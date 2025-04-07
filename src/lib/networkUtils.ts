import { logger } from './logger';
import { toast } from 'react-hot-toast';

class NetworkManager {
  private isOnline: boolean;
  private listeners: Set<(online: boolean) => void>;

  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();

    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(online: boolean) {
    this.isOnline = online;
    logger.info(`Network status changed: ${online ? 'online' : 'offline'}`);
    
    if (online) {
      toast.success('Back online!');
    } else {
      toast.error('You are offline. Some features may be limited.');
    }

    this.listeners.forEach(listener => listener(online));
  }

  public addListener(listener: (online: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getStatus() {
    return {
      online: this.isOnline,
      type: navigator.connection?.type || 'unknown',
      effectiveType: navigator.connection?.effectiveType || 'unknown'
    };
  }

  public async waitForOnline(): Promise<void> {
    if (this.isOnline) return;

    return new Promise(resolve => {
      const cleanup = this.addListener(online => {
        if (online) {
          cleanup();
          resolve();
        }
      });
    });
  }
}

export const network = new NetworkManager();