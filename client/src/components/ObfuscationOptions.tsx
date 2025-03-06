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
  const handleLevelChange = (value: string) => {
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
    onChange({
      ...options,
      [field]: !options[field],
    });
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
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Protection Settings</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelBadgeClasses(options.level)}`}>
            {options.level.charAt(0).toUpperCase() + options.level.slice(1)} Protection
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
            <h3 className="text-white text-lg font-medium mb-4">Protection Level</h3>
            <Select 
              value={options.level} 
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="light" className="text-white hover:bg-gray-700">Light - Basic protection</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium - Balanced protection</SelectItem>
                <SelectItem value="heavy" className="text-white hover:bg-gray-700">Heavy - Maximum security</SelectItem>
                <SelectItem value="custom" className="text-white hover:bg-gray-700">Custom - Advanced settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
              <h3 className="text-white text-md font-medium mb-4">Name Protection</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox 
                    id="nameMangling" 
                    checked={options.nameMangling}
                    onCheckedChange={() => handleCheckboxChange('nameMangling')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="nameMangling" className="ml-3 text-sm text-gray-300">
                    Variable name obfuscation
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="propertyMangling" 
                    checked={options.propertyMangling}
                    onCheckedChange={() => handleCheckboxChange('propertyMangling')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="propertyMangling" className="ml-3 text-sm text-gray-300">
                    Property name obfuscation
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
              <h3 className="text-white text-md font-medium mb-4">String Protection</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox 
                    id="stringEncryption" 
                    checked={options.stringEncryption}
                    onCheckedChange={() => handleCheckboxChange('stringEncryption')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="stringEncryption" className="ml-3 text-sm text-gray-300">
                    String encryption
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="stringSplitting" 
                    checked={options.stringSplitting}
                    onCheckedChange={() => handleCheckboxChange('stringSplitting')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="stringSplitting" className="ml-3 text-sm text-gray-300">
                    String splitting
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700">
              <h3 className="text-white text-md font-medium mb-4">Control Flow Protection</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox 
                    id="controlFlowFlattening" 
                    checked={options.controlFlowFlattening}
                    onCheckedChange={() => handleCheckboxChange('controlFlowFlattening')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="controlFlowFlattening" className="ml-3 text-sm text-gray-300">
                    Control flow flattening
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="deadCodeInjection" 
                    checked={options.deadCodeInjection}
                    onCheckedChange={() => handleCheckboxChange('deadCodeInjection')}
                    className="h-4 w-4 data-[state=checked]:bg-purple-500 border-gray-600 rounded"
                  />
                  <Label htmlFor="deadCodeInjection" className="ml-3 text-sm text-gray-300">
                    Dead code injection
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-6 px-8 rounded-md text-md shadow-lg transition-all duration-200"
            onClick={onObfuscate}
          >
            <i className="fas fa-shield-alt mr-3 text-lg"></i> Obfuscate Code
          </Button>
        </div>
      </div>
    </div>
  );
}
