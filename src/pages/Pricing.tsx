import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "₹999",
      originalPrice: "₹1,499",
      period: "/month",
      description: "Perfect for individual traders starting their journey",
      features: [
        "Up to 100 trades per month",
        "Basic analytics & reports",
        "Trade journal with notes",
        "Mobile app access",
        "Email support",
        "Basic tax reporting"
      ],
      icon: <Star className="h-6 w-6" />,
      popular: false,
      savings: "33% OFF"
    },
    {
      name: "Professional",
      price: "₹1,799",
      originalPrice: "₹2,999",
      period: "/month",
      description: "Advanced features for serious traders",
      features: [
        "Unlimited trades",
        "Advanced analytics & AI insights",
        "Performance tracking",
        "Risk management tools",
        "Priority support",
        "Advanced tax reporting",
        "Portfolio optimization",
        "Custom indicators",
        "Broker integration"
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      savings: "40% OFF"
    },
    {
      name: "Enterprise",
      price: "₹3,499",
      originalPrice: "₹4,999",
      period: "/month",
      description: "Complete solution for professional trading firms",
      features: [
        "Everything in Professional",
        "Multi-user accounts",
        "Team collaboration tools",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Advanced compliance tools",
        "White-label solution",
        "24/7 phone support"
      ],
      icon: <Crown className="h-6 w-6" />,
      popular: false,
      savings: "30% OFF"
    }
  ];

  const yearlyPlans = [
    {
      name: "Basic",
      price: "₹8,999",
      originalPrice: "₹17,988",
      period: "/year",
      monthlyEquivalent: "₹750/month",
      savings: "50% OFF"
    },
    {
      name: "Professional", 
      price: "₹15,999",
      originalPrice: "₹35,988",
      period: "/year",
      monthlyEquivalent: "₹1,333/month",
      savings: "56% OFF"
    },
    {
      name: "Enterprise",
      price: "₹29,999",
      originalPrice: "₹59,988",
      period: "/year",
      monthlyEquivalent: "₹2,500/month",
      savings: "50% OFF"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🔥 LIMITED TIME OFFER
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Trading Success
              </span>{' '}
              Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of successful traders who've transformed their trading journey with our industry-leading tools. 
              <strong className="text-primary"> Start your 14-day free trial today!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-card rounded-full p-1 border border-border">
              <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-full text-muted-foreground text-sm font-medium hover:text-foreground">
                Yearly (Save up to 56%)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 hover:shadow-elegant hover:scale-105 animate-fade-in ${
                  plan.popular 
                    ? 'border-primary shadow-glow' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-4 py-1">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      {plan.savings}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-through">{plan.originalPrice}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-primary hover:shadow-glow' 
                      : 'bg-card border border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4">
              🛡️ 30-Day Money-Back Guarantee
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not satisfied? Get a full refund within 30 days, no questions asked. 
              We're confident you'll love TradeJournal Pro.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Students get 50% off any plan. Contact our support team with your student ID for verification."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, UPI, net banking, and digital wallets including Paytm and PhonePe."
              },
              {
                q: "Is my trading data secure?",
                a: "Yes! We use bank-grade encryption and never store your broker credentials. Your data is 100% secure and private."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;