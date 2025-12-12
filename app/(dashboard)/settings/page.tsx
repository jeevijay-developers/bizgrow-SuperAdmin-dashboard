"use client"

import * as React from "react"
import { Save, Shield, Bell, Globe, Server, ToggleLeft, ToggleRight, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false)
  const [newSignups, setNewSignups] = React.useState(true)
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [slackNotifications, setSlackNotifications] = React.useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = React.useState(false)

  // Feature toggles
  const [features, setFeatures] = React.useState({
    whatsappIntegration: true,
    smsIntegration: true,
    emailIntegration: true,
    apiAccess: true,
    bulkExport: false,
    advancedAnalytics: false,
  })

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Platform Settings
              </CardTitle>
              <CardDescription>General platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="BizGrow360" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@bizgrow360.com" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="america-new_york">America/New_York (EST)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms-url">Terms of Service URL</Label>
                <Input id="terms-url" defaultValue="https://bizgrow360.com/terms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacy-url">Privacy Policy URL</Label>
                <Input id="privacy-url" defaultValue="https://bizgrow360.com/privacy" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Registration Settings</CardTitle>
              <CardDescription>Control new tenant registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow New Signups</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable new tenant registrations</p>
                </div>
                <Switch checked={newSignups} onCheckedChange={setNewSignups} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trial-days">Trial Period (Days)</Label>
                <Input id="trial-days" type="number" defaultValue="14" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-plan">Default Plan</Label>
                <Select defaultValue="starter">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                </div>
                <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
              </div>
              {slackNotifications && (
                <div className="space-y-2 pl-4 border-l-2 border-primary">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input id="slack-webhook" placeholder="https://hooks.slack.com/services/..." />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Alert Types</CardTitle>
              <CardDescription>Choose which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "New Tenant Signup", description: "When a new tenant registers" },
                { label: "Payment Received", description: "When a subscription payment is processed" },
                { label: "Payment Failed", description: "When a payment fails or is overdue" },
                { label: "Quota Warning", description: "When tenant reaches 80% of their quota" },
                { label: "System Errors", description: "Critical system errors and failures" },
              ].map((alert) => (
                <div key={alert.label} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{alert.label}</Label>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all admin users</p>
                </div>
                <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue="90" className="w-32" />
                <p className="text-xs text-muted-foreground">Set to 0 to disable password expiration</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">IP Whitelist</CardTitle>
              <CardDescription>Restrict admin access to specific IP addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">Allowed IP Addresses</Label>
                <Textarea
                  id="ip-whitelist"
                  placeholder="Enter one IP address per line&#10;e.g., 192.168.1.1&#10;10.0.0.0/24"
                  className="h-32 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Leave empty to allow all IP addresses</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                {features.whatsappIntegration ? (
                  <ToggleRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                )}
                Feature Toggles
              </CardTitle>
              <CardDescription>Enable or disable platform features globally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "whatsappIntegration",
                  label: "WhatsApp Integration",
                  description: "Allow tenants to use WhatsApp Business API",
                },
                {
                  key: "smsIntegration",
                  label: "SMS Integration",
                  description: "Allow tenants to send SMS notifications",
                },
                {
                  key: "emailIntegration",
                  label: "Email Integration",
                  description: "Allow tenants to send email notifications",
                },
                { key: "apiAccess", label: "API Access", description: "Allow tenants to use REST API" },
                { key: "bulkExport", label: "Bulk Export", description: "Allow tenants to export data in bulk" },
                {
                  key: "advancedAnalytics",
                  label: "Advanced Analytics",
                  description: "Enable advanced analytics dashboard",
                  badge: "Beta",
                },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>{feature.label}</Label>
                      {feature.badge && (
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    checked={features[feature.key as keyof typeof features]}
                    onCheckedChange={(checked) => setFeatures({ ...features, [feature.key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className={maintenanceMode ? "border-yellow-500" : ""}>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Configuration
                {maintenanceMode && (
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Maintenance Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>System-level settings and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable access to the platform for non-admin users
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              {maintenanceMode && (
                <div className="space-y-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30">
                  <Label htmlFor="maintenance-message">Maintenance Message</Label>
                  <Textarea
                    id="maintenance-message"
                    defaultValue="We are currently performing scheduled maintenance. Please check back soon."
                    className="bg-white dark:bg-background"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Rate Limits</CardTitle>
              <CardDescription>Configure API and message rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit">API Rate Limit (req/hour)</Label>
                  <Input id="api-rate-limit" type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-rate-limit">WhatsApp Rate Limit (msg/min)</Label>
                  <Input id="message-rate-limit" type="number" defaultValue="100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Database</CardTitle>
              <CardDescription>Database maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="bg-transparent">
                  Clear Cache
                </Button>
                <Button variant="outline" className="bg-transparent">
                  Optimize Tables
                </Button>
                <Button variant="outline" className="bg-transparent text-destructive hover:text-destructive">
                  Purge Old Logs
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Warning: These operations may take several minutes to complete
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
