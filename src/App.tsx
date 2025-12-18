import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskNav } from "@/components/TaskNav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TaskStorageProvider, useTaskStore } from "@/contexts/TaskStorageContext";
import Index from "./pages/Index";
import TaskPage from "./pages/TaskPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { tasks } = useTaskStore();

  return (
    <>
      <TaskNav tasks={tasks} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/task/:taskId" element={<TaskPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TaskStorageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </TaskStorageProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
