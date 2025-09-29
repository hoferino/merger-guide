import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDeals } from "@/data/mockDeals";
import { ArrowUpRight, TrendingUp, Users, DollarSign, FileText, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function InternalDashboard() {
  const activeDeals = mockDeals.filter(d => d.status === "active");
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgProgress = Math.round(activeDeals.reduce((sum, deal) => sum + deal.progress, 0) / activeDeals.length);
  const recentDeals = [...mockDeals].sort((a, b) => 
    new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  ).slice(0, 5);

  const stats = [
    {
      title: "Active Deals",
      value: activeDeals.length,
      icon: Building2,
      trend: "+2 this month",
      trendUp: true,
    },
    {
      title: "Total Deal Value",
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      trend: "+12.5% from last month",
      trendUp: true,
    },
    {
      title: "Average Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      trend: "Across active deals",
      trendUp: true,
    },
    {
      title: "Active Clients",
      value: mockDeals.filter(d => d.status !== "cancelled").length,
      icon: Users,
      trend: "8 total clients",
      trendUp: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your deals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trendUp && <TrendingUp className="h-3 w-3" />}
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{deal.name}</p>
                    <p className="text-sm text-muted-foreground">{deal.client}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getStatusColor(deal.status)}>{deal.status}</Badge>
                      <span className="text-xs text-muted-foreground">{deal.phase}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">${(deal.value / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">{deal.progress}% complete</p>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/internal/deal/${deal.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Deals by Status</CardTitle>
            <CardDescription>Overview of all deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["active", "pending", "completed", "cancelled"].map((status) => {
                const count = mockDeals.filter(d => d.status === status).length;
                const percentage = (count / mockDeals.length) * 100;
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(status)}>{status}</Badge>
                      </div>
                      <span className="text-sm font-medium">{count} deals</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Button asChild className="w-full mt-4">
              <Link to="/internal/deals">View All Deals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
