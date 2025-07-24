import { fromArrayBuffer } from 'geotiff';
import { FileData, TiffMetadata } from '../types';

export const processImageFile = async (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const fileData: FileData = {
        file,
        name: file.name,
        size: file.size,
        type: 'jpeg',
        url,
        width: img.width,
        height: img.height
      };
      resolve(fileData);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

export const processTiffFile = async (file: File): Promise<FileData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tiff = await fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    
    // Get basic image properties
    const width = image.getWidth();
    const height = image.getHeight();
    
    // Extract metadata
    const metadata: TiffMetadata = {};
    
    try {
      // Get GeoTIFF metadata if available
      const geoKeys = image.getGeoKeys();
      if (geoKeys && Object.keys(geoKeys).length > 0) {
        metadata.geoKeys = geoKeys;
      }
      
      // Get other TIFF tags
      const fileDirectory = image.fileDirectory;
      if (fileDirectory.ImageDescription) {
        metadata.imageDescription = fileDirectory.ImageDescription;
      }
      if (fileDirectory.Software) {
        metadata.software = fileDirectory.Software;
      }
      if (fileDirectory.DateTime) {
        metadata.dateTime = fileDirectory.DateTime;
      }
      
      // Get pixel scale and tie points for georeferencing
      if (fileDirectory.ModelPixelScale) {
        metadata.pixelScale = fileDirectory.ModelPixelScale;
      }
      if (fileDirectory.ModelTiepoint) {
        metadata.tiePoints = fileDirectory.ModelTiepoint;
      }
    } catch (metadataError) {
      console.warn('Could not extract all metadata:', metadataError);
    }
    
    // Convert to displayable format
    const rasters = await image.readRasters();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Create image data from raster
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Handle different band configurations
    const numBands = rasters.length;
    
    for (let i = 0; i < width * height; i++) {
      if (numBands >= 3) {
        // RGB or RGB+NIR
        data[i * 4] = normalizePixelValue(rasters[0][i]); // Red
        data[i * 4 + 1] = normalizePixelValue(rasters[1][i]); // Green
        data[i * 4 + 2] = normalizePixelValue(rasters[2][i]); // Blue
      } else if (numBands === 1) {
        // Grayscale
        const value = normalizePixelValue(rasters[0][i]);
        data[i * 4] = value;
        data[i * 4 + 1] = value;
        data[i * 4 + 2] = value;
      }
      data[i * 4 + 3] = 255; // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
    const url = canvas.toDataURL('image/png');
    
    const fileData: FileData = {
      file,
      name: file.name,
      size: file.size,
      type: 'tiff',
      url,
      width,
      height,
      metadata
    };
    
    return fileData;
  } catch (error) {
    console.error('TIFF processing error:', error);
    throw new Error('Failed to process TIFF file. Please ensure it\'s a valid GeoTIFF or TIFF image.');
  }
};

const normalizePixelValue = (value: number): number => {
  // Normalize pixel values to 0-255 range
  // This is a simple linear scaling - in production, you might want more sophisticated normalization
  if (value <= 255) {
    return Math.max(0, Math.min(255, value));
  }
  // For 16-bit values, scale down
  return Math.max(0, Math.min(255, Math.floor(value / 256)));
};