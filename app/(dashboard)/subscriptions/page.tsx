"use client"

import * as React from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Users,
  MessageSquare,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 8217,
    billing: "monthly",
    features: { users: 5, products: 100, messages: 1000, support: "Email" },
    activeSubscribers: 28,
  },
  {
    id: "business",
    name: "Business",
    price: 24817,
    billing: "monthly",
    features: { users: 25, products: 500, messages: 5000, support: "Priority" },
    activeSubscribers: 35,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49717,
    billing: "monthly",
    features: { users: "Unlimited", products: "Unlimited", messages: 20000, support: "24/7 Dedicated" },
    activeSubscribers: 9,
  },
]

const invoices = [
  {
    id: "INV-001",
    tenant: "TechCorp Ltd",
    plan: "Business",
    amount: 24817,
    status: "paid",
    date: "2024-03-01",
    dueDate: "2024-03-15",
    method: "Card",
  },
  {
    id: "INV-002",
    tenant: "FoodMart Express",
    plan: "Enterprise",
    amount: 49717,
    status: "paid",
    date: "2024-03-01",
    dueDate: "2024-03-15",
    method: "Bank Transfer",
  },
  {
    id: "INV-003",
    tenant: "RetailPro Store",
    plan: "Starter",
    amount: 8217,
    status: "pending",
    date: "2024-03-05",
    dueDate: "2024-03-19",
    method: "Card",
  },
  {
    id: "INV-004",
    tenant: "StyleHub Fashion",
    plan: "Business",
    amount: 24817,
    status: "pending",
    date: "2024-03-08",
    dueDate: "2024-03-22",
    method: "UPI",
  },
  {
    id: "INV-005",
    tenant: "MediCare Plus",
    plan: "Enterprise",
    amount: 49717,
    status: "paid",
    date: "2024-02-28",
    dueDate: "2024-03-14",
    method: "Card",
  },
  {
    id: "INV-006",
    tenant: "Global Imports",
    plan: "Business",
    amount: 24817,
    status: "overdue",
    date: "2024-02-15",
    dueDate: "2024-03-01",
    method: "Bank Transfer",
  },
  {
    id: "INV-007",
    tenant: "AutoParts Plus",
    plan: "Starter",
    amount: 0,
    status: "trial",
    date: "2024-03-10",
    dueDate: "2024-03-24",
    method: "-",
  },
  {
    id: "INV-008",
    tenant: "Quick Grocers",
    plan: "Starter",
    amount: 8217,
    status: "paid",
    date: "2024-03-12",
    dueDate: "2024-03-26",
    method: "UPI",
  },
]

const ITEMS_PER_PAGE = 5

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [editPlanOpen, setEditPlanOpen] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<(typeof plans)[0] | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const openEditPlan = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan)
    setEditPlanOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> = {
      paid: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
      pending: {
        icon: <Clock className="h-3 w-3" />,
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      overdue: {
        icon: <XCircle className="h-3 w-3" />,
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      trial: {
        icon: <Zap className="h-3 w-3" />,
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    }
    const { icon, className } = config[status] || config.pending
    return (
      <Badge className={`${className} gap-1`}>
        {icon}
        {status}
      </Badge>
    )
  }

  // Calculate stats in INR
  const totalMRR = plans.reduce((acc, plan) => acc + plan.price * plan.activeSubscribers, 0)
  const totalSubscribers = plans.reduce((acc, plan) => acc + plan.activeSubscribers, 0)
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length
  const pendingAmount = invoices.filter((inv) => inv.status === "pending").reduce((acc, inv) => acc + inv.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Subscriptions & Billing</h1>
          <p className="text-muted-foreground">Manage subscription plans and invoices</p>
        </div>
      </div>

      {/* Stats Cards - Updated to INR */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
            <p className="text-2xl font-bold text-foreground">₹{totalMRR.toLocaleString("en-IN")}</p>
            <p className="text-xs text-green-600 dark:text-green-400">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            <p className="text-2xl font-bold text-foreground">{totalSubscribers}</p>
            <p className="text-xs text-muted-foreground">Across all plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Paid Invoices</p>
            <p className="text-2xl font-bold text-foreground">{paidInvoices}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ₹{pendingAmount.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.name === "Business" ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">{plan.name}</CardTitle>
                    {plan.name === "Business" && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">₹{plan.price.toLocaleString("en-IN")}</span>
                    <span className="text-muted-foreground">/{plan.billing}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {typeof plan.features.users === "number" ? `Up to ${plan.features.users}` : plan.features.users}{" "}
                        users
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {typeof plan.features.products === "number"
                          ? `Up to ${plan.features.products}`
                          : plan.features.products}{" "}
                        products
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.features.messages.toLocaleString()} messages/mo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.features.support} support</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active subscribers</span>
                      <span className="font-semibold">{plan.activeSubscribers}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" onClick={() => openEditPlan(plan)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">All Invoices</CardTitle>
              <CardDescription>{filteredInvoices.length} invoices found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                      <TableCell className="font-medium">{invoice.tenant}</TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell className={invoice.amount > 0 ? "font-semibold" : "text-muted-foreground"}>
                        {invoice.amount > 0 ? `₹${invoice.amount.toLocaleString("en-IN")}` : "Free Trial"}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)} of{" "}
                    {filteredInvoices.length} invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage !== page ? "bg-transparent" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-transparent"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Modal */}
      <Dialog open={editPlanOpen} onOpenChange={setEditPlanOpen}>
        <DialogContent>
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>Edit {selectedPlan.name} Plan</DialogTitle>
                <DialogDescription>Update the pricing and features for this subscription plan.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Price (₹)</Label>
                  <Input id="price" type="number" defaultValue={selectedPlan.price} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="users">Max Users</Label>
                  <Input
                    id="users"
                    defaultValue={
                      typeof selectedPlan.features.users === "number" ? selectedPlan.features.users : "Unlimited"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="products">Max Products</Label>
                  <Input
                    id="products"
                    defaultValue={
                      typeof selectedPlan.features.products === "number" ? selectedPlan.features.products : "Unlimited"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messages">Monthly Messages</Label>
                  <Input id="messages" type="number" defaultValue={selectedPlan.features.messages} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditPlanOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={() => setEditPlanOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
