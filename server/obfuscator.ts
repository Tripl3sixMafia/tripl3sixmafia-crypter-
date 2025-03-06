import { ObfuscationOptions, ObfuscationResult } from "@shared/schema";
import * as JavaScriptObfuscator from "javascript-obfuscator";

// Helper function to get protection level string
function getProtectionLevel(options: ObfuscationOptions): string {
  return options.level.charAt(0).toUpperCase() + options.level.slice(1);
}

// Helper function to get applied techniques based on options
function getAppliedTechniques(options: ObfuscationOptions): string[] {
  const techniques: string[] = [];
  
  if (options.nameMangling) {
    techniques.push("Variable & Function Renaming");
  }
  
  if (options.propertyMangling) {
    techniques.push("Property Name Mangling");
  }
  
  if (options.stringEncryption) {
    techniques.push("String Encryption");
  }
  
  if (options.stringSplitting) {
    techniques.push("String Splitting");
  }
  
  if (options.controlFlowFlattening) {
    techniques.push("Control Flow Flattening");
  }
  
  if (options.deadCodeInjection) {
    techniques.push("Dead Code Injection");
  }
  
  // Add self-defending if it's medium or heavy protection
  if (options.level === "medium" || options.level === "heavy") {
    techniques.push("Self-Defending Code");
  }
  
  return techniques;
}

// Helper function to calculate compression ratio
function calculateCompressionRatio(originalSize: number, obfuscatedSize: number): number {
  return Math.round((obfuscatedSize - originalSize) / originalSize * 100);
}

// JavaScript obfuscation implementation
function obfuscateJavaScript(code: string, options: ObfuscationOptions): string {
  const obfuscatorOptions: JavaScriptObfuscator.ObfuscatorOptions = {
    compact: true,
    controlFlowFlattening: options.controlFlowFlattening,
    controlFlowFlatteningThreshold: options.level === 'heavy' ? 1 : 0.75,
    deadCodeInjection: options.deadCodeInjection,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: options.level === 'heavy',
    debugProtectionInterval: options.level === 'heavy' ? true : false,
    disableConsoleOutput: options.level === 'heavy',
    identifierNamesGenerator: options.level === 'light' ? 'mangled' : 'hexadecimal',
    renameGlobals: options.level === 'heavy',
    rotateStringArray: options.stringEncryption,
    selfDefending: options.level !== 'light',
    splitStrings: options.stringSplitting,
    splitStringsChunkLength: options.level === 'heavy' ? 5 : 10,
    stringArray: options.stringEncryption,
    stringArrayEncoding: options.level === 'heavy' ? ['rc4'] : ['base64'],
    stringArrayThreshold: options.level === 'light' ? 0.5 : 0.8,
    transformObjectKeys: options.propertyMangling,
    unicodeEscapeSequence: options.level === 'heavy'
  };

  return JavaScriptObfuscator.obfuscate(code, obfuscatorOptions).getObfuscatedCode();
}

// Simple Python obfuscation (basic implementation)
function obfuscatePython(code: string): string {
  // In a real implementation, we would use a proper Python obfuscator
  // This is a simplified version for demonstration
  
  // Replace variable names with obscure names
  let obfuscated = code;
  
  // Find all variable definitions
  const varPattern = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
  const varMatches = [...code.matchAll(varPattern)];
  
  // Create a mapping of variable names to obfuscated names
  const varMap: Record<string, string> = {};
  let counter = 0;
  
  varMatches.forEach(match => {
    const varName = match[1];
    if (!varMap[varName] && !['self', 'cls', '__init__'].includes(varName)) {
      varMap[varName] = `_${counter.toString(36)}`;
      counter++;
    }
  });
  
  // Replace variable names
  for (const [original, replacement] of Object.entries(varMap)) {
    const regex = new RegExp(`\\b${original}\\b`, 'g');
    obfuscated = obfuscated.replace(regex, replacement);
  }
  
  // Add some confusing comments
  obfuscated = `# This code is protected by DlinqntShield\n# Unauthorized access is prohibited\n\n${obfuscated}`;
  
  // Add some dead code
  obfuscated += `\n\n# Decoy function\ndef _${Math.random().toString(36).substring(2)}():\n    pass`;
  
  return obfuscated;
}

// Generic obfuscation for other languages (very basic)
function obfuscateGeneric(code: string): string {
  // For other languages, we're doing a very simple obfuscation
  // In a production environment, you would integrate with language-specific obfuscators
  
  // Add some confusing comments
  let obfuscated = `/* 
 * Code protected by DlinqntShield
 * Deobfuscation is prohibited
 */\n\n${code}`;
  
  // Remove comments (simple approach)
  obfuscated = obfuscated.replace(/\/\/.*$/gm, "");
  
  // Remove excess whitespace
  obfuscated = obfuscated.replace(/\s+/g, " ");
  
  return obfuscated;
}

// Main obfuscation function
export async function obfuscateCode(
  code: string,
  language: string,
  options: ObfuscationOptions
): Promise<ObfuscationResult> {
  const originalSize = Buffer.byteLength(code, 'utf8');
  let obfuscatedCode: string;
  
  // Obfuscate based on language
  switch (language) {
    case 'javascript':
      obfuscatedCode = obfuscateJavaScript(code, options);
      break;
    case 'python':
      obfuscatedCode = obfuscatePython(code);
      break;
    default:
      obfuscatedCode = obfuscateGeneric(code);
  }
  
  const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf8');
  const compressionRatio = calculateCompressionRatio(originalSize, obfuscatedSize);
  
  return {
    obfuscatedCode,
    originalSize,
    obfuscatedSize,
    compressionRatio,
    protectionLevel: getProtectionLevel(options),
    appliedTechniques: getAppliedTechniques(options)
  };
}
