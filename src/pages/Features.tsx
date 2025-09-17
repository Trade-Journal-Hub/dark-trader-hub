import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { SEOHead, SEOConfigs } from '@/components/SEOHead';

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...SEOConfigs.features} />
      <Navigation />
      <FeaturesContent />
      <Footer />
    </div>
  );
};

const FeaturesContent = () => {
  const allFeatures = [
    {
      category: "Trading Tools",
      items: [
        {
          icon: '📊',
          title: 'Advanced Charting',
          description: 'Professional-grade charts with 50+ technical indicators, drawing tools, and multiple timeframes.',
          details: ['TradingView integration', 'Custom indicators', 'Pattern recognition', 'Multi-asset support']
        },
        {
          icon: '⚡',
          title: 'Real-Time Data',
          description: 'Live market data with millisecond accuracy from all major exchanges.',
          details: ['NSE/BSE feeds', 'Options chain', 'Market depth', 'Tick-by-tick data']
        },
        {
          icon: '🎯',
          title: 'Smart Alerts',
          description: 'AI-powered alerts for price movements, patterns, and trading opportunities.',
          details: ['Price alerts', 'Technical alerts', 'News alerts', 'Custom conditions']
        },
        {
          icon: '📝',
          title: 'Paper Trading',
          description: 'Practice your strategies risk-free with our advanced paper trading simulator using real market data.',
          details: ['Virtual portfolio', 'Real market prices', 'Strategy backtesting', 'Performance tracking']
        }
      ]
    },
    {
      category: "Portfolio Management",
      items: [
        {
          icon: '💼',
          title: 'Multi-Account Support',
          description: 'Manage multiple trading accounts and brokers from a single dashboard.',
          details: ['15+ broker integrations', 'Consolidated view', 'Auto-sync trades', 'Risk aggregation']
        },
        {
          icon: '📈',
          title: 'Performance Analytics',
          description: 'Comprehensive analysis of your trading performance with detailed metrics.',
          details: ['P&L analysis', 'Win/loss ratios', 'Drawdown tracking', 'Risk metrics']
        },
        {
          icon: '🔄',
          title: 'Auto Trade Import',
          description: 'Automatically import trades from your broker with API integration.',
          details: ['Real-time sync', 'Historical data', 'Trade reconciliation', 'Error handling']
        }
      ]
    },
    {
      category: "Risk Management",
      items: [
        {
          icon: '🛡️',
          title: 'Risk Controls',
          description: 'Advanced risk management tools to protect your capital.',
          details: ['Position sizing', 'Stop-loss management', 'Max drawdown limits', 'Risk per trade']
        },
        {
          icon: '📋',
          title: 'Trade Journal',
          description: 'Detailed journaling with screenshots, notes, and emotional analysis.',
          details: ['Voice notes', 'Screenshot capture', 'Emotional tracking', 'Tag system']
        },
        {
          icon: '🔍',
          title: 'Pattern Recognition',
          description: 'AI identifies your trading patterns and suggests improvements.',
          details: ['Success patterns', 'Failure analysis', 'Behavioral insights', 'Recommendations']
        }
      ]
    },
    {
      category: "Tax & Compliance",
      items: [
        {
          icon: '📋',
          title: 'Automated Tax Reports',
          description: 'Generate comprehensive tax reports automatically for ITR filing and compliance.',
          details: ['Capital gains calculation', 'LTCG/STCG classification', 'ITR-2 ready format', 'Section 112A compliance']
        },
        {
          icon: '🧮',
          title: 'Advanced Tax Calculator',
          description: 'Calculate your tax liability with precision using latest tax slabs and exemptions.',
          details: ['FIFO/LIFO methods', 'Indexation benefits', 'Tax optimization tips', 'Loss carry forward']
        },
        {
          icon: '📄',
          title: 'ITR Filing Assistance',
          description: 'Step-by-step guidance for filing Income Tax Returns with trading income.',
          details: ['Form 16 integration', 'Audit trail reports', 'CA consultation', 'Error validation']
        }
      ]
    },
    {
      category: "Mobile & Integration",
      items: [
        {
          icon: '📱',
          title: 'Mobile App',
          description: 'Full-featured mobile app for trading on the go.',
          details: ['iOS & Android', 'Real-time sync', 'Push notifications', 'Offline support']
        },
        {
          icon: '🔌',
          title: 'API Access',
          description: 'Powerful APIs for custom integrations and automated trading.',
          details: ['REST API', 'WebSocket feeds', 'Custom webhooks', 'Developer tools']
        },
        {
          icon: '🔒',
          title: 'Enterprise Security',
          description: 'Bank-level security with enterprise-grade compliance.',
          details: ['256-bit encryption', 'Two-factor auth', 'SEBI compliance', 'Data sovereignty']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Complete Feature Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Everything you need to trade professionally. From basic journaling to advanced analytics, 
            we've got every aspect of your trading covered.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {allFeatures.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-primary bg-clip-text text-transparent">
                {category.category}
              </h2>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {category.items.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className="p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="text-5xl mb-6 group-hover:animate-float">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6 text-lg">{feature.description}</p>
                    
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-muted-foreground">
                          <span className="text-success mr-2">✓</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful traders who have already upgraded their trading game with TradeJournal Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start 14-Day Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Cancel anytime • Full access to all features
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;