import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { FileData } from '../types';
import { processImageFile, processTiffFile } from '../utils/fileProcessors';

interface FileUploadProps {
  onFileUpload: (fileData: FileData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      const fileExtension = file.name.toLowerCase().split('.').pop();
      let fileData: FileData;

      if (fileExtension === 'tif' || fileExtension === 'tiff') {
        fileData = await processTiffFile(file);
      } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
        fileData = await processImageFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload .tif, .tiff, .jpg, .jpeg, or .png files.');
      }

      onFileUpload(fileData);
      setUploadStatus('success');
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'success':
        return 'File uploaded successfully!';
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Geospatial Data</h2>
        <p className="text-sm text-gray-600">
          Drag and drop your files or click to browse. Supports .tif, .tiff, .jpg, .jpeg, and .png formats.
        </p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".tif,.tiff,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-3 rounded-full transition-colors duration-300
            ${isDragOver ? 'bg-primary-100' : 'bg-gray-100'}
          `}>
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileImage className={`w-8 h-8 ${isDragOver ? 'text-primary-600' : 'text-gray-400'}`} />
            )}
          </div>

          <div>
            <p className={`text-lg font-medium ${isDragOver ? 'text-primary-700' : 'text-gray-700'}`}>
              {isProcessing ? 'Processing file...' : 'Drop your files here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <span className="text-primary-600 font-medium">browse</span> to choose files
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Supported formats:</span>
            <div className="flex space-x-1">
              {['.TIF', '.TIFF', '.JPG', '.JPEG', '.PNG'].map((format) => (
                <span key={format} className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        {uploadStatus !== 'idle' && (
          <div className={`
            absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${uploadStatus === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}
          `}>
            {getStatusIcon()}
            <span>{getStatusMessage()}</span>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Maximum file size: 100MB</p>
        <p>• For best results, use high-resolution images (≥1024×1024)</p>
        <p>• GeoTIFF files will preserve spatial reference information</p>
      </div>
    </div>
  );
};