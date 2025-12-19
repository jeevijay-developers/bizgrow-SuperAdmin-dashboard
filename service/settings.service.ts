import api, { ApiResponse } from "./api";

// Types
export interface PlatformSettings {
  general: GeneralSettings;
  registration: RegistrationSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  features: FeatureToggles;
  system: SystemSettings;
}

export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  termsUrl: string;
  privacyUrl: string;
  logo?: string;
  favicon?: string;
}

export interface RegistrationSettings {
  allowNewSignups: boolean;
  trialPeriodDays: number;
  defaultPlan: string;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  slackNotifications: boolean;
  slackWebhookUrl?: string;
  alerts: {
    newTenantSignup: boolean;
    paymentReceived: boolean;
    paymentFailed: boolean;
    quotaWarning: boolean;
    systemErrors: boolean;
  };
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  ipWhitelist?: string[];
}

export interface FeatureToggles {
  whatsappIntegration: boolean;
  smsIntegration: boolean;
  emailIntegration: boolean;
  apiAccess: boolean;
  bulkExport: boolean;
  advancedAnalytics: boolean;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  debugMode: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  apiRateLimit: number;
  maxFileUploadSize: number; // in MB
}

export interface UpdateSettingsData {
  general?: Partial<GeneralSettings>;
  registration?: Partial<RegistrationSettings>;
  notifications?: Partial<NotificationSettings>;
  security?: Partial<SecuritySettings>;
  features?: Partial<FeatureToggles>;
  system?: Partial<SystemSettings>;
}

// Settings Service - Admin platform configuration
const settingsService = {
  /**
   * Get all platform settings (Admin)
   */
  async getSettings(): Promise<ApiResponse<PlatformSettings>> {
    const response = await api.get<ApiResponse<PlatformSettings>>(
      "/admin/settings"
    );
    return response.data;
  },

  /**
   * Update platform settings (Admin)
   */
  async updateSettings(
    data: UpdateSettingsData
  ): Promise<ApiResponse<PlatformSettings>> {
    const response = await api.put<ApiResponse<PlatformSettings>>(
      "/admin/settings",
      data
    );
    return response.data;
  },

  // ============ Individual Setting Groups ============

  /**
   * Get general settings (Admin)
   */
  async getGeneralSettings(): Promise<ApiResponse<GeneralSettings>> {
    const response = await api.get<ApiResponse<GeneralSettings>>(
      "/admin/settings/general"
    );
    return response.data;
  },

  /**
   * Update general settings (Admin)
   */
  async updateGeneralSettings(
    data: Partial<GeneralSettings>
  ): Promise<ApiResponse<GeneralSettings>> {
    const response = await api.put<ApiResponse<GeneralSettings>>(
      "/admin/settings/general",
      data
    );
    return response.data;
  },

  /**
   * Get registration settings (Admin)
   */
  async getRegistrationSettings(): Promise<ApiResponse<RegistrationSettings>> {
    const response = await api.get<ApiResponse<RegistrationSettings>>(
      "/admin/settings/registration"
    );
    return response.data;
  },

  /**
   * Update registration settings (Admin)
   */
  async updateRegistrationSettings(
    data: Partial<RegistrationSettings>
  ): Promise<ApiResponse<RegistrationSettings>> {
    const response = await api.put<ApiResponse<RegistrationSettings>>(
      "/admin/settings/registration",
      data
    );
    return response.data;
  },

  /**
   * Get notification settings (Admin)
   */
  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    const response = await api.get<ApiResponse<NotificationSettings>>(
      "/admin/settings/notifications"
    );
    return response.data;
  },

  /**
   * Update notification settings (Admin)
   */
  async updateNotificationSettings(
    data: Partial<NotificationSettings>
  ): Promise<ApiResponse<NotificationSettings>> {
    const response = await api.put<ApiResponse<NotificationSettings>>(
      "/admin/settings/notifications",
      data
    );
    return response.data;
  },

  /**
   * Get security settings (Admin)
   */
  async getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {
    const response = await api.get<ApiResponse<SecuritySettings>>(
      "/admin/settings/security"
    );
    return response.data;
  },

  /**
   * Update security settings (Admin)
   */
  async updateSecuritySettings(
    data: Partial<SecuritySettings>
  ): Promise<ApiResponse<SecuritySettings>> {
    const response = await api.put<ApiResponse<SecuritySettings>>(
      "/admin/settings/security",
      data
    );
    return response.data;
  },

  /**
   * Get feature toggles (Admin)
   */
  async getFeatureToggles(): Promise<ApiResponse<FeatureToggles>> {
    const response = await api.get<ApiResponse<FeatureToggles>>(
      "/admin/settings/features"
    );
    return response.data;
  },

  /**
   * Update feature toggles (Admin)
   */
  async updateFeatureToggles(
    data: Partial<FeatureToggles>
  ): Promise<ApiResponse<FeatureToggles>> {
    const response = await api.put<ApiResponse<FeatureToggles>>(
      "/admin/settings/features",
      data
    );
    return response.data;
  },

  /**
   * Get system settings (Admin)
   */
  async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    const response = await api.get<ApiResponse<SystemSettings>>(
      "/admin/settings/system"
    );
    return response.data;
  },

  /**
   * Update system settings (Admin)
   */
  async updateSystemSettings(
    data: Partial<SystemSettings>
  ): Promise<ApiResponse<SystemSettings>> {
    const response = await api.put<ApiResponse<SystemSettings>>(
      "/admin/settings/system",
      data
    );
    return response.data;
  },

  // ============ Special Operations ============

  /**
   * Toggle maintenance mode (Admin)
   */
  async toggleMaintenanceMode(
    enabled: boolean,
    message?: string
  ): Promise<ApiResponse<{ maintenanceMode: boolean }>> {
    const response = await api.post<ApiResponse<{ maintenanceMode: boolean }>>(
      "/admin/settings/maintenance",
      {
        enabled,
        message,
      }
    );
    return response.data;
  },

  /**
   * Test Slack webhook (Admin)
   */
  async testSlackWebhook(
    webhookUrl: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const response = await api.post<
      ApiResponse<{ success: boolean; message: string }>
    >("/admin/settings/test-slack", {
      webhookUrl,
    });
    return response.data;
  },

  /**
   * Upload platform logo (Admin)
   */
  async uploadLogo(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post<ApiResponse<{ url: string }>>(
      "/admin/settings/logo",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};

export default settingsService;
