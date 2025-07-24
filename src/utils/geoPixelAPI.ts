// Mock API interface for GeoPixel model
// In a real implementation, this would connect to your Python backend

export interface GeoPixelRequest {
  image: string; // base64 encoded image
  query: string;
  maxTokens?: number;
}

export interface GeoPixelResponse {
  description: string;
  masks: Array<{
    label: string;
    polygon: number[][];
    confidence: number;
  }>;
  processingTime: number;
  confidence: number;
}

export class GeoPixelAPI {
  private static instance: GeoPixelAPI;
  private baseUrl: string;

  private constructor() {
    // In production, this would be your actual API endpoint
    this.baseUrl = process.env.VITE_API_URL || 'http://localhost:8000';
  }

  public static getInstance(): GeoPixelAPI {
    if (!GeoPixelAPI.instance) {
      GeoPixelAPI.instance = new GeoPixelAPI();
    }
    return GeoPixelAPI.instance;
  }

  async extractFeatures(request: GeoPixelRequest): Promise<GeoPixelResponse> {
    try {
      // In a real implementation, this would make an HTTP request to your Python backend
      const response = await fetch(`${this.baseUrl}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GeoPixel API error:', error);
      
      // Fallback to mock response for demo purposes
      return this.getMockResponse(request);
    }
  }

  private getMockResponse(request: GeoPixelRequest): GeoPixelResponse {
    // Generate mock response based on query
    const query = request.query.toLowerCase();
    
    let description = "This remote sensing image shows a complex landscape with multiple land cover types.";
    const masks = [];

    if (query.includes('building')) {
      description = "The image contains several <p>residential buildings</p> [SEG] in the central area and <p>commercial structures</p> [SEG] along the main roads.";
      masks.push(
        { label: 'Residential Buildings', polygon: [[100, 100], [200, 100], [200, 200], [100, 200]], confidence: 0.94 },
        { label: 'Commercial Structures', polygon: [[300, 150], [450, 150], [450, 250], [300, 250]], confidence: 0.89 }
      );
    } else if (query.includes('vegetation')) {
      description = "Dense <p>forest areas</p> [SEG] dominate the northern section, while <p>agricultural fields</p> [SEG] are visible in the southern regions.";
      masks.push(
        { label: 'Forest Areas', polygon: [[50, 50], [300, 50], [300, 200], [50, 200]], confidence: 0.92 },
        { label: 'Agricultural Fields', polygon: [[100, 250], [400, 250], [400, 400], [100, 400]], confidence: 0.87 }
      );
    } else {
      description = "The image shows <p>urban areas</p> [SEG] with mixed land use, <p>transportation networks</p> [SEG], and <p>natural features</p> [SEG].";
      masks.push(
        { label: 'Urban Areas', polygon: [[150, 100], [350, 100], [350, 300], [150, 300]], confidence: 0.91 },
        { label: 'Transportation Networks', polygon: [[0, 200], [500, 200], [500, 220], [0, 220]], confidence: 0.88 },
        { label: 'Natural Features', polygon: [[400, 50], [500, 50], [500, 150], [400, 150]], confidence: 0.85 }
      );
    }

    return {
      description,
      masks,
      processingTime: 2.5 + Math.random() * 2,
      confidence: 0.85 + Math.random() * 0.15
    };
  }
}

export const geoPixelAPI = GeoPixelAPI.getInstance();