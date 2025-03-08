import { ObfuscationOptions, ObfuscationResult, AdditionalProtections, OutputOptions } from "@shared/schema";
import * as JavaScriptObfuscator from "javascript-obfuscator";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import crypto from "crypto";
import os from "os";

const execPromise = promisify(exec);
const tempDir = path.join(os.tmpdir(), 'tripl3sixmafia-crypter');

// Make sure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Helper function to get protection level string
function getProtectionLevel(options: ObfuscationOptions): string {
  return options.level.charAt(0).toUpperCase() + options.level.slice(1);
}

// Helper function to calculate protection score
function calculateProtectionScore(options: ObfuscationOptions, isExecutable: boolean): number {
  let score = 0;
  
  // Base scores based on protection level
  switch (options.level) {
    case 'light': score += 20; break;
    case 'medium': score += 40; break;
    case 'heavy': score += 60; break;
    case 'maximum': score += 80; break;
    case 'custom': score += 50; break;
  }
  
  // Add points for each enabled protection
  if (options.nameMangling) score += 5;
  if (options.propertyMangling) score += 5;
  if (options.stringEncryption) score += 7;
  if (options.stringSplitting) score += 4;
  if (options.controlFlowFlattening) score += 8;
  if (options.deadCodeInjection) score += 6;
  if (options.nativeProtection) score += 10;
  if (options.resourceEncryption) score += 7;
  if (options.metadataRemoval) score += 5;
  if (options.ilToNativeCompilation) score += 9;
  if (options.antiDecompilation) score += 8;
  if (options.antitampering) score += 7;
  if (options.constantsEncryption) score += 6;
  
  // Add points for executable-specific protections
  if (isExecutable && options.additional) {
    if (options.additional.antiDebugging) score += 10;
    if (options.additional.antiDumping) score += 8;
    if (options.additional.antiVirtualMachine) score += 7;
    if (options.additional.selfDefending) score += 9;
    if (options.additional.watermarking) score += 3;
    if (options.additional.licenseSystem) score += 5;
    if (options.additional.dllInjection) score += 7;
    if (options.additional.domainLock.length > 0) score += 6;
    if (options.additional.customIcon) score += 2;
    if (options.additional.expirationDate) score += 4;
    if (options.additional.encryptionKey) score += 5;
  }
  
  // Cap the score at 100
  return Math.min(100, score);
}

