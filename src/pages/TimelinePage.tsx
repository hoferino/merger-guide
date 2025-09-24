import { DealTimeline } from "@/components/DealTimeline";

const TimelinePage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Deal Timeline</h2>
        <p className="text-muted-foreground">
          Track deal phases, milestones, and progress toward transaction closing
        </p>
      </div>
      
      <DealTimeline />
    </div>
  );
};

export default TimelinePage;