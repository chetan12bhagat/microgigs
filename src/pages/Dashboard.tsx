import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { db } from "@/integrations/aws/client";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import logo from "../assets/logo.png";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Briefcase, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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

interface UserProfile {
  skills: string[] | null;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
        setUser(user);
        fetchUserRole(user.userId);
        fetchUserProfile(user.userId);
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

  const fetchUserRole = async (userId: string) => {
    try {
      const response = await db.send(new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: "METADATA"
        }
      }));
      setUserRole(response.Item?.role || "student");
    } catch (error: any) {
      console.error("Role fetch error:", error);
      toast.error("Failed to load user role");
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
        const response = await db.send(new GetCommand({
            TableName: DYNAMODB_TABLE_NAME,
            Key: {
              PK: `USER#${userId}`,
              SK: "METADATA"
            }
          }));
      setProfile(response.Item as UserProfile);
    } catch (error: any) {
      console.log("Profile not found or error:", error);
    }
  };

  useEffect(() => {
    if (userRole && user) {
      fetchGigs();
    }
  }, [userRole, user]);


  const fetchGigs = async () => {
    try {
      if (userRole === "client") {
        const response = await db.send(new ScanCommand({
            TableName: DYNAMODB_TABLE_NAME,
            FilterExpression: "begins_with(PK, :pk) AND client_id = :client_id",
            ExpressionAttributeValues: {
                ":pk": "GIG#",
                ":client_id": user.userId
            }
        }));
        setGigs(response.Items as Gig[] || []);
      } else {
        const response = await db.send(new ScanCommand({
            TableName: DYNAMODB_TABLE_NAME,
            FilterExpression: "begins_with(PK, :pk) AND #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: {
                ":pk": "GIG#",
                ":status": "open"
            }
        }));
        
        let fetchedGigs = response.Items as Gig[] || [];
        
        // Filter by skills if profile has skills
        if (profile?.skills && profile.skills.length > 0) {
          const filtered = fetchedGigs.filter(gig => 
            gig.required_skills?.some(skill => 
              profile.skills?.includes(skill)
            )
          );
          setGigs(filtered.length > 0 ? filtered : fetchedGigs);
        } else {
          setGigs(fetchedGigs);
        }
      }
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading || !userRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img src={logo} alt="MicroGigs Logo" className="h-10 w-auto" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {userRole === "client" ? "My Posted Gigs" : "Recommended Gigs"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {userRole === "client" 
              ? "Manage and track your posted gigs" 
              : profile?.skills && profile.skills.length > 0
                ? "Gigs matching your skills and interests"
                : "Browse available gigs and start earning"}
          </p>
        </div>

        {userRole === "client" && (
          <div className="mb-6">
            <Button 
              onClick={() => navigate("/post-gig")} 
              className="bg-gradient-primary hover:opacity-90"
            >
              Post New Gig
            </Button>
          </div>
        )}

        {gigs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {userRole === "client" 
                  ? "You haven't posted any gigs yet." 
                  : "No recommended gigs available at the moment."}
              </p>
              {userRole === "client" && (
                <Button onClick={() => navigate("/post-gig")} className="bg-gradient-primary hover:opacity-90">
                  Post Your First Gig
                </Button>
              )}
              {userRole === "student" && (
                <Button onClick={() => navigate("/gigs")} variant="outline">
                  Browse All Gigs
                </Button>
              )}
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
                    {userRole === "client" && (
                      <Badge className={getStatusColor(gig.status)}>
                        {gig.status.replace("_", " ")}
                      </Badge>
                    )}
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

                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    {userRole === "client" ? "View Details" : "Apply Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
