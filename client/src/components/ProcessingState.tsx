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
    <div className="mb-6 bg-secondary rounded-lg p-6 text-center">
      <div className="animate-pulse">
        <i className="fas fa-cog fa-spin text-4xl text-accent mb-4"></i>
        <h3 className="text-lg font-medium text-white mb-2">Processing Your Code...</h3>
        <p className="text-gray-400">This may take a moment depending on file size and complexity.</p>
        <div className="w-full mt-4">
          <Progress value={progress} className="h-2.5 bg-gray-700" indicatorClassName="bg-accent" />
        </div>
      </div>
    </div>
  );
}
