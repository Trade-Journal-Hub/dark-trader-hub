/**
 * File Upload Component with API Integration
 */
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload } from '@/hooks/useTradingApi';
import { useToast } from '@/components/ui/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PremiumGate } from '@/components/subscription/PremiumGate';
import { TrialService } from '@/services/trialService';

interface FileUploadProps {
  onUploadComplete?: (fileId: string) => void;
  onUploadError?: (error: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  result?: unknown;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canUploadFiles } = useSubscription();
  const { uploading, progress, error, uploadFile } = useFileUpload();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return;
    }

    if (!canUploadFiles) {
      toast({
        title: "Upgrade Required",
        description: "Please upgrade to PRO or start a free trial to upload files.",
        variant: "destructive",
      });
      return;
    }

    // Check trial limits if on trial
    const trialData = TrialService.getTrialData();
    if (trialData) {
      if (!TrialService.canUploadFile()) {
        toast({
          title: "Trial Limit Reached",
          description: "You've reached the maximum number of file uploads (3) for your trial period.",
          variant: "destructive",
        });
        return;
      }
    }

    if (acceptedFiles.length === 0) {
      toast({
        title: "Invalid File Type",
        description: "Only CSV, XLS, and XLSX files are allowed.",
        variant: "destructive",
      });
      return;
    }

    const file = acceptedFiles[0];
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Add file to state
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
    };

    setUploadedFiles(prev => [...prev, newFile]);
        // Show progress

    try {
      // Use direct upload API
      const response = await uploadFile(file, {
        onProgress: (progressData) => {
          setUploadedFiles(prev =>
            prev.map(f => f.id === fileId ? { 
              ...f, 
              status: 'uploading', 
              progress: progressData.percentage 
            } : f)
          );
        }
      });

      if (response.success) {
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            result: response.data
          } : f)
        );

        // Record trial usage if on trial
        if (trialData) {
          TrialService.recordFileUpload();
        }

        toast({
          title: "Upload Complete!",
          description: `File ${file.name} has been processed successfully.`,
          variant: "default",
        });

        onUploadComplete?.(fileId);
      } else {
        throw new Error(response.error || 'Upload failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? { 
          ...f, 
          status: 'failed', 
          error: errorMessage 
        } : f)
      );

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onUploadError?.(errorMessage);
    }
  }, [user, canUploadFiles, uploadFile, toast, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !canUploadFiles || uploading,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadContent = (
    <div className="space-y-4">
      <Card className="border-2 border-dashed hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload Trading Data
          </CardTitle>
          <CardDescription>
            Drag and drop your CSV/Excel trading files here, or click to select.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20 hover:border-primary/50'}
              ${!canUploadFiles || uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg text-primary">Drop the file here...</p>
            ) : (
              <p className="text-lg text-muted-foreground">
                Drag and drop your file here, or click to select
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Supports CSV, XLS, XLSX files up to 10MB
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {typeof error === 'object' && error !== null 
                  ? (error as unknown as Record<string, unknown>).message as string || 'An error occurred'
                  : String(error)
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {file.status === 'failed' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {file.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Show upload interface for PRO members or trial users
  return (
    <PremiumGate 
      feature="File Upload" 
      requiredPlan="professional"
    >
      {uploadContent}
    </PremiumGate>
  );
};