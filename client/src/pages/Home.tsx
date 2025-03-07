import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileCode, Zap, AlertTriangle } from "lucide-react";
import FileSpoofing, { FileType as SpoofFileType, fileTypeOptions } from "@/components/FileSpoofing";

// Components
import Navbar from "../components/Navbar";
import FileUploader from "../components/FileUploader";
import ObfuscationOptions from "../components/ObfuscationOptions";
import ResultsView from "../components/ResultsView";
import ProcessingState from "../components/ProcessingState";
import AdvancedOptions from "../components/AdvancedOptions";

// Define all interfaces locally to avoid import issues
export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'php' | 'csharp' | 'vbnet' | 'fsharp' | 'powershell' | 'batch' | 'assembly';
export type FileType = 'js' | 'py' | 'java' | 'php' | 'cs' | 'vb' | 'fs' | 'ps1' | 'bat' | 'exe' | 'dll' | 'asm';
export type ObfuscationLevel = 'light' | 'medium' | 'heavy' | 'custom' | 'maximum';

export interface AdditionalProtections {
  antiDebugging: boolean;
  antiDumping: boolean;
  antiVirtualMachine: boolean;
  selfDefending: boolean;
  watermarking: boolean;
  licenseSystem: boolean;
  dllInjection: boolean;
  domainLock: string[];
  customIcon: boolean;
  expirationDate?: string;
  encryptionKey?: string;
}

export interface OutputOptions {
  makeExecutable: boolean;
  targetPlatform: string;
  obfuscationStrength: string;
  includeRuntime: boolean;
  compressionLevel: number;
  hiddenConsole: boolean;
}

export interface ObfuscationOptions {
  level: ObfuscationLevel;
  nameMangling: boolean;
  propertyMangling: boolean;
  stringEncryption: boolean;
  stringSplitting: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
  nativeProtection: boolean;
  resourceEncryption: boolean;
  metadataRemoval: boolean;
  ilToNativeCompilation: boolean;
  antiDecompilation: boolean;
  antitampering: boolean;
  constantsEncryption: boolean;
  autoDetectLanguage: boolean;
  makeExecutable: boolean;
  additional?: AdditionalProtections;
}

export interface ObfuscationResult {
  obfuscatedCode: string;
  originalSize: number;
  obfuscatedSize: number;
  compressionRatio: number;
  protectionLevel: string;
  appliedTechniques: string[];
  outputType?: string;
  isExecutable: boolean;
  downloadUrl?: string;
  protectionScore: number;
  detectionProbability: number;
}

const defaultOptions: ObfuscationOptions = {
  level: 'heavy',
  nameMangling: true,
  propertyMangling: true,
  stringEncryption: true,
  stringSplitting: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  nativeProtection: true,
  resourceEncryption: true,
  metadataRemoval: true,
  ilToNativeCompilation: true,
  antiDecompilation: true,
  antitampering: true,
  constantsEncryption: true,
  autoDetectLanguage: true,
  makeExecutable: true,
  additional: {
    antiDebugging: true,
    antiDumping: true,
    antiVirtualMachine: true,
    selfDefending: true,
    watermarking: false,
    licenseSystem: false,
    dllInjection: false,
    domainLock: [],
    customIcon: false
  }
};

