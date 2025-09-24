import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Clock, 
  FileText, 
  Users, 
  ArrowRight,
  CheckCircle,
  Circle,
  AlertCircle
} from "lucide-react";

const dealData = {
  name: "TechCorp Acquisition",
  currentPhase: "Due Diligence",
  progress: 65,
  status: "On Track",
  targetClose: "Q2 2024",
  totalValue: "$125M",
  nextSteps: [
    { title: "Financial audit completion", status: "in-progress", priority: "high" },
    { title: "Legal document review", status: "pending", priority: "medium" },
    { title: "Board approval preparation", status: "pending", priority: "low" }
  ]
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "in-progress":
      return <AlertCircle className="h-4 w-4 text-warning" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const variants = {
    high: "bg-danger/10 text-danger border-danger/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-muted text-muted-foreground border-border"
  };
  
  return (
    <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
      {priority}
    </Badge>
  );
};

export function DealOverview() {
  return (
    <div className="space-y-6">
      {/* Main Deal Status Card */}
      <Card className="bg-gradient-card shadow-medium border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {dealData.name}
              </CardTitle>
              <p className="text-muted-foreground">Target Value: {dealData.totalValue}</p>
            </div>
            <Badge className="bg-success text-success-foreground">
              {dealData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Phase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Current Phase</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {dealData.currentPhase}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">{dealData.progress}%</span>
              </div>
              <Progress value={dealData.progress} className="h-2" />
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Target Close</p>
              <p className="font-semibold text-foreground">{dealData.targetClose}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <FileText className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Documents</p>
              <p className="font-semibold text-foreground">23 / 30</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Stakeholders</p>
              <p className="font-semibold text-foreground">12 Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealData.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusIcon status={step.status} />
                  <div>
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Status: {step.status.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={step.priority} />
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-gradient-primary">
            View All Action Items
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}