import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { db } from "@/integrations/aws/client";
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { Calendar, DollarSign, Briefcase, TrendingUp } from "lucide-react";
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
  client_name?: string;
  client_details?: string;
}

interface UserProfile {
  skills: string[] | null;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { seedMockGigs } from "@/integrations/aws/seed";
import SkillBadge from "@/components/SkillBadge";

const Dashboard = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
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
        
        const responseItems = response.Items || [] as any[];
        let fetchedGigs = responseItems.map(item => ({
            ...item,
            client_name: item.client_name,
            client_details: item.client_details
        })) as Gig[];
        
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

  const handleSeed = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      await seedMockGigs(user.userId);
      toast.success("Sample gigs added successfully!");
      fetchGigs();
    } catch (error) {
      toast.error("Failed to seed items.");
    } finally {
      setIsSeeding(false);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-muted-foreground font-bold animate-pulse">Loading Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Normal Dashboard Header */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden relative border-b border-slate-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-black text-[#1a2744] leading-tight tracking-tight mb-4">
                {userRole === "client" ? "Business " : "Student "}
                <span className="text-[#3b82f6]">Hub</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                {userRole === "client" ? "Manage your projects and discover top talent." : "Manage your tasks, track your applications, and keep everything flowing in one place."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSeed} disabled={isSeeding} variant="outline" className="font-bold rounded-2xl border-slate-200">
                {isSeeding ? "Syncing..." : "Seed Mock Data"}
              </Button>
              {userRole === "client" && (
                <Button onClick={() => navigate("/post-gig")} className="bg-[#1a2744] hover:bg-[#1a2744]/90 text-white font-bold rounded-2xl shadow-lg">
                  Create New Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
                { label: "Active Opps", value: gigs.length, icon: Briefcase },
                { label: "Submissions", value: 0, icon: TrendingUp },
                { label: "Total Pay", value: "$0", icon: DollarSign },
                { label: "Success Rate", value: "100%", icon: Calendar },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className={`p-3 rounded-2xl w-fit mb-6 bg-slate-50 text-[#1a2744]`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#1a2744] tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-[#1a2744] mb-8 uppercase tracking-widest">
                    {userRole === "client" ? "Your Project Stream" : "Recommended Projects"}
                </h3>
                
                {gigs.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[32px]">
                    <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Zero Active Projects</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                   {gigs.map((gig) => (
                      <div key={gig.id} onClick={() => navigate("/gigs")} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-[#3b82f6] shadow-sm border border-slate-50 transition-transform group-hover:scale-110">
                                  {gig.title[0]}
                              </div>
                              <div>
                                  <h4 className="font-black text-[#1a2744] transition-colors group-hover:text-[#3b82f6] line-clamp-1">{gig.title}</h4>
                                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                      {gig.required_skills?.slice(0, 3).map((skill, idx) => (
                                          <SkillBadge key={idx} skill={skill} />
                                      ))}
                                      {gig.required_skills && gig.required_skills.length > 3 && (
                                          <span className="text-[10px] font-bold text-slate-300">+{gig.required_skills.length - 3}</span>
                                      )}
                                  </div>
                                  <div className="flex gap-4 items-center">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                          <DollarSign className="w-3 h-3 text-[#3b82f6]" /> 
                                          ${gig.budget}
                                      </p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                          <Calendar className="w-3 h-3 text-[#3b82f6]" /> 
                                          {gig.deadline ? new Date(gig.deadline).toLocaleDateString() : "Flexible"}
                                      </p>
                                      {gig.client_name && (
                                        <p className="text-[10px] font-black text-[#3b82f6] uppercase tracking-widest border-l border-slate-200 pl-4">
                                            {gig.client_name}
                                        </p>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(gig.status)}`}>
                              {gig.status.replace('_', ' ')}
                          </span>
                      </div>
                  ))}
                  </div>
                )}
            </div>
          </main>

          <aside className="w-full lg:w-80">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-[#1a2744] mb-8 uppercase tracking-widest">Notifications</h3>
                <div className="text-center py-12">
                    <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Zero New Alerts</p>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
