import api, { ApiResponse } from "./api";

// Types
export interface WhatsAppStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
}

export interface HourlyMessageData {
  hour: string;
  sent: number;
  delivered: number;
}

export interface TenantQuota {
  tenantId: string;
  tenant: string;
  used: number;
  limit: number;
  plan: string;
  percentage: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "Transactional" | "Marketing" | "OTP";
  status: TemplateStatus;
  usageCount: number;
  lastUsed?: string;
  content: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export type TemplateStatus = "approved" | "pending" | "rejected";

export interface TemplateFilters {
  category?: "Transactional" | "Marketing" | "OTP" | "all";
  status?: TemplateStatus | "all";
  search?: string;
}

export interface WhatsAppProvider {
  id: string;
  name: string;
  provider: "twilio" | "gupshup" | "meta";
  status: ProviderStatus;
  isDefault: boolean;
  uptime: number;
  latency: number;
  queue: number;
  config?: {
    apiKey?: string;
    apiSecret?: string;
    accountSid?: string;
    phoneNumberId?: string;
    webhookUrl?: string;
  };
  rateLimit?: number;
  costPerMessage?: number;
  updatedAt: string;
}

export type ProviderStatus = "operational" | "standby" | "degraded" | "down";

export interface ProviderUpdateData {
  isActive?: boolean;
  isDefault?: boolean;
  config?: Partial<WhatsAppProvider["config"]>;
  rateLimit?: number;
  costPerMessage?: number;
}

export interface WhatsAppAnalytics {
  stats: WhatsAppStats;
  hourlyData: HourlyMessageData[];
  tenantQuotas: TenantQuota[];
  topTemplates: WhatsAppTemplate[];
}

// WhatsApp Service - Admin monitoring and configuration
const whatsappService = {
  // ============ Statistics ============

  /**
   * Get WhatsApp message statistics (Admin)
   */
  async getStats(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<WhatsAppStats>> {
    const response = await api.get<ApiResponse<WhatsAppStats>>(
      "/admin/whatsapp/stats",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get hourly message data for charts (Admin)
   */
  async getHourlyData(
    date?: string
  ): Promise<ApiResponse<HourlyMessageData[]>> {
    const response = await api.get<ApiResponse<HourlyMessageData[]>>(
      "/admin/whatsapp/hourly",
      { params: { date } }
    );
    return response.data;
  },

  /**
   * Get tenant quota usage (Admin)
   */
  async getTenantQuotas(): Promise<ApiResponse<TenantQuota[]>> {
    const response = await api.get<ApiResponse<TenantQuota[]>>(
      "/admin/whatsapp/quotas"
    );
    return response.data;
  },

  /**
   * Get full WhatsApp analytics (Admin)
   */
  async getAnalytics(filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<WhatsAppAnalytics>> {
    const response = await api.get<ApiResponse<WhatsAppAnalytics>>(
      "/admin/whatsapp/analytics",
      { params: filters }
    );
    return response.data;
  },

  // ============ Templates ============

  /**
   * Get all WhatsApp templates (Admin)
   */
  async getTemplates(
    filters?: TemplateFilters
  ): Promise<ApiResponse<WhatsAppTemplate[]>> {
    const params = { ...filters };
    if (params.category === "all") delete params.category;
    if (params.status === "all") delete params.status;
    const response = await api.get<ApiResponse<WhatsAppTemplate[]>>(
      "/admin/whatsapp/templates",
      { params }
    );
    return response.data;
  },

  /**
   * Get single template by ID (Admin)
   */
  async getTemplate(
    templateId: string
  ): Promise<ApiResponse<WhatsAppTemplate>> {
    const response = await api.get<ApiResponse<WhatsAppTemplate>>(
      `/admin/whatsapp/templates/${templateId}`
    );
    return response.data;
  },

  /**
   * Approve template (Admin)
   */
  async approveTemplate(
    templateId: string
  ): Promise<ApiResponse<WhatsAppTemplate>> {
    const response = await api.post<ApiResponse<WhatsAppTemplate>>(
      `/admin/whatsapp/templates/${templateId}/approve`
    );
    return response.data;
  },

  /**
   * Reject template (Admin)
   */
  async rejectTemplate(
    templateId: string,
    reason?: string
  ): Promise<ApiResponse<WhatsAppTemplate>> {
    const response = await api.post<ApiResponse<WhatsAppTemplate>>(
      `/admin/whatsapp/templates/${templateId}/reject`,
      { reason }
    );
    return response.data;
  },

  // ============ Providers ============

  /**
   * Get all WhatsApp providers (Admin)
   */
  async getProviders(): Promise<ApiResponse<WhatsAppProvider[]>> {
    const response = await api.get<ApiResponse<WhatsAppProvider[]>>(
      "/admin/whatsapp/providers"
    );
    return response.data;
  },

  /**
   * Update WhatsApp provider configuration (Admin)
   */
  async updateProvider(
    providerId: string,
    data: ProviderUpdateData
  ): Promise<ApiResponse<WhatsAppProvider>> {
    const response = await api.put<ApiResponse<WhatsAppProvider>>(
      `/admin/whatsapp/providers/${providerId}`,
      data
    );
    return response.data;
  },

  /**
   * Set default provider (Admin)
   */
  async setDefaultProvider(
    providerId: string
  ): Promise<ApiResponse<WhatsAppProvider>> {
    const response = await api.post<ApiResponse<WhatsAppProvider>>(
      `/admin/whatsapp/providers/${providerId}/default`
    );
    return response.data;
  },

  /**
   * Test provider connection (Admin)
   */
  async testProvider(
    providerId: string
  ): Promise<
    ApiResponse<{ success: boolean; latency: number; message: string }>
  > {
    const response = await api.post<
      ApiResponse<{ success: boolean; latency: number; message: string }>
    >(`/admin/whatsapp/providers/${providerId}/test`);
    return response.data;
  },

  /**
   * Refresh stats (Admin) - force refresh from providers
   */
  async refreshStats(): Promise<ApiResponse<WhatsAppStats>> {
    const response = await api.post<ApiResponse<WhatsAppStats>>(
      "/admin/whatsapp/refresh"
    );
    return response.data;
  },
};

export default whatsappService;
