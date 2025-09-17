import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Clock,
  BarChart3, 
  Calendar,
  Brain,
  Settings,
  Menu,
  X,
  User,
  Crown,
  LogOut,
  ChevronDown
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from '@/services/hooks/useAuth';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dashboardNavigation = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard/overview" },
  { name: "Time Metrics", icon: Clock, href: "/dashboard/time-metrics" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { name: "Psychology", icon: Brain, href: "/dashboard/psychology" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" }
];

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { subscription, isPremium } = useSubscription();

  // Handle window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
    }
  };

  const getSubscriptionBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shouldShowX = () => {
    return (isDesktop && !sidebarCollapsed) || (!isDesktop && mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 md:h-16 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-3 md:px-6 shadow-sm">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSidebarToggle}
            className="p-1.5 md:p-2 hover:bg-muted transition-colors touch-manipulation"
          >
            {shouldShowX() ? 
              <X className="h-4 w-4 md:h-5 md:w-5" /> : 
              <Menu className="h-4 w-4 md:h-5 md:w-5" />
            }
          </Button>
          <div className="flex items-center space-x-2 md:space-x-3">
            <img src={logo} alt="TradeJournal Pro Logo" className="h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-sm md:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              <span className="hidden sm:inline">TradeJournal Pro</span>
              <span className="sm:hidden">TJ Pro</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Subscription Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs md:text-sm px-2 py-0.5 md:px-2 md:py-1",
              getSubscriptionBadgeColor(subscription?.plan || 'basic')
            )}
          >
            {subscription?.plan || 'Basic'}
            {isPremium && <Crown className="w-3 h-3 ml-1" />}
          </Badge>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1.5 h-auto">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium truncate max-w-32">
                    {user?.displayName || user?.email || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {subscription?.plan || 'Basic'} Plan
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              {!isPremium && (
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
        </div>
      </header>

      <div className="flex pt-12 md:pt-16">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-12 md:top-16 z-40 h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] bg-card/95 backdrop-blur-md border-r border-border overflow-hidden shadow-sm",
          "transition-all duration-300 ease-in-out",
          // Desktop behavior
          "hidden lg:block",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile behavior - show as overlay
          mobileMenuOpen && "block lg:hidden w-64"
        )}>
          <div className={cn(
            "h-full transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "lg:p-2" : "p-4"
          )}>
            {/* Dashboard Navigation */}
            <div className="space-y-2 md:space-y-3">
              <div className={cn(
                "px-4 py-3 transition-all duration-300 ease-in-out overflow-hidden",
                sidebarCollapsed ? "lg:opacity-0 lg:h-0 lg:py-0" : "opacity-100 h-auto"
              )}>
                <h2 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Dashboard
                </h2>
              </div>
              <div className="space-y-2">
                {dashboardNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center rounded-lg text-sm md:text-base font-semibold relative overflow-hidden touch-manipulation",
                        "transition-all duration-300 ease-out hover:bg-muted/50 hover:scale-[0.98]",
                        sidebarCollapsed ? "lg:p-4 lg:justify-center px-4 py-3" : "px-4 py-3",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon 
                        className={cn(
                          "h-5 w-5 md:h-6 md:w-6 transition-all duration-300 ease-out flex-shrink-0",
                          sidebarCollapsed ? "lg:scale-110" : "mr-4 scale-100",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} 
                      />
                      <span className={cn(
                        "transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden font-medium tracking-wide",
                        sidebarCollapsed 
                          ? "lg:opacity-0 lg:w-0 lg:translate-x-4 opacity-100 w-auto translate-x-0" 
                          : "opacity-100 w-auto translate-x-0"
                      )}>
                        {item.name}
                      </span>
                      {/* Active indicator for collapsed state */}
                      {sidebarCollapsed && isActive && (
                        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-l-md transition-all duration-300 ease-out" />
                      )}
                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm font-medium rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
          <div className="p-3 md:p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}