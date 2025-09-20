/**
 * Enhanced Forgot Password - Nature-themed Design
 * Consistent with the enhanced authentication board design
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const EnhancedForgotPassword = memo(() => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  // Convert technical errors to user-friendly messages
  const getUserFriendlyError = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('user-not-found') || errorMessage.includes('invalid-email')) {
      return 'No account found with this email address. Please check your email or create a new account.';
    }
    if (errorMessage.includes('too-many-requests')) {
      return 'Too many reset attempts. Please wait a few minutes before trying again.';
    }
    if (errorMessage.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    return 'Unable to send reset email. Please check your email address and try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error) {
      const friendlyError = getUserFriendlyError(error);
      setError(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 flex items-center justify-center p-4">
      <motion.div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-900 text-white p-8 lg:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-300" />
              TradeJournal Pro
            </Badge>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {isEmailSent ? 'Check Your Email' : 'Reset Password'}
            </h1>
            
            <p className="text-emerald-100 leading-relaxed">
              {isEmailSent 
                ? 'We\'ve sent password reset instructions to your email address'
                : 'Enter your email address and we\'ll send you instructions to reset your password'
              }
            </p>
          </motion.div>
        </div>

        {/* Form Section */}
        <div className="p-8 lg:p-12">
          {!isEmailSent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="pl-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-14 text-lg"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-4 h-14 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Email...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Reset Instructions
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 transition-colors duration-200 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Email Sent Successfully!
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                We've sent password reset instructions to <strong className="text-emerald-700">{email}</strong>.
                Please check your inbox and follow the instructions to reset your password.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                    setError(null);
                  }}
                  variant="outline"
                  className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-3 h-12 rounded-full font-semibold transition-all duration-300"
                >
                  Send Another Email
                </Button>
                
                <Link to="/login">
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-3 h-12 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Background decoration - Nature theme */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-10 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl" />
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-200/30 rounded-full blur-lg" />
        </div>
      </motion.div>
    </div>
  );
});

EnhancedForgotPassword.displayName = 'EnhancedForgotPassword';

export default EnhancedForgotPassword;
