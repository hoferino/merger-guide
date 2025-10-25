import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientDashboardLayout } from "./components/layouts/ClientDashboardLayout";
import { InternalDashboardLayout } from "./components/layouts/InternalDashboardLayout";
import Index from "./pages/Index";
import DocumentsPage from "./pages/DocumentsPage";
import TimelinePage from "./pages/TimelinePage";
import TodosPage from "./pages/TodosPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import InternalDashboard from "./pages/internal/InternalDashboard";
import AllDeals from "./pages/internal/AllDeals";
import DealDetail from "./pages/internal/DealDetail";
import DealDetailAlternative from "./pages/internal/DealDetailAlternative";
import ClientManagement from "./pages/internal/ClientManagement";
import Settings from "./pages/internal/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root redirect to internal dashboard */}
          <Route path="/" element={<Navigate to="/internal/dashboard" replace />} />
          
          {/* Common route redirects */}
          <Route path="/documents" element={<Navigate to="/client/documents" replace />} />
          <Route path="/timeline" element={<Navigate to="/client/timeline" replace />} />
          <Route path="/todos" element={<Navigate to="/client/todos" replace />} />
          <Route path="/analytics" element={<Navigate to="/client/analytics" replace />} />
          
          {/* Client Routes */}
          <Route path="/client/*" element={
            <ClientDashboardLayout>
              <Routes>
                <Route path="dashboard" element={<Index />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="todos" element={<TodosPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Routes>
            </ClientDashboardLayout>
          } />

          {/* Internal Routes */}
          <Route path="/internal/*" element={
            <InternalDashboardLayout>
              <Routes>
                <Route path="dashboard" element={<InternalDashboard />} />
                <Route path="deals" element={<AllDeals />} />
                <Route path="deal/:id" element={<DealDetail />} />
                <Route path="deal/:id/preview" element={<DealDetailAlternative />} />
                <Route path="clients" element={<ClientManagement />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </InternalDashboardLayout>
          } />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
