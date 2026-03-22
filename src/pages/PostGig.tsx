import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { db } from "@/integrations/aws/client";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

const PostGig = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    required_skills: "",
  });

  useEffect(() => {
    getCurrentUser().then((user) => {
        setUser(user);
        checkUserRole(user.userId);
    }).catch(() => {
        navigate("/auth");
    });

    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedOut") {
        navigate("/auth");
      }
    });

    return () => stopHubListener();
  }, [navigate]);

  const checkUserRole = async (userId: string) => {
    try {
      const response = await db.send(new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: "METADATA"
        }
      }));

      const role = response.Item?.role;
      
      if (role !== "client") {
        toast.error("Only clients can post gigs");
        navigate("/dashboard");
      }
      setUserRole(role);
    } catch (error: any) {
      console.error("Role check error:", error);
      toast.error("Failed to verify user role");
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skills = formData.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const gigId = crypto.randomUUID();
      await db.send(new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
          PK: `GIG#${gigId}`,
          SK: "METADATA",
          id: gigId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          deadline: formData.deadline || null,
          required_skills: skills.length > 0 ? skills : null,
          client_id: user.userId,
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }));

      toast.success("Gig posted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Post Gig Error:", error);
      toast.error("Failed to post gig: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-full h-full -z-10 bg-radial-gradient from-primary/5 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-float " />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full animate-float delay-1000" />

      <div className="container mx-auto px-4 pt-32 pb-12 max-w-2xl relative z-10 text-foreground">
        <div className="mb-12 text-center">
          <div className="flex flex-col items-center gap-4 mb-4">
            <svg viewBox="0 0 500 500" className="w-14 h-14 drop-shadow-strong">
                <path d="M250,30 L430,140 L250,250 Z" fill="#1565c0" />
                <path d="M430,140 L430,360 L250,250 Z" fill="#1e88e5" />
                <path d="M430,360 L250,470 L250,250 Z" fill="#29b6f6" />
                <path d="M250,470 L70,360 L250,250 Z" fill="#1565c0" />
                <path d="M70,360 L70,140 L250,250 Z" fill="#1e88e5" />
                <path d="M70,140 L250,30 L250,250 Z" fill="#29b6f6" />
            </svg>
            <h1 className="text-5xl font-extrabold tracking-tight font-manrope">
              Post a <span className="text-gradient">Project</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-medium italic">
            Describe your project needs and find the perfect student talent to bring it to life.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gig Details</CardTitle>
            <CardDescription>
              Provide clear information to attract the right talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Build a responsive landing page"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project requirements, deliverables, and expectations..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web_development">Web Development</SelectItem>
                    <SelectItem value="mobile_development">Mobile Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data_entry">Data Entry</SelectItem>
                    <SelectItem value="video_editing">Video Editing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 500"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills (Optional)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., React, TypeScript, Tailwind CSS (comma-separated)"
                  value={formData.required_skills}
                  onChange={(e) =>
                    setFormData({ ...formData, required_skills: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter skills separated by commas
                </p>
              </div>

              <div className="flex gap-6 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 h-12 rounded-full border-2 font-bold transition-all hover:bg-background/80"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90 h-12 rounded-full font-bold shadow-soft transition-all"
                  disabled={loading}
                >
                  {loading ? "Launching Project..." : "Launch Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostGig;
