/**
 * Modern Checkout Page with Indian Payment Options
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { StickyFooter } from '@/components/ui/sticky-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  Check, 
  Lock,
  ArrowLeft,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or dashboard
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black">
      <SEOHead 
        title="Checkout - Dark Trader Hub"
        description="Complete your PRO subscription with secure Indian payment methods"
        keywords={["trading", "checkout", "payment", "subscription"]}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/pricing')}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete Your
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> PRO</span>
            {' '}Subscription
          </h1>
          <p className="text-xl text-gray-300">
            Secure payment with Indian payment methods
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                  PRO Plan
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">PRO Plan</span>
                  <span className="text-white font-semibold">₹2,499/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Discount</span>
                  <span className="text-green-400 font-semibold">-₹2,000</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">₹499/month</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-green-400 font-medium">What's Included:</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Unlimited file uploads</li>
                    <li>• Advanced analytics</li>
                    <li>• Real-time insights</li>
                    <li>• Premium support</li>
                    <li>• Export capabilities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Payment Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <Label className="text-white font-medium">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* UPI */}
                      <div className="relative">
                        <RadioGroupItem value="upi" id="upi" className="sr-only" />
                        <Label
                          htmlFor="upi"
                          className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'upi'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Smartphone className="h-5 w-5 text-cyan-400" />
                            <span className="text-white font-medium">UPI</span>
                          </div>
                          <span className="text-sm text-gray-400 mt-1">
                            Google Pay, PhonePe, Paytm
                          </span>
                        </Label>
                      </div>

                      {/* Credit/Debit Card */}
                      <div className="relative">
                        <RadioGroupItem value="card" id="card" className="sr-only" />
                        <Label
                          htmlFor="card"
                          className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'card'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-cyan-400" />
                            <span className="text-white font-medium">Card</span>
                          </div>
                          <span className="text-sm text-gray-400 mt-1">
                            Visa, Mastercard, RuPay
                          </span>
                        </Label>
                      </div>

                      {/* Net Banking */}
                      <div className="relative">
                        <RadioGroupItem value="netbanking" id="netbanking" className="sr-only" />
                        <Label
                          htmlFor="netbanking"
                          className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'netbanking'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5 text-cyan-400" />
                            <span className="text-white font-medium">Net Banking</span>
                          </div>
                          <span className="text-sm text-gray-400 mt-1">
                            All major Indian banks
                          </span>
                        </Label>
                      </div>

                      {/* EMI */}
                      <div className="relative">
                        <RadioGroupItem value="emi" id="emi" className="sr-only" />
                        <Label
                          htmlFor="emi"
                          className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === 'emi'
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-cyan-400" />
                            <span className="text-white font-medium">EMI</span>
                          </div>
                          <span className="text-sm text-gray-400 mt-1">
                            No-cost EMI available
                          </span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Form Fields */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upi-id" className="text-white">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@paytm"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-number" className="text-white">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="card-name" className="text-white">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        placeholder="John Doe"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank" className="text-white">Select Bank</Label>
                      <select
                        id="bank"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="">Choose your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'emi' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emi-card" className="text-white">Card Number</Label>
                      <Input
                        id="emi-card"
                        placeholder="1234 5678 9012 3456"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emi-tenure" className="text-white">EMI Tenure</Label>
                      <select
                        id="emi-tenure"
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="9">9 months</option>
                        <option value="12">12 months</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Secured by 256-bit SSL encryption</span>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-4 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Pay ₹499/month</span>
                    </div>
                  )}
                </Button>

                {/* Additional Info */}
                <div className="text-center text-sm text-gray-400">
                  <p>You can cancel anytime. No hidden fees.</p>
                  <p className="mt-1">
                    By proceeding, you agree to our{' '}
                    <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <StickyFooter />
    </div>
  );
};

export default Checkout;
