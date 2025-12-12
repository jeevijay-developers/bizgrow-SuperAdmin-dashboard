"use client"

import * as React from "react"
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

const initialUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john@techcorp.com",
    phone: "+91 98765 43210",
    tenant: "TechCorp Ltd",
    role: "Owner",
    status: "active",
    lastLogin: "2 hours ago",
    createdAt: "2024-01-15",
    avatar: "",
    ordersProcessed: 245,
    invoicesCreated: 189,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    phone: "+91 98765 43211",
    tenant: "TechCorp Ltd",
    role: "Manager",
    status: "active",
    lastLogin: "5 hours ago",
    createdAt: "2024-01-20",
    avatar: "",
    ordersProcessed: 156,
    invoicesCreated: 98,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@retailpro.com",
    phone: "+91 98765 43212",
    tenant: "RetailPro Store",
    role: "Owner",
    status: "active",
    lastLogin: "1 day ago",
    createdAt: "2024-02-20",
    avatar: "",
    ordersProcessed: 89,
    invoicesCreated: 67,
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@foodmart.com",
    phone: "+91 98765 43213",
    tenant: "FoodMart Express",
    role: "Owner",
    status: "active",
    lastLogin: "30 mins ago",
    createdAt: "2023-11-08",
    avatar: "",
    ordersProcessed: 512,
    invoicesCreated: 423,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@foodmart.com",
    phone: "+91 98765 43214",
    tenant: "FoodMart Express",
    role: "Staff",
    status: "active",
    lastLogin: "3 hours ago",
    createdAt: "2023-12-15",
    avatar: "",
    ordersProcessed: 198,
    invoicesCreated: 145,
  },
  {
    id: "6",
    name: "Lisa Brown",
    email: "lisa@stylehub.com",
    phone: "+91 98765 43215",
    tenant: "StyleHub Fashion",
    role: "Owner",
    status: "pending",
    lastLogin: "Never",
    createdAt: "2024-03-01",
    avatar: "",
    ordersProcessed: 0,
    invoicesCreated: 0,
  },
  {
    id: "7",
    name: "James Miller",
    email: "james@autoparts.com",
    phone: "+91 98765 43216",
    tenant: "AutoParts Plus",
    role: "Owner",
    status: "inactive",
    lastLogin: "2 weeks ago",
    createdAt: "2024-03-10",
    avatar: "",
    ordersProcessed: 23,
    invoicesCreated: 18,
  },
  {
    id: "8",
    name: "Anna Taylor",
    email: "anna@medicare.com",
    phone: "+91 98765 43217",
    tenant: "MediCare Plus",
    role: "Owner",
    status: "active",
    lastLogin: "1 hour ago",
    createdAt: "2023-09-22",
    avatar: "",
    ordersProcessed: 387,
    invoicesCreated: 312,
  },
  {
    id: "9",
    name: "Raj Patel",
    email: "raj@quickgrocers.com",
    phone: "+91 98765 43218",
    tenant: "Quick Grocers",
    role: "Owner",
    status: "active",
    lastLogin: "4 hours ago",
    createdAt: "2024-02-05",
    avatar: "",
    ordersProcessed: 156,
    invoicesCreated: 134,
  },
  {
    id: "10",
    name: "Priya Sharma",
    email: "priya@fitnesszone.com",
    phone: "+91 98765 43219",
    tenant: "Fitness Zone",
    role: "Owner",
    status: "active",
    lastLogin: "6 hours ago",
    createdAt: "2024-03-05",
    avatar: "",
    ordersProcessed: 78,
    invoicesCreated: 65,
  },
]

const ITEMS_PER_PAGE = 5

export default function UsersPage() {
  const [users, setUsers] = React.useState(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [selectedUser, setSelectedUser] = React.useState<(typeof users)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [addUserOpen, setAddUserOpen] = React.useState(false)
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    phone: "",
    tenant: "",
    role: "Staff",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, roleFilter])

  const openUserDialog = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleAddUser = () => {
    const user = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      tenant: newUser.tenant,
      role: newUser.role,
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
      avatar: "",
      ordersProcessed: 0,
      invoicesCreated: 0,
    }
    setUsers([user, ...users])
    setAddUserOpen(false)
    setNewUser({ name: "", email: "", phone: "", tenant: "", role: "Staff" })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    }
    return <Badge className={styles[status] || ""}>{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      Owner: "bg-primary/10 text-primary border-primary/20",
      Manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Staff: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    }
    return (
      <Badge variant="outline" className={styles[role] || ""}>
        {role}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const owners = users.filter((u) => u.role === "Owner").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Store Owners & Users</h1>
          <p className="text-muted-foreground">Manage users across all tenants</p>
        </div>
        <Button className="gap-2" onClick={() => setAddUserOpen(true)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{owners}</p>
                <p className="text-sm text-muted-foreground">Store Owners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or tenant..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Users</CardTitle>
          <CardDescription>{filteredUsers.length} users found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer" onClick={() => openUserDialog(user)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{user.tenant}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
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
                            openUserDialog(user)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend User
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
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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

      {/* User Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedUser.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.status)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.tenant}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined {selectedUser.createdAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-primary">{selectedUser.ordersProcessed}</p>
                        <p className="text-sm text-muted-foreground">Orders Processed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-primary">{selectedUser.invoicesCreated}</p>
                        <p className="text-sm text-muted-foreground">Invoices Created</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Login</span>
                        <span className="font-medium">{selectedUser.lastLogin}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1">Edit User</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Send Message
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account for a tenant.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input
                id="user-name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email Address</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="user@company.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">Phone Number</Label>
              <Input
                id="user-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-tenant">Tenant / Business</Label>
              <Input
                id="user-tenant"
                placeholder="Enter tenant name"
                value={newUser.tenant}
                onChange={(e) => setNewUser({ ...newUser, tenant: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.tenant}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
