import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./pages/Upload";
import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import ReportSection from "./components/dashboard/ReportSection";
import Presentation from "./pages/Presentation";
import NotFound from "./pages/NotFound";
import SourcesSidebar from "./components/SourcesSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SourcesSidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/deck" element={<Upload />} />
          <Route path="/report" element={
            <div className="min-h-screen bg-background dashboard-light">
              <ReportSection />
            </div>
          } />
          <Route path="/presentation" element={<Presentation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
