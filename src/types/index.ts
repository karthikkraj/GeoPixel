export interface FileData {
  file: File;
  name: string;
  size: number;
  type: 'jpeg' | 'tiff';
  url: string;
  width: number;
  height: number;
  metadata?: TiffMetadata;
}

export interface TiffMetadata {
  geoKeys?: Record<string, any>;
  imageDescription?: string;
  software?: string;
  dateTime?: string;
  pixelScale?: [number, number, number];
  tiePoints?: number[];
}

export interface ExtractionResults {
  description: string;
  features: Feature[];
  masks: MaskData[];
  confidence: number;
  processingTime: number;
}

export interface Feature {
  name: string;
  value: string;
}

export interface MaskData {
  id: number;
  label: string;
  color: string;
  area: number;
  confidence: number;
}

export type ProcessingState = 'idle' | 'processing' | 'completed' | 'error';