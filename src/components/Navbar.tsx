import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { toast } from "sonner";
import MicroGigsLogo from "./MicroGigsLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    
    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "tokenRefresh") {
        fetchUser();
      } else if (payload.event === "signedOut") {
        setUser(null);
      }
    });

    return () => stopHubListener();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      const { tokens } = await fetchAuthSession();
      const name = tokens?.idToken?.payload?.name?.toString() || user.username;
      setUser({ ...user, displayName: name });
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { label: "Browse Gigs", path: "/gigs" },
    ...(user ? [{ label: "Dashboard", path: "/dashboard" }] : []),
    { label: "How It Works", path: "/#how-it-works" },
    { label: "About", path: "/#about" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center transition-transform hover:scale-105" onClick={() => setIsOpen(false)}>
            <MicroGigsLogo size="md" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">
                    {user.displayName}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 font-bold text-xs uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                    Exit
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="font-bold text-xs uppercase tracking-widest">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-all shadow-soft font-bold text-xs uppercase tracking-widest h-9 px-6 rounded-full">
                      Start Exploring
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden p-2 text-[#1a2744] hover:bg-primary/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pt-6 pb-8 space-y-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors border-b border-primary/5 pb-2"
                        onClick={() => setIsOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            
            <div className="pt-4 flex flex-col gap-4">
              {user ? (
                <Button variant="destructive" size="lg" onClick={handleLogout} className="w-full gap-2 font-bold uppercase tracking-widest rounded-xl">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full font-bold uppercase tracking-widest rounded-xl border-2">Sign In</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90 font-bold uppercase tracking-widest rounded-xl shadow-medium">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
