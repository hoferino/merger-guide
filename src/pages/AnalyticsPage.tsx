import { KPIMetrics } from "@/components/KPIMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h2>
        <p className="text-muted-foreground">
          Detailed analysis of deal metrics, buyer interest, and performance indicators
        </p>
      </div>
      
      {/* Enhanced KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-primary" />
              Transaction Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">$125M</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success text-success-foreground text-xs">+8.7%</Badge>
              <span className="text-xs text-muted-foreground">vs. initial target</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Active Buyers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">15</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success text-success-foreground text-xs">+25%</Badge>
              <span className="text-xs text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Process Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">89%</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success text-success-foreground text-xs">Excellent</Badge>
              <span className="text-xs text-muted-foreground">ahead of schedule</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Market Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">High</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success text-success-foreground text-xs">Strong</Badge>
              <span className="text-xs text-muted-foreground">competitive bidding</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <KPIMetrics />
    </div>
  );
};

export default AnalyticsPage;