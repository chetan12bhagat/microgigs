import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import MicroGigsLogo from "@/components/MicroGigsLogo";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "client">("student");

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) navigate("/gigs");
    }).catch(() => {});

    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") navigate("/gigs");
    });
    return () => stopHubListener();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === "signup") {
        const { isSignUpComplete } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              name: fullName,
            },
          },
        });
        if (isSignUpComplete) {
          toast.success("Account created successfully! Please check your email for verification.");
        }
      } else {
        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 md:p-8 font-manrope">
      {/* Main Card */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-2xl min-h-[600px]">
        
        {/* Left Column: Branding & Value Prop */}
        <div className="relative w-full md:w-[45%] bg-gradient-to-br from-[#1a2744] via-[#1e3a5f] to-[#1565c0] p-12 flex flex-col justify-between text-white overflow-hidden">
          {/* Abstract Gradient Glows */}
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#4facfe] blur-[120px] rounded-full opacity-30 animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-[#00f2fe] blur-[120px] rounded-full opacity-20" />
          
          <div className="relative z-10">
            <Link to="/">
              <MicroGigsLogo light size="lg" />
            </Link>
          </div>

          <div className="relative z-10">
            <p className="text-sm font-medium text-white/70 mb-2">You can easily</p>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight">
              Get access your personal hub for clarity and productivity.
            </h2>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Orange Asterisk Header (Branding Element) */}
            <div className="mb-2">
              <span className="text-3xl text-[#1a2744] font-bold">★</span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-foreground mb-4">
              {authMode === "signup" ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              {authMode === "signup" 
                ? "Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place."
                : "Sign in to access your personalized student hub and manage your micro-gigs."}
            </p>

            <form onSubmit={handleAuth} className="space-y-6">
              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input
                    id="fullname"
                    placeholder="Enter your full name"
                    className="h-12 border-muted bg-muted/20 focus:bg-white rounded-xl transition-all"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="natalia.brak@knmstudio.com"
                  className="h-12 border-muted bg-muted/20 focus:bg-white rounded-xl transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {authMode === "signup" ? "Create password" : "Your password"}
                  </Label>
                  {authMode === "signin" && (
                    <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot password?</button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="h-12 border-muted bg-muted/20 focus:bg-white rounded-xl transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">I am a...</Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex-1 h-11 rounded-xl text-sm font-bold border-2 transition-all ${role === "student" ? "bg-[#1a2744] text-white border-[#1a2744]" : "bg-transparent text-muted-foreground border-muted hover:border-primary/20"}`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`flex-1 h-11 rounded-xl text-sm font-bold border-2 transition-all ${role === "client" ? "bg-[#1a2744] text-white border-[#1a2744]" : "bg-transparent text-muted-foreground border-muted hover:border-primary/20"}`}
                    >
                      Client
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#1a2744] hover:bg-[#1a2744]/90 text-white rounded-xl font-bold shadow-lg shadow-[#1a2744]/20 transition-all hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? "Processing..." : authMode === "signup" ? "Create account" : "Sign In"}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 rounded-xl border-muted hover:bg-muted/10 transition-all"
                  onClick={() => signInWithRedirect({ provider: "Google" })}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-bold text-xs uppercase tracking-wider">Google</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 rounded-xl border-muted hover:bg-muted/10 transition-all"
                  onClick={() => signInWithRedirect({ provider: "GitHub" })}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span className="font-bold text-xs uppercase tracking-wider">GitHub</span>
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {authMode === "signup" ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button
                onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
                className="font-bold text-[#1a2744] hover:underline transition-all"
              >
                {authMode === "signup" ? "Sign In" : "Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
