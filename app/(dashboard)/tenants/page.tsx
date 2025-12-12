"use client"

import * as React from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Package,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const initialTenants = [
  {
    id: "1",
    name: "TechCorp Ltd",
    email: "admin@techcorp.com",
    plan: "Business",
    status: "active",
    users: 24,
    products: 156,
    messagesUsed: 4250,
    messagesLimit: 5000,
    createdAt: "2024-01-15",
    lastActive: "2 hours ago",
    revenue: 248004,
    integrations: ["WhatsApp", "SMS", "Email"],
  },
  {
    id: "2",
    name: "RetailPro Store",
    email: "hello@retailpro.com",
    plan: "Starter",
    status: "active",
    users: 5,
    products: 42,
    messagesUsed: 890,
    messagesLimit: 1000,
    createdAt: "2024-02-20",
    lastActive: "5 hours ago",
    revenue: 98604,
    integrations: ["WhatsApp"],
  },
  {
    id: "3",
    name: "FoodMart Express",
    email: "ops@foodmart.com",
    plan: "Enterprise",
    status: "active",
    users: 52,
    products: 890,
    messagesUsed: 18500,
    messagesLimit: 20000,
    createdAt: "2023-11-08",
    lastActive: "1 hour ago",
    revenue: 596604,
    integrations: ["WhatsApp", "SMS", "Email", "API"],
  },
  {
    id: "4",
    name: "StyleHub Fashion",
    email: "contact@stylehub.com",
    plan: "Business",
    status: "pending",
    users: 12,
    products: 234,
    messagesUsed: 2100,
    messagesLimit: 5000,
    createdAt: "2024-03-01",
    lastActive: "1 day ago",
    revenue: 124002,
    integrations: ["WhatsApp", "Email"],
  },
  {
    id: "5",
    name: "AutoParts Plus",
    email: "info@autoparts.com",
    plan: "Starter",
    status: "trial",
    users: 3,
    products: 28,
    messagesUsed: 150,
    messagesLimit: 500,
    createdAt: "2024-03-10",
    lastActive: "3 days ago",
    revenue: 0,
    integrations: ["WhatsApp"],
  },
  {
    id: "6",
    name: "MediCare Plus",
    email: "admin@medicare.com",
    plan: "Enterprise",
    status: "active",
    users: 38,
    products: 520,
    messagesUsed: 12400,
    messagesLimit: 20000,
    createdAt: "2023-09-22",
    lastActive: "30 mins ago",
    revenue: 596604,
    integrations: ["WhatsApp", "SMS", "Email", "API"],
  },
  {
    id: "7",
    name: "Global Imports",
    email: "trade@globalimports.com",
    plan: "Business",
    status: "suspended",
    users: 8,
    products: 89,
    messagesUsed: 0,
    messagesLimit: 5000,
    createdAt: "2024-01-28",
    lastActive: "2 weeks ago",
    revenue: 49634,
    integrations: ["WhatsApp", "Email"],
  },
  {
    id: "8",
    name: "Quick Grocers",
    email: "support@quickgrocers.com",
    plan: "Starter",
    status: "active",
    users: 6,
    products: 78,
    messagesUsed: 650,
    messagesLimit: 1000,
    createdAt: "2024-02-05",
    lastActive: "4 hours ago",
    revenue: 82170,
    integrations: ["WhatsApp"],
  },
  {
    id: "9",
    name: "Urban Electronics",
    email: "info@urbanelectronics.com",
    plan: "Business",
    status: "active",
    users: 18,
    products: 320,
    messagesUsed: 3200,
    messagesLimit: 5000,
    createdAt: "2024-01-10",
    lastActive: "1 hour ago",
    revenue: 248004,
    integrations: ["WhatsApp", "SMS"],
  },
  {
    id: "10",
    name: "Fitness Zone",
    email: "hello@fitnesszone.com",
    plan: "Starter",
    status: "active",
    users: 4,
    products: 35,
    messagesUsed: 420,
    messagesLimit: 1000,
    createdAt: "2024-03-05",
    lastActive: "6 hours ago",
    revenue: 65780,
    integrations: ["WhatsApp"],
  },
]

const ITEMS_PER_PAGE = 5

