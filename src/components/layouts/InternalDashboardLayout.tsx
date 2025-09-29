import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InternalSidebar } from "@/components/InternalSidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface InternalDashboardLayoutProps {
  children: React.ReactNode;
}

export function InternalDashboardLayout({ children }: InternalDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <InternalSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Internal Dashboard</h1>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/client/dashboard">Switch to Client View</Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