const defaultOutputOptions: OutputOptions = {
  makeExecutable: true,
  targetPlatform: "windows",
  obfuscationStrength: "maximum",
  includeRuntime: true,
  compressionLevel: 9,
  hiddenConsole: false
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [options, setOptions] = useState<ObfuscationOptions>(defaultOptions);
  const [outputOptions, setOutputOptions] = useState<OutputOptions>(defaultOutputOptions);
  const [file, setFile] = useState<File | null>(null);
  const [customIcon, setCustomIcon] = useState<File | null>(null);
  const [result, setResult] = useState<ObfuscationResult | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage | null>(null);
  const [isExecutableFile, setIsExecutableFile] = useState<boolean>(false);
  
  // File spoofing state
  const [spoofingEnabled, setSpoofingEnabled] = useState<boolean>(false);
  const [selectedSpoofType, setSelectedSpoofType] = useState<SpoofFileType | null>(null);
  
  const { toast } = useToast();

  // Function to detect file type and language automatically
  useEffect(() => {
    if (file && options.autoDetectLanguage) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Map file extensions to languages
      const extensionToLanguage: Record<string, SupportedLanguage> = {
        'js': 'javascript',
        'ts': 'javascript',
        'jsx': 'javascript',
        'tsx': 'javascript',
        'py': 'python',
        'java': 'java',
        'php': 'php',
        'cs': 'csharp',
        'vb': 'vbnet',
        'fs': 'fsharp',
        'ps1': 'powershell',
        'bat': 'batch',
        'exe': 'csharp',
        'dll': 'csharp',
        'asm': 'assembly'
      };

      // Detect if file is executable
      const executableExtensions = ['exe', 'dll', 'bat'];
      setIsExecutableFile(extension ? executableExtensions.includes(extension) : false);
      
      if (extension && extension in extensionToLanguage) {
        const detected = extensionToLanguage[extension];
        setDetectedLanguage(detected);
        setSelectedLanguage(detected);
        
        // For executables, automatically enable additional protections
        if (executableExtensions.includes(extension)) {
          setOptions((prev) => ({
            ...prev,
            nativeProtection: true,
            antiDecompilation: true,
            makeExecutable: true,
            additional: {
              ...prev.additional!,
              antiDebugging: true,
              antiDumping: true
            }
          }));
          
          setOutputOptions((prev) => ({
            ...prev,
            makeExecutable: true
          }));
        }
      }
    }
  }, [file, options.autoDetectLanguage]);

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
        description: "Your code has been successfully protected with advanced security measures.",
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

  const handleIconChange = (iconFile: File | null) => {
    setCustomIcon(iconFile);
    
    // Update options to reflect custom icon selection
    if (iconFile) {
      setOptions((prev) => ({
        ...prev,
        additional: {
          ...prev.additional!,
          customIcon: true
        }
      }));
    }
  };

  const handleSpoofingToggle = (enabled: boolean) => {
    setSpoofingEnabled(enabled);
    if (!enabled) {
      setSelectedSpoofType(null);
    }
  };

  const handleSpoofTypeChange = (fileType: SpoofFileType) => {
    setSelectedSpoofType(fileType);
    // If user selects a spoof type, we should use its icon automatically
    const selectedOption = fileTypeOptions.find(opt => opt.type === fileType);
    if (selectedOption) {
      // The icon selection would be handled by the backend
      toast({
        title: "Spoof type selected",
        description: `Your executable will be disguised as a ${selectedOption.name}`,
      });
    }
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
    formData.append("language", detectedLanguage || selectedLanguage);
    formData.append("options", JSON.stringify(options));
    formData.append("outputOptions", JSON.stringify(outputOptions));
    
    if (customIcon && options.additional?.customIcon) {
      formData.append("icon", customIcon);
    }

    // Add file spoofing options if enabled
    if (spoofingEnabled && selectedSpoofType) {
      formData.append("spoofing", "true");
      formData.append("spoofType", selectedSpoofType);
    }

    obfuscationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="px-4 py-8 sm:px-0 mb-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-4">
                <Shield className="h-12 w-12 text-red-600 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-transparent bg-clip-text">
                  DLINQNT SHIELD
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Advanced Executable Protection System
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge variant="outline" className="bg-black/40 text-red-400 border-red-900/50 px-3 py-1">
                  <Lock className="h-3.5 w-3.5 mr-1" /> Automatic Protection
                </Badge>
                <Badge variant="outline" className="bg-black/40 text-red-400 border-red-900/50 px-3 py-1">
                  <FileCode className="h-3.5 w-3.5 mr-1" /> Executable Files
                </Badge>
                <Badge variant="outline" className="bg-black/40 text-red-400 border-red-900/50 px-3 py-1">
                  <Zap className="h-3.5 w-3.5 mr-1" /> Undetectable
                </Badge>
                <Badge variant="outline" className="bg-black/40 text-red-400 border-red-900/50 px-3 py-1">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Anti-Analysis
                </Badge>
              </div>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                Shield your executable files from prying eyes with our sophisticated protection system.
                Simply upload your file and our system will automatically implement optimal security measures.
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-8 border-b border-red-900/30">
            <div className="max-w-5xl mx-auto flex space-x-8 overflow-x-auto">
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "upload" ? "border-red-600 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                onClick={() => setActiveTab("upload")}
              >
                <i className="fas fa-upload mr-2"></i>Upload Executable
              </button>
              {result && (
                <button 
                  className={`py-4 px-1 border-b-2 ${activeTab === "results" ? "border-red-600 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                  onClick={() => setActiveTab("results")}
                >
                  <i className="fas fa-shield-alt mr-2"></i>Protection Results
                </button>
              )}
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "recent" ? "border-red-600 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
                onClick={() => setActiveTab("recent")}
              >
                <i className="fas fa-history mr-2"></i>Recent Jobs
              </button>
              <button 
                className={`py-4 px-1 border-b-2 ${activeTab === "learn" ? "border-red-600 text-white" : "border-transparent text-gray-400 hover:text-gray-300"} font-medium text-sm focus:outline-none whitespace-nowrap`}
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
                <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-900/30 p-6 mb-8 shadow-glow">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-red-500 mr-2" />
                    <h2 className="text-xl font-semibold text-white">Upload Your Executable File</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    Our system will automatically detect and implement the best protection measures for your executable file.
                    Supported file types: .exe, .dll, .bat
                  </p>
                  
                  <FileUploader 
                    selectedLanguage={selectedLanguage}
                    onFileChange={handleFileChange}
                  />
                  
                  {file && (
                    <div className="mt-4 px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg flex items-center">
                      <div className="exe-icon h-10 w-10 flex-shrink-0">
                        <FileCode className="h-6 w-6" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="pro-badge flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          AUTO-PROTECT
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <ObfuscationOptions 
                  options={options} 
                  onChange={setOptions}
                  onObfuscate={handleObfuscate}
                />
                
                {/* File Spoofing Options (New component) */}
                <FileSpoofing
                  enabled={spoofingEnabled}
                  selectedFileType={selectedSpoofType}
                  onToggle={handleSpoofingToggle}
                  onSelectFileType={handleSpoofTypeChange}
                />
                
                {/* Advanced Options */}
                <AdvancedOptions 
                  options={options}
                  outputOptions={outputOptions}
                  onChangeOptions={setOptions}
                  onChangeOutputOptions={setOutputOptions}
                  isExecutableFile={isExecutableFile}
                  onIconSelect={handleIconChange}
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
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-900/30 p-8 shadow-glow text-center">
                <div className="p-4 inline-block bg-red-900/10 rounded-full border border-red-900/20 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Recent Protection Jobs</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any recent protection jobs.
                  <br />Try protecting an executable file first!
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
                    className="border-red-900/30 hover:border-red-700/50 bg-transparent text-red-400"
                  >
                    Upload an Executable
                  </Button>
                  <Button className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow-sm">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === "learn" && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-900/30 p-8 shadow-glow">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-red-500 mr-2" />
                  DLINQNT SHIELD: Advanced Executable Protection
                </h3>
                <p className="text-gray-300 mb-4">
                  DLINQNT SHIELD is a cutting-edge executable protection system designed to make your files completely 
                  undetectable to reverse engineering tools and analysis. Our system automatically implements multiple 
                  layers of sophisticated protection techniques to secure your intellectual property.
                </p>
                
                <h4 className="text-lg font-medium text-white mt-6 mb-3 flex items-center">
                  <Lock className="h-4 w-4 text-red-500 mr-2" />
                  Protection Technologies
                </h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="bg-red-900/20 p-1 rounded mr-3 mt-0.5">
                      <Shield className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium text-white">File Obfuscation & Encryption</span>
                      <p className="text-sm text-gray-400">Makes your executable undecipherable to reverse engineering tools</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-900/20 p-1 rounded mr-3 mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium text-white">Anti-Analysis Protection</span>
                      <p className="text-sm text-gray-400">Detects and prevents debuggers, virtual machines, and sandboxes</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-900/20 p-1 rounded mr-3 mt-0.5">
                      <FileCode className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium text-white">File Disguise & Spoofing</span>
                      <p className="text-sm text-gray-400">Makes your executable appear as other harmless file types like PDFs or images</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-900/20 p-1 rounded mr-3 mt-0.5">
                      <Zap className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium text-white">Runtime Protection</span>
                      <p className="text-sm text-gray-400">Self-defending mechanisms that activate during execution</p>
                    </div>
                  </li>
                </ul>
                
                <h4 className="text-lg font-medium text-white mt-8 mb-3 flex items-center">
                  <Zap className="h-4 w-4 text-red-500 mr-2" />
                  How It Works
                </h4>
                <p className="text-gray-300 mb-6">
                  Our system analyzes your executable and automatically implements the most effective protection
                  strategies for your specific file. We use advanced techniques like polymorphic encryption, 
                  anti-debug traps, and code virtualization to ensure maximum security.
                </p>
                
                <div className="bg-black/30 border border-red-900/20 rounded-lg p-4 mt-6">
                  <h5 className="text-white font-medium flex items-center">
                    <FileCode className="h-4 w-4 text-red-500 mr-2" />New: File Spoofing Technology
                  </h5>
                  <p className="text-sm text-gray-400 mt-2">
                    Our latest feature allows you to disguise your executable as other file types (PDF, images, documents)
                    to maintain complete stealth. The file keeps full functionality while appearing as something else entirely.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}