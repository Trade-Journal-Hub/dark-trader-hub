/**
 * Trial Service - Handles 14-day trial logic with conditions
 */

export interface TrialData {
  startDate: string;
  endDate: string;
  maxRows: number;
  maxFiles: number;
  isTrial: boolean;
  filesUploaded?: number;
  totalRowsImported?: number;
}

export class TrialService {
  private static TRIAL_KEY = 'trialData';
  private static FILE_COUNT_KEY = 'trialFileCount';
  private static ROW_COUNT_KEY = 'trialRowCount';

  /**
   * Get current trial data
   */
  static getTrialData(): TrialData | null {
    try {
      const trialData = localStorage.getItem(this.TRIAL_KEY);
      if (!trialData) return null;
      
      const parsed = JSON.parse(trialData);
      
      // Check if trial has expired
      if (new Date() > new Date(parsed.endDate)) {
        this.clearTrialData();
        return null;
      }
      
      return {
        ...parsed,
        filesUploaded: parseInt(localStorage.getItem(this.FILE_COUNT_KEY) || '0'),
        totalRowsImported: parseInt(localStorage.getItem(this.ROW_COUNT_KEY) || '0')
      };
    } catch (error) {
      console.error('Error getting trial data:', error);
      return null;
    }
  }

  /**
   * Check if user is currently on trial
   */
  static isOnTrial(): boolean {
    const trialData = this.getTrialData();
    return trialData?.isTrial === true;
  }

  /**
   * Check if trial has expired
   */
  static isTrialExpired(): boolean {
    const trialData = this.getTrialData();
    if (!trialData) return true;
    
    return new Date() > new Date(trialData.endDate);
  }

  /**
   * Check if user can upload more files
   */
  static canUploadFile(): boolean {
    const trialData = this.getTrialData();
    if (!trialData) return false;
    
    return (trialData.filesUploaded || 0) < trialData.maxFiles;
  }

  /**
   * Check if user can import more rows
   */
  static canImportRows(rowsToImport: number): boolean {
    const trialData = this.getTrialData();
    if (!trialData) return false;
    
    return (trialData.totalRowsImported || 0) + rowsToImport <= trialData.maxRows;
  }

  /**
   * Record file upload
   */
  static recordFileUpload(): void {
    const currentCount = parseInt(localStorage.getItem(this.FILE_COUNT_KEY) || '0');
    localStorage.setItem(this.FILE_COUNT_KEY, (currentCount + 1).toString());
  }

  /**
   * Record rows imported
   */
  static recordRowsImported(rows: number): void {
    const currentCount = parseInt(localStorage.getItem(this.ROW_COUNT_KEY) || '0');
    localStorage.setItem(this.ROW_COUNT_KEY, (currentCount + rows).toString());
  }

  /**
   * Get trial status message
   */
  static getTrialStatusMessage(): string {
    const trialData = this.getTrialData();
    if (!trialData) return 'No active trial';
    
    const daysLeft = Math.ceil((new Date(trialData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const filesLeft = trialData.maxFiles - (trialData.filesUploaded || 0);
    const rowsLeft = trialData.maxRows - (trialData.totalRowsImported || 0);
    
    return `${daysLeft} days left • ${filesLeft} files remaining • ${rowsLeft} rows remaining`;
  }

  /**
   * Clear trial data
   */
  static clearTrialData(): void {
    localStorage.removeItem(this.TRIAL_KEY);
    localStorage.removeItem(this.FILE_COUNT_KEY);
    localStorage.removeItem(this.ROW_COUNT_KEY);
  }

  /**
   * Start new trial
   */
  static startTrial(): TrialData {
    const trialData: TrialData = {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      maxRows: 100,
      maxFiles: 3,
      isTrial: true,
      filesUploaded: 0,
      totalRowsImported: 0
    };
    
    localStorage.setItem(this.TRIAL_KEY, JSON.stringify(trialData));
    localStorage.setItem(this.FILE_COUNT_KEY, '0');
    localStorage.setItem(this.ROW_COUNT_KEY, '0');
    
    return trialData;
  }

  /**
   * Get trial progress
   */
  static getTrialProgress(): {
    filesUsed: number;
    filesTotal: number;
    rowsUsed: number;
    rowsTotal: number;
    daysLeft: number;
  } {
    const trialData = this.getTrialData();
    if (!trialData) {
      return { filesUsed: 0, filesTotal: 0, rowsUsed: 0, rowsTotal: 0, daysLeft: 0 };
    }
    
    const daysLeft = Math.ceil((new Date(trialData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      filesUsed: trialData.filesUploaded || 0,
      filesTotal: trialData.maxFiles,
      rowsUsed: trialData.totalRowsImported || 0,
      rowsTotal: trialData.maxRows,
      daysLeft: Math.max(0, daysLeft)
    };
  }
}
