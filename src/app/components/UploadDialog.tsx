import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "./ui/utils";
import { supabaseClient } from "../../../supabaseClient";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, name: string, title: string, groupId: string) => Promise<void>;
  groupId: string;
}

export function UploadDialog({ open, onOpenChange, onUpload, groupId }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && name.trim() && title.trim()) {
      setIsUploading(true);
      try {
        await onUpload(selectedFile, name.trim(), title.trim(), groupId);
        setSelectedFile(null);
        setName("");
        setTitle("");
        onOpenChange(false);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            Télécharger un document
          </DialogTitle>
          <DialogDescription>
            Ajoutez un PDF, une image ou tout autre document lié à votre dossier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-name">Nom du document *</Label>
              <Input
                id="doc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Passeport"
                className="border-2 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-title">Titre du document *</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Mon passeport biométrique"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
            )}
          >
          {selectedFile ? (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="mt-2"
              >
                <X className="w-4 h-4 mr-1" />
                Changer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-700">
                  Glissez-déposez un fichier ici
                </p>
                <p className="text-sm text-slate-500">ou</p>
              </div>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm">
                  Parcourir les fichiers
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </Label>
              <p className="text-xs text-slate-400">
                PDF, JPG, PNG, DOC (max. 10MB)
              </p>
            </div>
          )}
        </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFile(null);
              setName("");
              setTitle("");
              onOpenChange(false);
            }}
            className="w-full sm:w-auto"
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !name.trim() || !title.trim() || isUploading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}