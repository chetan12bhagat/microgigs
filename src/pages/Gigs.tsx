import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { db } from "@/integrations/aws/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Tag } from "lucide-react";
import { toast } from "sonner";
import ApplicationDialog from "@/components/ApplicationDialog";

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string | null;
  status: string;
  required_skills: string[] | null;
  created_at: string;
}

const Gigs = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedGig, setSelectedGig] = useState<{ id: string; title: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    getCurrentUser().then((user) => {
      setUser(user);
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

  useEffect(() => {
    fetchGigs();
  }, []);


  const fetchGigs = async () => {
    try {
      const response = await db.send(new ScanCommand({
        TableName: DYNAMODB_TABLE_NAME,
        FilterExpression: "begins_with(PK, :pk) AND #status = :status",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":pk": "GIG#",
          ":status": "open"
        }
      }));

      const formattedGigs: Gig[] = (response.Items || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        budget: item.budget,
        deadline: item.deadline,
        status: item.status,
        required_skills: item.required_skills,
        created_at: item.created_at,
      }));
      setGigs(formattedGigs);
    } catch (error: any) {
      console.error("DynamoDB fetch error:", error);
      toast.error("Failed to load gigs from DynamoDB");
    } finally {
      setLoading(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Browse Gigs
          </h1>
          <p className="text-muted-foreground">
            Find your next opportunity and start earning
          </p>
        </div>

        {gigs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No gigs available at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <Card key={gig.id} className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="mb-2">
                      {formatCategory(gig.category)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{gig.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {gig.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">${gig.budget}</span>
                  </div>
                  
                  {gig.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {new Date(gig.deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  {gig.required_skills && gig.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {gig.required_skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {gig.required_skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{gig.required_skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      setSelectedGig({ id: gig.id, title: gig.title });
                      setDialogOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedGig && (
          <ApplicationDialog
            gigId={selectedGig.id}
            gigTitle={selectedGig.title}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Gigs;
