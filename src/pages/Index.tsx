import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, IndianRupee, Users, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import MicroGigsLogo from "@/components/MicroGigsLogo";
import { Slider } from "@/components/ui/slider"; // Added Slider import

const Index = () => {
  const { hash } = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = () => getCurrentUser().then(setUser).catch(() => setUser(null));
    fetchUser();
    
    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        fetchUser();
      } else if (payload.event === "signedOut") {
        setUser(null);
      }
    });

    return () => stopHubListener();
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold tracking-wider uppercase">
                  Student Micro-Project Platform
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground font-manrope">
                Fuel Your Future with <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Micro-Projects
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                The first platform designed exclusively for students to gain professional experience 
                and earn by solving real micro-tasks for growth-focused clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {user ? (
                   <Link to="/dashboard">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-strong h-14 px-8 rounded-full group">
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-strong h-14 px-8 rounded-full group">
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <Link to="/gigs">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 hover:bg-background/50 transition-all font-semibold">
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group flex justify-center lg:justify-end">
              <div className="relative z-10 transition-all duration-500 hover:scale-105">
                 <MicroGigsLogo size="xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Users", value: "10K+" },
              { icon: Briefcase, label: "Gigs Posted", value: "5K+" },
              { icon: IndianRupee, label: "Earned Total", value: "₹4Cr+" },
              { icon: TrendingUp, label: "Success Rate", value: "95%" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose MicroGigs?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for students and small clients to connect on affordable, 
              flexible micro-projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Quick & Easy",
                description: "Post or find gigs in minutes. Simple interface designed for speed and efficiency.",
              },
              {
                icon: IndianRupee,
                title: "Affordable Pricing",
                description: "Budget-friendly rates perfect for students and small businesses. No hidden fees.",
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Join thousands of verified students and clients. Build your reputation with reviews.",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 border-border/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-50/50 border-y border-border/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 font-manrope uppercase tracking-tight text-[#1a2744]">How It Works</h2>
            <p className="text-xl text-muted-foreground font-medium">Simple steps to start earning or hiring</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <Card className="bg-white shadow-soft border-border/60 overflow-hidden group hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-8 px-8 pb-10">
                <h3 className="text-2xl font-bold mb-8 text-primary font-manrope flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-black shadow-inner">PRO</span>
                    For Students & Freelancers
                </h3>
                <div className="space-y-6">
                  {[
                    "Create your free profile and showcase your skills",
                    "Browse available gigs that match your expertise",
                    "Apply to projects with custom proposals",
                    "Complete work and get paid securely",
                  ].map((step, index) => (
                    <div key={index} className="flex gap-5 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-black shadow-md group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <p className="text-[#1a2744]/80 pt-1 font-semibold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Clients */}
            <Card className="bg-white shadow-soft border-border/60 overflow-hidden group hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-8 px-8 pb-10">
                <h3 className="text-2xl font-bold mb-8 text-accent font-manrope flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-black shadow-inner">BIZ</span>
                    For Growth-Focused Clients
                </h3>
                <div className="space-y-6">
                  {[
                    "Sign up and describe your project needs",
                    "Post your gig with budget and timeline",
                    "Review applications from talented students",
                    "Hire and manage your project with ease",
                  ].map((step, index) => (
                    <div key={index} className="flex gap-5 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-black shadow-md group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <p className="text-[#1a2744]/80 pt-1 font-semibold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-[#1a2744] to-[#3b82f6] text-white rounded-[32px] p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
            
            <h2 className="text-5xl font-black mb-6 tracking-tight">Ready to Get Started?</h2>
            <p className="text-xl mb-12 text-white/80 max-w-2xl mx-auto font-medium">
              Join thousands of students and clients already succeeding on MicroGig
            </p>
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-white text-[#1a2744] hover:bg-white/90 font-black h-14 px-12 rounded-full shadow-lg transition-transform hover:scale-105">
                {user ? "Go to Your Dashboard" : "Create Your Free Account"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-primary/10 py-16 px-4 bg-[#1a2744] text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MicroGigsLogo size="md" light />
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-sm font-medium text-white/80">
                © {new Date().getFullYear()} MicroGigs Platform. Designed for the Next Generation.
              </p>
              <div className="flex gap-4 text-xs text-white/40 font-bold uppercase tracking-wider">
                <a href="#" className="hover:text-[#29b6f6] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#29b6f6] transition-colors">Terms</a>
                <a href="#" className="hover:text-[#29b6f6] transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
