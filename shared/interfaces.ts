// This file is for shared interfaces between client and server

import { ObfuscationOptions, ObfuscationResult } from './schema';

export interface AdvancedOptionsProps {
  options: ObfuscationOptions;
  outputOptions: {
    makeExecutable: boolean;
    iconPath?: string;
    targetPlatform: "windows" | "linux" | "macos" | "cross-platform";
    obfuscationStrength: "normal" | "aggressive" | "maximum";
    includeRuntime: boolean;
    compressionLevel: number;
    hiddenConsole: boolean;
  };
  onChangeOptions: (options: ObfuscationOptions) => void;
  onChangeOutputOptions: (options: any) => void;
  isExecutableFile: boolean;
  onIconSelect: (file: File | null) => void;
}