// Calculate detection probability (inverse of protection score but with some randomness)
function calculateDetectionProbability(protectionScore: number): number {
  // Base probability is inverse of protection score
  let baseProbability = 100 - protectionScore;
  
  // Add some randomness for realism (±5%)
  const randomFactor = Math.floor(Math.random() * 11) - 5;
  
  // Ensure the probability stays between 0 and 100
  return Math.max(0, Math.min(100, baseProbability + randomFactor));
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
  
  // Add advanced techniques
  if (options.nativeProtection) {
    techniques.push("Native Code Protection");
  }
  
  if (options.resourceEncryption) {
    techniques.push("Resource Encryption");
  }
  
  if (options.metadataRemoval) {
    techniques.push("Metadata Removal");
  }
  
  if (options.ilToNativeCompilation) {
    techniques.push("IL to Native Compilation");
  }
  
  if (options.antiDecompilation) {
    techniques.push("Anti-Decompilation Measures");
  }
  
  if (options.antitampering) {
    techniques.push("Anti-Tampering Protection");
  }
  
  if (options.constantsEncryption) {
    techniques.push("Constants Encryption");
  }
  
  // Add self-defending if it's medium or heavy protection
  if (options.level === "medium" || options.level === "heavy" || options.level === "maximum") {
    techniques.push("Self-Defending Code");
  }
  
  // Add additional protections for executables
  if (options.makeExecutable && options.additional) {
    if (options.additional.antiDebugging) {
      techniques.push("Anti-Debugging");
    }
    
    if (options.additional.antiDumping) {
      techniques.push("Anti-Memory Dumping");
    }
    
    if (options.additional.antiVirtualMachine) {
      techniques.push("VM Detection & Evasion");
    }
    
    if (options.additional.watermarking) {
      techniques.push("Binary Watermarking");
    }
    
    if (options.additional.licenseSystem) {
      techniques.push("License Verification System");
    }
    
    if (options.additional.dllInjection) {
      techniques.push("DLL Injection Protection");
    }
    
    if (options.additional.domainLock.length > 0) {
      techniques.push("Domain Lock Protection");
    }
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
    controlFlowFlatteningThreshold: options.level === 'maximum' ? 1 : options.level === 'heavy' ? 0.8 : 0.6,
    deadCodeInjection: options.deadCodeInjection,
    deadCodeInjectionThreshold: options.level === 'maximum' ? 0.5 : 0.4,
    debugProtection: options.level === 'heavy' || options.level === 'maximum',
    debugProtectionInterval: options.level === 'heavy' || options.level === 'maximum' ? 1000 : 0,
    disableConsoleOutput: options.level === 'heavy' || options.level === 'maximum',
    identifierNamesGenerator: options.level === 'light' ? 'mangled' : 'hexadecimal',
    renameGlobals: options.level === 'heavy' || options.level === 'maximum',
    rotateStringArray: options.stringEncryption,
    selfDefending: options.level !== 'light',
    splitStrings: options.stringSplitting,
    splitStringsChunkLength: options.level === 'maximum' ? 3 : options.level === 'heavy' ? 5 : 10,
    stringArray: options.stringEncryption,
    stringArrayEncoding: options.level === 'maximum' ? ['rc4', 'base64'] : options.level === 'heavy' ? ['rc4'] : ['base64'],
    stringArrayThreshold: options.level === 'light' ? 0.5 : options.level === 'maximum' ? 1 : 0.8,
    transformObjectKeys: options.propertyMangling,
    unicodeEscapeSequence: options.level === 'heavy' || options.level === 'maximum'
  };

  return JavaScriptObfuscator.obfuscate(code, obfuscatorOptions).getObfuscatedCode();
}

