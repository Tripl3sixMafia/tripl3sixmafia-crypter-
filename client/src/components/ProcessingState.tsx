import React from "react";
import { Progress } from "@/components/ui/progress";

export default function ProcessingState() {
  const [progress, setProgress] = React.useState(15);

  // Simulate progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        // Randomly increase by 5-15%
        const increment = Math.floor(Math.random() * 10) + 5;
        const newProgress = prevProgress + increment;
        
        // Cap at 95% to show that we're still processing
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 600);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="mb-8 bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
      <div className="animate-pulse">
        <div className="text-purple-500 text-5xl mb-6">
          <i className="fas fa-cog fa-spin"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Obfuscating Your Code...</h3>
        <p className="text-gray-300 mb-6">
          We're applying multiple layers of protection to your code.
          This may take a moment depending on file size and complexity.
        </p>
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="progress-bar-gradient">
            <Progress 
              value={progress} 
              className="h-3 bg-gray-700" 
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
}
