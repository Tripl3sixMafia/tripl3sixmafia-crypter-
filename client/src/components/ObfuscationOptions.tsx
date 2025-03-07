import React from "react";
import { ObfuscationOptions, ObfuscationLevel } from "@/pages/Home";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ObfuscationOptionsProps {
  options: ObfuscationOptions;
  onChange: (options: ObfuscationOptions) => void;
  onObfuscate: () => void;
}

export default function ObfuscationOptionsComponent({ options, onChange, onObfuscate }: ObfuscationOptionsProps) {
  const handleLevelChange = (value: ObfuscationLevel | string) => {
    // Update options based on selected level
    const newLevel = value as ObfuscationLevel;
    
    let newOptions: ObfuscationOptions = {
      ...options,
      level: newLevel,
    };
    
    // Pre-configure options based on level
    if (newLevel === "light") {
      newOptions = {
        ...newOptions,
        nameMangling: true,
        propertyMangling: false,
        stringEncryption: false,
        stringSplitting: false,
        controlFlowFlattening: false,
        deadCodeInjection: false,
      };
    } else if (newLevel === "medium") {
      newOptions = {
        ...newOptions,
        nameMangling: true,
        propertyMangling: true,
        stringEncryption: true,
        stringSplitting: false,
        controlFlowFlattening: true,
        deadCodeInjection: false,
      };
    } else if (newLevel === "heavy") {
      newOptions = {
        ...newOptions,
        nameMangling: true,
        propertyMangling: true,
        stringEncryption: true,
        stringSplitting: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
      };
    }
    
    onChange(newOptions);
  };

  const handleCheckboxChange = (field: keyof ObfuscationOptions) => {
    const newOptions: ObfuscationOptions = {
      ...options,
      [field]: !options[field],
      level: "custom" as ObfuscationLevel, // When manually changing options, set to custom level
    };
    onChange(newOptions);
  };

  // Helper function to get level badge style
  const getLevelBadgeClasses = (level: ObfuscationLevel) => {
    if (level === "light") return "bg-green-600/20 text-green-400 border-green-600/30";
    if (level === "medium") return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
    if (level === "heavy") return "bg-red-600/20 text-red-400 border-red-600/30";
    return "bg-purple-600/20 text-purple-400 border-purple-600/30"; // custom
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
        <i className="fas fa-shield-alt text-gradient bg-gradient-to-r from-purple-400 to-pink-500 mr-3"></i>
        Protection Settings
      </h2>
      
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Obfuscation Strength</h2>
          <div className={`px-3.5 py-1.5 rounded-full text-xs font-medium border ${getLevelBadgeClasses(options.level)}`}>
            {options.level.charAt(0).toUpperCase() + options.level.slice(1)} Protection
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 shadow-md">
            <h3 className="text-white text-lg font-bold mb-4">Protection Level</h3>
            <Select 
              value={options.level} 
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="w-full bg-gray-800/80 border-gray-700/80 text-white">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700/80">
                <SelectItem value="light" className="text-white hover:bg-gray-700/80">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Light - Basic protection
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-700/80">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Medium - Balanced protection
                  </div>
                </SelectItem>
                <SelectItem value="heavy" className="text-white hover:bg-gray-700/80">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    Heavy - Maximum security
                  </div>
                </SelectItem>
                <SelectItem value="custom" className="text-white hover:bg-gray-700/80">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    Custom - Advanced settings
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className={`p-2 text-center rounded-md text-xs border ${options.level === 'light' ? 'border-green-500 bg-green-500/10' : 'border-gray-700/50 bg-gray-800/50'} cursor-pointer transition-all`} onClick={() => handleLevelChange('light')}>
                Light
              </div>
              <div className={`p-2 text-center rounded-md text-xs border ${options.level === 'medium' ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700/50 bg-gray-800/50'} cursor-pointer transition-all`} onClick={() => handleLevelChange('medium')}>
                Medium
              </div>
              <div className={`p-2 text-center rounded-md text-xs border ${options.level === 'heavy' ? 'border-red-500 bg-red-500/10' : 'border-gray-700/50 bg-gray-800/50'} cursor-pointer transition-all`} onClick={() => handleLevelChange('heavy')}>
                Heavy
              </div>
              <div className={`p-2 text-center rounded-md text-xs border ${options.level === 'custom' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700/50 bg-gray-800/50'} cursor-pointer transition-all`} onClick={() => handleLevelChange('custom')}>
                Custom
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 shadow-md option-card">
              <h3 className="text-white text-md font-bold mb-4 flex items-center">
                <i className="fas fa-random text-gradient bg-gradient-to-r from-purple-400 to-pink-500 mr-2"></i>
                Name Protection
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="nameMangling" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">Variable name obfuscation</span>
                    <p className="text-xs text-gray-400 mt-1">Transforms all variable names into random strings</p>
                  </Label>
                  <Checkbox 
                    id="nameMangling" 
                    checked={options.nameMangling}
                    onCheckedChange={() => handleCheckboxChange('nameMangling')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="propertyMangling" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">Property name obfuscation</span>
                    <p className="text-xs text-gray-400 mt-1">Encrypts object property names</p>
                  </Label>
                  <Checkbox 
                    id="propertyMangling" 
                    checked={options.propertyMangling}
                    onCheckedChange={() => handleCheckboxChange('propertyMangling')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 shadow-md option-card">
              <h3 className="text-white text-md font-bold mb-4 flex items-center">
                <i className="fas fa-lock text-gradient bg-gradient-to-r from-purple-400 to-pink-500 mr-2"></i>
                String Protection
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="stringEncryption" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">String encryption</span>
                    <p className="text-xs text-gray-400 mt-1">Encrypts string literals in your code</p>
                  </Label>
                  <Checkbox 
                    id="stringEncryption" 
                    checked={options.stringEncryption}
                    onCheckedChange={() => handleCheckboxChange('stringEncryption')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="stringSplitting" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">String splitting</span>
                    <p className="text-xs text-gray-400 mt-1">Splits strings into random chunks</p>
                  </Label>
                  <Checkbox 
                    id="stringSplitting" 
                    checked={options.stringSplitting}
                    onCheckedChange={() => handleCheckboxChange('stringSplitting')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50 shadow-md option-card md:col-span-2">
              <h3 className="text-white text-md font-bold mb-4 flex items-center">
                <i className="fas fa-project-diagram text-gradient bg-gradient-to-r from-purple-400 to-pink-500 mr-2"></i>
                Control Flow Protection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="controlFlowFlattening" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">Control flow flattening</span>
                    <p className="text-xs text-gray-400 mt-1">Transforms code execution paths</p>
                  </Label>
                  <Checkbox 
                    id="controlFlowFlattening" 
                    checked={options.controlFlowFlattening}
                    onCheckedChange={() => handleCheckboxChange('controlFlowFlattening')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <Label htmlFor="deadCodeInjection" className="text-sm text-gray-300 flex-1">
                    <span className="font-medium text-white">Dead code injection</span>
                    <p className="text-xs text-gray-400 mt-1">Adds meaningless code to confuse analyzers</p>
                  </Label>
                  <Checkbox 
                    id="deadCodeInjection" 
                    checked={options.deadCodeInjection}
                    onCheckedChange={() => handleCheckboxChange('deadCodeInjection')}
                    className="h-5 w-5 data-[state=checked]:bg-gradient-to-r from-purple-600 to-pink-600 border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-6 px-10 rounded-lg text-lg shadow-glow-sm hover:shadow-glow-md transition-all duration-200"
            onClick={onObfuscate}
          >
            <i className="fas fa-shield-alt mr-3 text-lg"></i> Obfuscate Code
          </Button>
        </div>
      </div>
    </div>
  );
}