export default function TenantsPage() {
  const [tenants, setTenants] = React.useState(initialTenants)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [planFilter, setPlanFilter] = React.useState("all")
  const [selectedTenant, setSelectedTenant] = React.useState<(typeof tenants)[0] | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [addTenantOpen, setAddTenantOpen] = React.useState(false)
  const [newTenant, setNewTenant] = React.useState({
    name: "",
    email: "",
    plan: "Starter",
    status: "trial",
  })

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTenants = filteredTenants.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, planFilter])

  const openTenantDrawer = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant)
    setDrawerOpen(true)
  }

  const handleAddTenant = () => {
    const tenant = {
      id: String(tenants.length + 1),
      name: newTenant.name,
      email: newTenant.email,
      plan: newTenant.plan,
      status: newTenant.status,
      users: 1,
      products: 0,
      messagesUsed: 0,
      messagesLimit: newTenant.plan === "Starter" ? 1000 : newTenant.plan === "Business" ? 5000 : 20000,
      createdAt: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      revenue: 0,
      integrations: ["WhatsApp"],
    }
    setTenants([tenant, ...tenants])
    setAddTenantOpen(false)
    setNewTenant({ name: "", email: "", plan: "Starter", status: "trial" })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    return <Badge className={styles[status] || ""}>{status}</Badge>
  }

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      Starter: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      Business: "bg-primary/10 text-primary",
      Enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    }
    return (
      <Badge variant="outline" className={styles[plan] || ""}>
        {plan}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tenant Management</h1>
          <p className="text-muted-foreground">Manage all registered tenants and their subscriptions</p>
        </div>
        <Button className="gap-2" onClick={() => setAddTenantOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants by name or email..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Tenants</CardTitle>
          <CardDescription>{filteredTenants.length} tenants found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTenants.map((tenant) => (
                <TableRow key={tenant.id} className="cursor-pointer" onClick={() => openTenantDrawer(tenant)}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>{tenant.users}</TableCell>
                  <TableCell>{tenant.products}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {tenant.messagesUsed.toLocaleString()} / {tenant.messagesLimit.toLocaleString()}
                      </p>
                      <Progress value={(tenant.messagesUsed / tenant.messagesLimit) * 100} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tenant.lastActive}</TableCell>
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
                            openTenantDrawer(tenant)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredTenants.length)} of{" "}
                {filteredTenants.length} tenants
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

      {/* Tenant Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedTenant && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-xl">{selectedTenant.name}</SheetTitle>
                    <SheetDescription>{selectedTenant.email}</SheetDescription>
                  </div>
                  {getStatusBadge(selectedTenant.status)}
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{selectedTenant.users}</p>
                            <p className="text-xs text-muted-foreground">Users</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{selectedTenant.products}</p>
                            <p className="text-xs text-muted-foreground">Products</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium">{selectedTenant.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Revenue</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ₹{selectedTenant.revenue.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{selectedTenant.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Active</span>
                        <span className="font-medium">{selectedTenant.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="usage" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{selectedTenant.messagesUsed.toLocaleString()} used</span>
                          <span>{selectedTenant.messagesLimit.toLocaleString()} limit</span>
                        </div>
                        <Progress
                          value={(selectedTenant.messagesUsed / selectedTenant.messagesLimit) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {Math.round((selectedTenant.messagesUsed / selectedTenant.messagesLimit) * 100)}% of monthly
                          quota used
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Activity Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Orders This Month</span>
                        <span className="font-medium">128</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Invoices Generated</span>
                        <span className="font-medium">98</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">API Calls</span>
                        <span className="font-medium">12,450</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedTenant.integrations.map((integration) => (
                          <Badge key={integration} variant="secondary" className="px-3 py-1">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Edit Tenant</Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Full Profile
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={addTenantOpen} onOpenChange={setAddTenantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new tenant account for the platform.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Business Name</Label>
              <Input
                id="tenant-name"
                placeholder="Enter business name"
                value={newTenant.name}
                onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-email">Email Address</Label>
              <Input
                id="tenant-email"
                type="email"
                placeholder="admin@business.com"
                value={newTenant.email}
                onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-plan">Subscription Plan</Label>
              <Select value={newTenant.plan} onValueChange={(value) => setNewTenant({ ...newTenant, plan: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter - ₹8,217/mo</SelectItem>
                  <SelectItem value="Business">Business - ₹24,817/mo</SelectItem>
                  <SelectItem value="Enterprise">Enterprise - ₹49,717/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-status">Initial Status</Label>
              <Select value={newTenant.status} onValueChange={(value) => setNewTenant({ ...newTenant, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTenantOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleAddTenant} disabled={!newTenant.name || !newTenant.email}>
              Add Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
