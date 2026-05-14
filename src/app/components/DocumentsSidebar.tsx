import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  Upload as UploadIcon,
  FileText,
  Download,
  Eye,
  Clock,
  FileImage,
  Pin,
  PinOff,
  X,
} from "lucide-react";
import { cn } from "./ui/utils";
import { UploadDialog } from "./UploadDialog";

interface DocumentsSidebarProps {
  groupId: string;
  open: boolean;
  pinned: boolean;
  onClose: () => void;
  onPinToggle: () => void;
  uploadDocument: (file: File, name: string, title: string, groupId: string) => Promise<void>;
  getDocuments: (groupId: string) => Promise<any[]>;
}

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText;
  if (type.includes("image") || type.includes("png") || type.includes("jpg") || type.includes("jpeg")) return FileImage;
  return FileText;
};

const getFileColor = (type: string) => {
  if (type.includes("pdf")) return "text-red-600";
  if (type.includes("image") || type.includes("png") || type.includes("jpg") || type.includes("jpeg")) return "text-blue-600";
  return "text-slate-600";
};

export function DocumentsSidebar({
  groupId,
  open,
  pinned,
  onClose,
  onPinToggle,
  uploadDocument,
  getDocuments,
}: DocumentsSidebarProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDocuments();
    }
  }, [open, groupId]);

  const fetchDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const docs = await getDocuments(groupId);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleUpload = async (file: File, name: string, title: string, groupId: string) => {
    try {
      await uploadDocument(file, name, title, groupId);
      await fetchDocuments();
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (!open) return null;

  return (
    <>
      <aside className="w-80 bg-gradient-to-br from-slate-50 to-white border-l border-slate-200 flex flex-col min-h-0 shadow-xl hidden lg:flex">
        <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-5">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Documents</h3>
            <p className="text-xs text-slate-500">Section : {groupId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPinToggle}
              className="h-9 w-9 rounded-lg p-0 text-slate-600 hover:bg-slate-100"
            >
              {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-9 w-9 rounded-lg p-0 text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <UploadIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Upload</h4>
                  <p className="text-xs text-slate-500">Pièces jointes par section</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Télécharger
              </Button>
            </div>

            <div className="space-y-3">
              {loadingDocuments ? (
                <div className="rounded-xl border border-slate-200 p-5 text-center text-sm text-slate-500">
                  Chargement des documents...
                </div>
              ) : documents.length > 0 ? (
                documents.map((upload) => {
                  const FileIcon = getFileIcon(upload.file_url || upload.type || "");
                  const fileColor = getFileColor(upload.file_url || upload.type || "");

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
                          <p className="text-sm font-semibold text-slate-900 truncate">{upload.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{upload.title || upload.type || "Document"}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Uploadé le {upload.uploaded_at ? new Date(upload.uploaded_at).toLocaleDateString("fr-FR") : "..."}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-blue-50 hover:text-blue-700" asChild>
                              <a href={upload.file_url} target="_blank" rel="noreferrer">
                                <Eye className="w-3 h-3 mr-1" />
                                Voir
                              </a>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-emerald-50 hover:text-emerald-700" asChild>
                              <a href={upload.file_url} target="_blank" rel="noreferrer" download>
                                <Download className="w-3 h-3 mr-1" />
                                Télécharger
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                    <UploadIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-3 font-medium">Aucun document pour cette section.</p>
                  <p className="text-xs text-slate-400">Téléchargez un document pour le voir ici.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>

      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUpload}
        groupId={groupId}
      />
    </>
  );
}
