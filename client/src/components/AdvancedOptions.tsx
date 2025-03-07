import React from "react";
import type { ObfuscationOptions, OutputOptions, AdditionalProtections } from "@/pages/Home";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, FileCode, Zap, Lock, AlertTriangle } from "lucide-react";

interface AdvancedOptionsProps {
  options: ObfuscationOptions;
  outputOptions: OutputOptions;
  onChangeOptions: (options: ObfuscationOptions) => void;
  onChangeOutputOptions: (options: OutputOptions) => void;
  isExecutableFile: boolean;
  onIconSelect: (file: File | null) => void;
}

export default function AdvancedOptions({
  options,
  outputOptions,
  onChangeOptions,
  onChangeOutputOptions,
  isExecutableFile,
  onIconSelect
}: AdvancedOptionsProps) {
  const handleSwitchChange = (key: keyof ObfuscationOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key]
    });
  };

  const handleAdditionalChange = (key: keyof AdditionalProtections) => {
    if (!options.additional) return;
    
    onChangeOptions({
      ...options,
      additional: {
        ...options.additional,
        [key]: typeof options.additional[key] === 'boolean' ? !options.additional[key] : options.additional[key]
      }
    });
  };

  const handleOutputOptionChange = (key: keyof OutputOptions, value: any) => {
    onChangeOutputOptions({
      ...outputOptions,
      [key]: value
    });
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onIconSelect(file);
  };

  return (
    <div className="mb-8 mt-8 bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-red-900/30 shadow-glow">
      <h2 className="text-2xl font-bold text-white mb-5 flex items-center">
        <Shield className="h-6 w-6 text-red-500 mr-3" />
        Advanced Protection Settings
      </h2>

      <Tabs defaultValue="code-protection" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 bg-black/50 border border-red-900/30">
          <TabsTrigger value="code-protection" className="rounded-lg data-[state=active]:bg-red-900/40 data-[state=active]:text-white">
            <FileCode className="h-4 w-4 mr-2" />
            Code Protection
          </TabsTrigger>
          <TabsTrigger value="anti-analysis" className="rounded-lg data-[state=active]:bg-red-900/40 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Anti-Analysis
          </TabsTrigger>
          <TabsTrigger value="output-options" className="rounded-lg data-[state=active]:bg-red-900/40 data-[state=active]:text-white">
            <Zap className="h-4 w-4 mr-2" />
            Output Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code-protection" className="p-4 bg-black/50 rounded-xl border border-red-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">IL/.NET Protection</CardTitle>
                <CardDescription className="text-gray-400">Enhanced protection for .NET assemblies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="ilToNativeCompilation">IL to Native Compilation</Label>
                    <p className="text-xs text-gray-400">Convert IL code to native, making it harder to decompile</p>
                  </div>
                  <Switch
                    id="ilToNativeCompilation"
                    checked={options.ilToNativeCompilation}
                    onCheckedChange={() => handleSwitchChange('ilToNativeCompilation')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="metadataRemoval">Metadata Obfuscation</Label>
                    <p className="text-xs text-gray-400">Remove or encrypt .NET assembly metadata</p>
                  </div>
                  <Switch
                    id="metadataRemoval"
                    checked={options.metadataRemoval}
                    onCheckedChange={() => handleSwitchChange('metadataRemoval')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="resourceEncryption">Resource Encryption</Label>
                    <p className="text-xs text-gray-400">Encrypt embedded resources within assemblies</p>
                  </div>
                  <Switch
                    id="resourceEncryption"
                    checked={options.resourceEncryption}
                    onCheckedChange={() => handleSwitchChange('resourceEncryption')}
                    className="toggle-switch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Native Protection</CardTitle>
                <CardDescription className="text-gray-400">Low-level protection features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="nativeProtection">Native Code Protection</Label>
                    <p className="text-xs text-gray-400">Apply low-level binary obfuscation techniques</p>
                  </div>
                  <Switch
                    id="nativeProtection"
                    checked={options.nativeProtection}
                    onCheckedChange={() => handleSwitchChange('nativeProtection')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="antiDecompilation">Anti-Decompilation</Label>
                    <p className="text-xs text-gray-400">Implement measures to prevent decompilation</p>
                  </div>
                  <Switch
                    id="antiDecompilation"
                    checked={options.antiDecompilation}
                    onCheckedChange={() => handleSwitchChange('antiDecompilation')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="constantsEncryption">Constants Encryption</Label>
                    <p className="text-xs text-gray-400">Encrypt constant values in the binary</p>
                  </div>
                  <Switch
                    id="constantsEncryption"
                    checked={options.constantsEncryption}
                    onCheckedChange={() => handleSwitchChange('constantsEncryption')}
                    className="toggle-switch"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anti-analysis" className="p-4 bg-black/50 rounded-xl border border-red-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Anti-Debug Protections</CardTitle>
                <CardDescription>Prevent debugging and analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="antiDebugging">Anti-Debugging</Label>
                    <p className="text-xs text-gray-400">Detect and prevent debugger attachment</p>
                  </div>
                  <Switch
                    id="antiDebugging"
                    checked={options.additional?.antiDebugging || false}
                    onCheckedChange={() => handleAdditionalChange('antiDebugging')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="antiDumping">Anti-Dumping</Label>
                    <p className="text-xs text-gray-400">Prevent memory dumps of the application</p>
                  </div>
                  <Switch
                    id="antiDumping"
                    checked={options.additional?.antiDumping || false}
                    onCheckedChange={() => handleAdditionalChange('antiDumping')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="antiVirtualMachine">Anti-VM/Sandbox</Label>
                    <p className="text-xs text-gray-400">Detect and react to virtual environments</p>
                  </div>
                  <Switch
                    id="antiVirtualMachine"
                    checked={options.additional?.antiVirtualMachine || false}
                    onCheckedChange={() => handleAdditionalChange('antiVirtualMachine')}
                    className="toggle-switch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Runtime Protection</CardTitle>
                <CardDescription className="text-gray-400">Protect application during execution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="selfDefending">Self-Defending Code</Label>
                    <p className="text-xs text-gray-400">React to tampering attempts at runtime</p>
                  </div>
                  <Switch
                    id="selfDefending"
                    checked={options.additional?.selfDefending || false}
                    onCheckedChange={() => handleAdditionalChange('selfDefending')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="antitampering">Anti-Tampering</Label>
                    <p className="text-xs text-gray-400">Detect modifications to the executable</p>
                  </div>
                  <Switch
                    id="antitampering"
                    checked={options.antitampering}
                    onCheckedChange={() => handleSwitchChange('antitampering')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="dllInjection">DLL Injection Protection</Label>
                    <p className="text-xs text-gray-400">Prevent unauthorized code injection</p>
                  </div>
                  <Switch
                    id="dllInjection"
                    checked={options.additional?.dllInjection || false}
                    onCheckedChange={() => handleAdditionalChange('dllInjection')}
                    className="toggle-switch"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="output-options" className="p-4 bg-black/50 rounded-xl border border-red-900/30">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Executable Options</CardTitle>
                <CardDescription className="text-gray-400">Configure final output format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="makeExecutable">Make Executable</Label>
                    <p className="text-xs text-gray-400">Convert to standalone executable</p>
                  </div>
                  <Switch
                    id="makeExecutable"
                    checked={outputOptions.makeExecutable}
                    onCheckedChange={(checked) => handleOutputOptionChange('makeExecutable', checked)}
                    className="toggle-switch"
                  />
                </div>

                {outputOptions.makeExecutable && (
                  <>
                    <div>
                      <Label className="text-white mb-2 block">Target Platform</Label>
                      <Select 
                        value={outputOptions.targetPlatform} 
                        onValueChange={(value) => handleOutputOptionChange('targetPlatform', value)}
                      >
                        <SelectTrigger className="w-full bg-black/80 border-red-900/30 text-white">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-red-900/30">
                          <SelectItem value="windows" className="text-white hover:bg-red-950/50">Windows</SelectItem>
                          <SelectItem value="linux" className="text-white hover:bg-red-950/50">Linux</SelectItem>
                          <SelectItem value="macos" className="text-white hover:bg-red-950/50">macOS</SelectItem>
                          <SelectItem value="cross-platform" className="text-white hover:bg-red-950/50">Cross-Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Compression Level: {outputOptions.compressionLevel}</Label>
                      <Slider 
                        defaultValue={[outputOptions.compressionLevel]} 
                        max={9} 
                        step={1} 
                        onValueChange={(values) => handleOutputOptionChange('compressionLevel', values[0])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>None</span>
                        <span>Maximum</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white" htmlFor="hiddenConsole">Hide Console Window</Label>
                        <p className="text-xs text-gray-400">Hide console window for console applications</p>
                      </div>
                      <Switch
                        id="hiddenConsole"
                        checked={outputOptions.hiddenConsole}
                        onCheckedChange={(checked) => handleOutputOptionChange('hiddenConsole', checked)}
                        className="toggle-switch"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white" htmlFor="includeRuntime">Include Runtime</Label>
                        <p className="text-xs text-gray-400">Include necessary runtime files</p>
                      </div>
                      <Switch
                        id="includeRuntime"
                        checked={outputOptions.includeRuntime}
                        onCheckedChange={(checked) => handleOutputOptionChange('includeRuntime', checked)}
                        className="toggle-switch"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">Custom Icon (optional)</Label>
                      <div className="flex items-center space-x-4">
                        <Input 
                          type="file" 
                          accept=".ico,.png,.jpg" 
                          onChange={handleIconChange} 
                          className="bg-black/80 border-red-900/30 text-white"
                        />
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded bg-black flex items-center justify-center ${options.additional?.customIcon ? 'border-2 border-red-500' : 'border border-red-900/30'}`}>
                            <i className="fas fa-image text-red-400"></i>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Recommended: 256x256 .ico file</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Enterprise Features</CardTitle>
                <CardDescription className="text-gray-400">Advanced licensing and watermarking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="watermarking">Watermarking</Label>
                    <p className="text-xs text-gray-400">Add hidden identifier to your code</p>
                  </div>
                  <Switch
                    id="watermarking"
                    checked={options.additional?.watermarking || false}
                    onCheckedChange={() => handleAdditionalChange('watermarking')}
                    className="toggle-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white" htmlFor="licenseSystem">License System</Label>
                    <p className="text-xs text-gray-400">Add licensing validation to your app</p>
                  </div>
                  <Switch
                    id="licenseSystem"
                    checked={options.additional?.licenseSystem || false}
                    onCheckedChange={() => handleAdditionalChange('licenseSystem')}
                    className="toggle-switch"
                  />
                </div>

                {options.additional?.licenseSystem && (
                  <div className="bg-black/50 p-4 rounded-lg mt-2 border border-red-900/30">
                    <Label className="text-white mb-2 block">Expiration Date (optional)</Label>
                    <Input 
                      type="date" 
                      value={options.additional?.expirationDate || ''} 
                      onChange={(e) => {
                        if (!options.additional) return;
                        onChangeOptions({
                          ...options,
                          additional: {
                            ...options.additional,
                            expirationDate: e.target.value
                          }
                        });
                      }} 
                      className="bg-black/80 border-red-900/30 text-white"
                    />
                    
                    <Label className="text-white mb-2 mt-4 block">Domain Restrictions (optional)</Label>
                    <div className="flex space-x-2">
                      <Input 
                        type="text" 
                        placeholder="Add domain (e.g., example.com)" 
                        className="bg-black/80 border-red-900/30 text-white"
                        id="domainInput"
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          if (!options.additional) return;
                          const input = document.getElementById('domainInput') as HTMLInputElement;
                          if (!input.value) return;
                          
                          onChangeOptions({
                            ...options,
                            additional: {
                              ...options.additional,
                              domainLock: [...(options.additional.domainLock || []), input.value]
                            }
                          });
                          input.value = '';
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {options.additional.domainLock && options.additional.domainLock.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {options.additional.domainLock.map((domain: string, index: number) => (
                          <div key={index} className="bg-black px-2 py-1 rounded-md flex items-center text-sm border border-red-900/30 text-white">
                            {domain}
                            <button 
                              className="ml-2 text-gray-400 hover:text-red-500"
                              onClick={() => {
                                if (!options.additional) return;
                                onChangeOptions({
                                  ...options,
                                  additional: {
                                    ...options.additional,
                                    domainLock: options.additional.domainLock?.filter((_: string, i: number) => i !== index)
                                  }
                                });
                              }}
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Label className="text-white mb-2 mt-4 block">Encryption Key (optional)</Label>
                    <Input 
                      type="text" 
                      placeholder="Custom encryption key" 
                      value={options.additional?.encryptionKey || ''} 
                      onChange={(e) => {
                        if (!options.additional) return;
                        onChangeOptions({
                          ...options,
                          additional: {
                            ...options.additional,
                            encryptionKey: e.target.value
                          }
                        });
                      }} 
                      className="bg-black/80 border-red-900/30 text-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-5 p-4 bg-black/40 rounded-lg border border-red-900/30 shadow-lg shadow-red-900/10">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <i className="fas fa-shield-alt text-red-500 text-lg"></i>
          </div>
          <div className="ml-3">
            <h4 className="text-white font-medium">Advanced Protection Features</h4>
            <p className="text-gray-300 text-sm mt-1">
              These advanced protection options will make your code extremely difficult to reverse engineer.
              For executable files (.exe, .dll), we recommend enabling Anti-Debugging and Anti-Dumping features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}