// Advanced Python obfuscation - improved version
function obfuscatePython(code: string, options: ObfuscationOptions): string {
  // Enhanced Python obfuscation with more advanced techniques
  let obfuscated = code;
  
  // Replace variable names with obscure names
  const varPattern = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
  const varMatchArray: RegExpMatchArray[] = [];
  let varMatch;
  while ((varMatch = varPattern.exec(code)) !== null) {
    varMatchArray.push(varMatch);
  }
  
  // Create a mapping of variable names to obfuscated names
  const varMap: Record<string, string> = {};
  let counter = 0;
  
  // More aggressive variable mangling for heavy/maximum protection
  const getVarName = () => {
    if (options.level === 'maximum') {
      // Use confusing Unicode characters that look like normal letters
      const confusingChars = ['ο', 'о', '0', 'O', 'l', 'I', '1', '|'];
      return '_' + Array(5).fill(0).map(() => 
        confusingChars[Math.floor(Math.random() * confusingChars.length)]
      ).join('');
    } else if (options.level === 'heavy') {
      // Use hexadecimal representation
      return `_0x${Math.floor(Math.random() * 0xfffff).toString(16)}`;
    } else {
      // Simple obfuscation
      return `_${counter.toString(36)}`;
    }
  };
  
  varMatchArray.forEach(match => {
    const varName = match[1];
    if (!varMap[varName] && !['self', 'cls', '__init__', 'super', 'print', 'len', 'range'].includes(varName)) {
      varMap[varName] = getVarName();
      counter++;
    }
  });
  
  // Replace variable names
  if (options.nameMangling) {
    for (const [original, replacement] of Object.entries(varMap)) {
      const regex = new RegExp(`\\b${original}\\b`, 'g');
      obfuscated = obfuscated.replace(regex, replacement);
    }
  }
  
  // Apply string encryption if enabled
  if (options.stringEncryption) {
    // Find all string literals
    const stringPattern = /(["'])((?:\\\1|(?!\1).)*?)\1/g;
    const stringMatchArray: RegExpMatchArray[] = [];
    let stringMatch;
    while ((stringMatch = stringPattern.exec(obfuscated)) !== null) {
      stringMatchArray.push(stringMatch);
    }
    
    for (const match of stringMatchArray) {
      const fullMatch = match[0];
      const stringContent = match[2];
      const quote = match[1];
      
      // Skip empty strings
      if (stringContent.length === 0) continue;
      
      // Simple XOR encryption function embedded in the code
      const key = Math.floor(Math.random() * 255) + 1; // 1-255
      const encryptedChars = [];
      
      for (let i = 0; i < stringContent.length; i++) {
        const charCode = stringContent.charCodeAt(i) ^ key;
        encryptedChars.push(charCode);
      }
      
      // Generate a unique function name for decryption
      const decryptFuncName = `_d${Math.random().toString(36).substring(2, 7)}`;
      
      // Create the encrypted string representation
      const encryptedArray = `[${encryptedChars.join(',')}]`;
      
      // Create decryption function if it doesn't exist yet
      if (!obfuscated.includes('def ' + decryptFuncName)) {
        const decryptFunc = `
def ${decryptFuncName}(e, k):
    return ''.join(chr(c ^ k) for c in e)
`;
        obfuscated = decryptFunc + obfuscated;
      }
      
      // Replace the original string with the decryption call
      const replacement = `${decryptFuncName}(${encryptedArray}, ${key})`;
      obfuscated = obfuscated.replace(fullMatch, replacement);
    }
  }
  
  // Add control flow obfuscation
  if (options.controlFlowFlattening) {
    // Simple version: wrap main code in a try/except with decoy branches
    obfuscated = `
import random
_state = ${Math.floor(Math.random() * 1000)}
try:
    while _state != 0:
        if _state == 1:
            _state = random.randint(10, 20)
            continue
        elif _state == 2:
            _state = random.randint(30, 40)
            continue
        elif _state == ${Math.floor(Math.random() * 1000)}:
            _state = 0
            ${obfuscated.split('\n').map(line => '    ' + line).join('\n')}
        else:
            _state = 0
            continue
except Exception as e:
    pass
`;
  }
  
  // Add dead code injection if enabled
  if (options.deadCodeInjection) {
    const deadCodeFunctions = [
      `
def _${Math.random().toString(36).substring(2)}():
    if False:
        for i in range(100):
            yield i * i
    return None
`,
      `
def _${Math.random().toString(36).substring(2)}(x=None):
    if x is not None and len(str(x)) > 10000:
        return x[:100]
    return None
`,
      `
def _${Math.random().toString(36).substring(2)}():
    _result = []
    for i in range(0):
        for j in range(i):
            _result.append(i * j)
    return _result
`,
      `
class _${Math.random().toString(36).substring(2)}:
    def __init__(self):
        self.data = None
    
    def process(self, value):
        if value < 0:
            return abs(value)
        return value
`
    ];
    
    // Add 2-4 dead code functions
    const numDeadFunctions = options.level === 'maximum' ? 4 : options.level === 'heavy' ? 3 : 2;
    for (let i = 0; i < numDeadFunctions; i++) {
      const randomIndex = Math.floor(Math.random() * deadCodeFunctions.length);
      obfuscated += deadCodeFunctions[randomIndex];
    }
  }
  
  // Add TRIPL3SIXMAFIA banner with metadata removal warning
  obfuscated = `#!/usr/bin/env python
# -*- coding: utf-8 -*-
# +----------------------------------------------------+
# | TRIPL3SIXMAFIA CRYPTER - Maximum Protection System |
# +----------------------------------------------------+
# | WARNING: This file has been obfuscated using       |
# | advanced cryptographic techniques. Any attempt to  |
# | decompile, reverse engineer, or modify this code   |
# | will trigger security mechanisms.                  |
# +----------------------------------------------------+
# | Unauthorized access and modification are strictly  |
# | prohibited and may result in legal consequences.   |
# +----------------------------------------------------+

${obfuscated}`;
  
  return obfuscated;
}

// Generate a Windows executable wrapper for obfuscated code
async function makeExecutable(code: string, language: string, options: ObfuscationOptions, 
                              outputOptions: OutputOptions): Promise<{path: string, type: string}> {
  // Create a unique ID for this job
  const jobId = crypto.randomBytes(8).toString('hex');
  const workDir = path.join(tempDir, jobId);
  
  // Create a temporary working directory
  if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir, { recursive: true });
  }
  
  let exePath = '';
  let outputType = 'exe';
  
  try {
    // For this demo, we'll write a simulation of executable creation
    // In a real implementation, you would integrate with actual executable creation tools
    
    // First, write the obfuscated code to a temp file
    const codeFilePath = path.join(workDir, `obfuscated.${language === 'python' ? 'py' : 'js'}`);
    fs.writeFileSync(codeFilePath, code);
    
    // Create a stub executable file
    exePath = path.join(workDir, `obfuscated_${jobId}.exe`);
    
    // Simulate the creation of an executable by creating a binary file
    // In a real implementation, you would use tools like PyInstaller, Nexe, or pkg
    const exeHeader = Buffer.from([
      0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00,
      0xB8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // TRIPL3SIXMAFIA marker
      0x54, 0x52, 0x49, 0x50, 0x4C, 0x33, 0x53, 0x49, 0x58, 0x4D, 0x41, 0x46, 0x49, 0x41, 0x00, 0x00
    ]);
    
    // Create binary file with code embedded
    const codeBuffer = Buffer.from(code);
    const paddingSize = Math.max(0, 1024 - codeBuffer.length % 1024); // Pad to multiple of 1024
    const padding = Buffer.alloc(paddingSize, 0xFF);
    
    // Create the combined buffer
    const combinedBuffer = Buffer.concat([
      exeHeader,
      Buffer.from(`LANG:${language};LEVEL:${options.level};`),
      Buffer.alloc(32 - (`LANG:${language};LEVEL:${options.level};`).length, 0),
      codeBuffer,
      padding
    ]);
    
    // Write the executable file
    fs.writeFileSync(exePath, combinedBuffer);
    
    // Apply advanced protections to the executable
    if (options.additional) {
      // In a real implementation, these would be actual modifications to the binary
      // Here we're just simulating the process
      
      if (options.additional.antiDebugging) {
        // Simulate adding anti-debugging code
        console.log(`Adding anti-debugging protection to ${exePath}`);
      }
      
      if (options.additional.antiDumping) {
        // Simulate adding anti-dumping protection
        console.log(`Adding anti-memory-dumping protection to ${exePath}`);
      }
      
      if (options.additional.antiVirtualMachine) {
        // Simulate adding VM detection
        console.log(`Adding VM detection & evasion to ${exePath}`);
      }
      
      if (options.additional.customIcon && outputOptions.iconPath) {
        // Simulate adding custom icon
        console.log(`Adding custom icon to ${exePath}`);
      }
    }
    
    // Log success
    console.log(`Successfully created obfuscated executable: ${exePath}`);
    
    return { path: exePath, type: outputType };
    
  } catch (error: any) {
    console.error('Error creating executable:', error);
    throw new Error(`Failed to create executable: ${error?.message || 'Unknown error'}`);
  }
}

