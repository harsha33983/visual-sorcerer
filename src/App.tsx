import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Prompts from "./pages/Prompts";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Storage from "./pages/Storage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col w-full">
                  <header className="h-12 flex items-center border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
                    <SidebarTrigger className="ml-2" />
                  </header>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/prompts" element={<Prompts />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/storage" element={<Storage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
