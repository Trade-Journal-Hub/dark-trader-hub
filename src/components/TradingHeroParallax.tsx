/**
 * Trading Hero Parallax - Optimized for Trading Journal App
 * Performance-optimized parallax hero section with trading-focused content
 */

import React, { memo, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Zap, 
  ArrowRight,
  Star,
  Users
} from "lucide-react";

// Import local images
import tradeJournalMockup from '@/assets/trade-journal-mockup.jpg';
import portfolioAnalyticsMockup from '@/assets/portfolio-analytics-mockup.jpg';
import riskManagementMockup from '@/assets/risk-management-mockup.jpg';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';

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

export const TradingHeroParallax = memo(() => {
  // Memoized trading products data
  const tradingProducts = useMemo(() => [
    {
      title: "Advanced Analytics Dashboard",
      link: "/features#analytics",
      thumbnail: dashboardMockup,
      category: "Analytics",
      description: "Real-time performance tracking with AI insights"
    },
    {
      title: "Smart Trade Journal",
      link: "/features#journal",
      thumbnail: tradeJournalMockup,
      category: "Journaling",
      description: "AI-powered pattern recognition and learning"
    },
    {
      title: "Portfolio Analytics Engine",
      link: "/features#portfolio",
      thumbnail: portfolioAnalyticsMockup,
      category: "Portfolio",
      description: "Professional-grade portfolio optimization"
    },
    {
      title: "Risk Management Suite",
      link: "/features#risk",
      thumbnail: riskManagementMockup,
      category: "Risk",
      description: "Institutional-level capital protection"
    },
    {
      title: "Real-Time Market Data",
      link: "/features#market-data",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center",
      category: "Data",
      description: "Live feeds from 15+ exchanges"
    },
    {
      title: "AI-Powered Insights",
      link: "/features#ai-insights",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
      category: "AI",
      description: "Machine learning trade recommendations"
    },
    {
      title: "Multi-Broker Integration",
      link: "/brokers",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
      category: "Integration",
      description: "Connect 50+ brokers seamlessly"
    },
    {
      title: "Performance Tracking",
      link: "/features#performance",
      thumbnail: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop&crop=center",
      category: "Performance",
      description: "Comprehensive P&L analysis"
    },
    {
      title: "Trading Psychology Analysis",
      link: "/dashboard/psychology",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop&crop=center",
      category: "Psychology",
      description: "Emotional state tracking and insights"
    },
    {
      title: "Tax Optimization Tools",
      link: "/features#tax",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center",
      category: "Tax",
      description: "Automated tax calculation and planning"
    },
    {
      title: "Mobile Trading App",
      link: "/features#mobile",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
      category: "Mobile",
      description: "Trade anywhere with iOS & Android apps"
    },
    {
      title: "Advanced Charting Tools",
      link: "/features#charts",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=600&fit=crop&crop=center",
      category: "Charts",
      description: "Professional technical analysis tools"
    },
    {
      title: "Automated Reporting",
      link: "/features#reports",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      category: "Reports",
      description: "Custom reports and analytics exports"
    },
    {
      title: "Social Trading Features",
      link: "/features#social",
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&crop=center",
      category: "Social",
      description: "Learn from top traders in the community"
    },
    {
      title: "Professional Trading Tools",
      link: "/features#pro-tools",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center",
      category: "Pro",
      description: "Institutional-grade trading infrastructure"
    },
  ], []);

  const firstRow = tradingProducts.slice(0, 5);
  const secondRow = tradingProducts.slice(5, 10);
  const thirdRow = tradingProducts.slice(10, 15);
  
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Performance optimization: throttle scroll updates
  const throttledScrollUpdate = useCallback((latest: number) => {
    // Throttle updates to improve performance during fast scrolling
    requestAnimationFrame(() => {
      // This ensures smooth updates without blocking the main thread
    });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", throttledScrollUpdate);

  // Optimized spring config for smoother scrolling
  const springConfig = { stiffness: 100, damping: 25, bounce: 0, mass: 0.8 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-black smooth-scroll will-change-transform"
    >
      <TradingHeader />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="will-change-transform transform-gpu"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <TradingProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <TradingProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <TradingProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

TradingHeroParallax.displayName = 'TradingHeroParallax';

const TradingHeader = memo(() => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <div className="text-center mb-8">
        <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm">
          <Star className="w-4 h-4 mr-2 text-yellow-400" />
          Trusted by 50,000+ Traders
        </Badge>
        
        <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight text-white">
          Transform Your Trading
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-2">
            With AI-Powered Analytics
          </span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl mt-8 text-gray-300 leading-relaxed">
          Join thousands of successful traders using our professional-grade platform. 
          Advanced analytics, AI insights, and institutional-quality tools to maximize your trading performance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-8">
        {[
          { icon: <Users className="w-5 h-5 text-blue-400" />, value: "50K+", label: "Active Traders" },
          { icon: <TrendingUp className="w-5 h-5 text-green-400" />, value: "31%", label: "Avg Win Rate Boost" },
          { icon: <Shield className="w-5 h-5 text-purple-400" />, value: "₹2.4Cr+", label: "Capital Tracked" },
          { icon: <BarChart3 className="w-5 h-5 text-cyan-400" />, value: "67%", label: "Risk Reduced" }
        ].map((stat, i) => (
          <div key={i} className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <InteractiveHoverButton className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 px-6 py-3 text-base font-semibold shadow-lg border-0">
          Start Free Trial
        </InteractiveHoverButton>
        
        <InteractiveHoverButton className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black px-6 py-3 text-base font-semibold backdrop-blur-sm">
          Watch Demo
        </InteractiveHoverButton>
      </div>
    </div>
  );
});

TradingHeader.displayName = 'TradingHeader';

const TradingProductCard = memo(({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    category: string;
    description: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.02,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 cursor-pointer will-change-transform transform-gpu"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl rounded-xl overflow-hidden"
      >
        <OptimizedImage
          src={product.thumbnail}
          alt={product.title}
          className="object-cover object-center absolute h-full w-full inset-0 rounded-xl"
        />
      </a>
      
      {/* Overlay */}
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-300 rounded-xl"></div>
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
        <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-semibold border-0">
          {product.category}
        </Badge>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-gray-200 text-sm">{product.description}</p>
      </div>
    </motion.div>
  );
});

TradingProductCard.displayName = 'TradingProductCard';

export default TradingHeroParallax;
