import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid,
  Calendar,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Search,
  LogOut,
  ChevronLeft,
  Plus,
  Compass,
  Zap,
  BookOpen,
  MessageSquare,
  BarChart3,
  ListTodo
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { toast } from "sonner";
import MicroGigsLogo from "./MicroGigsLogo";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") fetchUser();
      else if (payload.event === "signedOut") setUser(null);
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
      toast.success("Signed out");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navGroups = [
    {
      label: "Command",
      links: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
        { label: "Browse Gigs", path: "/gigs", icon: Compass },
        { label: "Post a Gig", path: "/post-gig", icon: Plus },
      ]
    },
    {
      label: "System",
      links: [
        { label: "Settings", path: "/dashboard", icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-[280px] h-screen bg-[#fcfcfc] border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50 font-sans">
      {/* User / Org Header Card */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {user?.displayName ? (
               <span className="opacity-80">{user.displayName[0]}</span>
            ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-400" />
                </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight leading-none mb-1">
                {user?.displayName || "Courtney Henry"}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium truncate italic leading-none">The Walt Disney Company</p>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-slate-300 group-hover:text-slate-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Minimal Search */}
      <div className="px-4 mb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search" 
            className="pl-9 h-9 bg-slate-100/40 border-transparent rounded-xl text-sm text-slate-500 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-slate-100/60 shadow-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-40 pointer-events-none group-focus-within:opacity-0">
            <span className="text-[10px] font-medium">⌘</span>
            <span className="text-[10px] font-medium font-sans">F</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-8 scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 flex items-center justify-between group/title">
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-3 h-3 text-slate-300 -rotate-90" />
                <span className="text-[11px] font-semibold text-slate-400 leading-none">{group.label}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover/title:opacity-100 transition-opacity">
                <Plus className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-pointer" />
                <div className="flex gap-0.5">
                    <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                    <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const isActive = location.pathname === link.path && (link.label !== "Settings" || location.pathname === "/settings"); // Simple guard
                return (
                  <Link 
                    key={link.label}
                    to={link.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive 
                      ? "bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100" 
                      : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <div className={link.color || ""}>
                        <link.icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"} transition-colors stroke-[2px]`} />
                    </div>
                    <span className="text-[13px] font-medium tracking-tight flex-1">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Logout at Bottom */}
      <div className="p-4 mt-auto">
         <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all"
         >
            <LogOut className="w-4 h-4 stroke-[2px]" />
            <span className="text-[13px] font-medium">Log out</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
