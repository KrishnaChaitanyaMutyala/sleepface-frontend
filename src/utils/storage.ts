import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageService {
  private isWeb = Platform.OS === 'web';

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isWeb) {
        // For web, use localStorage as fallback
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.isWeb) {
        // For web, use localStorage as fallback
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isWeb) {
        localStorage.clear();
      } else {
        // For iOS, use a more robust clearing method
        // First try to get all keys and remove them individually
        try {
          const keys = await AsyncStorage.getAllKeys();
          if (keys && keys.length > 0) {
            await AsyncStorage.multiRemove(keys);
            console.log(`Successfully removed ${keys.length} storage items`);
          }
        } catch (multiRemoveError) {
          console.warn('Multi-remove failed, trying individual removal:', multiRemoveError);
          
          // Fallback: try to remove known keys individually
          const knownKeys = [
            'analysis_history',
            'current_analysis', 
            'daily_summary',
            'weekly_summary',
            'streak_data',
            'analyses',
            'user_preferences',
            'last_analysis_date'
          ];
          
          for (const key of knownKeys) {
            try {
              await AsyncStorage.removeItem(key);
            } catch (keyError) {
              console.warn(`Failed to remove key ${key}:`, keyError);
            }
          }
        }
        
        // Finally, try the clear method as a last resort
        try {
          await AsyncStorage.clear();
        } catch (clearError) {
          console.warn('AsyncStorage.clear() failed, but individual keys were removed:', clearError);
          // This is expected on iOS sometimes - the individual removal above should be sufficient
        }
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      // Don't throw - storage clearing is not critical for app functionality
    }
  }

  // Helper method to get JSON data
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const data = await this.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return null;
    }
  }

  // Helper method to set JSON data
  async setJSON(key: string, value: any): Promise<void> {
    try {
      await this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting JSON for key ${key}:`, error);
    }
  }
}

export const storageService = new StorageService();


