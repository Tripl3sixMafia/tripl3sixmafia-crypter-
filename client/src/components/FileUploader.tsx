import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileCode, Shield, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  selectedLanguage: string;
  onFileChange: (file: File | null) => void;
}

export default function FileUploader({ selectedLanguage, onFileChange }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Enhanced executable file type support
  const executableExtensions = [".exe", ".dll", ".bat", ".com", ".sys", ".ocx", ".bin"];
  
  // Additional source file types we can analyze and protect
  const sourceFileExtensions = [
    // .NET/Windows
    ".cs", ".vb", ".fs", 
    // C/C++
    ".c", ".cpp", ".cc", ".h", ".hpp",
    // Scripting
    ".js", ".ts", ".py", ".php", ".rb",
    // Java/Mobile
    ".java", ".kt", ".swift", ".dart",
    // Modern compiled
    ".go", ".rs"
  ];
  
  // All supported file types for upload
  const allSupportedExtensions = [...executableExtensions, ...sourceFileExtensions];

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setFileName(null);
      setFileSize(null);
      onFileChange(null);
      return;
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!allSupportedExtensions.includes(fileExtension)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload an executable or source code file",
        variant: "destructive",
      });
      setFileName(null);
      setFileSize(null);
      onFileChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    onFileChange(file);
    
    // Different toast messages based on file type
    if (executableExtensions.includes(fileExtension)) {
      toast({
        title: "Executable file detected",
        description: "Advanced protection measures will be applied automatically",
      });
    } else if (sourceFileExtensions.includes(fileExtension)) {
      toast({
        title: "Source code detected",
        description: "Code will be analyzed and protected with optimal techniques",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    } else {
      handleFileSelect(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className={`relative ${
          isDragging 
            ? "bg-black/40 backdrop-blur-sm border-2 border-dashed border-red-600 shadow-lg" 
            : fileName 
              ? "bg-black/40 backdrop-blur-sm border border-red-900/30 shadow-md" 
              : "bg-black/40 backdrop-blur-sm border-2 border-dashed border-red-900/30 hover:border-red-600/50 shadow-md hover:shadow-lg"
        } rounded-xl transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Border gradient animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-xl bg-red-600/10 animate-pulse pointer-events-none"></div>
        )}
        
        {fileName ? (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="exe-icon w-16 h-16 rounded-xl flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <FileCode className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-white mb-2 truncate max-w-md">{fileName}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 bg-black/60 px-3 py-1 rounded-full">{fileSize}</span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="pro-badge flex items-center text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    AUTO-PROTECT
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  className="border-red-900/30 hover:border-red-700/50 bg-transparent text-white"
                  onClick={() => {
                    setFileName(null);
                    setFileSize(null);
                    onFileChange(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow-sm"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 exe-icon rounded-2xl flex items-center justify-center mb-8 shadow-glow float-animation">
                <Shield className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Upload Your Executable</h3>
              <p className="text-gray-300 mb-8 max-w-md">
                Drop your executable file here for automatic protection. Our system will implement
                the most effective security measures to shield your file from reverse engineering.
              </p>
              <Button
                className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow py-6 px-8"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                Browse Files
              </Button>
              <p className="mt-8 text-gray-400 text-sm flex items-center">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 mr-2" />
                Executables: {executableExtensions.join(", ")}
              </p>
              <p className="mt-2 text-gray-500 text-xs">
                Source files also supported for advanced compilation & protection
              </p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={allSupportedExtensions.join(",")}
        />
      </div>
    </div>
  );
}
