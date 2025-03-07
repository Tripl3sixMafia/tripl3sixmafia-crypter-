import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface IconSelectorProps {
  onIconSelect: (file: File | null) => void;
  isCustomIconEnabled: boolean;
}

export default function IconSelector({ onIconSelect, isCustomIconEnabled }: IconSelectorProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Create a preview URL for the selected icon
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onIconSelect(file);
    } else {
      setPreviewUrl(null);
      onIconSelect(null);
    }
  };

  const handleRemoveIcon = () => {
    setPreviewUrl(null);
    onIconSelect(null);
  };

  return (
    <Card className="bg-gray-800/60 border-gray-700/50 mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Custom Application Icon</CardTitle>
        <CardDescription>Add a custom icon for your executable file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <Label className="text-white mb-2 block">Icon File (.ico, .png, .jpg)</Label>
            <Input 
              type="file" 
              accept=".ico,.png,.jpg" 
              onChange={handleIconChange} 
              className="bg-gray-900 border-gray-700 text-white"
              disabled={!isCustomIconEnabled}
            />
            <p className="text-xs text-gray-400 mt-1">
              Recommended: 256x256 .ico file for best compatibility
            </p>
          </div>
          
          <div className="flex-shrink-0 flex items-center justify-center md:mt-0 mt-4">
            <div className="w-20 h-20 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Icon preview" className="max-w-full max-h-full" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <i className="fas fa-image text-2xl mb-1"></i>
                  <span className="text-xs">No icon</span>
                </div>
              )}
            </div>
          </div>
          
          {previewUrl && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleRemoveIcon}
              className="md:mt-0 mt-2"
            >
              <i className="fas fa-times mr-1"></i>
              Remove
            </Button>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <i className="fas fa-info-circle text-purple-400"></i>
            </div>
            <div className="ml-2">
              <p className="text-gray-300 text-sm">
                Custom icons will be embedded in your executable. This is only applicable when 
                "Make Executable" is enabled and the output format supports custom icons.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}