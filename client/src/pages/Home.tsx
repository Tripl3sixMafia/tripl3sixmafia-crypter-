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
      setActiveTab("results");
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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="px-4 py-6 sm:px-0 mb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-4">
                Code Obfuscation Made Simple
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Protect your source code from theft and reverse engineering with our powerful obfuscation tool.
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-8 border-b border-gray-800">
            <div className="max-w-5xl mx-auto flex space-x-8 overflow-x-auto">
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "upload" ? "border-purple-500 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                onClick={() => setActiveTab("upload")}
              >
                <i className="fas fa-upload mr-2"></i>Upload Code
              </button>
              {result && (
                <button 
                  className={`py-4 px-1 border-b-2 ${activeTab === "results" ? "border-purple-500 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                  onClick={() => setActiveTab("results")}
                >
                  <i className="fas fa-code mr-2"></i>Obfuscated Result
                </button>
              )}
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "recent" ? "border-purple-500 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                onClick={() => setActiveTab("recent")}
              >
                <i className="fas fa-history mr-2"></i>Recent Jobs
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "learn" ? "border-purple-500 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                onClick={() => setActiveTab("learn")}
              >
                <i className="fas fa-book mr-2"></i>Learn More
              </button>
            </div>
          </div>
          
          {/* Main Content Based on Active Tab */}
          <div className="max-w-5xl mx-auto">
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
              </>
            )}
            
            {activeTab === "results" && result && (
              <ResultsView result={result} />
            )}
            
            {activeTab === "recent" && (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="text-4xl text-gray-500 mb-4">
                  <i className="fas fa-history"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Recent Obfuscation Jobs</h3>
                <p className="text-gray-400">
                  You don't have any recent obfuscation jobs.
                  <br />Try obfuscating a file first!
                </p>
              </div>
            )}
            
            {activeTab === "learn" && (
              <div className="bg-gray-800 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-white mb-4">What is Code Obfuscation?</h3>
                <p className="text-gray-300 mb-4">
                  Code obfuscation is the process of deliberately making your source code difficult to understand
                  while preserving its functionality. It's a crucial technique for protecting proprietary algorithms,
                  preventing reverse engineering, and securing your intellectual property.
                </p>
                
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Why Obfuscate Your Code?</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Protect proprietary algorithms and business logic</li>
                  <li>Prevent unauthorized access to your source code</li>
                  <li>Make reverse engineering significantly more difficult</li>
                  <li>Add an extra layer of security to your applications</li>
                  <li>Comply with security requirements in enterprise environments</li>
                </ul>
                
                <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-2">
                    <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
                    Pro Tip
                  </h4>
                  <p className="text-gray-300">
                    For maximum protection, combine code obfuscation with other security measures like 
                    encryption, code signing, and regular security audits.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {(activeTab === "upload" || activeTab === "results") && <InfoSection />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
