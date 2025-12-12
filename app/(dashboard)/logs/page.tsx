"use client"

import * as React from "react"
import {
  Search,
  Filter,
  Download,
  FileText,
  User,
  Settings,
  CreditCard,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const auditLogs = [
  {
    id: "1",
    timestamp: "2024-03-15 14:32:45",
    action: "user.login",
    actor: "john@techcorp.com",
    actorType: "User",
    target: "TechCorp Ltd",
    status: "success",
    ip: "192.168.1.45",
    details: "Successful login from Chrome on Windows",
  },
  {
    id: "2",
    timestamp: "2024-03-15 14:28:12",
    action: "subscription.upgraded",
    actor: "admin@bizgrow360.com",
    actorType: "Admin",
    target: "FoodMart Express",
    status: "success",
    ip: "10.0.0.1",
    details: "Plan upgraded from Business to Enterprise",
  },
  {
    id: "3",
    timestamp: "2024-03-15 14:15:33",
    action: "user.created",
    actor: "sarah@techcorp.com",
    actorType: "User",
    target: "TechCorp Ltd",
    status: "success",
    ip: "192.168.1.46",
    details: "New staff member added: david@techcorp.com",
  },
  {
    id: "4",
    timestamp: "2024-03-15 13:58:21",
    action: "payment.failed",
    actor: "system",
    actorType: "System",
    target: "Global Imports",
    status: "error",
    ip: "-",
    details: "Payment declined - insufficient funds",
  },
  {
    id: "5",
    timestamp: "2024-03-15 13:45:10",
    action: "settings.updated",
    actor: "admin@bizgrow360.com",
    actorType: "Admin",
    target: "Platform",
    status: "success",
    ip: "10.0.0.1",
    details: "WhatsApp rate limit updated to 100 msg/min",
  },
  {
    id: "6",
    timestamp: "2024-03-15 13:30:55",
    action: "tenant.suspended",
    actor: "admin@bizgrow360.com",
    actorType: "Admin",
    target: "Global Imports",
    status: "warning",
    ip: "10.0.0.1",
    details: "Account suspended due to payment issues",
  },
  {
    id: "7",
    timestamp: "2024-03-15 12:22:18",
    action: "api.rate_limited",
    actor: "system",
    actorType: "System",
    target: "RetailPro Store",
    status: "warning",
    ip: "-",
    details: "API rate limit exceeded - 1000 requests/hour",
  },
  {
    id: "8",
    timestamp: "2024-03-15 11:45:32",
    action: "user.password_reset",
    actor: "mike@retailpro.com",
    actorType: "User",
    target: "RetailPro Store",
    status: "success",
    ip: "192.168.2.12",
    details: "Password reset completed successfully",
  },
  {
    id: "9",
    timestamp: "2024-03-15 11:12:05",
    action: "data.exported",
    actor: "emily@foodmart.com",
    actorType: "User",
    target: "FoodMart Express",
    status: "info",
    ip: "192.168.3.88",
    details: "Exported 5,420 customer records as CSV",
  },
  {
    id: "10",
    timestamp: "2024-03-15 10:55:41",
    action: "security.2fa_enabled",
    actor: "anna@medicare.com",
    actorType: "User",
    target: "MediCare Plus",
    status: "success",
    ip: "192.168.4.22",
    details: "Two-factor authentication enabled via authenticator app",
  },
  {
    id: "11",
    timestamp: "2024-03-15 10:30:00",
    action: "tenant.created",
    actor: "admin@bizgrow360.com",
    actorType: "Admin",
    target: "New Business Corp",
    status: "success",
    ip: "10.0.0.1",
    details: "New tenant account created with Business plan",
  },
  {
    id: "12",
    timestamp: "2024-03-15 10:15:22",
    action: "payment.received",
    actor: "system",
    actorType: "System",
    target: "TechCorp Ltd",
    status: "success",
    ip: "-",
    details: "Monthly subscription payment of ₹24,817 received",
  },
]

const ITEMS_PER_PAGE = 6

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [actorTypeFilter, setActorTypeFilter] = React.useState("all")
  const [dateRange, setDateRange] = React.useState("today")
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesActorType = actorTypeFilter === "all" || log.actorType === actorTypeFilter
    return matchesSearch && matchesStatus && matchesActorType
  })

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, actorTypeFilter, dateRange])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; className: string }> = {
      success: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
      error: {
        icon: <XCircle className="h-3 w-3" />,
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      warning: {
        icon: <AlertTriangle className="h-3 w-3" />,
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      info: {
        icon: <Info className="h-3 w-3" />,
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    }
    const { icon, className } = config[status] || config.info
    return (
      <Badge className={`${className} gap-1`}>
        {icon}
        {status}
      </Badge>
    )
  }

  const getActionIcon = (action: string) => {
    if (action.startsWith("user.")) return <User className="h-4 w-4" />
    if (action.startsWith("settings.")) return <Settings className="h-4 w-4" />
    if (action.startsWith("payment.") || action.startsWith("subscription.")) return <CreditCard className="h-4 w-4" />
    if (action.startsWith("security.")) return <Shield className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const handleExport = () => {
    alert("Exporting audit logs...")
  }

  const handleRefresh = () => {
    alert("Refreshing logs...")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events Today</p>
            <p className="text-2xl font-bold text-foreground">{auditLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Success Events</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {auditLogs.filter((l) => l.status === "success").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {auditLogs.filter((l) => l.status === "warning").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {auditLogs.filter((l) => l.status === "error").length}
            </p>
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
                placeholder="Search logs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actorTypeFilter} onValueChange={setActorTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Actor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Activity Log</CardTitle>
          <CardDescription>{filteredLogs.length} events found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{getActionIcon(log.action)}</span>
                      <div>
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{log.details}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{log.actor}</p>
                      <p className="text-xs text-muted-foreground">{log.actorType}</p>
                    </div>
                  </TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
                {filteredLogs.length} events
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
    </div>
  )
}
