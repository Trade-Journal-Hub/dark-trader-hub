/**
 * Trial Terms and Conditions Modal
 * Displays terms for 14-day free trial with conditions
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  FileText, 
  Database, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TrialTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TrialTermsModal: React.FC<TrialTermsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">14-Day Free Trial</h2>
                  <p className="text-gray-600">Start your premium trading journey</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Trial Benefits */}
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">File Upload Access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Real-time Insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Crown className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Premium Features</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trial Conditions */}
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Trial Conditions
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Please review these important limitations during your trial period
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-amber-800">14-Day Duration</div>
                      <div className="text-sm text-amber-700">Your trial automatically expires after 14 days from activation</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-amber-800">Maximum 3 File Uploads</div>
                      <div className="text-sm text-amber-700">You can upload up to 3 trading data files during the trial</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Database className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-amber-800">Maximum 100 Rows per File</div>
                      <div className="text-sm text-amber-700">Each uploaded file can contain up to 100 trading records</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-amber-800">Auto-Expiry</div>
                      <div className="text-sm text-amber-700">Trial access will be automatically revoked after 14 days</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>
                  By accepting this free trial, you agree to the following terms:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Trial period is limited to 14 days from activation</li>
                  <li>Maximum of 3 file uploads during the trial period</li>
                  <li>Each file may contain up to 100 trading records</li>
                  <li>Access to premium features is granted only during the trial period</li>
                  <li>Trial access will be automatically revoked after expiry</li>
                  <li>No payment is required during the trial period</li>
                  <li>You can upgrade to PRO at any time during or after the trial</li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={onAccept}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
              >
                <Crown className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
