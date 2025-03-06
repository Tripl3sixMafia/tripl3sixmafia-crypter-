import React from "react";
import { SupportedLanguage } from "@/pages/Home";

const languages: { id: SupportedLanguage; name: string; icon: string }[] = [
  { id: "javascript", name: "JavaScript", icon: "fab fa-js" },
  { id: "python", name: "Python", icon: "fab fa-python" },
  { id: "java", name: "Java", icon: "fab fa-java" },
  { id: "php", name: "PHP", icon: "fab fa-php" },
  { id: "csharp", name: "C#", icon: "fas fa-hashtag" },
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
            className={`flex flex-col items-center justify-center h-24 ${
              selectedLanguage === lang.id 
                ? "bg-gray-800 border-2 border-purple-500 shadow-lg" 
                : "bg-gray-800/60 border border-gray-700 hover:border-gray-500"
            } rounded-lg transition-all duration-200`}
            onClick={() => onSelectLanguage(lang.id)}
          >
            <div className={`text-2xl mb-2 ${
              selectedLanguage === lang.id 
                ? "text-gradient bg-gradient-to-r from-purple-500 to-pink-500" 
                : "text-gray-400"
            }`}>
              <i className={lang.icon}></i>
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
