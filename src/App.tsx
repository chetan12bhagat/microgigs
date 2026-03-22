import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Gigs from "./pages/Gigs";
import Dashboard from "./pages/Dashboard";
import PostGig from "./pages/PostGig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import AppLayout from "./components/AppLayout";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<AppLayout />}>
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-gig" element={<PostGig />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
