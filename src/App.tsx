import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ImagePreview } from './components/ImagePreview';
import { FeatureExtraction } from './components/FeatureExtraction';
import { Results } from './components/Results';
import { Footer } from './components/Footer';
import { ProcessingStatus } from './components/ProcessingStatus';
import { FileData, ExtractionResults, ProcessingState } from './types';

function App() {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [extractionResults, setExtractionResults] = useState<ExtractionResults | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [query, setQuery] = useState('');

  const handleFileUpload = (fileData: FileData) => {
    setUploadedFile(fileData);
    setExtractionResults(null);
    setProcessingState('idle');
  };

  const handleExtraction = async (extractionQuery: string) => {
    if (!uploadedFile) return;
    
    setQuery(extractionQuery);
    setProcessingState('processing');
    
    try {
      // Simulate GeoPixel processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results based on file type and query
      const mockResults: ExtractionResults = {
        description: generateMockDescription(uploadedFile, extractionQuery),
        features: generateMockFeatures(uploadedFile),
        masks: generateMockMasks(),
        confidence: 0.92,
        processingTime: 2.8
      };
      
      setExtractionResults(mockResults);
      setProcessingState('completed');
    } catch (error) {
      console.error('Extraction failed:', error);
      setProcessingState('error');
    }
  };

  const generateMockDescription = (file: FileData, query: string): string => {
    const baseDescription = file.type === 'tiff' 
      ? "This is a high-resolution remote sensing image showing various land cover types and geographical features."
      : "This aerial/satellite image contains multiple objects and terrain features.";
    
    if (query.toLowerCase().includes('building')) {
      return `${baseDescription} The image contains several <p>residential buildings</p> [SEG] clustered in the central area, with <p>commercial structures</p> [SEG] along the main roads. The buildings show typical urban development patterns with clear boundaries and geometric shapes.`;
    } else if (query.toLowerCase().includes('vegetation')) {
      return `${baseDescription} Dense <p>forest areas</p> [SEG] dominate the northern section, while <p>agricultural fields</p> [SEG] are visible in the southern regions. The vegetation shows healthy growth patterns with distinct seasonal characteristics.`;
    } else if (query.toLowerCase().includes('water')) {
      return `${baseDescription} A prominent <p>water body</p> [SEG] is located in the eastern portion of the image, with <p>wetland areas</p> [SEG] surrounding it. The water appears clear with well-defined shorelines.`;
    } else {
      return `${baseDescription} The image shows <p>urban areas</p> [SEG] with mixed land use, <p>transportation networks</p> [SEG] connecting different regions, and <p>natural features</p> [SEG] interspersed throughout the landscape.`;
    }
  };

  const generateMockFeatures = (file: FileData) => {
    const baseFeatures = [
      { name: 'Spatial Resolution', value: file.type === 'tiff' ? '0.5m/pixel' : '1.2m/pixel' },
      { name: 'Image Dimensions', value: `${file.width} × ${file.height}` },
      { name: 'File Size', value: `${(file.size / (1024 * 1024)).toFixed(2)} MB` },
      { name: 'Color Channels', value: file.type === 'tiff' ? 'RGB + NIR' : 'RGB' }
    ];

    if (file.type === 'tiff') {
      baseFeatures.push(
        { name: 'Coordinate System', value: 'WGS84 / UTM Zone 33N' },
        { name: 'Pixel Depth', value: '16-bit' },
        { name: 'Compression', value: 'LZW' }
      );
    }

    return baseFeatures;
  };

  const generateMockMasks = () => {
    return [
      { id: 1, label: 'Buildings', color: '#ef4444', area: 1250, confidence: 0.94 },
      { id: 2, label: 'Vegetation', color: '#22c55e', area: 3420, confidence: 0.89 },
      { id: 3, label: 'Roads', color: '#6b7280', area: 890, confidence: 0.91 },
      { id: 4, label: 'Water Bodies', color: '#3b82f6', area: 2100, confidence: 0.96 }
    ];
  };

  const handleReset = () => {
    setUploadedFile(null);
    setExtractionResults(null);
    setProcessingState('idle');
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            <FileUpload onFileUpload={handleFileUpload} />
            
            {uploadedFile && (
              <ImagePreview 
                fileData={uploadedFile} 
                onReset={handleReset}
              />
            )}
          </div>

          {/* Right Column - Feature Extraction and Results */}
          <div className="space-y-6">
            {uploadedFile && (
              <FeatureExtraction 
                onExtract={handleExtraction}
                disabled={processingState === 'processing'}
                query={query}
                onQueryChange={setQuery}
              />
            )}

            <ProcessingStatus state={processingState} />

            {extractionResults && (
              <Results 
                results={extractionResults}
                query={query}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;