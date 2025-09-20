/**
 * Enhanced Modern Features Page - Black Theme
 * Interactive features showcase without duplicate hero section
 */

import React, { memo, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Badge } from '@/components/ui/badge';
// Removed unused Card imports
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { SEOHead, SEOConfigs } from '@/components/SEOHead';
import { 
  BarChart3, 
  Shield, 
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Activity,
  Sparkles,
  Brain,
  Smartphone,
  Clock,
  Bell,
  Lock,
  Globe,
  RefreshCw,
  Camera,
  Calculator
} from 'lucide-react';

// Import images
import tradeJournalMockup from '@/assets/trade-journal-mockup.jpg';
import portfolioAnalyticsMockup from '@/assets/portfolio-analytics-mockup.jpg';
import riskManagementMockup from '@/assets/risk-management-mockup.jpg';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';

// Optimized components
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
));
OptimizedImage.displayName = 'OptimizedImage';

const StatCard = memo(({ icon, text, value }: { icon: React.ReactNode; text: string; value: string }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-sm">
        <span className="font-semibold text-gray-800">{text}:</span>
        <span className="ml-1 font-bold">{value}</span>
      </div>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

const Features = memo(() => {
  // Enhanced sticky content with more features
  const stickyContent = useMemo(() => [
    {
      title: "Smart Trade Journal",
      description: "Turn every trade into a learning experience. Our AI-powered journal analyzes your trading patterns, identifies what's working, and shows you exactly where you're leaving money on the table. Advanced pattern recognition helps you avoid costly mistakes.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-lg overflow-hidden">
          <OptimizedImage src={tradeJournalMockup} alt="Trade Journal Interface" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <StatCard icon={<TrendingUp className="w-4 h-4 text-green-500" />} text="Win Rate" value="+23%" />
            <StatCard icon={<Users className="w-4 h-4 text-blue-500" />} text="Daily Users" value="15,000+" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white">
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>P&L Tracking</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <Camera className="w-3 h-3 text-blue-400" />
                  <span>Screenshots</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span>AI Insights</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <Calculator className="w-3 h-3 text-yellow-400" />
                  <span>Tax Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Analytics Dashboard",
      description: "Get professional-grade analytics that institutional traders pay thousands for. Real-time performance tracking, risk analysis, drawdown monitoring, and AI-powered insights help you make data-driven decisions and optimize your trading strategy for consistent profits.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-lg overflow-hidden">
          <OptimizedImage src={dashboardMockup} alt="Analytics Dashboard" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-semibold text-gray-800">Performance Dashboard</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">+18.5% Returns</div>
              <div className="text-xs text-gray-600">Risk Score: Low</div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-white text-sm">
                <div className="mb-2">
                  <span className="text-gray-300">Total P&L:</span> 
                  <span className="text-green-400 font-bold ml-2">₹2,47,500</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span><span className="text-gray-300">Trades:</span> <span className="text-blue-400 font-bold">1,247</span></span>
                  <span><span className="text-gray-300">Win Rate:</span> <span className="text-purple-400 font-bold">73.2%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Portfolio Analytics Engine",
      description: "Transform your portfolio with real-time insights that professional fund managers use. Multi-broker consolidation, sector analysis, AI-powered rebalancing suggestions, and tax optimization help you maximize returns while minimizing risk.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-pink-500/20 rounded-lg overflow-hidden">
          <OptimizedImage src={portfolioAnalyticsMockup} alt="Portfolio Analytics" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <PieChart className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-semibold text-gray-800">Portfolio Engine</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">AUM Tracked:</span>
                  <span className="text-sm font-bold text-purple-600">₹2,500Cr+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Avg Returns:</span>
                  <span className="text-sm font-bold text-green-600">18.5%</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Activity className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">Real-time Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Risk Management Shield",
      description: "Protect your capital like institutional traders with advanced risk management tools. Automated position sizing, real-time risk monitoring, intelligent alerts, and portfolio heat maps help you never risk more than you can afford to lose.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-lg overflow-hidden">
          <OptimizedImage src={riskManagementMockup} alt="Risk Management Tools" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-800">Risk Level</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">Low</Badge>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-white">
                <div className="text-lg font-bold text-green-400 mb-2">-3.2% Max Drawdown</div>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-300">Protected:</span> 
                    <span className="text-blue-400 font-bold">₹1,200Cr+</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-yellow-400" />
                    <span className="text-gray-300">Alerts:</span> 
                    <span className="text-yellow-400 font-bold">50K+</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI-Powered Insights",
      description: "Machine learning algorithms analyze your trading patterns and provide personalized recommendations. Pattern recognition, sentiment analysis, and predictive modeling help you stay ahead of the market with data-driven decisions.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-2xl font-bold mb-2">AI Engine</h3>
              <p className="text-gray-300 mb-4">94% Accuracy Rate</p>
              <div className="space-y-3 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-cyan-400 font-bold mb-1">Pattern Recognition</div>
                  <div className="text-gray-300">15+ Trading Patterns Detected</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-purple-400 font-bold mb-1">AI Predictions</div>
                  <div className="text-gray-300">Next Day Market Trends</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Mobile Trading App",
      description: "Trade anywhere with our powerful mobile app. Real-time notifications, instant trade logging, mobile-optimized charts, and offline mode ensure you never miss an opportunity. Available on iOS and Android with full feature parity.",
      content: (
        <div className="relative h-full w-full bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white p-8">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-pink-400" />
              <h3 className="text-2xl font-bold mb-2">Mobile App</h3>
              <p className="text-gray-300 mb-4">iOS & Android</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <Bell className="w-4 h-4 text-yellow-400" />
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span>Instant Screenshots</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <RefreshCw className="w-4 h-4 text-green-400" />
                  <span>Offline Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ], []);

  // Simplified and Animated Bento Grid Features
  const bentoFeatures = useMemo(() => [
    {
      name: "Multi-Broker Integration",
      description: "Connect 50+ brokers worldwide with secure API integration.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-6 left-6">
            <div className="text-white/90 text-xl font-bold animate-bounce">50+</div>
            <div className="text-white/70 text-sm">Brokers</div>
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 bg-blue-400 rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      Icon: Globe,
      className: "col-span-1 sm:col-span-2 lg:col-span-2 animate-fade-in"
    },
    {
      name: "AI-Powered Insights",
      description: "Machine learning algorithms for trading recommendations.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white animate-pulse">
              <Brain className="w-16 h-16 mx-auto mb-3 text-cyan-400 animate-bounce" />
              <div className="text-lg font-bold">94%</div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </div>
          </div>
        </div>
      ),
      Icon: Brain,
      className: "col-span-1 sm:col-span-1 lg:col-span-1 animate-fade-in"
    },
    {
      name: "Bank-Grade Security",
      description: "Military-grade 256-bit encryption and compliance.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <Lock className="w-16 h-16 mx-auto mb-3 text-green-400 animate-pulse" />
              <div className="text-lg font-bold">256-bit</div>
              <div className="text-sm text-gray-300">Encryption</div>
            </div>
          </div>
        </div>
      ),
      Icon: Lock,
      className: "col-span-1 sm:col-span-1 lg:col-span-1 animate-fade-in"
    },
    {
      name: "Smart Alerts",
      description: "Intelligent real-time notifications for all trading activities.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-6 left-6">
            <Bell className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="text-white text-right">
              <div className="text-xl font-bold animate-pulse">24/7</div>
              <div className="text-sm text-gray-300">Monitoring</div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      Icon: Bell,
      className: "col-span-1 sm:col-span-2 lg:col-span-2 animate-fade-in"
    },
    {
      name: "Tax Optimization",
      description: "Automated LTCG/STCG calculations for Indian markets.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-pink-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <Calculator className="w-16 h-16 mx-auto mb-3 text-purple-400 animate-pulse" />
              <div className="text-lg font-bold animate-bounce">₹2.4L+</div>
              <div className="text-sm text-gray-300">Tax Saved</div>
            </div>
          </div>
        </div>
      ),
      Icon: Calculator,
      className: "col-span-1 sm:col-span-2 lg:col-span-2 animate-fade-in"
    },
    {
      name: "Time Analysis",
      description: "Discover your most profitable trading hours and patterns.",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-6 left-6">
            <Clock className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="text-white text-right">
              <div className="text-xl font-bold text-green-400 animate-pulse">+18.5%</div>
              <div className="text-sm text-gray-300">Best Hours</div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="grid grid-cols-3 gap-2">
              {['9AM', '1PM', '3PM'].map((time, i) => (
                <div 
                  key={i}
                  className="text-xs text-white/70 text-center animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      Icon: Clock,
      className: "col-span-1 sm:col-span-1 lg:col-span-1 animate-fade-in"
    }
  ], []);

  return (
    <div className="min-h-screen bg-black">
      <SEOHead {...SEOConfigs.features} />
      <Navigation />
      
      {/* Modern Interactive Header (Replaces Hero) */}
      <section className="pt-24 pb-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              Interactive Features Experience
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Discover What Makes Us
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2">
                The #1 Trading Platform
              </span>
          </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Scroll through our powerful features and see how we're helping <span className="text-cyan-400 font-semibold">50,000+ traders</span> achieve consistent profitability with professional-grade tools and AI-powered insights.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: <Users className="w-5 h-5 text-blue-400" />, value: "50K+", label: "Active Traders" },
                { icon: <TrendingUp className="w-5 h-5 text-green-400" />, value: "31%", label: "Win Rate Boost" },
                { icon: <DollarSign className="w-5 h-5 text-purple-400" />, value: "₹2.4Cr+", label: "Capital Tracked" },
                { icon: <Shield className="w-5 h-5 text-red-400" />, value: "67%", label: "Risk Reduced" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Enhanced Sticky Scroll Features */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="w-full relative">
          {/* Sticky Scroll */}
          <div className="mb-20">
            <StickyScroll content={stickyContent} />
          </div>

        </div>
        
        {/* Enhanced Bento Grid Power Features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
              Advanced{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Power Features
              </span>
            </h2>
            
            <BentoGrid className="auto-rows-[16rem] sm:auto-rows-[18rem] lg:auto-rows-[20rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {bentoFeatures.map((feature, index) => (
                <BentoCard
                  key={index}
                  name={feature.name}
                  className={`${feature.className} animate-fade-in`}
                  background={feature.background}
                  Icon={feature.Icon}
                  description={feature.description}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </BentoGrid>
          </div>

          {/* Final CTA - Enhanced */}
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Trading?
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who've revolutionized their performance with our comprehensive suite of trading tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <InteractiveHoverButton className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-6 py-3 text-base font-semibold shadow-lg">
                  Start Your Free Trial
                </InteractiveHoverButton>
                
                <InteractiveHoverButton className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black px-6 py-3 text-base font-semibold backdrop-blur-sm">
                  Watch Demo
                </InteractiveHoverButton>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  14-day free trial • No credit card required • Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyFooter />
    </div>
  );
});

Features.displayName = 'Features';

export default Features;