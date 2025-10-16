import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png';
}

export class ImageCompression {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    format: 'jpeg'
  };

  /**
   * Compress image for faster upload
   */
  static async compressImage(
    uri: string, 
    options: CompressionOptions = {}
  ): Promise<string> {
    try {
      const opts = { ...this.DEFAULT_OPTIONS, ...options };
      
      console.log('🖼️ Compressing image...', { originalUri: uri, options: opts });
      
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          { 
            resize: { 
              width: opts.maxWidth,
              height: opts.maxHeight 
            } 
          }
        ],
        { 
          compress: opts.quality,
          format: ImageManipulator.SaveFormat.JPEG
        }
      );

      console.log('✅ Image compressed successfully', {
        originalSize: 'unknown', // Would need to get file size
        compressedUri: result.uri
      });

      return result.uri;
    } catch (error) {
      console.error('❌ Image compression failed:', error);
      return uri; // Return original if compression fails
    }
  }

  /**
   * Get optimal compression settings based on network quality
   */
  static getOptimalSettings(networkQuality: 'slow' | 'medium' | 'fast'): CompressionOptions {
    switch (networkQuality) {
      case 'slow':
        return { maxWidth: 600, maxHeight: 600, quality: 0.6 };
      case 'medium':
        return { maxWidth: 800, maxHeight: 800, quality: 0.8 };
      case 'fast':
        return { maxWidth: 1200, maxHeight: 1200, quality: 0.9 };
      default:
        return this.DEFAULT_OPTIONS;
    }
  }

  /**
   * Detect network quality (simplified)
   */
  static async detectNetworkQuality(): Promise<'slow' | 'medium' | 'fast'> {
    try {
      // Simple network test - ping a fast endpoint
      const start = Date.now();
      await fetch('https://www.google.com/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const duration = Date.now() - start;

      if (duration < 500) return 'fast';
      if (duration < 1500) return 'medium';
      return 'slow';
    } catch {
      return 'medium'; // Default to medium if test fails
    }
  }
}


