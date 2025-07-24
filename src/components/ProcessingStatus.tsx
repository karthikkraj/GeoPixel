import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ProcessingState } from '../types';

interface ProcessingStatusProps {
  state: ProcessingState;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ state }) => {
  if (state === 'idle') return null;

  const getStatusConfig = () => {
    switch (state) {
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          title: 'Processing Image',
          message: 'GeoPixel is analyzing your geospatial data...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          title: 'Analysis Complete',
          message: 'Feature extraction completed successfully!',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          textColor: 'text-success-800'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'Processing Failed',
          message: 'An error occurred during feature extraction. Please try again.',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          textColor: 'text-error-800'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`
      card animate-slide-up
      ${config.bgColor} ${config.borderColor} ${config.textColor}
    `}>
      <div className="flex items-center space-x-3">
        {config.icon}
        <div>
          <h4 className="font-semibold">{config.title}</h4>
          <p className="text-sm opacity-90">{config.message}</p>
        </div>
      </div>

      {state === 'processing' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>Analyzing features...</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};