// Base API
export { default as api, getErrorMessage } from "./api";
export type { ApiResponse, ApiError } from "./api";

// Auth Service
export { default as authService } from "./auth.service";
export type {
  User as AuthUser,
  LoginCredentials,
  AdminLoginCredentials,
  AuthTokens,
  LoginResponse,
  ProfileUpdateData,
  OtpSendData,
  OtpVerifyData,
  ChangePhoneData,
} from "./auth.service";

// Tenant Service
export { default as tenantService } from "./tenant.service";
export type {
  Tenant,
  TenantStatus,
  TenantSettings,
  TenantFilters,
  TenantStatusUpdate,
  TenantPlanUpdate,
  TenantCreateData,
  TenantUpdateData,
  TenantStats,
} from "./tenant.service";

// User Service
export { default as userService } from "./user.service";
export type {
  User,
  UserRole,
  UserStatus,
  UserFilters,
  UserStatusUpdate,
  UserCreateData,
  UserUpdateData,
  UserStats,
} from "./user.service";

// Subscription Service
export { default as subscriptionService } from "./subscription.service";
export type {
  SubscriptionPlan,
  PlanFeatures,
  PlanCreateData,
  PlanUpdateData,
  Invoice,
  InvoiceStatus,
  InvoiceFilters,
  SubscriptionStats,
} from "./subscription.service";

// Revenue Service
export { default as revenueService } from "./revenue.service";
export type {
  RevenueOverview,
  MonthlyRevenue,
  RevenueByPlan,
  TopTenant,
  RevenueBreakdown,
  RevenueAnalytics,
  RevenueFilters,
  MRRMetrics,
} from "./revenue.service";

// WhatsApp Service
export { default as whatsappService } from "./whatsapp.service";
export type {
  WhatsAppStats,
  HourlyMessageData,
  TenantQuota,
  WhatsAppTemplate,
  TemplateStatus,
  TemplateFilters,
  WhatsAppProvider,
  ProviderStatus,
  ProviderUpdateData,
  WhatsAppAnalytics,
} from "./whatsapp.service";

// Logs Service
export { default as logsService } from "./logs.service";
export type {
  AuditLog,
  ActorType,
  LogStatus,
  LogFilters,
  LogStats,
  SystemLog,
  SystemLogFilters,
} from "./logs.service";

// Settings Service
export { default as settingsService } from "./settings.service";
export type {
  PlatformSettings,
  GeneralSettings,
  RegistrationSettings,
  NotificationSettings,
  SecuritySettings,
  FeatureToggles,
  SystemSettings,
  UpdateSettingsData,
} from "./settings.service";

// SWR Hooks
export {
  useOverviewAnalytics,
  useTenants,
  useTenant,
  useUsers,
  usePlans,
  useRevenueAnalytics,
  useTenantGrowthAnalytics,
  useRecentTenants,
  useWhatsAppProviders,
  useSystemHealth,
  swrConfig,
} from "./hooks";
export type {
  OverviewData,
  TenantData,
  TenantsResponse,
  TenantFilters as TenantHookFilters,
  UserData,
  UsersResponse,
  UserFilters as UserHookFilters,
  PlanData,
  MonthlyRevenueData,
  TenantGrowthData,
  RevenueAnalyticsResponse,
  TenantGrowthResponse,
} from "./hooks";
