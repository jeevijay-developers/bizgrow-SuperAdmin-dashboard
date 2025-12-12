import { Building2, Users, IndianRupee, MessageSquare } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 1535500, tenants: 42 },
  { month: "Feb", revenue: 1759600, tenants: 48 },
  { month: "Mar", revenue: 1643400, tenants: 51 },
  { month: "Apr", revenue: 2033500, tenants: 58 },
  { month: "May", revenue: 2398700, tenants: 65 },
  { month: "Jun", revenue: 2689200, tenants: 72 },
]

const tenantGrowthData = [
  { month: "Jan", new: 8, churned: 2 },
  { month: "Feb", new: 12, churned: 3 },
  { month: "Mar", new: 9, churned: 1 },
  { month: "Apr", new: 14, churned: 2 },
  { month: "May", new: 11, churned: 1 },
  { month: "Jun", new: 15, churned: 2 },
]

const recentSignups = [
  { id: 1, name: "TechCorp Ltd", plan: "Business", date: "2 hours ago", status: "active" },
  { id: 2, name: "RetailPro Store", plan: "Starter", date: "5 hours ago", status: "pending" },
  { id: 3, name: "FoodMart Express", plan: "Enterprise", date: "1 day ago", status: "active" },
  { id: 4, name: "StyleHub Fashion", plan: "Business", date: "2 days ago", status: "active" },
  { id: 5, name: "AutoParts Plus", plan: "Starter", date: "3 days ago", status: "trial" },
]

const latestPayments = [
  { id: 1, tenant: "TechCorp Ltd", amount: "₹24,817", date: "Today", method: "Card" },
  { id: 2, tenant: "FoodMart Express", amount: "₹49,717", date: "Today", method: "Bank" },
  { id: 3, tenant: "StyleHub Fashion", amount: "₹24,817", date: "Yesterday", method: "Card" },
  { id: 4, tenant: "Global Imports", amount: "₹12,367", date: "Yesterday", method: "UPI" },
  { id: 5, tenant: "MediCare Plus", amount: "₹49,717", date: "2 days ago", method: "Card" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor your SaaS metrics and tenant activity</p>
      </div>

      {/* Stats Grid - Updated to INR */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="₹26,89,200"
          change="+12.5% from last month"
          changeType="positive"
          icon={IndianRupee}
        />
        <StatsCard
          title="Active Tenants"
          value="72"
          change="+8 new this month"
          changeType="positive"
          icon={Building2}
        />
        <StatsCard title="Total Users" value="1,284" change="+156 this month" changeType="positive" icon={Users} />
        <StatsCard
          title="WhatsApp Messages"
          value="45.2K"
          change="92% delivery rate"
          changeType="neutral"
          icon={MessageSquare}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(310, 70%, 35%)" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(310, 70%, 35%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(310, 70%, 35%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tenant Growth</CardTitle>
            <CardDescription>New signups vs churned tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                new: { label: "New Tenants", color: "hsl(145, 60%, 40%)" },
                churned: { label: "Churned", color: "hsl(0, 70%, 50%)" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tenantGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="new" fill="hsl(145, 60%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churned" fill="hsl(0, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
                {recentSignups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell className="font-medium">{signup.name}</TableCell>
                    <TableCell>{signup.plan}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          signup.status === "active" ? "default" : signup.status === "pending" ? "secondary" : "outline"
                        }
                        className={
                          signup.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {signup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{signup.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    <TableCell className="font-medium">{payment.tenant}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400 font-semibold">{payment.amount}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{payment.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
