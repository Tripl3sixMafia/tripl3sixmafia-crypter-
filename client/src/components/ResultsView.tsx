import React, { useState, useEffect } from "react";
import type { ObfuscationResult } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResultsViewProps {
  result: ObfuscationResult;
}

export default function ResultsView({ result }: ResultsViewProps) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [showDownload, setShowDownload] = useState(false);
  
  useEffect(() => {
    // Simulate a loading effect that completes in 3 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 3;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowDownload(true), 500);
          return 100;
        }
        return newProgress;
      });
    }, 90); // Increment progress about every 90ms

    return () => clearInterval(interval);
  }, []);
  
  const handleDownload = () => {
    // Create blob and trigger download
    const blob = new Blob([result.obfuscatedCode], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "obfuscated-executable.exe"; // Download as .exe file
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your protected executable is being downloaded",
    });
  };
  
  return (
    <div className="mb-8">
      <div className="bg-black/70 rounded-xl border border-red-900/30 shadow-glow">
        <div className="p-6 border-b border-red-900/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">Obfuscation Results</h2>
                <div className="ml-3 px-3 py-1 rounded-full text-xs font-medium border bg-red-900/30 text-red-400 border-red-800/50">
                  {result.protectionLevel}
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Your executable has been successfully protected with advanced techniques</p>
            </div>
          </div>
          
          <div className="bg-black/80 rounded-lg overflow-hidden border border-red-900/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Lock className="text-red-500 h-5 w-5 mr-2" />
                <div className="text-md text-white font-semibold">Protection Process</div>
              </div>
              <div className="text-red-400 text-sm font-medium">
                {progress < 100 ? `${Math.round(progress)}% Complete` : "Protection Complete"}
              </div>
            </div>
            
            <Progress value={progress} className="mb-6" />
            
            {showDownload ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="mb-3 text-lg text-white flex items-center">
                  <Check className="h-5 w-5 text-red-500 mr-2" />
                  Protection process complete
                </div>
                <p className="text-gray-400 text-sm mb-6 text-center max-w-lg">
                  Your executable has been successfully protected with all selected security measures. 
                  It is now ready for download and deployment.
                </p>
                <Button
                  className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white 
                           border border-red-700/50 shadow-glow-sm px-6 py-5"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download Protected Executable
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-red-400 text-center">
                  Applying protection layers and securing your executable...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center">
            <Shield className="h-5 w-5 text-red-500 mr-2" />
            Protection Details
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/80 p-4 rounded-lg border border-red-900/20 shadow-glow-sm">
              <div className="text-gray-400 text-xs mb-1">Original Size</div>
              <div className="text-white text-lg font-semibold">{result.originalSize} bytes</div>
            </div>
            <div className="bg-black/80 p-4 rounded-lg border border-red-900/20 shadow-glow-sm">
              <div className="text-gray-400 text-xs mb-1">Protected Size</div>
              <div className="text-white text-lg font-semibold">{result.obfuscatedSize} bytes</div>
            </div>
            <div className="bg-black/80 p-4 rounded-lg border border-red-900/20 shadow-glow-sm">
              <div className="text-gray-400 text-xs mb-1">Size Change</div>
              <div className={`text-lg font-semibold ${result.compressionRatio > 0 ? 'text-red-400' : 'text-red-400'}`}>
                {`${result.compressionRatio > 0 ? '+' : ''}${result.compressionRatio}%`}
              </div>
            </div>
            <div className="bg-black/80 p-4 rounded-lg border border-red-900/20 shadow-glow-sm">
              <div className="text-gray-400 text-xs mb-1">Techniques Applied</div>
              <div className="text-white text-lg font-semibold">{result.appliedTechniques.length}</div>
            </div>
          </div>
          
          <div className="bg-black/90 rounded-lg p-5 border border-red-900/30 shadow-glow-sm">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Shield className="h-4 w-4 text-red-500 mr-2" />
              Protection Techniques Applied
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.appliedTechniques.map((technique: string, index: number) => (
                <div key={index} className="bg-black px-3 py-1.5 rounded-md flex items-center text-sm border border-red-900/30">
                  <Lock className="text-red-500 h-3 w-3 mr-2" />
                  <span className="text-white">{technique}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
