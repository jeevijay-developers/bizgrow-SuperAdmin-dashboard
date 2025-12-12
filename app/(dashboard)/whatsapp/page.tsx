"use client"

import * as React from "react"
import {
  MessageSquare,
  Send,
  CheckCheck,
  Eye,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const messageStats = {
  sent: 45200,
  delivered: 44180,
  read: 38450,
  failed: 520,
}

const hourlyData = [
  { hour: "6AM", sent: 1200, delivered: 1180 },
  { hour: "8AM", sent: 3500, delivered: 3420 },
  { hour: "10AM", sent: 5200, delivered: 5100 },
  { hour: "12PM", sent: 4800, delivered: 4700 },
  { hour: "2PM", sent: 5500, delivered: 5380 },
  { hour: "4PM", sent: 6200, delivered: 6050 },
  { hour: "6PM", sent: 7100, delivered: 6950 },
  { hour: "8PM", sent: 5800, delivered: 5680 },
  { hour: "10PM", sent: 3200, delivered: 3120 },
]

const tenantQuota = [
  { tenant: "FoodMart Express", used: 18500, limit: 20000, plan: "Enterprise" },
  { tenant: "TechCorp Ltd", used: 4250, limit: 5000, plan: "Business" },
  { tenant: "MediCare Plus", used: 12400, limit: 20000, plan: "Enterprise" },
  { tenant: "RetailPro Store", used: 890, limit: 1000, plan: "Starter" },
  { tenant: "StyleHub Fashion", used: 2100, limit: 5000, plan: "Business" },
]

const templates = [
  {
    id: "1",
    name: "Order Confirmation",
    category: "Transactional",
    status: "approved",
    usageCount: 12450,
    lastUsed: "2 mins ago",
    content: "Hi {{1}}, your order #{{2}} has been confirmed. Track at {{3}}",
  },
  {
    id: "2",
    name: "Delivery Update",
    category: "Transactional",
    status: "approved",
    usageCount: 8920,
    lastUsed: "5 mins ago",
    content: "Your order is out for delivery! Expected arrival: {{1}}",
  },
  {
    id: "3",
    name: "Payment Reminder",
    category: "Marketing",
    status: "approved",
    usageCount: 5670,
    lastUsed: "1 hour ago",
    content: "Hi {{1}}, this is a reminder about your pending payment of ₹{{2}}",
  },
  {
    id: "4",
    name: "Welcome Message",
    category: "Transactional",
    status: "approved",
    usageCount: 3450,
    lastUsed: "30 mins ago",
    content: "Welcome to {{1}}! We're excited to have you on board.",
  },
  {
    id: "5",
    name: "Promotional Offer",
    category: "Marketing",
    status: "pending",
    usageCount: 0,
    lastUsed: "Never",
    content: "🎉 Special offer just for you! Get {{1}}% off on your next purchase.",
  },
  {
    id: "6",
    name: "Feedback Request",
    category: "Marketing",
    status: "rejected",
    usageCount: 0,
    lastUsed: "Never",
    content: "How was your experience? Rate us: {{1}}",
  },
]

const providers = [
  { name: "Primary (Twilio)", status: "operational", uptime: 99.9, latency: 120, queue: 45 },
  { name: "Backup (MessageBird)", status: "standby", uptime: 99.7, latency: 145, queue: 0 },
]

export default function WhatsAppPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedTemplate, setSelectedTemplate] = React.useState<(typeof templates)[0] | null>(null)
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const openTemplateDialog = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template)
    setTemplateDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    return <Badge className={styles[status] || ""}>{status}</Badge>
  }

  const getProviderStatusBadge = (status: string) => {
    const styles: Record<string, { color: string; text: string }> = {
      operational: { color: "bg-green-500", text: "Operational" },
      standby: { color: "bg-blue-500", text: "Standby" },
      degraded: { color: "bg-yellow-500", text: "Degraded" },
      down: { color: "bg-red-500", text: "Down" },
    }
    const { color, text } = styles[status] || styles.down
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-sm">{text}</span>
      </div>
    )
  }

  const deliveryRate = ((messageStats.delivered / messageStats.sent) * 100).toFixed(1)
  const readRate = ((messageStats.read / messageStats.delivered) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">WhatsApp Monitoring</h1>
          <p className="text-muted-foreground">Monitor message delivery and template performance</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refresh Stats
        </Button>
      </div>

      {/* Message Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messageStats.sent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                <CheckCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deliveryRate}%</p>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{readRate}%</p>
                <p className="text-sm text-muted-foreground">Read Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{messageStats.failed.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Failed Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hourly Message Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Message Delivery by Hour</CardTitle>
            <CardDescription>Today's message volume and delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sent: { label: "Sent", color: "hsl(310, 70%, 35%)" },
                delivered: { label: "Delivered", color: "hsl(145, 60%, 40%)" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hour" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sent" fill="hsl(310, 70%, 35%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" fill="hsl(145, 60%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tenant Quota Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tenant Quota Usage</CardTitle>
            <CardDescription>Message quota consumption by tenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tenantQuota.map((tenant) => {
              const percentage = (tenant.used / tenant.limit) * 100
              const isWarning = percentage >= 80
              return (
                <div key={tenant.tenant} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tenant.tenant}</span>
                      {isWarning && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <span className="text-muted-foreground">
                      {tenant.used.toLocaleString()} / {tenant.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={percentage} className={`h-2 ${isWarning ? "[&>div]:bg-yellow-500" : ""}`} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Message Templates</CardTitle>
              <CardDescription>Manage WhatsApp Business API templates</CardDescription>
            </div>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id} className="cursor-pointer" onClick={() => openTemplateDialog(template)}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                  <TableCell>{template.usageCount.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{template.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            openTemplateDialog(template)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit Template</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Provider Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{provider.name}</CardTitle>
                {getProviderStatusBadge(provider.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Uptime</span>
                  </div>
                  <p className="text-xl font-semibold">{provider.uptime}%</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Latency</span>
                  </div>
                  <p className="text-xl font-semibold">{provider.latency}ms</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs">Queue</span>
                  </div>
                  <p className="text-xl font-semibold">{provider.queue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Detail Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                  {getStatusBadge(selectedTemplate.status)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium mb-2">Template Content</p>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-mono">{selectedTemplate.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedTemplate.usageCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Usage</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{selectedTemplate.lastUsed}</p>
                      <p className="text-xs text-muted-foreground">Last Used</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Edit Template</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  View Analytics
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
