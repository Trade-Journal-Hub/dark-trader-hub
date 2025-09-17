import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata,
  UploadResult,
} from 'firebase/storage';
import { storage } from './config';
import { fileValidationSchema } from '@/utils/validation';
import { logger } from '@/utils/logger';

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  userId: string;
}

export class StorageService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  async uploadFile(
    file: File,
    userId: string,
    options?: FileUploadOptions
  ): Promise<{ url: string; metadata: FileMetadata }> {
    try {
      // Validate file
      this.validateFile(file);

      // Create storage reference
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `trading-files/${fileName}`);

      // Upload file
      const uploadResult: UploadResult = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Create metadata
      const metadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        userId,
      };

      // Update Firebase metadata
      await updateMetadata(uploadResult.ref, {
        customMetadata: {
          userId,
          originalName: file.name,
          uploadedAt: metadata.uploadedAt.toISOString(),
        },
      });

      options?.onSuccess?.(downloadURL);

      return { url: downloadURL, metadata };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      const uploadError = new Error(`Upload failed: ${errorMessage}`);
      options?.onError?.(uploadError);
      throw uploadError;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileMetadata(fileUrl: string): Promise<FileMetadata | null> {
    try {
      const fileRef = ref(storage, fileUrl);
      const metadata = await getMetadata(fileRef);
      
      return {
        name: metadata.name,
        size: metadata.size,
        type: metadata.contentType || 'unknown',
        uploadedAt: new Date(metadata.timeCreated),
        userId: metadata.customMetadata?.userId || '',
      };
    } catch (error) {
      logger.error('Error getting file metadata:', error);
      return null;
    }
  }

  async getFileDownloadURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      logger.error('Error getting download URL:', error);
      throw new Error('Failed to get file download URL');
    }
  }

  private validateFile(file: File): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('File must be CSV or Excel format');
    }

    // Validate using Zod schema
    try {
      fileValidationSchema.parse({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`File validation failed: ${error.message}`);
      }
      throw new Error('File validation failed');
    }
  }

  // Utility method to generate file path
  generateFilePath(userId: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `trading-files/${userId}/${timestamp}-${sanitizedFileName}`;
  }

  // Utility method to check if file exists
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fileRef = ref(storage, filePath);
      await getMetadata(fileRef);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
export default storageService;
