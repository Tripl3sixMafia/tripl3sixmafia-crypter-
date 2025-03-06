import React from "react";
import { Progress } from "@/components/ui/progress";

export default function ProcessingState() {
  const [progress, setProgress] = React.useState(15);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const obfuscationSteps = [
    "Analyzing code structure...",
    "Identifying variable and function names...",
    "Applying name mangling...",
    "Encrypting string literals...",
    "Flattening control flow...",
    "Injecting dead code...",
    "Finalizing obfuscation..."
  ];

  // Simulate progress
  React.useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        // Randomly increase by 5-15%
        const increment = Math.floor(Math.random() * 8) + 3;
        const newProgress = prevProgress + increment;
        
        // Cap at 95% to show that we're still processing
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 800);
    
    const stepTimer = setInterval(() => {
      setCurrentStep((prevStep) => {
        // Move to next step or loop back
        return (prevStep + 1) % obfuscationSteps.length;
      });
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="mb-8 bg-gray-800 rounded-lg p-10 text-center border border-gray-700 shadow-lg">
      <div className="animate-pulse">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
            <i className="fas fa-shield-alt text-gradient bg-gradient-to-r from-purple-500 to-pink-500 text-5xl"></i>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-3">Obfuscating Your Code</h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          We're applying multiple layers of protection to secure your intellectual property.
          This may take a moment depending on code complexity.
        </p>
        
        <div className="w-full max-w-md mx-auto mt-4 mb-6">
          <div className="progress-bar-gradient mb-2">
            <Progress 
              value={progress} 
              className="h-4 bg-gray-700 rounded-full" 
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">{progress}% complete</p>
            <p className="text-purple-400 text-sm font-medium">Step {currentStep + 1}/{obfuscationSteps.length}</p>
          </div>
        </div>
        
        <div className="bg-gray-900/50 py-3 px-5 rounded-lg border border-gray-700 inline-block min-w-[300px]">
          <p className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-mono">
            $ {obfuscationSteps[currentStep]}
          </p>
        </div>
        
        <div className="mt-8 text-gray-500 text-sm">
          <i className="fas fa-info-circle mr-2"></i>
          Your code never leaves your browser - all processing happens locally
        </div>
      </div>
    </div>
  );
}
