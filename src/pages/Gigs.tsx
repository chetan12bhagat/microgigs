import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { db } from "@/integrations/aws/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "@/integrations/aws/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, User, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import ApplicationDialog from "@/components/ApplicationDialog";
import SkillBadge from "@/components/SkillBadge";

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

const Gigs = () => {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 1000]);
  const [selectedGig, setSelectedGig] = useState<{ id: string; title: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().catch(() => {});
    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedOut") navigate("/auth");
    });
    return () => stopHubListener();
  }, [navigate]);

  useEffect(() => {
    fetchGigs();
  }, []);

  useEffect(() => {
    let result = gigs;
    if (searchQuery) {
      result = result.filter(gig => 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.required_skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter(gig => gig.category === selectedCategory);
    }
    result = result.filter(gig => gig.budget >= budgetRange[0] && gig.budget <= budgetRange[1]);
    setFilteredGigs(result);
  }, [searchQuery, selectedCategory, budgetRange, gigs]);

  const fetchGigs = async () => {
    try {
      const response = await db.send(new ScanCommand({
        TableName: DYNAMODB_TABLE_NAME,
        FilterExpression: "begins_with(PK, :pk) AND #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":pk": "GIG#", ":status": "open" }
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
        client_name: item.client_name,
        client_details: item.client_details,
      }));
      setGigs(formattedGigs);
      setFilteredGigs(formattedGigs);
    } catch (error: any) {
      toast.error("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "development", label: "Development" },
    { id: "design", label: "Design" },
    { id: "writing", label: "Writing" },
    { id: "marketing", label: "Marketing" },
    { id: "business", label: "Business" },
  ];

  const formatCategory = (category: string) => {
    return category.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Commanding Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Normal Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black text-[#1a2744] leading-tight tracking-tight mb-6">
              Explore <span className="text-[#3b82f6]">Opportunities</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl italic">
              Discover micro-projects tailored to your student schedule and start building your professional portfolio.
            </p>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Simple Filter Sidebar */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-[#1a2744] mb-6 uppercase tracking-widest">Filters</h3>
                
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-[#3b82f6] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Budget: ${budgetRange[0]}+</label>
                        <Slider
                            value={[budgetRange[1]]} // Slider expects an array for value
                            onValueChange={(val) => setBudgetRange([0, val[0]])} // Update budgetRange based on slider
                            max={1000} // Max budget set to 1000
                            step={50}
                            className="py-4"
                        />
                    </div>
                    <div className="pt-6 border-t border-slate-50">
                      <Button 
                          variant="ghost" 
                          className="w-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                          onClick={() => {
                              setSelectedCategory("all");
                              setBudgetRange([0, 1000]);
                              setSearchQuery("");
                          }}
                      >
                          Reset Filters
                      </Button>
                    </div>
                </div>
            </div>
          </aside>

          {/* Gig Grid */}
          <main className="flex-1">
            <div className="relative flex-1 group mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors" />
              <Input
                placeholder="Search for projects or skills..."
                className="pl-12 h-14 bg-white border-slate-100 rounded-2xl text-base font-bold text-[#1a2744] placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#3b82f6] shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredGigs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-300 font-black uppercase tracking-[0.2em]">No matching projects found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGigs.map((gig) => (
                  <div key={gig.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                          <span className="px-4 py-1.5 bg-[#3b82f6] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                              {gig.category}
                          </span>
                          <span className="text-lg font-black text-[#3b82f6]">${gig.budget}</span>
                      </div>
                      
                      <h3 className="text-xl font-black text-[#1a2744] mb-3 group-hover:text-[#3b82f6] transition-colors line-clamp-1">{gig.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2 italic">{gig.description}</p>
                      
                      <div className="space-y-4 mb-8 flex-grow">
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2">
                              {gig.required_skills?.map((skill, idx) => (
                                  <SkillBadge key={idx} skill={skill} />
                              ))}
                          </div>

                          {/* Client & Deadline Info */}
                          <div className="space-y-3 pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#3b82f6] border border-slate-100">
                                      <User className="w-4 h-4" />
                                  </div>
                                  <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Client</p>
                                      <p className="text-sm font-bold text-[#1a2744]">{gig.client_name || "Premium Partner"}</p>
                                  </div>
                              </div>

                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#3b82f6] border border-slate-100">
                                      <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Deadline</p>
                                      <p className="text-sm font-bold text-[#1a2744]">
                                          {gig.deadline ? new Date(gig.deadline).toLocaleDateString() : "Flexible"}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <Button 
                          className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-black rounded-2xl h-12 shadow-md transition-all group-hover:scale-[1.02] mt-auto"
                          onClick={() => {
                              setSelectedGig(gig);
                              setDialogOpen(true);
                           }}
                       >
                           Apply Now
                       </Button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedGig && (
        <ApplicationDialog 
          gigId={selectedGig.id} 
          gigTitle={selectedGig.title} 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
        />
      )}
    </div>
  );
};

export default Gigs;