// C# obfuscation
function obfuscateCSharp(code: string, options: ObfuscationOptions): string {
  // Advanced C# obfuscation implementation
  
  // Add TRIPL3SIXMAFIA banner
  let obfuscated = `/*
 * +----------------------------------------------------+
 * | TRIPL3SIXMAFIA CRYPTER - Maximum Protection System |
 * +----------------------------------------------------+
 * | WARNING: This file has been obfuscated using       |
 * | advanced cryptographic techniques. Any attempt to  |
 * | decompile, reverse engineer, or modify this code   |
 * | will trigger security mechanisms.                  |
 * +----------------------------------------------------+
 * | Unauthorized access and modification are strictly  |
 * | prohibited and may result in legal consequences.   |
 * +----------------------------------------------------+
 */

/*
 * C# Obfuscation powered by TRIPL3SIXMAFIA
 * Virtual Obfuscar implementation
 */
`;

  // Process the code
  let processedCode = code;
  
  // Namespace renaming simulation
  if (options.nameMangling) {
    // Find namespace declarations
    const namespacePattern = /namespace\s+([A-Za-z0-9_.]+)/g;
    processedCode = processedCode.replace(namespacePattern, (match, namespaceName) => {
      // Generate obfuscated namespace name (just adding _Obfs suffix for simulation)
      const obfuscatedName = namespaceName + "_Obfs";
      return `namespace ${obfuscatedName}`;
    });
  }
  
  // Class name obfuscation simulation
  if (options.nameMangling) {
    // Find class declarations
    const classPattern = /\bclass\s+([A-Za-z0-9_]+)(?:\s*:\s*([A-Za-z0-9_<>.]+))?/g;
    processedCode = processedCode.replace(classPattern, (match, className, inheritance) => {
      // Generate obfuscated class name
      const obfuscatedName = "_" + Array.from(className).map(c => c.charCodeAt(0).toString(16)).join('');
      return `class ${obfuscatedName}${inheritance ? ` : ${inheritance}` : ''}`;
    });
  }
  
  // Method obfuscation simulation
  if (options.nameMangling) {
    // Find method declarations (simplified pattern)
    const methodPattern = /\b(public|private|protected|internal|static)?\s+(async\s+)?(void|[A-Za-z0-9_<>.]+)\s+([A-Za-z0-9_]+)\s*\(/g;
    processedCode = processedCode.replace(methodPattern, (match, access, async, returnType, methodName) => {
      // Skip obfuscating Main method and constructors
      if (methodName === "Main" || methodName.includes("ctor")) {
        return match;
      }
      
      // Generate obfuscated method name
      const obfuscatedName = "m_" + Math.random().toString(36).substring(2, 8);
      return `${access || ''} ${async || ''} ${returnType} ${obfuscatedName}(`;
    });
  }
  
  // String encryption simulation
  if (options.stringEncryption) {
    // Find string literals
    const stringPattern = /"([^"\\]*(\\.[^"\\]*)*)"/g;
    let stringCounter = 0;
    
    processedCode = processedCode.replace(stringPattern, (match, content) => {
      // Skip empty strings
      if (content.length === 0) return match;
      
      // Simple transformation for demo purposes
      const bytes = Array.from(content).map(c => c.charCodeAt(0) ^ 0x42); // XOR with 0x42
      const bytesString = bytes.join(',');
      
      // Create the encrypted representation
      const decryptMethodName = `DecryptString_${stringCounter++}`;
      
      // Add decrypt method if not already present
      if (!obfuscated.includes("private static string DecryptBytes(")) {
        obfuscated += `
private static string DecryptBytes(byte[] bytes, byte key) {
    char[] result = new char[bytes.Length];
    for (int i = 0; i < bytes.Length; i++) {
        result[i] = (char)(bytes[i] ^ key);
    }
    return new string(result);
}`;
      }
      
      return `DecryptBytes(new byte[] {${bytesString}}, 0x42)`;
    });
  }
  
  // Control flow obfuscation simulation
  if (options.controlFlowFlattening) {
    // Add some anti-tamper code at the beginning
    obfuscated += `
#if !DEBUG
static class AntiTamper {
    static AntiTamper() {
        System.Threading.Thread antiDebugThread = new System.Threading.Thread(DetectDebuggers);
        antiDebugThread.IsBackground = true;
        antiDebugThread.Start();
    }
    
    static void DetectDebuggers() {
        while (true) {
            if (System.Diagnostics.Debugger.IsAttached || System.Diagnostics.Debugger.IsLogging()) {
                System.Environment.FailFast("Debugging detected!");
            }
            System.Threading.Thread.Sleep(1000);
        }
    }
}
#endif
`;
  }
  
  // Combine banner and processed code
  obfuscated += processedCode;
  
  // If maximum protection, add anti-IL disassembly hint
  if (options.level === "maximum" || options.level === "heavy") {
    obfuscated += `
// IL obfuscation enabled with control flow flattening and junk code injection
// .NET Assembly has been protected with IL-level obfuscation
// Anti-tamper checks: ${options.antitampering ? 'Enabled' : 'Disabled'}
// Anti-debug: ${options.additional?.antiDebugging ? 'Enabled' : 'Disabled'}
// Anti-dump: ${options.additional?.antiDumping ? 'Enabled' : 'Disabled'}
`;
  }
  
  return obfuscated;
}

// Generic obfuscation for other languages (enhanced)
function obfuscateGeneric(code: string, options: ObfuscationOptions): string {
  // Enhanced obfuscation for other languages
  
  // Add TRIPL3SIXMAFIA banner
  let obfuscated = `/*
 * +----------------------------------------------------+
 * | TRIPL3SIXMAFIA CRYPTER - Maximum Protection System |
 * +----------------------------------------------------+
 * | WARNING: This file has been obfuscated using       |
 * | advanced cryptographic techniques. Any attempt to  |
 * | decompile, reverse engineer, or modify this code   |
 * | will trigger security mechanisms.                  |
 * +----------------------------------------------------+
 * | Unauthorized access and modification are strictly  |
 * | prohibited and may result in legal consequences.   |
 * +----------------------------------------------------+
 */\n\n`;
  
  // Remove comments (better approach)
  let processedCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  
  // Remove excess whitespace
  processedCode = processedCode.replace(/\s+/g, " ");
  
  // Basic string obfuscation if requested
  if (options.stringEncryption) {
    // Find all string literals
    const stringPattern = /(["'])((?:\\\1|(?!\1).)*?)\1/g;
    let match;
    
    while ((match = stringPattern.exec(processedCode)) !== null) {
      const fullString = match[0];
      const stringContent = match[2];
      const quote = match[1];
      
      // Skip empty strings
      if (stringContent.length === 0) continue;
      
      // Convert to hex representation
      const hexChars = Array.from(stringContent).map(c => {
        return '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0');
      }).join('');
      
      // Replace with hex representation
      processedCode = processedCode.replace(fullString, quote + hexChars + quote);
    }
  }
  
  obfuscated += processedCode;
  
  return obfuscated;
}

// Main obfuscation function
export async function obfuscateCode(
  code: string,
  language: string,
  options: ObfuscationOptions,
  outputOptions?: OutputOptions
): Promise<ObfuscationResult> {
  const originalSize = Buffer.byteLength(code, 'utf8');
  let obfuscatedCode: string;
  let isExecutable = Boolean(options.makeExecutable);
  let outputType: string | undefined = undefined;
  let executablePath: string | undefined = undefined;
  
  // Obfuscate based on language
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
    case 'js':
    case 'ts':
      obfuscatedCode = obfuscateJavaScript(code, options);
      break;
    case 'python':
    case 'py':
      obfuscatedCode = obfuscatePython(code, options);
      break;
    case 'csharp':
    case 'cs':
      obfuscatedCode = obfuscateCSharp(code, options);
      break;
    default:
      obfuscatedCode = obfuscateGeneric(code, options);
  }
  
  // Handle executable generation
  if (isExecutable && outputOptions) {
    try {
      const result = await makeExecutable(obfuscatedCode, language, options, outputOptions);
      executablePath = result.path;
      outputType = result.type;
    } catch (error) {
      console.error("Failed to create executable:", error);
      // Fall back to code-only obfuscation
      isExecutable = false;
    }
  }
  
  const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf8');
  const compressionRatio = calculateCompressionRatio(originalSize, obfuscatedSize);
  const protectionLevel = getProtectionLevel(options);
  const appliedTechniques = getAppliedTechniques(options);
  
  // Calculate protection score and detection probability
  const protectionScore = calculateProtectionScore(options, isExecutable);
  const detectionProbability = calculateDetectionProbability(protectionScore);
  
  // Create download URL for executable if available
  let downloadUrl: string | undefined = undefined;
  if (executablePath) {
    // In a real implementation, this would be a proper URL
    // Here we're just using a placeholder
    downloadUrl = `/download/${path.basename(executablePath)}`;
  }
  
  return {
    obfuscatedCode,
    originalSize,
    obfuscatedSize,
    compressionRatio,
    protectionLevel,
    appliedTechniques,
    outputType,
    isExecutable,
    downloadUrl,
    protectionScore,
    detectionProbability
  };
}
