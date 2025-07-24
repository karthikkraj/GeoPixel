import React, { useState } from 'react';
import { Download, Eye, EyeOff, Clock, Target, BarChart3 } from 'lucide-react';
import { ExtractionResults } from '../types';

interface ResultsProps {
  results: ExtractionResults;
  query: string;
}

export const Results: React.FC<ResultsProps> = ({ results, query }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'masks'>('description');
  const [visibleMasks, setVisibleMasks] = useState<Set<number>>(new Set(results.masks.map(m => m.id)));

  const toggleMaskVisibility = (maskId: number) => {
    const newVisible = new Set(visibleMasks);
    if (newVisible.has(maskId)) {
      newVisible.delete(maskId);
    } else {
      newVisible.add(maskId);
    }
    setVisibleMasks(newVisible);
  };

  const formatDescription = (description: string) => {
    // Parse the description to highlight segmented phrases
    const parts = description.split(/(<p>.*?<\/p>\s*\[SEG\])/g);
    
    return parts.map((part, index) => {
      const match = part.match(/<p>(.*?)<\/p>\s*\[SEG\]/);
      if (match) {
        return (
          <span
            key={index}
            className="bg-primary-100 text-primary-800 px-1 py-0.5 rounded font-medium border border-primary-200"
          >
            {match[1]}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const downloadResults = () => {
    const data = {
      query,
      results,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geopixel-results-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Target className="w-4 h-4" /> },
    { id: 'masks', label: 'Segmentation', icon: <Eye className="w-4 h-4" /> }
  ];

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Extraction Results</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{results.processingTime}s</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{(results.confidence * 100).toFixed(1)}%</span>
          </div>
          <button
            onClick={downloadResults}
            className="btn-secondary text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI-Generated Description</h4>
              <div className="p-4 bg-gray-50 rounded-lg text-sm leading-relaxed">
                {formatDescription(results.description)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-success-50 rounded-lg">
                <div className="text-success-600 font-medium">Confidence Score</div>
                <div className="text-2xl font-bold text-success-700">
                  {(results.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium">Processing Time</div>
                <div className="text-2xl font-bold text-blue-700">
                  {results.processingTime}s
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Extracted Features</h4>
            <div className="grid grid-cols-1 gap-3">
              {results.features.map((feature, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{feature.name}</span>
                  <span className="text-gray-900 font-mono text-sm">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'masks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Segmentation Masks</h4>
              <div className="text-sm text-gray-600">
                {visibleMasks.size} of {results.masks.length} visible
              </div>
            </div>
            
            <div className="space-y-2">
              {results.masks.map((mask) => (
                <div
                  key={mask.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded border-2 border-white shadow-sm"
                      style={{ backgroundColor: mask.color }}
                    />
                    <div>
                      <span className="font-medium text-gray-900">{mask.label}</span>
                      <div className="text-xs text-gray-500">
                        Area: {mask.area.toLocaleString()} px² • 
                        Confidence: {(mask.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleMaskVisibility(mask.id)}
                    className={`
                      p-1.5 rounded-lg transition-colors
                      ${visibleMasks.has(mask.id)
                        ? 'text-primary-600 hover:bg-primary-100'
                        : 'text-gray-400 hover:bg-gray-200'
                      }
                    `}
                  >
                    {visibleMasks.has(mask.id) ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Note:</span> Segmentation masks show pixel-level grounding 
                of identified features. Toggle visibility to focus on specific elements.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};