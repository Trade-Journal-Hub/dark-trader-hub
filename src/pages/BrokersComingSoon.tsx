import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Rocket, Star, Zap, ArrowRight, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const BrokersComingSoon = () => {
  const navigate = useNavigate();
  const [showNotifyPopup, setShowNotifyPopup] = useState(false);

  const handleNotifyMe = () => {
    setShowNotifyPopup(true);
  };

  const handleLearnMore = () => {
    navigate('/');
  };

  const closeNotifyPopup = () => {
    setShowNotifyPopup(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 backdrop-blur-sm rounded-full px-8 py-4 border-2 border-cyan-400/70 shadow-xl shadow-cyan-400/40">
              <Sparkles className="h-6 w-6 text-cyan-200 animate-pulse" />
              <span className="text-cyan-200 font-bold text-base tracking-wider drop-shadow-lg">BROKER INTEGRATION</span>
              <Sparkles className="h-6 w-6 text-purple-200 animate-pulse" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
              Coming
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Soon
              </span>
            </h1>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="h-8 w-8 text-cyan-400" />
              </motion.div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-8 w-8 text-purple-400" />
              </motion.div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-8 w-8 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            We're building something <span className="text-cyan-400 font-semibold">amazing</span> for broker integration. 
            Get ready for seamless connections with India's top trading platforms.
          </motion.p>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Real-time Sync",
                description: "Instant trade synchronization"
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "15+ Brokers",
                description: "All major Indian brokers"
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "AI Analytics",
                description: "Smart performance insights"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:bg-white/10"
              >
                <div className="text-cyan-400 mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <InteractiveHoverButton 
              onClick={handleNotifyMe}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold"
            >
              Notify Me When Ready
            </InteractiveHoverButton>
            
            <InteractiveHoverButton 
              onClick={handleLearnMore}
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm px-8 py-4 text-lg font-semibold"
            >
              Learn More
            </InteractiveHoverButton>
          </motion.div>

          {/* Progress Indicator */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold">Broker Integration Progress</span>
              <span className="text-cyan-400 font-bold">65%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 2, delay: 1.5 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
              />
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Expected launch: Q2 2024
            </p>
          </motion.div> */}

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notify Popup Modal */}
      <AnimatePresence>
        {showNotifyPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeNotifyPopup}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Notification Setup
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  You'll be notified about broker integration updates only when you're logged in to your account. 
                  Please <span className="text-cyan-400 font-semibold">sign in</span> to receive notifications.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 flex-1"
                  >
                    Sign In
                  </Button>
                  
                  <Button
                    onClick={closeNotifyPopup}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StickyFooter />
    </div>
  );
};

export default BrokersComingSoon;
