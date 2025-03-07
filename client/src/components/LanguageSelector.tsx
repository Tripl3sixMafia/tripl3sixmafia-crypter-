import React from "react";
import { SupportedLanguage } from "@/pages/Home";
import { FileCode, Hash, Code, Terminal, Wrench, Server, Database, CircuitBoard, Cpu } from "lucide-react";
import { SiJavascript, SiPython, SiJava, SiPhp, SiCsharp, SiRuby, SiGo, SiRust, SiCplusplus, SiC, SiSwift, SiKotlin, SiDart, SiTypescript } from "react-icons/si";

const languages: { id: SupportedLanguage; name: string; icon: React.ReactNode }[] = [
  { id: "javascript", name: "JavaScript", icon: <SiJavascript className="h-8 w-8" /> },
  { id: "typescript", name: "TypeScript", icon: <SiTypescript className="h-8 w-8" /> },
  { id: "python", name: "Python", icon: <SiPython className="h-8 w-8" /> },
  { id: "java", name: "Java", icon: <SiJava className="h-8 w-8" /> },
  { id: "php", name: "PHP", icon: <SiPhp className="h-8 w-8" /> },
  { id: "csharp", name: "C#", icon: <SiCsharp className="h-8 w-8" /> },
  { id: "cpp", name: "C++", icon: <SiCplusplus className="h-8 w-8" /> },
  { id: "c", name: "C", icon: <SiC className="h-8 w-8" /> },
  { id: "ruby", name: "Ruby", icon: <SiRuby className="h-8 w-8" /> },
  { id: "go", name: "Go", icon: <SiGo className="h-8 w-8" /> },
  { id: "rust", name: "Rust", icon: <SiRust className="h-8 w-8" /> },
  { id: "swift", name: "Swift", icon: <SiSwift className="h-8 w-8" /> },
  { id: "kotlin", name: "Kotlin", icon: <SiKotlin className="h-8 w-8" /> },
  { id: "dart", name: "Dart", icon: <SiDart className="h-8 w-8" /> },
  { id: "vbnet", name: "VB.NET", icon: <Code className="h-8 w-8" /> },
  { id: "fsharp", name: "F#", icon: <Hash className="h-8 w-8" /> },
  { id: "powershell", name: "PowerShell", icon: <Terminal className="h-8 w-8" /> },
  { id: "batch", name: "Batch", icon: <FileCode className="h-8 w-8" /> },
  { id: "assembly", name: "Assembly", icon: <Cpu className="h-8 w-8" /> },
];

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (language: SupportedLanguage) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Select Programming Language</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            className={`flex flex-col items-center justify-center h-20 ${
              selectedLanguage === lang.id 
                ? "bg-black/60 border-2 border-red-600 shadow-glow" 
                : "bg-black/40 border border-red-900/30 hover:border-red-600/50"
            } rounded-lg transition-all duration-200`}
            onClick={() => onSelectLanguage(lang.id)}
          >
            <div className={`mb-2 ${
              selectedLanguage === lang.id 
                ? "text-red-500" 
                : "text-gray-400"
            }`}>
              {lang.icon}
            </div>
            <span className={`text-sm font-medium ${
              selectedLanguage === lang.id ? "text-white" : "text-gray-300"
            }`}>
              {lang.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
