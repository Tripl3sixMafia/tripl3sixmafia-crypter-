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
export type SupportedLanguage = 
  'javascript' | 'typescript' | 'python' | 'java' | 'php' | 'csharp' | 'cpp' | 'c' | 
  'ruby' | 'go' | 'rust' | 'swift' | 'kotlin' | 'dart' | 'vbnet' | 'fsharp' | 
  'powershell' | 'batch' | 'assembly';
export type FileType = 'js' | 'ts' | 'py' | 'java' | 'php' | 'cs' | 'cpp' | 'c' | 
  'rb' | 'go' | 'rs' | 'swift' | 'kt' | 'dart' | 'vb' | 'fs' | 'ps1' | 'bat' | 
  'exe' | 'dll' | 'asm';
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

  // Function to detect file type and language automatically with enhanced executable detection
  useEffect(() => {
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Map file extensions to languages
      const extensionToLanguage: Record<string, SupportedLanguage> = {
        // JavaScript/TypeScript
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'mjs': 'javascript',
        
        // Web languages
        'py': 'python',
        'java': 'java',
        'php': 'php',
        
        // .NET languages
        'cs': 'csharp',
        'vb': 'vbnet',
        'fs': 'fsharp',
        
        // C/C++ variants
        'c': 'c',
        'cpp': 'cpp',
        'cc': 'cpp',
        'h': 'c',
        'hpp': 'cpp',
        
        // Mobile development
        'swift': 'swift',
        'kt': 'kotlin',
        'dart': 'dart',
        
        // Modern languages
        'go': 'go',
        'rs': 'rust',
        'rb': 'ruby',
        
        // Scripts
        'ps1': 'powershell',
        'bat': 'batch',
        'sh': 'batch',
        
        // Binaries
        'exe': 'csharp',
        'dll': 'csharp',
        'asm': 'assembly'
      };

      // Detect if file is executable
      const executableExtensions = ['exe', 'dll', 'bat', 'com', 'sys', 'bin', 'ocx'];
      const isExe = extension ? executableExtensions.includes(extension) : false;
      setIsExecutableFile(isExe);
      
      // Enhanced executable detection - check file size and magic bytes
      // This is a simplified version - in production, you'd analyze the file header bytes
      const isLikelyExecutable = isExe || file.size > 20000;
      
      if (extension && extension in extensionToLanguage) {
        const detected = extensionToLanguage[extension];
        setDetectedLanguage(detected);
        setSelectedLanguage(detected);
        
        // Toast notification for successful detection
        toast({
          title: "Language detected",
          description: `Detected ${detected} from file extension .${extension}`,
        });
      } else if (isLikelyExecutable) {
        // Default to C# for unknown executables
        setDetectedLanguage('csharp');
        setSelectedLanguage('csharp');
        
        toast({
          title: "Executable detected",
          description: "Optimal protection settings applied automatically",
        });
      }
      
      // For executables, automatically enable all relevant protections
      if (isLikelyExecutable) {
        setOptions((prev) => ({
          ...prev,
          level: 'maximum',
          nativeProtection: true,
          antiDecompilation: true,
          makeExecutable: true,
          stringEncryption: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
          ilToNativeCompilation: true,
          antitampering: true,
          additional: {
            ...prev.additional!,
            antiDebugging: true,
            antiDumping: true,
            antiVirtualMachine: true,
            selfDefending: true,
            customIcon: false
          }
        }));
        
        setOutputOptions((prev) => ({
          ...prev,
          makeExecutable: true,
          obfuscationStrength: "maximum",
          includeRuntime: true,
          compressionLevel: 9
        }));
      }
    }
  }, [file, toast]);

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

    console.log("File being submitted:", file.name, file.type, file.size);
    
    const formData = new FormData();
    // Ensure the file is appended with the correct field name (must match what the server expects)
    formData.append("file", file, file.name);
    formData.append("language", detectedLanguage || selectedLanguage);
    formData.append("options", JSON.stringify(options));
    formData.append("outputOptions", JSON.stringify(outputOptions));
    
    // Debug the form data
    console.log("File appended to FormData");
    console.log("Language:", detectedLanguage || selectedLanguage);
    
    if (customIcon && options.additional?.customIcon) {
      formData.append("icon", customIcon, customIcon.name);
      console.log("Icon appended:", customIcon.name);
    }

    // Add file spoofing options if enabled
    if (spoofingEnabled && selectedSpoofType) {
      formData.append("spoofing", "true");
      formData.append("spoofType", selectedSpoofType);
      console.log("File spoofing enabled:", selectedSpoofType);
    }

    // Submit the form data
    toast({
      title: "Processing file",
      description: "Sending " + file.name + " for obfuscation...",
    });
    
    obfuscationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          <div className="px-4 py-12 sm:px-0 mb-8 bg-black/30 border-y border-red-900/30">
            <div className="text-center">
              <div className="mb-8">
                <img src="/images/logo.svg" alt="3-6 Logo" className="w-40 h-40 mx-auto mb-5" />
              </div>
              <div className="relative mb-6">
                <h1 className="text-5xl md:text-7xl font-bold text-graffiti text-white mb-2 text-street">
                  TRIPL3SIXMAFIA <span className="bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-transparent bg-clip-text">CRYPTER</span>
                </h1>
                <div className="text-sm tracking-widest text-red-400 opacity-80 font-bold -mt-1 mb-3 uppercase">
                  Most Known Unknown | 3-6 Mafia
                </div>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
                  Next-Gen Executable Protection System
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="outline" className="bg-black/50 text-red-400 border-red-900/50 px-4 py-1.5 text-sm">
                  <Lock className="h-4 w-4 mr-1.5" /> Anti-Detection
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-red-400 border-red-900/50 px-4 py-1.5 text-sm">
                  <FileCode className="h-4 w-4 mr-1.5" /> File Spoofing
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-red-400 border-red-900/50 px-4 py-1.5 text-sm">
                  <Zap className="h-4 w-4 mr-1.5" /> VM Evasion
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-red-400 border-red-900/50 px-4 py-1.5 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1.5" /> Registry Mods
                </Badge>
              </div>
              
              <div className="max-w-3xl mx-auto px-5 py-4 bg-gradient-to-r from-black/70 to-black/80 border-l-4 border-red-700 rounded-r-lg shadow-glow-sm">
                <p className="text-base text-gray-300">
                  Protect your executables with industry-leading techniques used by the pros.
                  Our system detects file types automatically and implements the most effective protection.
                </p>
              </div>
              
              <div className="mt-8 mb-2">
                <Button 
                  onClick={() => document.getElementById('upload-section')?.scrollIntoView({behavior: 'smooth'})}
                  size="lg"
                  className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-glow-md animate-pulse"
                >
                  START PROTECTING NOW
                </Button>
              </div>
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
                <div id="upload-section" className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-900/30 p-6 mb-8 shadow-glow">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-red-500 mr-2" />
                    <h2 className="text-xl font-semibold text-white gangster-font">DROP YA FILES HERE</h2>
                  </div>
                  <p className="text-gray-300 text-sm mb-6 border-l-2 border-red-800/50 pl-3">
                    We keep your code locked down tight. No more reverse engineering. 
                    Just drop your executable right here, and we'll make that sh*t untouchable.
                    <span className="block mt-2 text-red-400 font-bold text-xs">AUTO-DETECTION ACTIVE - NO SETUP NEEDED</span>
                  </p>
                  
                  <FileUploader 
                    selectedLanguage={selectedLanguage}
                    onFileChange={handleFileChange}
                  />
                  
                  {file && (
                    <div className="mt-4 px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg flex items-center">
                      <div className="exe-icon h-10 w-10 flex-shrink-0">
                        <FileCode className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">{Math.round(file.size / 1024)} KB</p>
                        {detectedLanguage && (
                          <div className="mt-1 flex items-center">
                            <span className="text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded-full">
                              {detectedLanguage.toUpperCase()}
                            </span>
                            <span className="ml-2 text-xs text-gray-400">
                              Auto-detected
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="pro-badge flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          AUTO-PROTECT
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {file && (
                    <div className="mt-4">
                      <Button 
                        onClick={handleObfuscate}
                        className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow-sm"
                        disabled={obfuscationMutation.isPending}
                      >
                        {obfuscationMutation.isPending ? 
                          <div className="flex items-center">
                            <span className="mr-2">Processing...</span>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          : 
                          <div className="flex items-center justify-center gangster-font tracking-wider text-lg">
                            <Shield className="mr-2 h-5 w-5" />
                            LOCK IT DOWN
                          </div>
                        }
                      </Button>
                    </div>
                  )}
                </div>
                
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("upload")}
                    className="border-red-900/30 hover:border-red-700/50 bg-transparent text-red-400 w-full sm:w-auto gangster-font tracking-wide"
                  >
                    START PROTECTIN'
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow-sm w-full sm:w-auto gangster-font tracking-wide"
                    onClick={() => window.open('https://www.paypal.com/donate?business=tripl3sixmafia@gmail.com', '_blank')}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.084-.03.114a.804.804 0 0 1-.794.679h-2.776a.483.483 0 0 1-.477-.558l.922-5.832-.02.124a.804.804 0 0 1 .793-.681h1.662a7.132 7.132 0 0 0 7.118-6.161c.26-1.659-.03-2.94-.88-3.877-.037-.042-.072-.085-.108-.127a5.748 5.748 0 0 0-.973-.784c.46.709.697 1.61.602 2.722m-9.709 1.391c.077-.47.154-.94.232-.139a6.089 6.089 0 0 1 2.82-2.208 9.542 9.542 0 0 1 3.105-.471h.365c.196 0 .387.012.574.034a4.551 4.551 0 0 1 1.989.615c-.587-3.26-3.387-4.393-6.917-4.393h-2.79a.804.804 0 0 0-.794.68l-2.85 18.05a.483.483 0 0 0 .477.558h3.12l.781-4.975z"/>
                    </svg>
                    CASH DROP
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === "learn" && (
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-red-900/30 p-8 shadow-glow">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-red-500 mr-2" />
                  TRIPL3SIXMAFIA CRYPTER: Advanced Protection System
                </h3>
                <p className="text-gray-300 mb-4">
                  TRIPL3SIXMAFIA CRYPTER is a cutting-edge protection system designed to make your files completely 
                  undetectable to reverse engineering tools and analysis. Our system automatically implements multiple 
                  layers of sophisticated protection techniques to secure your executable files.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center p-4 bg-black/50 border border-red-900/30 rounded-lg mb-6">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h5 className="text-white font-semibold mb-1 gangster-font tracking-wide">Support the 3-6</h5>
                    <p className="text-xs text-gray-400">If you find this tool useful, toss some cash our way</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 shadow-glow-sm w-full sm:w-auto"
                    onClick={() => window.open('https://www.paypal.com/donate?business=tripl3sixmafia@gmail.com', '_blank')}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.084-.03.114a.804.804 0 0 1-.794.679h-2.776a.483.483 0 0 1-.477-.558l.922-5.832-.02.124a.804.804 0 0 1 .793-.681h1.662a7.132 7.132 0 0 0 7.118-6.161c.26-1.659-.03-2.94-.88-3.877-.037-.042-.072-.085-.108-.127a5.748 5.748 0 0 0-.973-.784c.46.709.697 1.61.602 2.722m-9.709 1.391c.077-.47.154-.94.232-.139a6.089 6.089 0 0 1 2.82-2.208 9.542 9.542 0 0 1 3.105-.471h.365c.196 0 .387.012.574.034a4.551 4.551 0 0 1 1.989.615c-.587-3.26-3.387-4.393-6.917-4.393h-2.79a.804.804 0 0 0-.794.68l-2.85 18.05a.483.483 0 0 0 .477.558h3.12l.781-4.975z"/>
                    </svg>
                    DONATE
                  </Button>
                </div>
                
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