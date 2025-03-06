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
    <div className="mb-8">
      <div 
        className={`relative ${
          isDragging 
            ? "bg-gray-800/70 border-purple-500/70" 
            : "bg-gray-800 border-gray-700 hover:border-gray-600"
        } rounded-lg p-10 text-center border-2 transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Border gradient effect when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 pointer-events-none"></div>
        )}
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <i className="fas fa-file-code text-4xl text-purple-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{fileName}</h3>
            <p className="text-gray-400 mb-5">Ready to be obfuscated</p>
            <div className="flex space-x-3 mt-2">
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-150"
                onClick={() => {
                  setFileName(null);
                  onFileChange(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <i className="fas fa-times mr-2"></i> Remove
              </button>
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-150"
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
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-6">
              <i className="fas fa-file-upload text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Drag & Drop Your Code File</h3>
            <p className="text-gray-300 mb-6">or select a file from your computer</p>
            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-md transition duration-150"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <i className="fas fa-upload mr-2"></i> Select File
            </button>
            <p className="mt-6 text-gray-500">
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
