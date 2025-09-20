/**
 * Scroll Stack Features - Enhanced Features Section for Home Page
 * Horizontal scroll stack layout with Lenis smooth scrolling
 * Reference: https://reactbits.dev/components/scroll-stack
 */

import React, { useEffect, useRef, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Shield, 
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Import images
import tradeJournalMockup from '@/assets/trade-journal-mockup.jpg';
import portfolioAnalyticsMockup from '@/assets/portfolio-analytics-mockup.jpg';
import riskManagementMockup from '@/assets/risk-management-mockup.jpg';

// Feature stack data
const featureStacks = [
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    subtitle: 'Professional-Grade Insights',
    description: 'Get institutional-quality analytics that hedge funds pay thousands for. Real-time performance tracking, risk analysis, and AI-powered insights help you make data-driven decisions.',
    image: tradeJournalMockup,
    stats: [
      { icon: <TrendingUp className="w-5 h-5 text-green-400" />, value: '+31%', label: 'Win Rate Boost' },
      { icon: <Users className="w-5 h-5 text-blue-400" />, value: '50K+', label: 'Active Users' },
      { icon: <BarChart3 className="w-5 h-5 text-purple-400" />, value: '15+', label: 'Metrics' }
    ],
    highlights: [
      'Real-time P&L tracking',
      'AI-powered pattern recognition',
      'Risk-adjusted returns analysis',
      'Performance benchmarking'
    ],
    cta: 'Explore Analytics',
    href: '/features',
    gradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Engine',
    subtitle: 'Multi-Broker Consolidation',
    description: 'Transform your portfolio with real-time insights that professional fund managers use. Multi-broker consolidation, sector analysis, and AI-powered rebalancing suggestions.',
    image: portfolioAnalyticsMockup,
    stats: [
      { icon: <DollarSign className="w-5 h-5 text-green-400" />, value: '₹2.4Cr+', label: 'AUM Tracked' },
      { icon: <Activity className="w-5 h-5 text-cyan-400" />, value: '50+', label: 'Brokers' },
      { icon: <BarChart3 className="w-5 h-5 text-purple-400" />, value: '18.5%', label: 'Avg Returns' }
    ],
    highlights: [
      'Multi-broker synchronization',
      'Sector-wise analysis',
      'Rebalancing suggestions',
      'Tax optimization'
    ],
    cta: 'View Portfolio',
    href: '/dashboard',
    gradient: 'from-purple-500/20 via-violet-500/20 to-pink-500/20'
  },
  {
    id: 'risk',
    title: 'Risk Management',
    subtitle: 'Capital Protection Shield',
    description: 'Protect your capital like institutional traders with advanced risk management tools. Automated position sizing, real-time risk monitoring, and intelligent alerts.',
    image: riskManagementMockup,
    stats: [
      { icon: <Shield className="w-5 h-5 text-red-400" />, value: '67%', label: 'Risk Reduced' },
      { icon: <TrendingUp className="w-5 h-5 text-green-400" />, value: '-3.2%', label: 'Max Drawdown' },
      { icon: <Activity className="w-5 h-5 text-yellow-400" />, value: '24/7', label: 'Monitoring' }
    ],
    highlights: [
      'Automated position sizing',
      'Real-time risk alerts',
      'Drawdown protection',
      'Portfolio heat maps'
    ],
    cta: 'Risk Tools',
    href: '/dashboard',
    gradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20'
  }
];

// Optimized image component
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    loading="lazy"
    decoding="async"
  />
));
OptimizedImage.displayName = 'OptimizedImage';

// Individual stack component
const FeatureStack = memo(({ feature, index }: { feature: typeof featureStacks[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Horizontal scroll transforms for stacking effect
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100 * index, 0, -100 * index]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.5, 1, 0.5, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ x, scale, opacity }}
      className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="max-w-7xl mx-auto w-full min-h-[80vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Content Side */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div>
              <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                {feature.subtitle}
              </Badge>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
                {feature.title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2">
                  Excellence
                </span>
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 lg:mb-8">
                {feature.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6">
              {feature.stats.map((stat, statIndex) => (
                <motion.div 
                  key={statIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index * 0.1) + (statIndex * 0.1) }}
                  className="text-center p-3 lg:p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-xl lg:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-2 lg:space-y-3">
              {feature.highlights.map((highlight, highlightIndex) => (
                <motion.div 
                  key={highlightIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index * 0.1) + (highlightIndex * 0.05) }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 animate-pulse"></div>
                  <span className="text-gray-300">{highlight}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index * 0.1) + 0.3 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                asChild
              >
                <a href={feature.href}>
                  {feature.cta}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: (index * 0.1) + 0.2 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50`}></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 group">
              <OptimizedImage 
                src={feature.image} 
                alt={feature.title} 
                className="w-full h-auto rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating stats overlay */}
              <div className="absolute top-8 left-8 right-8">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {feature.stats.slice(0, 3).map((stat, i) => (
                      <div key={i} className="text-white">
                        <div className="flex justify-center mb-1">{stat.icon}</div>
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-300">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

FeatureStack.displayName = 'FeatureStack';

// Main ScrollStackFeatures component
const ScrollStackFeatures = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative bg-black overflow-hidden"
      style={{ minHeight: `${(featureStacks.length + 1) * 100}vh` }}
    >
      {/* Section Header */}
      <div className="sticky top-0 z-10 pt-20 pb-16 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
            Scroll Stack Experience
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Discover Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2">
              Trading Arsenal
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Scroll through our three core features and experience the power of professional trading tools.
          </p>
        </div>
      </div>

      {/* Feature Stacks */}
      <div className="relative">
        {featureStacks.map((feature, index) => (
          <FeatureStack key={feature.id} feature={feature} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-md py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ready to Experience All Features?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who've transformed their performance with our comprehensive suite of tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                asChild
              >
                <a href="/register">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <a href="/features">
                  Explore All Features
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

ScrollStackFeatures.displayName = 'ScrollStackFeatures';

export default ScrollStackFeatures;
