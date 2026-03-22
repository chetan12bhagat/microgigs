import { useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { db } from "@/integrations/aws/client";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ApplicationDialogProps {
  gigId: string;
  gigTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationDialog = ({
  gigId,
  gigTitle,
  open,
  onOpenChange,
}: ApplicationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: "",
    proposed_rate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      
      if (!user) {
        toast.error("You must be logged in to apply");
        return;
      }

      // Check if user has student role
      const roleResponse = await db.send(new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: {
          PK: `USER#${user.userId}`,
          SK: "METADATA"
        }
      }));

      if (roleResponse.Item?.role !== "student") {
        toast.error("Only students can apply to gigs");
        return;
      }

      // Check if already applied
      const existingAppResponse = await db.send(new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: {
          PK: `APP#${gigId}#${user.userId}`,
          SK: "METADATA"
        }
      }));

      if (existingAppResponse.Item) {
        toast.error("You have already applied to this gig");
        return;
      }

      await db.send(new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
          PK: `APP#${gigId}#${user.userId}`,
          SK: "METADATA",
          gig_id: gigId,
          student_id: user.userId,
          cover_letter: formData.cover_letter,
          proposed_rate: formData.proposed_rate ? parseFloat(formData.proposed_rate) : null,
          status: "pending",
          created_at: new Date().toISOString()
        }
      }));

      toast.success("Application submitted successfully!");
      setFormData({ cover_letter: "", proposed_rate: "" });
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to submit application: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Apply to Gig</DialogTitle>
          <DialogDescription>
            Submit your application for: {gigTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover_letter">Cover Letter *</Label>
            <Textarea
              id="cover_letter"
              placeholder="Explain why you're the perfect fit for this gig..."
              value={formData.cover_letter}
              onChange={(e) =>
                setFormData({ ...formData, cover_letter: e.target.value })
              }
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposed_rate">Proposed Rate (INR) - Optional</Label>
            <Input
              id="proposed_rate"
              type="number"
              placeholder="Enter your rate if different from budget"
              min="0"
              step="0.01"
              value={formData.proposed_rate}
              onChange={(e) =>
                setFormData({ ...formData, proposed_rate: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to accept the posted budget
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
