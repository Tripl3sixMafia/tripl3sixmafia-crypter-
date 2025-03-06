import React, { useState } from "react";
import { ObfuscationResult } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ResultsViewProps {
  result: ObfuscationResult;
}

export default function ResultsView({ result }: ResultsViewProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result.obfuscatedCode).then(() => {
      setCopied(true);
      toast({
        title: "Code copied",
        description: "Obfuscated code has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleDownload = () => {
    // Create blob and trigger download
    const blob = new Blob([result.obfuscatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "obfuscated-code.js"; // Default name, could be customized
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your obfuscated code is being downloaded",
    });
  };
  
  // Get the appropriate color for protection level badges
  const getProtectionLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('high') || lowerLevel.includes('maximum')) return 'bg-red-600/20 text-red-400 border-red-600/30';
    if (lowerLevel.includes('medium')) return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
    if (lowerLevel.includes('low') || lowerLevel.includes('basic')) return 'bg-green-600/20 text-green-400 border-green-600/30';
    return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
  };
  
  return (
    <div className="mb-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-white">Obfuscation Results</h2>
                <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${getProtectionLevelColor(result.protectionLevel)}`}>
                  {result.protectionLevel}
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Your code has been successfully obfuscated and is ready to use</p>
            </div>
            <div className="flex space-x-3">
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                onClick={handleCopy}
              >
                <i className={`fas fa-${copied ? 'check' : 'copy'} mr-2`}></i> {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-md text-sm transition-all"
                onClick={handleDownload}
              >
                <i className="fas fa-download mr-2"></i> Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="text-sm text-gray-300">Obfuscated Output</div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-80" style={{ background: '#0D1117' }}>
              <pre className="font-mono text-gray-300 text-sm whitespace-pre-wrap">
                {result.obfuscatedCode}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Obfuscation Details</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/80 p-4 rounded-lg card-hover">
              <div className="text-gray-400 text-xs mb-1">Original Size</div>
              <div className="text-white text-lg font-semibold">{result.originalSize} bytes</div>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-lg card-hover">
              <div className="text-gray-400 text-xs mb-1">Obfuscated Size</div>
              <div className="text-white text-lg font-semibold">{result.obfuscatedSize} bytes</div>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-lg card-hover">
              <div className="text-gray-400 text-xs mb-1">Size Change</div>
              <div className={`text-lg font-semibold ${result.compressionRatio > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {`${result.compressionRatio > 0 ? '+' : ''}${result.compressionRatio}%`}
              </div>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-lg card-hover">
              <div className="text-gray-400 text-xs mb-1">Techniques Applied</div>
              <div className="text-white text-lg font-semibold">{result.appliedTechniques.length}</div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
            <h4 className="text-white font-medium mb-4">Techniques Applied</h4>
            <div className="flex flex-wrap gap-2">
              {result.appliedTechniques.map((technique, index) => (
                <div key={index} className="bg-gray-800 px-3 py-1.5 rounded-md flex items-center text-sm">
                  <i className="fas fa-shield-alt text-purple-400 mr-2"></i>
                  <span className="text-gray-300">{technique}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
