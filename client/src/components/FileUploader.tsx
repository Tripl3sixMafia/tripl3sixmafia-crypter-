import React, { useState, useRef } from "react";
import { SupportedLanguage } from "@/pages/Home";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  selectedLanguage: SupportedLanguage;
  onFileChange: (file: File | null) => void;
}

export default function FileUploader({ selectedLanguage, onFileChange }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
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

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setFileName(null);
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
      onFileChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFileName(file.name);
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

  return (
    <div className="mb-6">
      <div 
        className={`relative ${isDragging ? "bg-accent/10" : "bg-secondary"} rounded-lg p-6 text-center border-2 ${isDragging ? "border-accent" : "border-gray-700"} transition-all`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Border gradient effect */}
        <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-accent via-purple-500 to-pink-500 opacity-30 pointer-events-none"></div>
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <i className="fas fa-file-code text-4xl text-accent mb-3"></i>
            <h3 className="text-lg font-medium text-white mb-2">{fileName}</h3>
            <div className="flex space-x-3 mt-2">
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded text-sm"
                onClick={() => {
                  setFileName(null);
                  onFileChange(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <i className="fas fa-times mr-1"></i> Remove
              </button>
              <button 
                className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded text-sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <i className="fas fa-exchange-alt mr-1"></i> Change
              </button>
            </div>
          </div>
        ) : (
          <>
            <i className="fas fa-file-upload text-5xl text-gray-500 mb-3"></i>
            <h3 className="text-lg font-medium text-white mb-2">Drag & Drop Your Code File</h3>
            <p className="text-gray-400 mb-4">or click to browse</p>
            <button
              className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded cursor-pointer"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              Select File
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Supported formats: {fileExtensionMap[selectedLanguage].join(", ")}
            </p>
          </>
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
