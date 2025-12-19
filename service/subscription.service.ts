import api, { ApiResponse } from "./api";

// Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  billing: "monthly" | "yearly";
  features: PlanFeatures;
  isActive: boolean;
  isPopular?: boolean;
  sortOrder?: number;
  activeSubscribers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatures {
  users: number | "Unlimited";
  products: number | "Unlimited";
  messages: number;
  support: string;
  maxLocations?: number;
  advancedReports?: boolean;
  apiAccess?: boolean;
  prioritySupport?: boolean;
  customBranding?: boolean;
  multipleLocations?: boolean;
}

export interface PlanCreateData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  billing: "monthly" | "yearly";
  features: PlanFeatures;
  isActive?: boolean;
  isPopular?: boolean;
  sortOrder?: number;
}

export interface PlanUpdateData extends Partial<PlanCreateData> {}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenant: string;
  plan: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  paidDate?: string;
  method?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "trial"
  | "cancelled"
  | "refunded";

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: InvoiceStatus | "all";
  tenantId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SubscriptionStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  overdueInvoices: number;
  byPlan: Array<{
    plan: string;
    count: number;
    revenue: number;
  }>;
}

// Subscription Service - Admin operations on plans and invoices
const subscriptionService = {
  // ============ Subscription Plans ============

  /**
   * Get all subscription plans (Admin)
   */
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await api.get<ApiResponse<SubscriptionPlan[]>>(
      "/admin/plans"
    );
    return response.data;
  },

  /**
   * Get single plan by ID (Admin)
   */
  async getPlan(planId: string): Promise<ApiResponse<SubscriptionPlan>> {
    const response = await api.get<ApiResponse<SubscriptionPlan>>(
      `/admin/plans/${planId}`
    );
    return response.data;
  },

  /**
   * Create new subscription plan (Admin)
   */
  async createPlan(
    data: PlanCreateData
  ): Promise<ApiResponse<SubscriptionPlan>> {
    const response = await api.post<ApiResponse<SubscriptionPlan>>(
      "/admin/plans",
      data
    );
    return response.data;
  },

  /**
   * Update subscription plan (Admin)
   */
  async updatePlan(
    planId: string,
    data: PlanUpdateData
  ): Promise<ApiResponse<SubscriptionPlan>> {
    const response = await api.put<ApiResponse<SubscriptionPlan>>(
      `/admin/plans/${planId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete subscription plan (Admin)
   */
  async deletePlan(planId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/admin/plans/${planId}`
    );
    return response.data;
  },

  // ============ Invoices ============

  /**
   * Get all invoices (Admin)
   */
  async getInvoices(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>> {
    const params = { ...filters };
    if (params.status === "all") delete params.status;
    const response = await api.get<ApiResponse<Invoice[]>>("/admin/invoices", {
      params,
    });
    return response.data;
  },

  /**
   * Get single invoice by ID (Admin)
   */
  async getInvoice(invoiceId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.get<ApiResponse<Invoice>>(
      `/admin/invoices/${invoiceId}`
    );
    return response.data;
  },

  /**
   * Mark invoice as paid (Admin)
   */
  async markInvoicePaid(
    invoiceId: string,
    paymentDetails?: { method: string; transactionId?: string }
  ): Promise<ApiResponse<Invoice>> {
    const response = await api.post<ApiResponse<Invoice>>(
      `/admin/invoices/${invoiceId}/paid`,
      paymentDetails
    );
    return response.data;
  },

  /**
   * Refund invoice (Admin)
   */
  async refundInvoice(
    invoiceId: string,
    reason?: string
  ): Promise<ApiResponse<Invoice>> {
    const response = await api.post<ApiResponse<Invoice>>(
      `/admin/invoices/${invoiceId}/refund`,
      { reason }
    );
    return response.data;
  },

  /**
   * Send invoice reminder (Admin)
   */
  async sendInvoiceReminder(
    invoiceId: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/admin/invoices/${invoiceId}/reminder`
    );
    return response.data;
  },

  /**
   * Download invoice PDF (Admin)
   */
  async downloadInvoicePdf(invoiceId: string): Promise<Blob> {
    const response = await api.get(`/admin/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Get subscription statistics (Admin)
   */
  async getSubscriptionStats(): Promise<ApiResponse<SubscriptionStats>> {
    const response = await api.get<ApiResponse<SubscriptionStats>>(
      "/admin/subscriptions/stats"
    );
    return response.data;
  },

  /**
   * Get recent payments (Admin)
   */
  async getRecentPayments(limit: number = 5): Promise<ApiResponse<Invoice[]>> {
    const response = await api.get<ApiResponse<Invoice[]>>("/admin/invoices", {
      params: { status: "paid", sortBy: "paidDate", sortOrder: "desc", limit },
    });
    return response.data;
  },

  /**
   * Export invoices data (Admin)
   */
  async exportInvoices(
    format: "csv" | "xlsx" | "pdf" = "csv",
    filters?: InvoiceFilters
  ): Promise<Blob> {
    const response = await api.get("/admin/invoices/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },
};

export default subscriptionService;
