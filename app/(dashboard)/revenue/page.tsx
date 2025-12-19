"use client";

import * as React from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const monthlyRevenue = [
  { month: "Jan", revenue: 1535500, expenses: 348600, profit: 1186900 },
  { month: "Feb", revenue: 1759600, expenses: 398400, profit: 1361200 },
  { month: "Mar", revenue: 1643400, expenses: 373500, profit: 1269900 },
  { month: "Apr", revenue: 2033500, expenses: 423300, profit: 1610200 },
  { month: "May", revenue: 2398700, expenses: 481400, profit: 1917300 },
  { month: "Jun", revenue: 2689200, expenses: 514600, profit: 2174600 },
];

const revenueByPlan = [
  { name: "Starter", value: 230076, subscribers: 28, color: "#94a3b8" },
  { name: "Business", value: 868595, subscribers: 35, color: "#8b5cf6" },
  { name: "Enterprise", value: 447453, subscribers: 9, color: "#580077" },
];

const topTenants = [
  {
    name: "FoodMart Express",
    plan: "Enterprise",
    revenue: 596604,
    growth: 15.2,
  },
  { name: "MediCare Plus", plan: "Enterprise", revenue: 596604, growth: 12.8 },
  { name: "TechCorp Ltd", plan: "Business", revenue: 248004, growth: 8.5 },
  { name: "StyleHub Fashion", plan: "Business", revenue: 124002, growth: -2.1 },
  { name: "RetailPro Store", plan: "Starter", revenue: 98604, growth: 5.3 },
];

const revenueBreakdown = [
  { category: "Subscription Revenue", amount: 2689200, percentage: 85 },
  { category: "Overage Charges", amount: 265600, percentage: 8.4 },
  { category: "Setup Fees", amount: 124500, percentage: 3.9 },
  { category: "Support Add-ons", amount: 91300, percentage: 2.7 },
];

export default function RevenuePage() {
  const [timeRange, setTimeRange] = React.useState("6months");
  const [exportFormat, setExportFormat] = React.useState("csv");

  const totalRevenue = monthlyRevenue.reduce((acc, m) => acc + m.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((acc, m) => acc + m.expenses, 0);
  const totalProfit = monthlyRevenue.reduce((acc, m) => acc + m.profit, 0);
  const avgMonthlyRevenue = totalRevenue / monthlyRevenue.length;

  const handleExport = () => {
    alert(`Exporting data as ${exportFormat.toUpperCase()}...`);
  };

  const formatINR = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Revenue & Financial Reports
          </h1>
          <p className="text-muted-foreground">
            Analyze revenue trends and financial performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards - Updated to INR */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(totalRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(totalExpenses / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">+8.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₹{(totalProfit / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+14.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(avgMonthlyRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <IndianRupee className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-plan">By Plan</TabsTrigger>
          <TabsTrigger value="by-tenant">By Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue & Profit Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Revenue & Profit Trend
                </CardTitle>
                <CardDescription>
                  Monthly revenue, expenses, and profit over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(310, 70%, 35%)" },
                    expenses: { label: "Expenses", color: "hsl(0, 70%, 50%)" },
                    profit: { label: "Profit", color: "hsl(145, 60%, 40%)" },
                  }}
                  className="h-87.5 w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyRevenue}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="revGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(310, 70%, 35%)"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(310, 70%, 35%)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="profitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(145, 60%, 40%)"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(145, 60%, 40%)"
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
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(310, 70%, 35%)"
                        strokeWidth={2}
                        fill="url(#revGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="hsl(145, 60%, 40%)"
                        strokeWidth={2}
                        fill="url(#profitGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>
                  Revenue by category for current month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.category}</span>
                        <span className="font-medium">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Monthly Comparison
                </CardTitle>
                <CardDescription>Revenue vs Expenses by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: { label: "Revenue", color: "hsl(310, 70%, 35%)" },
                    expenses: { label: "Expenses", color: "hsl(0, 70%, 50%)" },
                  }}
                  className="h-62.5 w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
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
                      <YAxis
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="revenue"
                        fill="hsl(310, 70%, 35%)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="hsl(0, 70%, 50%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-plan" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Revenue by Plan
                </CardTitle>
                <CardDescription>
                  Distribution of revenue across subscription tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByPlan}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {revenueByPlan.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">
                  Plan Performance
                </CardTitle>
                <CardDescription>
                  Revenue and subscriber details by plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="text-right">ARPU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByPlan.map((plan) => (
                      <TableRow key={plan.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: plan.color }}
                            />
                            {plan.name}
                          </div>
                        </TableCell>
                        <TableCell>{plan.subscribers}</TableCell>
                        <TableCell>
                          ₹{plan.value.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹
                          {Math.round(
                            plan.value / plan.subscribers
                          ).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-tenant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Top Revenue Generating Tenants
              </CardTitle>
              <CardDescription>
                Tenants ranked by lifetime revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTenants.map((tenant, index) => (
                    <TableRow key={tenant.name}>
                      <TableCell>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {tenant.name}
                      </TableCell>
                      <TableCell>{tenant.plan}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{tenant.revenue.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`flex items-center justify-end gap-1 ${
                            tenant.growth >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {tenant.growth >= 0 ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {Math.abs(tenant.growth)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
