import React, { useState } from "react";
import { ObfuscationResult } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";

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
  
  return (
    <div className="mb-6">
      <div className="bg-secondary rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Obfuscated Code</h3>
          <div className="flex space-x-2">
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              onClick={handleCopy}
            >
              <i className={`fas fa-${copied ? 'check' : 'copy'} mr-1`}></i> {copied ? 'Copied' : 'Copy'}
            </button>
            <button 
              className="bg-accent hover:bg-accent/90 text-white px-3 py-1 rounded text-sm"
              onClick={handleDownload}
            >
              <i className="fas fa-download mr-1"></i> Download
            </button>
          </div>
        </div>
        
        <div className="bg-[#0D1117] rounded-lg p-4 overflow-auto max-h-80">
          <pre className="font-mono text-gray-300 text-sm whitespace-pre-wrap">
            {result.obfuscatedCode}
          </pre>
        </div>

        <div className="mt-6">
          <h4 className="text-md font-medium text-white mb-3">Obfuscation Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-gray-400 text-xs">Original Size</div>
              <div className="text-white font-medium">{result.originalSize} B</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-gray-400 text-xs">Obfuscated Size</div>
              <div className="text-white font-medium">{result.obfuscatedSize} B</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-gray-400 text-xs">Compression</div>
              <div className="text-white font-medium">{`${result.compressionRatio > 0 ? '+' : ''}${result.compressionRatio}%`}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-gray-400 text-xs">Protection Level</div>
              <div className="text-accent font-medium">{result.protectionLevel}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h4 className="text-md font-medium text-white mb-3">Applied Techniques</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.appliedTechniques.map((technique, index) => (
              <div className="flex items-start" key={index}>
                <div className="flex-shrink-0 h-5 w-5 text-green-400">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-300">{technique}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
