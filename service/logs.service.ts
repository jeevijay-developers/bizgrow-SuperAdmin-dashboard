import api, { ApiResponse } from "./api";

// Types
export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorType: ActorType;
  actorId?: string;
  target: string;
  targetId?: string;
  status: LogStatus;
  ip?: string;
  userAgent?: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export type ActorType = "User" | "Admin" | "System";
export type LogStatus = "success" | "error" | "warning" | "info";

export interface LogFilters {
  page?: number;
  limit?: number;
  status?: LogStatus | "all";
  actorType?: ActorType | "all";
  action?: string;
  tenantId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: "today" | "7days" | "30days" | "custom";
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LogStats {
  total: number;
  byStatus: {
    success: number;
    error: number;
    warning: number;
    info: number;
  };
  byActorType: {
    User: number;
    Admin: number;
    System: number;
  };
  recentActions: Array<{
    action: string;
    count: number;
  }>;
}

export interface SystemLog {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  service?: string;
  tenantId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface SystemLogFilters {
  page?: number;
  limit?: number;
  level?: "info" | "warn" | "error" | "debug" | "all";
  service?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Logs Service - Admin audit and system logs
const logsService = {
  // ============ Audit Logs ============

  /**
   * Get audit logs with filters (Admin)
   */
  async getAuditLogs(filters?: LogFilters): Promise<ApiResponse<AuditLog[]>> {
    const params = { ...filters };
    if (params.status === "all") delete params.status;
    if (params.actorType === "all") delete params.actorType;
    const response = await api.get<ApiResponse<AuditLog[]>>(
      "/admin/logs/audit",
      { params }
    );
    return response.data;
  },

  /**
   * Get single audit log by ID (Admin)
   */
  async getAuditLog(logId: string): Promise<ApiResponse<AuditLog>> {
    const response = await api.get<ApiResponse<AuditLog>>(
      `/admin/logs/audit/${logId}`
    );
    return response.data;
  },

  /**
   * Get audit log statistics (Admin)
   */
  async getAuditLogStats(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<LogStats>> {
    const response = await api.get<ApiResponse<LogStats>>(
      "/admin/logs/audit/stats",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Export audit logs (Admin)
   */
  async exportAuditLogs(
    format: "csv" | "xlsx" | "json" = "csv",
    filters?: LogFilters
  ): Promise<Blob> {
    const response = await api.get("/admin/logs/audit/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  // ============ System Logs ============

  /**
   * Get system logs (Admin)
   */
  async getSystemLogs(
    filters?: SystemLogFilters
  ): Promise<ApiResponse<SystemLog[]>> {
    const params = { ...filters };
    if (params.level === "all") delete params.level;
    const response = await api.get<ApiResponse<SystemLog[]>>("/admin/logs", {
      params,
    });
    return response.data;
  },

  /**
   * Get system health status (Admin)
   */
  async getSystemHealth(): Promise<
    ApiResponse<{
      status: "healthy" | "degraded" | "unhealthy";
      uptime: number;
      timestamp: string;
      services: {
        database: { status: string; latency?: number };
        redis: { status: string; latency?: number };
        queue: { status: string; latency?: number };
        whatsapp: { status: string; latency?: number };
        storage: { status: string; latency?: number };
      };
      metrics: {
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        activeConnections: number;
      };
    }>
  > {
    const response = await api.get("/admin/health");
    return response.data;
  },

  /**
   * Get available log actions for filtering (Admin)
   */
  async getLogActions(): Promise<ApiResponse<string[]>> {
    const response = await api.get<ApiResponse<string[]>>(
      "/admin/logs/actions"
    );
    return response.data;
  },
};

export default logsService;
