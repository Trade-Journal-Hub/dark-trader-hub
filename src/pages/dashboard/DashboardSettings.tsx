import { 
  Settings, 
  User, 
  TrendingUp, 
  Bell, 
  Shield, 
  Crown,
  Zap,
  HelpCircle,
  Edit3,
  Save,
  Globe,
  Lock,
  CreditCard,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { getMaskedApiKey, isDevelopment } from "@/config/environment";

export default function DashboardSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);

  const settingsNavigation = [
    { id: "profile", title: "Profile & Account", icon: User },
    { id: "trading", title: "Trading Preferences", icon: TrendingUp },
    { id: "notifications", title: "Notifications", icon: Bell },
    { id: "privacy", title: "Privacy & Security", icon: Shield },
    { id: "premium", title: "Premium Plan", icon: Crown },
    { id: "actions", title: "Quick Actions", icon: Zap },
    { id: "support", title: "Support", icon: HelpCircle }
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profile & Account</h2>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="p-3 bg-muted rounded-lg">John Doe</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="p-3 bg-muted rounded-lg">@johndoe</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                john.doe@example.com
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Account Status</h4>
              <p className="text-sm text-muted-foreground">Your account is verified and active</p>
            </div>
            <Badge variant="default">Verified</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTradingSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Trading Preferences</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Order Type</label>
                <div className="p-3 bg-muted rounded-lg">Market Order</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Position Size</label>
                <div className="p-3 bg-muted rounded-lg">1% of Portfolio</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Chart Timeframe</label>
                <div className="p-3 bg-muted rounded-lg">1H</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency Display</label>
                <div className="p-3 bg-muted rounded-lg">USD ($)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto Stop Loss</h4>
                <p className="text-sm text-muted-foreground">Automatically set stop loss at 2%</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Position Size Limits</h4>
                <p className="text-sm text-muted-foreground">Maximum 5% per trade</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Notifications</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Price Alerts</h4>
              <p className="text-sm text-muted-foreground">Get notified when price targets are reached</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Trade Confirmations</h4>
              <p className="text-sm text-muted-foreground">Receive confirmation for all trades</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Market News</h4>
              <p className="text-sm text-muted-foreground">Important market updates and news</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Weekly Reports</h4>
              <p className="text-sm text-muted-foreground">Performance summary every week</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Privacy & Security</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                  {showApiKey ? getMaskedApiKey("sk_test_••••••••••••••••••••••••••••") : "••••••••••••••••••••••••••••"}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isDevelopment() 
                  ? "This is a test API key. In production, this will be securely managed."
                  : "API key is securely managed by the backend service."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Privacy Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics Tracking</h4>
                <p className="text-sm text-muted-foreground">Help improve the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">Receive product updates and tips</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPremiumSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Premium Plan</h2>
      
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Premium Subscription
            </CardTitle>
            <Badge variant="default">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium">Current Plan</h4>
              <p className="text-sm text-muted-foreground">Premium Monthly</p>
            </div>
            <div>
              <h4 className="font-medium">Next Billing</h4>
              <p className="text-sm text-muted-foreground">March 15, 2024</p>
            </div>
            <div>
              <h4 className="font-medium">Amount</h4>
              <p className="text-sm text-muted-foreground">$29.99/month</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActionsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover-scale cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">Download your trading history</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-medium">Import Trades</h4>
                <p className="text-sm text-muted-foreground">Bulk import from CSV/Excel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-medium">Reset Dashboard</h4>
                <p className="text-sm text-muted-foreground">Restore default layout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently remove your data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSupportSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Support</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <HelpCircle className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Help Center</div>
                  <div className="text-sm text-muted-foreground">Browse FAQ and guides</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <Mail className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm text-muted-foreground">Get personalized help</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Version</span>
              <span>v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>March 1, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support ID</span>
              <span className="font-mono">TJP-2024-001</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile": return renderProfileSection();
      case "trading": return renderTradingSection();
      case "notifications": return renderNotificationsSection();
      case "privacy": return renderPrivacySection();
      case "premium": return renderPremiumSection();
      case "actions": return renderActionsSection();
      case "support": return renderSupportSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Settings Navigation */}
      <div className="w-64 flex-shrink-0">
        <Card className="sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? "bg-primary/10 text-primary border-r-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}