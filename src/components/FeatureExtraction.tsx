import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Layers } from 'lucide-react';

interface FeatureExtractionProps {
  onExtract: (query: string) => void;
  disabled: boolean;
  query: string;
  onQueryChange: (query: string) => void;
}

export const FeatureExtraction: React.FC<FeatureExtractionProps> = ({
  onExtract,
  disabled,
  query,
  onQueryChange
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const queryTemplates = [
    {
      id: 'comprehensive',
      icon: <Layers className="w-4 h-4" />,
      title: 'Comprehensive Analysis',
      query: 'Can you provide a thorough description of this image? Please output with interleaved segmentation masks for the corresponding phrases.',
      description: 'Complete analysis with all features and segmentation masks'
    },
    {
      id: 'buildings',
      icon: <MapPin className="w-4 h-4" />,
      title: 'Building Detection',
      query: 'Identify and segment all buildings and structures in this remote sensing image.',
      description: 'Focus on built infrastructure and urban features'
    },
    {
      id: 'vegetation',
      icon: <Sparkles className="w-4 h-4" />,
      title: 'Vegetation Analysis',
      query: 'Analyze the vegetation and natural features in this image with detailed segmentation.',
      description: 'Identify forests, crops, and natural land cover'
    },
    {
      id: 'water',
      icon: <Search className="w-4 h-4" />,
      title: 'Water Bodies',
      query: 'Detect and segment water bodies, rivers, and aquatic features in this satellite image.',
      description: 'Focus on hydrological features and water resources'
    }
  ];

  const handleTemplateSelect = (template: typeof queryTemplates[0]) => {
    setSelectedTemplate(template.id);
    onQueryChange(template.query);
  };

  const handleExtract = () => {
    if (query.trim()) {
      onExtract(query.trim());
    }
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Extraction</h3>
        <p className="text-sm text-gray-600">
          Choose a template or write a custom query to extract features from your geospatial data.
        </p>
      </div>

      {/* Query Templates */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {queryTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              disabled={disabled}
              className={`
                p-3 text-left border rounded-lg transition-all duration-200 hover:shadow-sm
                ${selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-1.5 rounded-lg
                  ${selectedTemplate === template.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}
                `}>
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm">{template.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Query Input */}
      <div className="mb-6">
        <label htmlFor="query-input" className="block text-sm font-medium text-gray-900 mb-2">
          Custom Query
        </label>
        <textarea
          id="query-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Describe what you want to extract from the image..."
          disabled={disabled}
          className="input-field resize-none h-24"
        />
        <p className="text-xs text-gray-500 mt-1">
          Be specific about the features you want to identify and segment.
        </p>
      </div>

      {/* Extract Button */}
      <button
        onClick={handleExtract}
        disabled={disabled || !query.trim()}
        className={`
          w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200
          ${disabled || !query.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'btn-primary hover:shadow-lg transform hover:-translate-y-0.5'
          }
        `}
      >
        {disabled ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Extract Features</span>
          </>
        )}
      </button>

      {/* Processing Info */}
      {disabled && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Processing with GeoPixel AI...</span>
            <br />
            This may take a few moments depending on image complexity.
          </p>
        </div>
      )}
    </div>
  );
};