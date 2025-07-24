import React from 'react';
import { Github, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">About GeoPixel</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              The first large multimodal model explicitly designed for high-resolution 
              remote sensing image comprehension and pixel-level grounding.
            </p>
            <div className="flex items-center space-x-2 mt-3">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">ICML 2025 Accepted</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
            <div className="space-y-2">
              <a
                href="https://arxiv.org/abs/2501.13925"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Research Paper</span>
              </a>
              <a
                href="https://github.com/mbzuai-oryx/GeoPixel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="w-3 h-3" />
                <span>GitHub Repository</span>
              </a>
              <a
                href="https://huggingface.co/collections/MBZUAI/geopixel-67b6e1e441250814d06f2043"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>HuggingFace Models</span>
              </a>
            </div>
          </div>

          {/* Institution */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Institution</h4>
            <p className="text-sm text-gray-600">
              Mohamed bin Zayed University of Artificial Intelligence
            </p>
            <p className="text-sm text-gray-600 mt-1">
              The University of Western Australia
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Linköping University
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 MBZUAI. Licensed under Apache License 2.0.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Powered by GeoPixel AI</span>
              <span>•</span>
              <span>Built with React & TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};