import React, { useState } from 'react';
import { X, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { FileData } from '../types';

interface ImagePreviewProps {
  fileData: FileData;
  onReset: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ fileData, onReset }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle metadata"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative overflow-hidden" style={{ height: '300px' }}>
          <img
            src={fileData.url}
            alt={fileData.name}
            className="w-full h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
          
          {/* Zoom Controls */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1 bg-white/90 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* File Information */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Filename:</span>
            <p className="font-medium text-gray-900 truncate">{fileData.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <p className="font-medium text-gray-900 uppercase">{fileData.type}</p>
          </div>
          <div>
            <span className="text-gray-500">Dimensions:</span>
            <p className="font-medium text-gray-900">{fileData.width} × {fileData.height}</p>
          </div>
          <div>
            <span className="text-gray-500">Size:</span>
            <p className="font-medium text-gray-900">
              {(fileData.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>

        {/* Metadata Toggle */}
        {showMetadata && fileData.metadata && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Metadata</h4>
            <div className="space-y-2 text-xs">
              {fileData.metadata.imageDescription && (
                <div>
                  <span className="text-gray-500">Description:</span>
                  <p className="text-gray-700">{fileData.metadata.imageDescription}</p>
                </div>
              )}
              {fileData.metadata.software && (
                <div>
                  <span className="text-gray-500">Software:</span>
                  <p className="text-gray-700">{fileData.metadata.software}</p>
                </div>
              )}
              {fileData.metadata.pixelScale && (
                <div>
                  <span className="text-gray-500">Pixel Scale:</span>
                  <p className="text-gray-700">
                    {fileData.metadata.pixelScale.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};