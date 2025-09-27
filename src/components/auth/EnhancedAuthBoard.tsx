/**
 * Enhanced Authentication Board - Dual Panel Design
 * Interactive sign-in/sign-up toggle with smooth animations
 * Fixed visibility and responsive layout issues
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
  Lock, 
  User, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

// Removed social providers as requested

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

const EnhancedAuthBoard = memo(() => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Convert technical errors to user-friendly messages
  const getUserFriendlyError = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('user-not-found') || errorMessage.includes('invalid-email')) {
      return 'No account found with this email address. Please check your email or create a new account.';
    }
    if (errorMessage.includes('wrong-password') || errorMessage.includes('invalid-credential')) {
      return 'Incorrect password. Please try again or reset your password.';
    }
    if (errorMessage.includes('email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (errorMessage.includes('weak-password')) {
      return 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
    }
    if (errorMessage.includes('too-many-requests')) {
      return 'Too many failed attempts. Please wait a few minutes before trying again.';
    }
    if (errorMessage.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Default user-friendly message
    return isSignUp 
      ? 'Unable to create account. Please check your information and try again.'
      : 'Unable to sign in. Please check your credentials and try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        await register(formData.email, formData.password, formData.name || '');
        setSuccess("Account created successfully! Welcome to TradeJournal Pro.");
        // Navigate to dashboard after successful registration
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        await login(formData.email, formData.password);
        setSuccess("Welcome back! You're now signed in.");
        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      const friendlyError = getUserFriendlyError(error);
      setError(friendlyError);
      
      // Reset password field on login failure
      if (!isSignUp) {
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
    setShowPassword(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 flex items-center justify-center p-4">
      <motion.div 
        className="relative w-full max-w-6xl min-h-[600px] lg:h-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Welcome Panel */}
        <motion.div
          animate={{ 
            x: isSignUp ? '100%' : '0%',
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-gradient-to-br from-slate-800 via-emerald-800 to-teal-900 flex flex-col items-center justify-center text-white p-6 lg:p-8"
        >
          <motion.div 
            className="text-center max-w-sm"
            key={isSignUp ? 'signup-welcome' : 'signin-welcome'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-300" />
              TradeJournal Pro
            </Badge>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {isSignUp ? 'Hello, Friend!' : 'Welcome Back!'}
            </h2>
            
            <p className="text-emerald-100 mb-8 leading-relaxed">
              {isSignUp 
                ? 'Register with your personal details to use all of site features'
                : 'Enter your personal details to use all of site features'
              }
            </p>
            
            <Button
              onClick={toggleMode}
              variant="outline"
              className="bg-transparent border-2 border-emerald-300/40 text-white hover:bg-white hover:text-emerald-800 px-8 py-3 rounded-full font-semibold transition-all duration-300 group"
            >
              {isSignUp ? 'SIGN IN' : 'SIGN UP'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          animate={{ 
            x: isSignUp ? '-100%' : '0%',
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-white flex flex-col items-center justify-center p-6 lg:p-8"
        >
          <motion.div 
            className="w-full max-w-sm"
            key={isSignUp ? 'signup-form' : 'signin-form'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            
            <p className="text-gray-600 text-sm text-center mb-6">
              {isSignUp ? 'Use your email for registration' : 'Use your email and password'}
            </p>

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

            {/* Success Alert */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <Alert className="border-emerald-200 bg-emerald-50">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 font-medium">
                      {success}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="name" className="text-gray-700 text-sm font-medium">Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                        required={isSignUp}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                  >
                    Forget Your Password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white py-3 h-12 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'SIGN UP' : 'SIGN IN'
                )}
              </Button>
            </form>

            {/* Mobile toggle for small screens */}
            <div className="mt-6 text-center lg:hidden">
              <p className="text-gray-600 text-sm mb-2">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                onClick={toggleMode}
                  className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors duration-200"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Background decoration - Nature theme */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-200/30 rounded-full blur-lg" />
          <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-emerald-300/20 rounded-full blur-2xl" />
        </div>
      </motion.div>
    </div>
  );
});

EnhancedAuthBoard.displayName = 'EnhancedAuthBoard';

export default EnhancedAuthBoard;