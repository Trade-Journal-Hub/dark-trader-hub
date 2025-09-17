import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Optimized parallax transforms for smooth scrolling
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), {
    stiffness: 50,
    damping: 40,
    restDelta: 0.01
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), {
    stiffness: 40,
    damping: 50,
    restDelta: 0.01
  });
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -75]), {
    stiffness: 60,
    damping: 35,
    restDelta: 0.01
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // Floating animation state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse tracking for better performance
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 15,
          y: (e.clientY / window.innerHeight - 0.5) * 15,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Optimized Background Layers */}
      <div className="absolute inset-0 bg-background">
        {/* Layer 1 - Deepest background */}
        <motion.div 
          style={{ 
            y: y2,
            willChange: 'transform'
          }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-secondary/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </motion.div>

        {/* Simplified floating elements */}
        <motion.div
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
            willChange: 'transform'
          }}
          transition={{ type: "spring", stiffness: 80, damping: 25, mass: 0.5 }}
          className="absolute inset-0 pointer-events-none opacity-60"
        >
          <div className="absolute top-32 left-20 w-3 h-3 bg-primary/40 rounded-full"></div>
          <div className="absolute top-96 right-32 w-4 h-4 bg-secondary/30 rounded-full"></div>
          <div className="absolute top-72 left-3/4 w-2 h-2 bg-accent/50 rounded-full"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ 
          opacity, 
          scale, 
          y: y3,
          willChange: 'transform, opacity'
        }}
        className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
            >
              Master Your Trading Journey
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              The only trading journal you'll ever need. Track, analyze, and optimize your trades with professional-grade tools trusted by successful traders worldwide.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
                >
                  Start Free Trial
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 backdrop-blur-sm">
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Dashboard Mockup with Advanced Parallax */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="relative max-w-6xl mx-auto mb-20"
          >
            {/* Simplified Glow Effect */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-gradient-primary opacity-20 blur-2xl rounded-2xl"
            ></motion.div>
            
            <motion.div
              whileHover={{ scale: 1.01, y: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative z-10"
              style={{ willChange: 'transform' }}
            >
              <img 
                src={dashboardMockup} 
                alt="TradeJournal Pro Dashboard - Professional Trading Interface with Live Trades, Analytics, and Portfolio Management"
                className="w-full rounded-2xl shadow-elegant border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-glow"
              />
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -left-4 top-1/4 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Traders</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute -right-4 top-3/4 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-primary">₹100Cr+</div>
                <div className="text-sm text-muted-foreground">Trades Tracked</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Key Benefits with Staggered Animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "📊",
                title: "Advanced Analytics",
                description: "Get deep insights into your trading performance with comprehensive analytics and reporting.",
                delay: 0
              },
              {
                icon: "🚀",
                title: "Real-Time Tracking",
                description: "Monitor your live trades and get instant updates on your portfolio performance.",
                delay: 0.2
              },
              {
                icon: "🎯",
                title: "Smart Insights",
                description: "AI-powered recommendations to help you identify patterns and improve your trading strategy.",
                delay: 0.4
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + benefit.delay }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center p-8 rounded-xl bg-gradient-card border border-border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + benefit.delay }}
                  className="text-4xl mb-6"
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;