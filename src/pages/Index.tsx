import Navigation from '@/components/Navigation';
// Removed unused HeroSection import
import TradingHeroParallax from '@/components/TradingHeroParallax';
import ScrollStackFeatures from '@/components/ScrollStackFeatures';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AppDownloadSection from '@/components/AppDownloadSection';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { SEOHead, SEOConfigs } from '@/components/SEOHead';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <>
      <SEOHead {...SEOConfigs.home} />
      <div className="relative w-full bg-black">
        {/* Main Content */}
        <div className="min-h-screen bg-black overflow-x-hidden smooth-scroll">
          <Navigation />
          
          {/* Trading Hero Parallax */}
          <TradingHeroParallax />
          
          {/* Enhanced Scroll Stack Features */}
          <ScrollStackFeatures />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <AboutSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <TestimonialsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <AppDownloadSection />
          </motion.div>
          
          {/* Interactive Bridge Section */}
          <div className="relative bg-black py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Trading Journey?
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of traders who have revolutionized their performance with TradeJournal Pro.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Free Trial
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-semibold rounded-full transition-all duration-300"
                  >
                    View Demo
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Sticky Footer with Enhanced Background */}
        <StickyFooter />
      </div>
    </>
  );
};

export default Index;
