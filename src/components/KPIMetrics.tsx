import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

const kpiData = {
  loisVsTarget: {
    current: 8,
    target: 12,
    percentage: 67,
    trend: "up",
    change: "+2 this week"
  },
  timeToClose: {
    estimate: "45 days",
    original: "60 days",
    trend: "up",
    status: "ahead"
  },
  buyerInterest: {
    score: 8.5,
    maxScore: 10,
    activeInquiries: 15,
    trend: "up",
    change: "+15%"
  },
  dealHealth: {
    score: 82,
    status: "Strong",
    factors: [
      { name: "Financial Metrics", score: 90, status: "excellent" },
      { name: "Legal Compliance", score: 85, status: "good" },
      { name: "Market Conditions", score: 78, status: "good" },
      { name: "Stakeholder Alignment", score: 75, status: "moderate" }
    ]
  }
};

const TrendIcon = ({ trend }: { trend: string }) => {
  switch (trend) {
    case "up":
      return <ArrowUp className="h-4 w-4 text-success" />;
    case "down":
      return <ArrowDown className="h-4 w-4 text-danger" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const ScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    excellent: "bg-success/10 text-success border-success/20",
    good: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning border-warning/20",
    poor: "bg-danger/10 text-danger border-danger/20"
  };
  
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status}
    </Badge>
  );
};

export function KPIMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LOIs vs Target */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            LOIs vs. Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {kpiData.loisVsTarget.current}
              </p>
              <p className="text-sm text-muted-foreground">
                of {kpiData.loisVsTarget.target} target
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon trend={kpiData.loisVsTarget.trend} />
              <span className="text-sm font-medium text-success">
                {kpiData.loisVsTarget.change}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{kpiData.loisVsTarget.percentage}%</span>
            </div>
            <Progress value={kpiData.loisVsTarget.percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Time to Close */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Time to Close
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {kpiData.timeToClose.estimate}
              </p>
              <p className="text-sm text-muted-foreground">
                vs. {kpiData.timeToClose.original} original
              </p>
            </div>
            <Badge className="bg-success text-success-foreground">
              {kpiData.timeToClose.status}
            </Badge>
          </div>
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-success font-medium">
              Deal is progressing ahead of schedule
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Interest */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Buyer Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {kpiData.buyerInterest.score}
                <span className="text-lg text-muted-foreground">/{kpiData.buyerInterest.maxScore}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Interest Score
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <TrendIcon trend={kpiData.buyerInterest.trend} />
                <span className="text-sm font-medium text-success">
                  {kpiData.buyerInterest.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {kpiData.buyerInterest.activeInquiries} active inquiries
              </p>
            </div>
          </div>
          <Progress value={(kpiData.buyerInterest.score / kpiData.buyerInterest.maxScore) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Deal Health Score */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Deal Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${ScoreColor(kpiData.dealHealth.score)}`}>
                {kpiData.dealHealth.score}
              </p>
              <p className="text-sm text-muted-foreground">Overall Health</p>
            </div>
            <Badge className="bg-success text-success-foreground">
              {kpiData.dealHealth.status}
            </Badge>
          </div>
          <div className="space-y-3">
            {kpiData.dealHealth.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{factor.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={factor.score} className="h-1 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">
                      {factor.score}
                    </span>
                  </div>
                </div>
                <StatusBadge status={factor.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}