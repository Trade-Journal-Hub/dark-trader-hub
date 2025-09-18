import Navigation from '@/components/Navigation';
// Removed unused HeroSection import
import TradingHeroParallax from '@/components/TradingHeroParallax';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import AppDownloadSection from '@/components/AppDownloadSection';
import Footer from '@/components/Footer';
import { SEOHead, SEOConfigs } from '@/components/SEOHead';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden smooth-scroll">
      <SEOHead {...SEOConfigs.home} />
      <Navigation />
      
      {/* Trading Hero Parallax */}
      <TradingHeroParallax />
      

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FeaturesSection />
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
