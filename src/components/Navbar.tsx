import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user);
    }).catch(() => {
      setUser(null);
    });

    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        getCurrentUser().then(setUser);
      } else if (payload.event === "signedOut") {
        setUser(null);
      }
    });

    return () => stopHubListener();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="MicroGigs Logo" className="h-10 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/gigs" className="text-foreground/80 hover:text-foreground transition-colors">
              Browse Gigs
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
            <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.signInDetails?.loginId || user.username}
                </span>
                <Button variant="ghost" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
