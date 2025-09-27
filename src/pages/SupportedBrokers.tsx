import Navigation from '@/components/Navigation';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Zap, Shield, Clock, Sparkles, Rocket, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportedBrokers = () => {
  const brokers = [
    {
      name: "Zerodha",
      logo: "Z",
      status: "Live",
      features: ["Real-time sync", "Order tracking", "P&L analysis"],
      color: "bg-blue-500"
    },
    {
      name: "Angel One",
      logo: "A",
      status: "Live", 
      features: ["Instant sync", "Trade history", "Performance metrics"],
      color: "bg-red-500"
    },
    {
      name: "Upstox",
      logo: "U",
      status: "Live",
      features: ["Auto import", "Risk analysis", "Tax reports"],
      color: "bg-purple-500"
    },
    {
      name: "ICICI Direct",
      logo: "I",
      status: "Live",
      features: ["Portfolio sync", "Advanced analytics", "Compliance tools"],
      color: "bg-orange-500"
    },
    {
      name: "HDFC Securities",
      logo: "H",
      status: "Live",
      features: ["Trade sync", "Performance tracking", "Risk management"],
      color: "bg-blue-600"
    },
    {
      name: "Kotak Securities",
      logo: "K",
      status: "Live",
      features: ["Real-time data", "Portfolio analysis", "Tax optimization"],
      color: "bg-red-600"
    },
    {
      name: "5paisa",
      logo: "5",
      status: "Beta",
      features: ["Basic sync", "Trade history", "P&L tracking"],
      color: "bg-green-500"
    },
    {
      name: "Groww",
      logo: "G",
      status: "Coming Soon",
      features: ["Full integration", "Advanced features", "Premium support"],
      color: "bg-purple-600"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Synchronization",
      description: "Your trades are automatically synced in real-time, no manual entry required."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Grade Security",
      description: "We never store your broker credentials. All data is encrypted end-to-end."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Historical Data Import",
      description: "Import your complete trading history with just one click."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              ✅ 15+ BROKERS SUPPORTED
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Connect Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Favorite Broker
              </span>{' '}
              Instantly
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Seamlessly integrate with India's top brokers. Your trades, portfolios, and analytics - 
              all synchronized automatically with <strong className="text-cyan-400">military-grade security</strong>.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl">
              Connect Your Broker Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose Our 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Broker Integration?
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brokers Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Supported 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Brokers
            </span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brokers.map((broker, index) => (
              <div 
                key={broker.name}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-elegant hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${broker.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {broker.logo}
                  </div>
                  <Badge 
                    variant={broker.status === 'Live' ? 'default' : broker.status === 'Beta' ? 'secondary' : 'outline'}
                    className={
                      broker.status === 'Live' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : broker.status === 'Beta'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }
                  >
                    {broker.status}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-white">{broker.name}</h3>
                
                <ul className="space-y-2">
                  {broker.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Connect in 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              3 Simple Steps
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Broker",
                description: "Select your broker from our list of 15+ supported platforms."
              },
              {
                step: "02", 
                title: "Secure Authentication",
                description: "Authenticate using your broker's secure API - we never store credentials."
              },
              {
                step: "03",
                title: "Start Trading",
                description: "Your trades are automatically synced. Focus on trading, we handle the rest."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 hover:border-cyan-400/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Don't See Your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Broker?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're constantly adding new brokers. Let us know which one you'd like to see next!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl">
              Request New Broker
            </Button>
            <Button size="lg" className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <StickyFooter />
    </div>
  );
};

export default SupportedBrokers;