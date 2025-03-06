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
      <h2 className="text-xl font-semibold text-white mb-5">Upload Your Code</h2>
      <div 
        className={`relative ${
          isDragging 
            ? "bg-gray-800 border-2 border-dashed border-purple-500" 
            : fileName 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-gray-800/60 border-2 border-dashed border-gray-700 hover:border-gray-500"
        } rounded-lg transition-all duration-200`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Border gradient animation when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-lg bg-purple-500/10 pointer-events-none"></div>
        )}
        
        {fileName ? (
          <div className="p-8">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center mr-5">
                <i className={`${getFileIcon()} text-3xl text-gradient bg-gradient-to-r from-purple-500 to-pink-500`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 truncate max-w-md">{fileName}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">{fileSize}</span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-sm text-purple-400">{selectedLanguage}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-md text-sm transition-all"
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
          <div className="p-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-700/70 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-cloud-upload-alt text-4xl text-gradient bg-gradient-to-r from-purple-500 to-pink-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Drag & Drop Your Code</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Upload your {selectedLanguage} source code to obfuscate and protect
              </p>
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-8 rounded-md text-sm shadow-lg transition-all"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <i className="fas fa-file-upload mr-2"></i> Browse Files
              </button>
              <p className="mt-6 text-gray-500 text-sm">
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
