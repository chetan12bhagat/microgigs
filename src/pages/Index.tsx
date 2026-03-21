import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, DollarSign, Users, Zap, CheckCircle, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-full text-sm font-medium">
                  The Future of Micro-Projects
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Turn Your Skills Into{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Income
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with clients seeking micro-projects. Perfect for students and freelancers 
                looking to build experience and earn money on flexible schedules.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-medium group">
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/gigs">
                  <Button size="lg" variant="outline" className="shadow-soft">
                    Browse Gigs
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">No fees to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Secure payments</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Students and freelancers collaborating" 
                className="relative rounded-2xl shadow-strong w-full"
              />
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
              { icon: DollarSign, label: "Earned Total", value: "$500K+" },
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
            <h2 className="text-4xl font-bold mb-4">Why Choose MicroGig?</h2>
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
                icon: DollarSign,
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
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start earning or hiring</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <Card className="shadow-soft border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-6 text-primary">For Students/Freelancers</h3>
                <div className="space-y-4">
                  {[
                    "Create your free profile and showcase your skills",
                    "Browse available gigs that match your expertise",
                    "Apply to projects with custom proposals",
                    "Complete work and get paid securely",
                  ].map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Clients */}
            <Card className="shadow-soft border-accent/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-6 text-accent">For Clients</h3>
                <div className="space-y-4">
                  {[
                    "Sign up and describe your project needs",
                    "Post your gig with budget and timeline",
                    "Review applications from talented students",
                    "Hire and manage your project with ease",
                  ].map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground pt-1">{step}</p>
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
          <Card className="bg-gradient-hero text-primary-foreground shadow-strong">
            <CardContent className="py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of students and clients already succeeding on MicroGig
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="shadow-medium">
                  Create Your Free Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="MicroGig Logo" className="h-6 w-auto" />
              <span className="font-bold text-lg">MicroGig</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MicroGig. Empowering students and small businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
