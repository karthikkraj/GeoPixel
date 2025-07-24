import React from 'react';
import { Satellite, Brain } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Satellite className="w-8 h-8 text-primary-600" />
              <Brain className="w-4 h-4 text-primary-500 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                GeoPixel
              </h1>
              <p className="text-sm text-gray-600">
                Pixel Grounding Large Multimodal Model
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Advanced AI</p>
              <p className="text-xs text-gray-500">Remote Sensing Analysis</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
          <p className="text-sm text-primary-800">
            <span className="font-semibold">🔥 ICML 2025 Accepted!</span> Upload your geospatial images (.tif, .jpeg) and extract detailed features with pixel-level grounding using our state-of-the-art multimodal AI model.
          </p>
        </div>
      </div>
    </header>
  );
};