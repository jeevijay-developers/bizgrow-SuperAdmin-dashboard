"use client";
import {
  Building2,
  Users,
  IndianRupee,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  useOverviewAnalytics,
  useRecentTenants,
  useRevenueAnalytics,
  useTenantGrowthAnalytics,
} from "@/service";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

// Static payments data (will be replaced with API data later)
const latestPayments = [
  {
    id: 1,
    tenant: "TechCorp Ltd",
    amount: "₹24,817",
    date: "Today",
    method: "Card",
  },
  {
    id: 2,
    tenant: "FoodMart Express",
    amount: "₹49,717",
    date: "Today",
    method: "Bank",
  },
  {
    id: 3,
    tenant: "StyleHub Fashion",
    amount: "₹24,817",
    date: "Yesterday",
    method: "Card",
  },
  {
    id: 4,
    tenant: "Global Imports",
    amount: "₹12,367",
    date: "Yesterday",
    method: "UPI",
  },
  {
    id: 5,
    tenant: "MediCare Plus",
    amount: "₹49,717",
    date: "2 days ago",
    method: "Card",
  },
];

// Helper functions
const formatINR = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
};

const formatNumber = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-IN");
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "trial":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "suspended":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "";
  }
};

const getPlanName = (planId?: string) => {
  const plans: Record<string, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };
  return plans[planId || ""] || planId || "N/A";
};

// Loading skeleton component
function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-75 w-full flex items-end justify-around gap-2 p-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-12"
          style={{ height: `${Math.random() * 50 + 30}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const {
    data: overview,
    isLoading: overviewLoading,
    mutate: refreshOverview,
  } = useOverviewAnalytics();
  const {
    tenants: recentTenants,
    isLoading: tenantsLoading,
    mutate: refreshTenants,
  } = useRecentTenants(5);
  const {
    revenueData,
    isLoading: revenueLoading,
    mutate: refreshRevenue,
  } = useRevenueAnalytics(6);
  const {
    growthData,
    isLoading: growthLoading,
    mutate: refreshGrowth,
  } = useTenantGrowthAnalytics(6);

  const handleRefresh = () => {
    refreshOverview();
    refreshTenants();
    refreshRevenue();
    refreshGrowth();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor your SaaS metrics and tenant activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatINR(overview?.totalRevenue || 0)}
              change={`${
                overview?.revenueGrowth && overview.revenueGrowth > 0 ? "+" : ""
              }${overview?.revenueGrowth || 0}% from last month`}
              changeType={
                overview?.revenueGrowth && overview.revenueGrowth > 0
                  ? "positive"
                  : overview?.revenueGrowth && overview.revenueGrowth < 0
                  ? "negative"
                  : "neutral"
              }
              icon={IndianRupee}
            />
            <StatsCard
              title="Active Tenants"
              value={overview?.activeTenants?.toString() || "0"}
              change={`+${overview?.newTenantsThisMonth || 0} new this month`}
              changeType="positive"
              icon={Building2}
            />
            <StatsCard
              title="Total Users"
              value={formatNumber(overview?.totalUsers || 0)}
              change={`+${overview?.newUsersThisMonth || 0} this month`}
              changeType="positive"
              icon={Users}
            />
            <StatsCard
              title="WhatsApp Messages"
              value={formatNumber(overview?.whatsappMessages || 0)}
              change={`${overview?.deliveryRate || 0}% delivery rate`}
              changeType="neutral"
              icon={MessageSquare}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>
              Monthly recurring revenue over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <ChartSkeleton />
            ) : revenueData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            ) : (
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "hsl(310, 70%, 35%)" },
                }}
                className="h-75 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(310, 70%, 35%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(310, 70%, 35%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis
                      className="text-xs fill-muted-foreground"
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(310, 70%, 35%)"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tenant Growth</CardTitle>
            <CardDescription>New signups vs churned tenants</CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <ChartSkeleton />
            ) : growthData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-muted-foreground">
                No growth data available
              </div>
            ) : (
              <ChartContainer
                config={{
                  new: { label: "New Tenants", color: "hsl(145, 60%, 40%)" },
                  churned: { label: "Churned", color: "hsl(0, 70%, 50%)" },
                }}
                className="h-75 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={growthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="new"
                      fill="hsl(145, 60%, 40%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="churned"
                      fill="hsl(0, 70%, 50%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Signups</CardTitle>
            <CardDescription>Latest tenant registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {tenantsLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTenants.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                      >
                        No recent signups found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTenants.map((tenant) => (
                      <TableRow key={tenant._id || tenant.id}>
                        <TableCell className="font-medium">
                          {tenant.name}
                        </TableCell>
                        <TableCell>
                          {getPlanName(tenant.subscription?.plan_id)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle(tenant.status)}>
                            {tenant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {tenant.created_at
                            ? formatDistanceToNow(new Date(tenant.created_at), {
                                addSuffix: true,
                              })
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Latest Payments</CardTitle>
            <CardDescription>Recent subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.tenant}
                    </TableCell>
                    <TableCell className="text-green-600 dark:text-green-400 font-semibold">
                      {payment.amount}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {payment.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
