import React from "react";
import { Progress } from "@/components/ui/progress";

export default function ProcessingState() {
  const [progress, setProgress] = React.useState(15);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const obfuscationSteps = [
    "Analyzing code structure...",
    "Parsing abstract syntax tree...",
    "Identifying variable and function names...",
    "Applying name mangling transformations...",
    "Encrypting string literals...",
    "Flattening control flow graph...",
    "Injecting dead code blocks...",
    "Applying control flow obfuscation...",
    "Executing string encryption algorithms...",
    "Implementing anti-debugging measures...",
    "Finalizing obfuscation process..."
  ];

  // Simulate progress
  React.useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        // Randomly increase by 3-10%
        const increment = Math.floor(Math.random() * 8) + 3;
        const newProgress = prevProgress + increment;
        
        // Cap at 98% to show that we're still processing
        return newProgress > 98 ? 98 : newProgress;
      });
    }, 800);
    
    const stepTimer = setInterval(() => {
      setCurrentStep((prevStep) => {
        // Move to next step or loop back
        return (prevStep + 1) % obfuscationSteps.length;
      });
    }, 1800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="mb-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-700/50 shadow-lg animated-border-gradient">
      <div className="animate-pulse">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-purple-500/30 flex items-center justify-center shadow-glow">
            <i className="fas fa-shield-alt text-gradient bg-gradient-to-r from-purple-400 to-pink-500 text-5xl"></i>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Obfuscating Your Code</h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          We're applying multiple layers of protection to secure your intellectual property.
          This process may take a moment depending on code complexity.
        </p>
        
        <div className="w-full max-w-md mx-auto mt-4 mb-6">
          <div className="progress-bar-gradient mb-2">
            <Progress 
              value={progress} 
              className="h-5 bg-gray-800/80 rounded-full border border-gray-700/50" 
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm font-medium">{progress}% complete</p>
            <p className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-medium">Step {currentStep + 1}/{obfuscationSteps.length}</p>
          </div>
        </div>
        
        <div className="bg-gray-900/50 py-4 px-6 rounded-lg border border-gray-700/50 inline-block min-w-[320px] shadow-md">
          <div className="flex items-center">
            <div className="h-3 w-3 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
            <p className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 text-sm font-mono">
              $ {obfuscationSteps[currentStep]}
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-gray-500 text-sm flex items-center justify-center">
          <i className="fas fa-lock-alt mr-2 text-purple-500"></i>
          Your code never leaves your browser - all processing happens locally
        </div>
      </div>
    </div>
  );
}
