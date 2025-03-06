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

  return (
    <div className="mb-6 bg-secondary rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Obfuscation Settings</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Obfuscation Level
          </label>
          <Select 
            value={options.level} 
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light - Maintain readability</SelectItem>
              <SelectItem value="medium">Medium - Balanced protection</SelectItem>
              <SelectItem value="heavy">Heavy - Maximum protection</SelectItem>
              <SelectItem value="custom">Custom - Advanced settings</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-400 mb-2 block">
            Name Mangling
          </Label>
          <div className="flex items-center">
            <Checkbox 
              id="nameMangling" 
              checked={options.nameMangling}
              onCheckedChange={() => handleCheckboxChange('nameMangling')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="nameMangling" className="ml-2 text-sm text-gray-300">
              Rename variables and functions
            </Label>
          </div>
          <div className="flex items-center mt-2">
            <Checkbox 
              id="propertyMangling" 
              checked={options.propertyMangling}
              onCheckedChange={() => handleCheckboxChange('propertyMangling')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="propertyMangling" className="ml-2 text-sm text-gray-300">
              Obfuscate property names
            </Label>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-400 mb-2 block">
            String Encryption
          </Label>
          <div className="flex items-center">
            <Checkbox 
              id="stringEncryption" 
              checked={options.stringEncryption}
              onCheckedChange={() => handleCheckboxChange('stringEncryption')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="stringEncryption" className="ml-2 text-sm text-gray-300">
              Encrypt string literals
            </Label>
          </div>
          <div className="flex items-center mt-2">
            <Checkbox 
              id="stringSplitting" 
              checked={options.stringSplitting}
              onCheckedChange={() => handleCheckboxChange('stringSplitting')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="stringSplitting" className="ml-2 text-sm text-gray-300">
              Split strings
            </Label>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-400 mb-2 block">
            Control Flow
          </Label>
          <div className="flex items-center">
            <Checkbox 
              id="controlFlowFlattening" 
              checked={options.controlFlowFlattening}
              onCheckedChange={() => handleCheckboxChange('controlFlowFlattening')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="controlFlowFlattening" className="ml-2 text-sm text-gray-300">
              Control flow flattening
            </Label>
          </div>
          <div className="flex items-center mt-2">
            <Checkbox 
              id="deadCodeInjection" 
              checked={options.deadCodeInjection}
              onCheckedChange={() => handleCheckboxChange('deadCodeInjection')}
              className="h-4 w-4 data-[state=checked]:bg-accent border-gray-700 rounded"
            />
            <Label htmlFor="deadCodeInjection" className="ml-2 text-sm text-gray-300">
              Dead code injection
            </Label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-accent hover:bg-accent/90 text-white font-medium"
          onClick={onObfuscate}
        >
          <i className="fas fa-shield-alt mr-2"></i> Obfuscate Code
        </Button>
      </div>
    </div>
  );
}
