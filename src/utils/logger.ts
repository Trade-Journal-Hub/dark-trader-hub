// Centralized logging utility
export const logger = {
  error: (message: string, error?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, data);
  },
  info: (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, data);
  },
  debug: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
