import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { SEOHead, SEOConfigs } from '@/components/SEOHead';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { motion, AnimatePresence } from 'framer-motion';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEOHead {...SEOConfigs.pricing} />
      <Navigation />
      <PricingContent />
      <Footer />
    </div>
  );
};

const PricingContent = () => {
  const [isYearly, setIsYearly] = useState(false);

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
      price: "₹9,590", // (999 * 12) * 0.8 = 20% discount
      originalPrice: "₹11,988", // 999 * 12
      period: "/year",
      monthlyEquivalent: "₹799/month",
      savings: "20% OFF",
      features: [
        "Up to 100 trades per month",
        "Basic analytics & reports",
        "Trade journal with notes",
        "Mobile app access",
        "Email support",
        "Basic tax reporting"
      ],
      icon: <Star className="h-6 w-6" />,
      popular: false
    },
    {
      name: "Professional", 
      price: "₹17,270", // (1799 * 12) * 0.8 = 20% discount
      originalPrice: "₹21,588", // 1799 * 12
      period: "/year",
      monthlyEquivalent: "₹1,439/month",
      savings: "20% OFF",
      features: [
        "Unlimited trades",
        "Advanced analytics & AI insights",
        "Performance tracking",
        "Risk management tools",
        "Multi-broker integration",
        "Priority support",
        "Advanced tax optimization",
        "Custom reports & exports"
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹38,390", // (3999 * 12) * 0.8 = 20% discount
      originalPrice: "₹47,988", // 3999 * 12
      period: "/year",
      monthlyEquivalent: "₹3,199/month",
      savings: "20% OFF",
      features: [
        "Everything in Professional",
        "White-label solutions",
        "API access & webhooks",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced compliance tools",
        "Custom training sessions"
      ],
      icon: <Crown className="h-6 w-6" />,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              🔥 LIMITED TIME OFFER
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Choose Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                Trading Success
              </span>{' '}
              Plan
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of successful traders who've transformed their trading journey with our industry-leading tools. 
              <strong className="text-cyan-400"> Start your 14-day free trial today!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
              <InteractiveHoverButton 
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium border-0 transition-all duration-300 ${
                  !isYearly 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white bg-transparent'
                }`}
              >
                Monthly
              </InteractiveHoverButton>
              <InteractiveHoverButton 
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium border-0 transition-all duration-300 ${
                  isYearly 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'text-gray-300 hover:text-white bg-transparent'
                }`}
              >
                Yearly (Save 20%)
              </InteractiveHoverButton>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {(isYearly ? yearlyPlans : plans).map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:shadow-elegant hover:scale-105 animate-fade-in ${
                  plan.popular 
                    ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' 
                    : 'border-white/20 hover:border-cyan-400/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  
                  {/* <div className="mb-4">
                    <motion.div
                      key={`${plan.savings}-${isYearly}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Badge 
                        variant="secondary" 
                        className={`${
                          isYearly 
                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30 animate-pulse' 
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                        } transition-all duration-300`}
                      >
                        {plan.savings}
                        {isYearly && ' 🎉'}
                      </Badge>
                    </motion.div>
                  </div> */}
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.span 
                      key={`${plan.price}-${isYearly}`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="text-3xl font-bold text-white"
                    >
                      {plan.price}
                    </motion.span>
                    <motion.span 
                      key={`${plan.period}-${isYearly}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-gray-400"
                    >
                      {plan.period}
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {isYearly && 'monthlyEquivalent' in plan && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-sm text-cyan-400 font-medium mb-1"
                      >
                        {(plan as any).monthlyEquivalent}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.p 
                    key={`${plan.originalPrice}-${isYearly}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-sm text-gray-400 line-through"
                  >
                    {plan.originalPrice}
                  </motion.p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <InteractiveHoverButton 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg' 
                      : 'bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black'
                  } py-3 px-6 text-lg font-semibold`}
                >
                  {plan.popular ? 'Start Pro Trial' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </InteractiveHoverButton>
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
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Frequently Asked 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Questions
            </span>
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
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-cyan-400/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-semibold mb-2 text-white">{faq.q}</h4>
                <p className="text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Interactive Buttons */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ready to Transform Your Trading?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful traders who've improved their performance with our advanced analytics and insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <InteractiveHoverButton className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl">
                Start Your Free Trial
              </InteractiveHoverButton>
              
              <InteractiveHoverButton className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                View Live Demo
              </InteractiveHoverButton>
            </div>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                No credit card required
              </span>
              <span className="mx-4">•</span>
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                14-day money-back guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;