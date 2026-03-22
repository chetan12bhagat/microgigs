import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, fetchAuthSession, getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "client">("student");

  useEffect(() => {
    // Check if user is already logged in
    getCurrentUser().then((user) => {
      if (user) {
        navigate("/gigs");
      }
    }).catch(() => {
      // Not logged in
    });

    // Listen for auth changes
    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        navigate("/gigs");
      }
    });

    return () => stopHubListener();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isSignUpComplete, userId } = await signUp({
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
        toast.success("Account created successfully! Please check your email for a verification code.");
        // In a full implementation, we'd navigate to a confirm sign up page
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isSignedIn } = await signIn({ username: email, password });
      if (isSignedIn) {
        toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-foreground">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-radial-gradient from-primary/5 to-transparent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-float " />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 blur-[100px] rounded-full animate-float delay-1000" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex flex-col items-center gap-3 mb-10 group text-center">
          <svg viewBox="0 0 500 500" className="w-16 h-16 drop-shadow-strong group-hover:scale-110 transition-transform duration-500">
            <path d="M250,30 L430,140 L250,250 Z" fill="#1565c0" />
            <path d="M430,140 L430,360 L250,250 Z" fill="#1e88e5" />
            <path d="M430,360 L250,470 L250,250 Z" fill="#29b6f6" />
            <path d="M250,470 L70,360 L250,250 Z" fill="#1565c0" />
            <path d="M70,360 L70,140 L250,250 Z" fill="#1e88e5" />
            <path d="M70,140 L250,30 L250,250 Z" fill="#29b6f6" />
          </svg>
          <div className="flex flex-col items-center leading-none">
            <span className="text-3xl font-extrabold tracking-tight text-[#1a2744] font-manrope">
              Micro<span className="text-[#29b6f6]">Gigs</span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
              Student Micro-Project Platform
            </span>
          </div>
        </Link>

        <Card className="glass border-primary/10 shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold font-manrope">Welcome to MicroGigs</CardTitle>
            <CardDescription className="font-medium">Sign in or create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => signInWithRedirect({ provider: "Google" })}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a...</Label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={role === "student" ? "default" : "outline"}
                        className={role === "student" ? "bg-gradient-primary" : ""}
                        onClick={() => setRole("student")}
                      >
                        Student/Freelancer
                      </Button>
                      <Button
                        type="button"
                        variant={role === "client" ? "default" : "outline"}
                        className={role === "client" ? "bg-gradient-primary" : ""}
                        onClick={() => setRole("client")}
                      >
                        Client
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
