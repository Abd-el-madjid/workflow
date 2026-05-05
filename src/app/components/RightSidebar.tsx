import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Upload as UploadIcon,
  History,
  PanelRightOpen,
  FileText,
  Download,
  Eye,
  Clock,

  FileImage,
  File
} from "lucide-react";
import { cn } from "./ui/utils";
import { UploadDialog } from "./UploadDialog";

interface UploadItem {
  id: string;
  name: string;
  type: string;
  date: string;
  url?: string;
}

interface HistoryItem {
  id: string;
  action: string;
  date: string;
  user: string;
}

interface RightSidebarProps {
  uploads: UploadItem[];
  history: HistoryItem[];
  onClose: () => void;
}

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText;
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return FileImage;
  return File;
};

const getFileColor = (type: string) => {
  if (type.includes('pdf')) return 'text-red-600';
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return 'text-blue-600';
  return 'text-slate-600';
};

export function RightSidebar({ uploads, history, onClose }: RightSidebarProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = (file: File) => {
    console.log("Uploading file:", file.name);
    // Handle file upload logic here
  };

  return (
    <>
      <aside className="w-80 bg-gradient-to-br from-slate-50 to-white border-l border-slate-200 flex flex-col min-h-0 shadow-xl hidden lg:flex">
      {/* Header with close button */}
      <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-5">
        <h3 className="font-bold text-slate-900 text-lg">Détails</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <PanelRightOpen className="w-5 h-5 text-slate-600" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Uploads Section */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <UploadIcon className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-900">Documents</h4>
          </div>

          {uploads.length > 0 ? (
            <div className="space-y-3">
              {uploads.map((upload) => {
                const FileIcon = getFileIcon(upload.type);
                const fileColor = getFileColor(upload.type);

                return (
                  <div
                    key={upload.id}
                    className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors", fileColor)}>
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {upload.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {upload.type} • {upload.date}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-blue-50 hover:text-blue-700">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-emerald-50 hover:text-emerald-700">
                            <Download className="w-3 h-3 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <UploadIcon className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 mb-3 font-medium">Aucun document</p>
              <Button
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <UploadIcon className="w-3 h-3 mr-1" />
                Télécharger
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {/* History Section */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-900">Historique</h4>
          </div>

          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="relative">
                  {index !== history.length - 1 && (
                    <div className="absolute left-2.5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-transparent" />
                  )}
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white shadow-sm mt-1 relative z-10 flex-shrink-0" />
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {item.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {item.user}
                        </Badge>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 font-medium">Aucun historique</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>

    <UploadDialog
      open={isUploadDialogOpen}
      onOpenChange={setIsUploadDialogOpen}
      onUpload={handleUpload}
    />
    </>
  );
}
