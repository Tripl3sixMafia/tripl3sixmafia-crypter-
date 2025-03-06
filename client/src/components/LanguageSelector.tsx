import React from "react";
import { SupportedLanguage } from "@/pages/Home";

const languages: { id: SupportedLanguage; name: string; icon: string }[] = [
  { id: "javascript", name: "JavaScript", icon: "fab fa-js" },
  { id: "python", name: "Python", icon: "fab fa-python" },
  { id: "java", name: "Java", icon: "fab fa-java" },
  { id: "php", name: "PHP", icon: "fab fa-php" },
  { id: "csharp", name: "C#", icon: "far fa-file-code" },
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
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-2">Select Language</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            className={`bg-secondary hover:bg-gray-700 ${
              selectedLanguage === lang.id ? "text-white border-2 border-accent" : "text-gray-300 border-2 border-transparent"
            } py-2 px-4 rounded transition-colors`}
            onClick={() => onSelectLanguage(lang.id)}
          >
            <i className={`${lang.icon} mr-1`}></i> {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
