import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  Users,
  FileText
} from "lucide-react";

const timelineData = [
  {
    phase: "Initial Preparation",
    status: "completed",
    startDate: "2024-01-15",
    endDate: "2024-02-01",
    duration: "17 days",
    milestones: [
      { name: "Engagement Letter Signed", status: "completed", date: "2024-01-15" },
      { name: "Initial Valuation", status: "completed", date: "2024-01-22" },
      { name: "Marketing Materials Prepared", status: "completed", date: "2024-01-30" }
    ]
  },
  {
    phase: "Marketing Phase",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    duration: "27 days",
    milestones: [
      { name: "Buyer List Compiled", status: "completed", date: "2024-02-05" },
      { name: "Teaser Distribution", status: "completed", date: "2024-02-10" },
      { name: "NDA Collection", status: "completed", date: "2024-02-25" }
    ]
  },
  {
    phase: "Due Diligence",
    status: "current",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    duration: "45 days",
    progress: 65,
    milestones: [
      { name: "Data Room Setup", status: "completed", date: "2024-03-01" },
      { name: "Financial DD", status: "in-progress", date: "2024-03-10" },
      { name: "Legal DD", status: "in-progress", date: "2024-03-15" },
      { name: "Commercial DD", status: "pending", date: "2024-04-01" },
      { name: "Management Presentations", status: "pending", date: "2024-04-10" }
    ]
  },
  {
    phase: "Final Negotiations",
    status: "upcoming",
    startDate: "2024-04-15",
    endDate: "2024-05-15",
    duration: "30 days",
    milestones: [
      { name: "LOI Analysis", status: "pending", date: "2024-04-15" },
      { name: "Final Negotiations", status: "pending", date: "2024-04-25" },
      { name: "SPA Preparation", status: "pending", date: "2024-05-05" }
    ]
  },
  {
    phase: "Closing",
    status: "upcoming",
    startDate: "2024-05-15",
    endDate: "2024-06-01",
    duration: "17 days",
    milestones: [
      { name: "Final Conditions", status: "pending", date: "2024-05-15" },
      { name: "Regulatory Approvals", status: "pending", date: "2024-05-25" },
      { name: "Transaction Closing", status: "pending", date: "2024-06-01" }
    ]
  }
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "current":
    case "in-progress":
      return <Clock className="h-5 w-5 text-warning" />;
    case "upcoming":
    case "pending":
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    default:
      return <AlertCircle className="h-5 w-5 text-danger" />;
  }
};

const MilestoneStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-warning" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const PhaseStatusBadge = ({ status }: { status: string }) => {
  const variants = {
    completed: "bg-success/10 text-success border-success/20",
    current: "bg-primary/10 text-primary border-primary/20",
    "in-progress": "bg-warning/10 text-warning border-warning/20",
    upcoming: "bg-muted text-muted-foreground border-border",
    pending: "bg-muted text-muted-foreground border-border"
  };
  
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status}
    </Badge>
  );
};

export function DealTimeline() {
  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <Card className="bg-card shadow-soft border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Deal Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Current Phase</p>
              <p className="font-semibold text-card-foreground">Due Diligence</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <p className="font-semibold text-card-foreground">16 days</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <FileText className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Expected Close</p>
              <p className="font-semibold text-card-foreground">June 1, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Phases */}
      <div className="space-y-4">
        {timelineData.map((phase, index) => (
          <Card key={index} className={`shadow-soft ${phase.status === 'current' ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon status={phase.status} />
                  <div>
                    <CardTitle className="text-lg">{phase.phase}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {phase.startDate} - {phase.endDate} ({phase.duration})
                    </p>
                  </div>
                </div>
                <PhaseStatusBadge status={phase.status} />
              </div>
              {phase.status === 'current' && phase.progress && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Key Milestones</h4>
                <div className="space-y-2">
                  {phase.milestones.map((milestone, milestoneIndex) => (
                    <div key={milestoneIndex} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <MilestoneStatusIcon status={milestone.status} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{milestone.name}</p>
                          <p className="text-xs text-muted-foreground">{milestone.date}</p>
                        </div>
                      </div>
                      {milestone.status === 'in-progress' && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-dark">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Review
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Export Timeline
        </Button>
      </div>
    </div>
  );
}