import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const SupportedBrokers = lazy(() => import("./pages/SupportedBrokers"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
// Removed ScrollStackTest - integrated into home page

// Auth pages (lazy loaded)
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
// Enhanced auth integrated into main login/register pages

// Dashboard pages (lazy loaded for better initial load)
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardTimeMetrics = lazy(() => import("./pages/dashboard/DashboardTimeMetrics"));
const DashboardAnalytics = lazy(() => import("./pages/dashboard/DashboardAnalytics"));
const DashboardCalendar = lazy(() => import("./pages/dashboard/DashboardCalendar"));
const DashboardPsychology = lazy(() => import("./pages/dashboard/DashboardPsychology"));
const DashboardSettings = lazy(() => import("./pages/dashboard/DashboardSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for Suspense
const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Public routes with lazy loading */}
                <Route path="/" element={<Index />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/brokers" element={<SupportedBrokers />} />
                <Route path="/contact" element={<ContactUs />} />
                {/* ScrollStackTest removed - integrated into home page */}
                
                {/* Authentication routes with lazy loading */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Enhanced auth integrated into main login/register pages */}
                
                {/* Protected dashboard routes with lazy loading */}
                <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardLayout />
                    </Suspense>
                  </ProtectedRoute>
                }>
                  <Route path="overview" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardOverview />
                    </Suspense>
                  } />
                  <Route path="time-metrics" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardTimeMetrics />
                    </Suspense>
                  } />
                  <Route path="analytics" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardAnalytics />
                    </Suspense>
                  } />
                  <Route path="calendar" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardCalendar />
                    </Suspense>
                  } />
                  <Route path="psychology" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardPsychology />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<PageLoadingFallback />}>
                      <DashboardSettings />
                    </Suspense>
                  } />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

