import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              ✅ 15+ BROKERS SUPPORTED
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Favorite Broker
              </span>{' '}
              Instantly
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Seamlessly integrate with India's top brokers. Your trades, portfolios, and analytics - 
              all synchronized automatically with <strong className="text-primary">military-grade security</strong>.
            </p>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
              Connect Your Broker Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Broker Integration?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brokers Grid */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supported Brokers
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brokers.map((broker, index) => (
              <div 
                key={broker.name}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:scale-105 animate-fade-in"
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
                
                <h3 className="text-lg font-semibold mb-3">{broker.name}</h3>
                
                <ul className="space-y-2">
                  {broker.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Connect in 3 Simple Steps
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
                className="text-center p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't See Your Broker?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're constantly adding new brokers. Let us know which one you'd like to see next!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
              Request New Broker
            </Button>
            <Button size="lg" variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SupportedBrokers;