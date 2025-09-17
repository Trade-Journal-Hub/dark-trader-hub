import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import tradeJournalMockup from '@/assets/trade-journal-mockup.jpg';
import portfolioAnalyticsMockup from '@/assets/portfolio-analytics-mockup.jpg';
import riskManagementMockup from '@/assets/risk-management-mockup.jpg';

const FeaturesSection = () => {
  const features = [
    {
      title: "Smart Trade Journal",
      subtitle: "Turn Every Trade Into A Learning Experience",
      description: "Stop making the same costly mistakes. Our AI-powered journal analyzes your trading patterns, identifies what's working, and shows you exactly where you're leaving money on the table.",
      image: tradeJournalMockup,
      stats: [
        { label: "Average Win Rate Improvement", value: "23%" },
        { label: "Traders Using Daily", value: "15,000+" },
        { label: "Avg Monthly P&L Boost", value: "₹47K" }
      ],
      highlights: [
        "Detailed P&L tracking with tax calculations",
        "Emotional state analysis for better decisions", 
        "Screenshot annotations and trade notes",
        "Win/Loss pattern recognition"
      ]
    },
    {
      title: "Portfolio Performance Engine",
      subtitle: "See Your Wealth Grow Like Never Before", 
      description: "Watch your portfolio transform with real-time insights that professional fund managers pay thousands for. Get the same analytical power that helps billionaires make winning decisions.",
      image: portfolioAnalyticsMockup,
      stats: [
        { label: "Assets Under Management", value: "₹2,500Cr+" },
        { label: "Average Annual Returns", value: "18.5%" },
        { label: "Portfolio Tracking", value: "Real-time" }
      ],
      highlights: [
        "Multi-broker portfolio consolidation",
        "Sector-wise performance analysis",
        "Benchmark comparison & alpha generation",
        "Tax-efficient rebalancing suggestions"
      ]
    },
    {
      title: "Risk Management Shield", 
      subtitle: "Protect Your Capital Like Institutional Traders",
      description: "Never risk more than you can afford to lose. Our advanced risk engine automatically calculates position sizes and alerts you before emotions take over your trades.",
      image: riskManagementMockup,
      stats: [
        { label: "Maximum Drawdown Reduced", value: "67%" },
        { label: "Risk Alerts Sent Daily", value: "50,000+" },
        { label: "Capital Protected", value: "₹1,200Cr+" }
      ],
      highlights: [
        "Position sizing calculator with Kelly Criterion",
        "Real-time risk monitoring & alerts",
        "Portfolio heat maps and correlation analysis", 
        "Stop-loss and target automation"
      ]
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            The Complete Trading Arsenal
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Join <span className="text-primary font-semibold">25,000+ profitable traders</span> who've transformed their trading with our institutional-grade platform. 
            <span className="block mt-2 text-lg">Start your journey to consistent profitability today.</span>
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center animate-fade-in ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Content */}
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xl text-primary font-medium mb-4">
                    {feature.subtitle}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center p-4 rounded-lg bg-background/50 border border-border">
                      <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-3">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover-scale"
                >
                  Start Using This Feature
                </Button>
              </div>

              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 group">
                  <CardContent className="p-0">
                    <img 
                      src={feature.image} 
                      alt={`${feature.title} - Professional Trading Interface`}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20 p-12 rounded-2xl bg-gradient-card border border-primary/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Ready to Trade Like the Top 1%?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who've already transformed their results. Start your 14-day free trial and see why 
            <span className="text-primary font-semibold"> 89% of our users become profitable within 90 days</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4"
            >
              Start Free Trial - No Credit Card Required
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4"
            >
              Watch Success Stories
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✓ 14-day money-back guarantee ✓ Cancel anytime ✓ Setup in under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;