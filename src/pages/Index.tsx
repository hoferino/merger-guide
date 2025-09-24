import { DealOverview } from "@/components/DealOverview";
import { KPIMetrics } from "@/components/KPIMetrics";

const Index = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Deal Overview</h2>
        <p className="text-muted-foreground">
          Track your M&A transaction progress, key metrics, and upcoming milestones
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <DealOverview />
        </div>
        <div className="xl:col-span-1">
          <KPIMetrics />
        </div>
      </div>
    </div>
  );
};

export default Index;
