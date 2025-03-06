import React, { useState, useRef } from "react";
import { SupportedLanguage } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  selectedLanguage: SupportedLanguage;
  onFileChange: (file: File | null) => void;
}

export default function FileUploader({ selectedLanguage, onFileChange }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileExtensionMap: Record<SupportedLanguage, string[]> = {
    javascript: [".js", ".jsx", ".ts", ".tsx"],
    python: [".py", ".pyw"],
    java: [".java"],
    php: [".php"],
    csharp: [".cs"],
  };

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
    const validExtensions = fileExtensionMap[selectedLanguage];
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${selectedLanguage} file (${validExtensions.join(", ")})`,
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

  // Get icon based on file extension
  const getFileIcon = (): string => {
    if (!fileName) return "fas fa-file-upload";
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'js' || extension === 'jsx' || extension === 'ts' || extension === 'tsx') return "fab fa-js";
    if (extension === 'py' || extension === 'pyw') return "fab fa-python";
    if (extension === 'java') return "fab fa-java";
    if (extension === 'php') return "fab fa-php";
    if (extension === 'cs') return "fas fa-hashtag";
    
    return "fas fa-file-code";
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
        <i className="fas fa-file-code text-gradient bg-gradient-to-r from-purple-400 to-pink-500 mr-3"></i>
        Upload Your Code
      </h2>
      <div 
        className={`relative ${
          isDragging 
            ? "bg-gray-800/40 backdrop-blur-sm border-2 border-dashed border-purple-500 shadow-lg" 
            : fileName 
              ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/80 shadow-md" 
              : "bg-gray-800/40 backdrop-blur-sm border-2 border-dashed border-gray-600 hover:border-purple-500/60 shadow-md hover:shadow-lg"
        } rounded-xl transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Border gradient animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-xl bg-purple-500/10 animate-pulse pointer-events-none"></div>
        )}
        
        {fileName ? (
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center mb-4 md:mb-0 md:mr-6 shadow-glow">
                <i className={`${getFileIcon()} text-3xl text-gradient bg-gradient-to-r from-purple-400 to-pink-500`}></i>
              </div>
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-white mb-2 truncate max-w-md">{fileName}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 bg-gray-800/60 px-3 py-1 rounded-full">{fileSize}</span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-sm text-gradient bg-gradient-to-r from-purple-400 to-pink-400 font-medium">{selectedLanguage}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 border border-gray-700 hover:border-gray-600"
                  onClick={() => {
                    setFileName(null);
                    setFileSize(null);
                    onFileChange(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <i className="fas fa-trash-alt mr-2"></i> Remove
                </button>
                <button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <i className="fas fa-exchange-alt mr-2"></i> Change
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-8 border border-gray-700/50 shadow-glow float-animation">
                <i className="fas fa-cloud-upload-alt text-4xl text-gradient bg-gradient-to-r from-purple-400 to-pink-500"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Drag & Drop Your Code</h3>
              <p className="text-gray-300 mb-8 max-w-md">
                Upload your {selectedLanguage} source code to obfuscate and protect it from reverse engineering
              </p>
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-8 rounded-lg text-sm shadow-glow transition-all duration-200"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <i className="fas fa-file-upload mr-2"></i> Browse Files
              </button>
              <p className="mt-8 text-gray-500 text-sm flex items-center">
                <i className="fas fa-info-circle mr-2 text-purple-500"></i>
                Supported formats: {fileExtensionMap[selectedLanguage].join(", ")}
              </p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={fileExtensionMap[selectedLanguage].join(",")}
        />
      </div>
    </div>
  );
}
