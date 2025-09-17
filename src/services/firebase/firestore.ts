import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { logger } from '@/utils/logger';

// User document interface
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt: Date | null;
  };
  profile: {
    tradingExperience: string;
    preferredBroker: string;
  };
}

// Trading file document interface
export interface TradingFileDocument {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'failed';
  fileUrl: string;
  processedData?: {
    totalTrades: number;
    totalPnL: number;
    winRate: number;
    symbols: string[];
  };
  error?: string;
}

// Analytics document interface
export interface AnalyticsDocument {
  userId: string;
  lastUpdated: Date;
  overview: {
    totalPnL: number;
    totalTrades: number;
    winRate: number;
    sharpeRatio: number;
  };
  performance: Array<{
    date: string;
    pnl: number;
    trades: number;
    winRate: number;
  }>;
  risk: {
    maxDrawdown: number;
    riskRewardRatio: number;
    volatility: number;
  };
  insights: Array<{
    type: 'performance' | 'risk' | 'strategy';
    message: string;
    confidence: number;
  }>;
}

export class FirestoreService {
  // User operations
  async createUser(userData: Omit<UserDocument, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Failed to create user document');
    }
  }

  async getUser(uid: string): Promise<UserDocument | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserDocument;
      }
      return null;
    } catch (error) {
      logger.error('Error getting user:', error);
      throw new Error('Failed to get user document');
    }
  }

  async updateUser(uid: string, userData: Partial<UserDocument>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new Error('Failed to update user document');
    }
  }

  // Trading file operations
  async createTradingFile(fileData: Omit<TradingFileDocument, 'id' | 'uploadDate'>): Promise<string> {
    try {
      const filesRef = collection(db, 'tradingFiles');
      const docRef = await addDoc(filesRef, {
        ...fileData,
        uploadDate: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      logger.error('Error creating trading file:', error);
      throw new Error('Failed to create trading file document');
    }
  }

  async getTradingFiles(userId: string): Promise<TradingFileDocument[]> {
    try {
      const filesRef = collection(db, 'tradingFiles');
      const q = query(
        filesRef,
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as TradingFileDocument[];
    } catch (error) {
      logger.error('Error getting trading files:', error);
      throw new Error('Failed to get trading files');
    }
  }

  async updateTradingFile(fileId: string, updates: Partial<TradingFileDocument>): Promise<void> {
    try {
      const fileRef = doc(db, 'tradingFiles', fileId);
      await updateDoc(fileRef, updates);
    } catch (error) {
      logger.error('Error updating trading file:', error);
      throw new Error('Failed to update trading file');
    }
  }

  async deleteTradingFile(fileId: string): Promise<void> {
    try {
      const fileRef = doc(db, 'tradingFiles', fileId);
      await deleteDoc(fileRef);
    } catch (error) {
      logger.error('Error deleting trading file:', error);
      throw new Error('Failed to delete trading file');
    }
  }

  // Analytics operations
  async saveAnalytics(userId: string, analytics: Omit<AnalyticsDocument, 'userId' | 'lastUpdated'>): Promise<void> {
    try {
      const analyticsRef = doc(db, 'analytics', userId);
      await setDoc(analyticsRef, {
        ...analytics,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      logger.error('Error saving analytics:', error);
      throw new Error('Failed to save analytics');
    }
  }

  async getAnalytics(userId: string): Promise<AnalyticsDocument | null> {
    try {
      const analyticsRef = doc(db, 'analytics', userId);
      const analyticsSnap = await getDoc(analyticsRef);
      
      if (analyticsSnap.exists()) {
        return analyticsSnap.data() as AnalyticsDocument;
      }
      return null;
    } catch (error) {
      logger.error('Error getting analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  // Utility methods
  private handleFirestoreError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(`Firestore error: ${error.message}`);
    }
    throw new Error('Unknown Firestore error');
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;
