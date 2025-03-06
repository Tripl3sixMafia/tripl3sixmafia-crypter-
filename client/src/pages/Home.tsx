import React from "react";
import Navbar from "@/components/Navbar";
import LanguageSelector from "@/components/LanguageSelector";
import FileUploader from "@/components/FileUploader";
import ObfuscationOptions from "@/components/ObfuscationOptions";
import ProcessingState from "@/components/ProcessingState";
import ResultsView from "@/components/ResultsView";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'php' | 'csharp';
export type ObfuscationLevel = 'light' | 'medium' | 'heavy' | 'custom';

export interface ObfuscationOptions {
  level: ObfuscationLevel;
  nameMangling: boolean;
  propertyMangling: boolean;
  stringEncryption: boolean;
  stringSplitting: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
}

export interface ObfuscationResult {
  obfuscatedCode: string;
  originalSize: number;
  obfuscatedSize: number;
  compressionRatio: number;
  protectionLevel: string;
  appliedTechniques: string[];
}

const defaultOptions: ObfuscationOptions = {
  level: 'medium',
  nameMangling: true,
  propertyMangling: true,
  stringEncryption: true,
  stringSplitting: false,
  controlFlowFlattening: true,
  deadCodeInjection: false
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [options, setOptions] = useState<ObfuscationOptions>(defaultOptions);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ObfuscationResult | null>(null);
  const { toast } = useToast();

  const obfuscationMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/obfuscate", formData);
      return response.json();
    },
    onSuccess: (data: ObfuscationResult) => {
      setResult(data);
      toast({
        title: "Obfuscation complete",
        description: "Your code has been successfully obfuscated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Obfuscation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (file: File | null) => {
    setFile(file);
    // Reset result when a new file is uploaded
    setResult(null);
  };

  const handleObfuscate = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to obfuscate.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", selectedLanguage);
    formData.append("options", JSON.stringify(options));

    obfuscationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Protect Your Code from Prying Eyes</h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Professional-grade code obfuscation that makes your source code nearly impossible to reverse-engineer.
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-700">
            <div className="max-w-5xl mx-auto px-4 flex space-x-8">
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "upload" ? "border-accent text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none`}
                onClick={() => setActiveTab("upload")}
              >
                <i className="fas fa-upload mr-2"></i>Upload & Obfuscate
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "recent" ? "border-accent text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none`}
                onClick={() => setActiveTab("recent")}
              >
                <i className="fas fa-history mr-2"></i>Recent Jobs
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "learn" ? "border-accent text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none`}
                onClick={() => setActiveTab("learn")}
              >
                <i className="fas fa-book mr-2"></i>Learn
              </button>
            </div>
          </div>
          
          {/* Main Content Based on Active Tab */}
          <div className="max-w-5xl mx-auto px-4">
            {activeTab === "upload" && (
              <>
                <LanguageSelector 
                  selectedLanguage={selectedLanguage} 
                  onSelectLanguage={setSelectedLanguage} 
                />
                
                <FileUploader 
                  selectedLanguage={selectedLanguage}
                  onFileChange={handleFileChange}
                />
                
                <ObfuscationOptions 
                  options={options} 
                  onChange={setOptions}
                  onObfuscate={handleObfuscate}
                />
                
                {obfuscationMutation.isPending && (
                  <ProcessingState />
                )}
                
                {result && !obfuscationMutation.isPending && (
                  <ResultsView result={result} />
                )}
              </>
            )}
            
            {activeTab === "recent" && (
              <div className="bg-secondary rounded-lg p-6 text-center">
                <i className="fas fa-history text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-lg font-medium text-white mb-2">Recent Jobs</h3>
                <p className="text-gray-400">Your recent obfuscation jobs will appear here.</p>
              </div>
            )}
            
            {activeTab === "learn" && (
              <div className="bg-secondary rounded-lg p-6 text-center">
                <i className="fas fa-book text-4xl text-gray-500 mb-4"></i>
                <h3 className="text-lg font-medium text-white mb-2">Learning Resources</h3>
                <p className="text-gray-400">Educational content about code obfuscation will appear here.</p>
              </div>
            )}
          </div>
          
          <InfoSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
