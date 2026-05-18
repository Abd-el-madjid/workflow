import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertCircle, Calendar, CheckCircle2, Clock, Upload as UploadIcon, ChevronRight, FileText, X, Download, Plus, Edit, Trash2 } from "lucide-react";
import { cn } from "./ui/utils";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { supabaseClient } from "../../../supabaseClient";
import { BEFORE_SECS, AFTER_SECS } from "../../imports/data";
import type { ChecklistState } from "../hooks/useChecklistAuth";
interface MainContentProps {
  section: any;
  state: ChecklistState;
  onChecklistToggle: (itemId: string) => void;
  getDocuments: (groupId: string) => Promise<any[]>;
  saveLetter: (letterId: string, title: string, content: string, pdfFile?: File) => Promise<void>;
  getLetter: (letterId: string) => Promise<any>;
  setState: Dispatch<SetStateAction<ChecklistState>>;
  onUpdateSection: (section: any) => void;
}

const BADGE_COLORS = {
  "b-amb": "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  "b-red": "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  "b-grn": "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  "b-blu": "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  "b-pur": "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
};

const NOTE_COLORS = {
  "n-blu": "bg-blue-50 border-blue-200 text-blue-900",
  "n-grn": "bg-emerald-50 border-emerald-200 text-emerald-900",
  "n-amb": "bg-amber-50 border-amber-200 text-amber-900",
  "n-red": "bg-red-50 border-red-200 text-red-900",
  "n-pur": "bg-purple-50 border-purple-200 text-purple-900",
};

const TAG_STYLES = {
  "req": { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", label: "Obligatoire", icon: AlertCircle },
  "opt": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", label: "Optionnel", icon: CheckCircle2 },
  "don": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", label: "Fait ✓", icon: CheckCircle2 },
  "inf": { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300", label: "Info", icon: AlertCircle },
};

const ITEM_TYPES = [
  { value: "task", label: "Tâche", icon: "📝" },
  { value: "note", label: "Note", icon: "💡" },
  { value: "instruction", label: "Instruction", icon: "⚠️" },
];

const ITEM_COLOR_CLASSES = {
  "b-blu": "bg-blue-50 border-blue-200 text-slate-900",
  "b-grn": "bg-emerald-50 border-emerald-200 text-slate-900",
  "b-amb": "bg-amber-50 border-amber-200 text-slate-900",
  "b-red": "bg-red-50 border-red-200 text-slate-900",
  "b-pur": "bg-purple-50 border-purple-200 text-slate-900",
  "b-slate": "bg-slate-50 border-slate-200 text-slate-900",
};

const ITEM_STYLE_CLASSES = {
  normal: "",
  small: "text-sm",
  bold: "font-semibold",
};

export function MainContent({ section, state, onChecklistToggle, getDocuments, saveLetter, getLetter, setState, onUpdateSection }: MainContentProps) {
  
  const [sectionData, setSectionData] = useState<any>(section);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    id: "",
    t: "",
    d: "",
    s: "",
    g: [] as string[],
    linkedTo: "",
    type: "task",
    color: "b-blu",
    style: "normal",
  });
  const [noteForm, setNoteForm] = useState({
    t: section.note?.t || "",
    c: section.note?.c || "n-grn"
  });
  const [letterContent, setLetterContent] = useState(section.content || "");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSectionData(section);
    setItemForm({
      id: "",
      t: "",
      d: "",
      s: "",
      g: [],
      linkedTo: "",
      type: "task",
      color: "b-blu",
      style: "normal",
    });
    setNoteForm({
      t: section.note?.t || "",
      c: section.note?.c || "n-grn"
    });
    setLetterContent(section.content || "");
  }, [section]);
  const [isLatexMode, setIsLatexMode] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [letterTitle, setLetterTitle] = useState(section.nm);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [letterPdfFile, setLetterPdfFile] = useState<File | null>(null);

  const isLetter = section.isLetter || section.content;

  useEffect(() => {
    if (isLetter) {
      const loadLetter = async () => {
        try {
          const letterData = await getLetter(section.id);
          if (letterData) {
            setLetterTitle(letterData.title);
            setLetterContent(letterData.content);
            if (letterData.file_path) {
              // Get the public URL for the PDF
              const { data } = supabaseClient.storage
                .from('letters')
                .getPublicUrl(letterData.file_path);
              setCompiledPdfUrl(data.publicUrl);
            }
          }
        } catch (error) {
          console.error("Error loading letter:", error);
        }
      };
      loadLetter();
    }
  }, [isLetter, section.id, getLetter]);

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const generateItemId = (sectionId: string, items: any[], linkedTo: string) => {
    const prefix = sectionId === "resume" ? "r" : sectionId;
    if (sectionId === "resume" && linkedTo) {
      return `r-${linkedTo}`;
    }

    const existingNumbers = (items || [])
      .map((item: any) => item.id)
      .map((id: string) => {
        const match = id.match(new RegExp(`^${prefix}-(?:.*?)(\\d+)$`)) || id.match(new RegExp(`^${prefix}(\\d+)$`));
        return match ? Number(match[1]) : null;
      })
      .filter((n) => n !== null) as number[];

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return sectionId === "resume" ? `r-${nextNumber}` : `${prefix}${nextNumber}`;
  };

  const openAddItemDialog = () => {
    setItemForm({
      id: "",
      t: "",
      d: "",
      s: "",
      g: [],
      linkedTo: "",
      type: "task",
      color: "b-blu",
      style: "normal",
    });
    setEditingItem(null);
    setIsItemDialogOpen(true);
  };

  const openEditItemDialog = (item: any) => {
    setEditingItem(item);
    setItemForm({
      id: item.id,
      t: item.t,
      d: item.d || "",
      s: item.s || "",
      g: item.g || [],
      linkedTo: item.linkedTo || "",
      type: item.type || "task",
      color: item.color || "b-blu",
      style: item.style || "normal",
    });
    setIsItemDialogOpen(true);
  };

  const saveItem = () => {
    const newItems = [...(sectionData.items || [])];
    const id = editingItem
      ? itemForm.id.trim()
      : generateItemId(sectionData.id, sectionData.items || [], itemForm.linkedTo.trim());
    const itemData = {
      id,
      t: itemForm.t.trim(),
      d: itemForm.d.trim(),
      s: itemForm.s.trim(),
      g: itemForm.g,
      linkedTo: itemForm.linkedTo.trim() || null,
      type: itemForm.type,
      color: itemForm.color,
      style: itemForm.style,
      custom: editingItem ? editingItem.custom : true,
    };

    if (editingItem) {
      const index = newItems.findIndex((item) => item.id === editingItem.id);
      if (index >= 0) {
        newItems[index] = { ...newItems[index], ...itemData };
      }
    } else {
      newItems.push(itemData);
    }

    const updatedSection = { ...sectionData, items: newItems };
    setSectionData(updatedSection);
    onUpdateSection(updatedSection);
    if (!state[itemData.id]) {
      setState((prev) => ({ ...prev, [itemData.id]: false }));
    }

    setIsItemDialogOpen(false);
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    const itemToDelete = (sectionData.items || []).find((item: any) => item.id === itemId);
    if (!itemToDelete?.custom) return;

    const updatedSection = {
      ...sectionData,
      items: (sectionData.items || []).filter((item: any) => item.id !== itemId),
    };
    setSectionData(updatedSection);
    onUpdateSection(updatedSection);
  };

  const toggleTag = (tag: string) => {
    setItemForm((prev) => ({
      ...prev,
      g: prev.g.includes(tag) ? prev.g.filter((t) => t !== tag) : [...prev.g, tag],
    }));
  };

  const openEditNoteDialog = () => {
    setNoteForm({
      t: sectionData.note?.t || "",
      c: sectionData.note?.c || "n-grn"
    });
    setIsEditNoteOpen(true);
  };

  const saveNote = () => {
    const updatedSection = {
      ...sectionData,
      note: noteForm.t.trim()
        ? { t: noteForm.t.trim(), c: noteForm.c }
        : null,
    };
    setSectionData(updatedSection);
    onUpdateSection(updatedSection);
    setIsEditNoteOpen(false);
  };

  const tagLabels = {
    req: "Obligatoire",
    opt: "Optionnel",
    don: "Fait",
    inf: "Info",
  };

  const availableTags = ["req", "opt", "don", "inf"];

  const compileLatex = async () => {
    if (!letterContent.trim()) return;

    setIsCompiling(true);
    try {
      // Create a proper LaTeX document
      const latexDocument = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[french]{babel}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\pagestyle{fancy}

\\begin{document}

${letterContent}

\\end{document}`;

      // For demo purposes, we'll use a LaTeX compilation service
      // You can use services like:
      // - LaTeX.js (client-side)
      // - Overleaf API
      // - Custom backend service
      // - Or services like latexonline.cc

      // For now, let's use latexonline.cc as an example
      const response = await fetch('https://latexonline.cc/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: latexDocument,
          command: 'pdflatex',
        }),
      });

      if (response.ok) {
        const pdfBlob = await response.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setCompiledPdfUrl(pdfUrl);
      } else {
        throw new Error('LaTeX compilation failed');
      }
    } catch (error) {
      console.error("LaTeX compilation failed:", error);
      // Fallback: show the LaTeX source as a downloadable text file
      const blob = new Blob([letterContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setCompiledPdfUrl(url);
      alert("LaTeX compilation non disponible. Téléchargez le fichier source LaTeX à la place.");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSaveLetter = async () => {
    if (!letterContent.trim()) return;

    setIsSaving(true);
    try {
      let pdfFile: File | undefined;

      // If we have a compiled PDF, create a file from it
      if (compiledPdfUrl && isLatexMode) {
        const response = await fetch(compiledPdfUrl);
        const blob = await response.blob();
        pdfFile = new File([blob], `${letterTitle}.pdf`, { type: 'application/pdf' });
      }

      await saveLetter(section.id, letterTitle, letterContent, pdfFile);
      alert("Lettre sauvegardée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de la lettre.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Content Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{section.ico}</span>
              {section.badge && (
                <Badge className={cn(
                  "font-semibold border text-xs px-2 py-0.5",
                  BADGE_COLORS[section.badge.c as keyof typeof BADGE_COLORS]
                )}>
                  {section.badge.t}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{section.nm}</h2>
            {section.subtitle && (
              <p className="text-sm text-slate-600 mt-2 italic">{section.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Modifier l'item" : "Ajouter un item"}</DialogTitle>
                  <DialogDescription>Ajoutez directement un élément à cette section.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>ID automatique</Label>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {editingItem
                          ? itemForm.id
                          : generateItemId(sectionData.id, sectionData.items || [], itemForm.linkedTo.trim())}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="item-linked">Relie à</Label>
                      <Input
                        id="item-linked"
                        value={itemForm.linkedTo}
                        onChange={(e) => setItemForm((prev) => ({ ...prev, linkedTo: e.target.value }))}
                        placeholder="cf1, dip1, ..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="item-type">Type</Label>
                      <Select
                        value={itemForm.type}
                        onValueChange={(value) => setItemForm((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="item-color">Couleur</Label>
                      <Select
                        value={itemForm.color}
                        onValueChange={(value) => setItemForm((prev) => ({ ...prev, color: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="b-blu">Bleu</SelectItem>
                          <SelectItem value="b-grn">Vert</SelectItem>
                          <SelectItem value="b-amb">Ambre</SelectItem>
                          <SelectItem value="b-red">Rouge</SelectItem>
                          <SelectItem value="b-pur">Violet</SelectItem>
                          <SelectItem value="b-slate">Neutre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="item-style">Style</Label>
                      <Select
                        value={itemForm.style}
                        onValueChange={(value) => setItemForm((prev) => ({ ...prev, style: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="small">Petit</SelectItem>
                          <SelectItem value="bold">Gras</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="item-title">Titre</Label>
                    <Input
                      id="item-title"
                      value={itemForm.t}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, t: e.target.value }))}
                      placeholder="Titre de l'item"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-desc">Résumé</Label>
                    <Textarea
                      id="item-desc"
                      value={itemForm.d}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, d: e.target.value }))}
                      rows={2}
                      placeholder="Sous-titre léger ou résumé"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-details">Détails ou instruction</Label>
                    <Textarea
                      id="item-details"
                      value={itemForm.s}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, s: e.target.value }))}
                      rows={3}
                      placeholder="Ajoutez une note, une instruction ou un détail déroulant"
                    />
                  </div>
                  <div>
                    <Label>Tags / Flags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={itemForm.g.includes(tag) ? "secondary" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => toggleTag(tag)}
                        >
                          {tagLabels[tag as keyof typeof tagLabels]}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => { setIsItemDialogOpen(false); setEditingItem(null); }}>
                      Annuler
                    </Button>
                    <Button onClick={saveItem} disabled={!itemForm.t.trim()}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={openEditNoteDialog}>
              Modifier la note
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-8 space-y-6 max-w-6xl">
          {/* Note Section */}
          {section.note && (
            <div className={cn(
              "border rounded-xl p-4 md:p-5 flex items-start gap-3 shadow-sm",
              NOTE_COLORS[section.note.c as keyof typeof NOTE_COLORS]
            )}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.note.t }}
                />
              </div>
            </div>
          )}

          <Dialog open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Modifier la note</DialogTitle>
                <DialogDescription>Éditez le texte et la couleur de la note de section.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note-edit-text">Texte de la note</Label>
                  <Textarea
                    id="note-edit-text"
                    value={noteForm.t}
                    onChange={(e) => setNoteForm((prev) => ({ ...prev, t: e.target.value }))}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="note-edit-color">Couleur</Label>
                  <Select
                    value={noteForm.c}
                    onValueChange={(value) => setNoteForm((prev) => ({ ...prev, c: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une couleur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="n-grn">Vert</SelectItem>
                      <SelectItem value="n-blu">Bleu</SelectItem>
                      <SelectItem value="n-amb">Ambre</SelectItem>
                      <SelectItem value="n-red">Rouge</SelectItem>
                      <SelectItem value="n-pur">Violet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsEditNoteOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={saveNote} disabled={!noteForm.t.trim()}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Explanations Section (for definition pages) */}
          {section.expls && section.expls.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full" />
                Définitions importantes
              </h3>
              <div className="space-y-4">
                {section.expls.map((expl: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-lg text-slate-900 mb-3">{expl.t}</h4>
                    <div
                      className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: expl.b }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLetter ? (
            // Letter template editor
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Modèle de lettre</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Modifiez ce modèle directement dans l'éditeur ci-dessous. Choisissez entre le mode texte simple ou LaTeX pour une mise en forme professionnelle.
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-medium text-slate-700">Mode d'édition :</span>
                <div className="flex rounded-lg bg-white border border-slate-200 p-1">
                  <button
                    onClick={() => setIsLatexMode(false)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all",
                      !isLatexMode
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Texte
                  </button>
                  <button
                    onClick={() => setIsLatexMode(true)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all",
                      isLatexMode
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    LaTeX
                  </button>
                </div>
                {isLatexMode && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Utilisez la syntaxe LaTeX pour une mise en forme professionnelle
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="letter-title" className="text-base font-semibold text-slate-800">
                  Titre de la lettre
                </Label>
                <input
                  id="letter-title"
                  type="text"
                  value={letterTitle}
                  onChange={(e) => setLetterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre de votre lettre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="letter-content" className="text-base font-semibold text-slate-800">
                  Contenu de la lettre {isLatexMode && "(LaTeX)"}
                </Label>
                <Textarea
                  id="letter-content"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className={cn(
                    "min-h-[600px] text-sm leading-relaxed border-2 focus:border-blue-400 rounded-xl",
                    isLatexMode ? "font-mono" : "font-sans"
                  )}
                  placeholder={
                    isLatexMode
                      ? "\\documentclass{article}\n\\begin{document}\nVotre lettre en LaTeX ici...\n\\end{document}"
                      : "Tapez votre lettre ici..."
                  }
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSaveLetter}
                  disabled={isSaving || !letterContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                >
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>

                {isLatexMode ? (
                  <Button
                    onClick={compileLatex}
                    disabled={isCompiling || !letterContent.trim()}
                    variant="outline"
                    className="border-2 hover:bg-slate-50"
                  >
                    {isCompiling ? "Compilation..." : "Compiler LaTeX → PDF"}
                  </Button>
                ) : (
                  <Button variant="outline" className="border-2 hover:bg-slate-50">
                    Exporter en PDF
                  </Button>
                )}

                <div className="relative">
                  <Button
                    variant="outline"
                    className="border-2 hover:bg-slate-50"
                    onClick={() => document.getElementById('letter-pdf-upload')?.click()}
                  >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Télécharger PDF existant
                  </Button>
                  <input
                    id="letter-pdf-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLetterPdfFile(file);
                        const url = URL.createObjectURL(file);
                        setCompiledPdfUrl(url);
                      }
                    }}
                  />
                </div>

                <Button variant="outline" className="border-2 hover:bg-slate-50">
                  Réinitialiser
                </Button>
              </div>

              {/* PDF Preview */}
              {compiledPdfUrl && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">
                        {isLatexMode ? "PDF généré avec succès" : "PDF chargé"}
                      </h4>
                      <p className="text-sm text-green-700">
                        {isLatexMode
                          ? "Votre lettre LaTeX a été compilée en PDF"
                          : "Votre PDF a été chargé avec succès"
                        }
                      </p>
                      {letterPdfFile && (
                        <p className="text-xs text-green-600 mt-1">
                          Fichier : {letterPdfFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <a
                        href={compiledPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={
                          isLatexMode
                            ? `${section.title || 'letter'}.pdf`
                            : letterPdfFile?.name || 'letter.pdf'
                        }
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger PDF
                      </a>
                    </Button>
                    <Button
                      onClick={() => {
                        setCompiledPdfUrl(null);
                        setLetterPdfFile(null);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Regular checklist view
            <>
              {/* Résumé - Simple list view */}
              {section.id === "resume" && section.items && section.items.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      ✓ Cochez les documents à mesure que vous les préparez. Les items seront marqués dans le résumé au fur et à mesure.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {section.items.map((item: any) => {
                      // Find if the linked item is checked in the main state
                      const linkedItemId = item.linkedTo;
                      let isChecked = false;
                      let linkedSectionId = "";

                      if (linkedItemId) {
                        // Search through all sections to find which section contains this item
                        const allSections = [...BEFORE_SECS, ...AFTER_SECS];
                        for (const otherSection of allSections) {
                          if (otherSection.items) {
                            const found = otherSection.items.find((i: any) => i.id === linkedItemId);
                            if (found) {
                              linkedSectionId = otherSection.id;
                              isChecked = state[linkedItemId] || false;
                              break;
                            }
                          }
                        }
                      } else {
                        isChecked = state[item.id] || false;
                      }

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                            isChecked
                              ? "bg-emerald-50 border-emerald-300"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <Checkbox
                            id={item.id}
                            checked={isChecked}
                            onCheckedChange={() => {
                              if (linkedItemId) {
                                onChecklistToggle(linkedItemId);
                              } else {
                                onChecklistToggle(item.id);
                              }
                            }}
                            className="w-4 h-4 border-2"
                          />
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={item.id}
                              className={cn(
                                "text-sm font-medium cursor-pointer transition-colors",
                                isChecked
                                  ? "text-emerald-800 line-through"
                                  : "text-slate-900"
                              )}
                            >
                              {item.t}
                            </label>
                            {linkedSectionId && isChecked && (
                              <p className="text-xs text-emerald-700 mt-1">
                                Fait dans une autre section.
                              </p>
                            )}
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.d}
                            </p>
                          </div>
                          {item.g?.includes("req") && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold flex-shrink-0">
                              Obligatoire
                            </span>
                          )}
                          {item.g?.includes("opt") && !item.g?.includes("req") && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold flex-shrink-0">
                              Optionnel
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : section.items && section.items.length > 0 ? (
                /* Normal expanded checklist items */
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-emerald-600 to-cyan-600 rounded-full" />
                      {section.chain ? "Étapes à suivre" : "Liste des tâches"}
                    </span>
                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {section.items.filter((i: any) => i.checked).length} / {section.items.length} complétées
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {section.items.map((item: any, idx: number) => {
                      const isExpanded = expandedItems.has(item.id);
                      const primaryTag = item.g?.[0];
                      const secondaryTag = item.g?.[1];
                      const tagStyle = TAG_STYLES[primaryTag as keyof typeof TAG_STYLES];
                      const itemType = ITEM_TYPES.find((type) => type.value === item.type);
                      const itemColorClass = !item.checked ? ITEM_COLOR_CLASSES[(item.color || "b-slate") as keyof typeof ITEM_COLOR_CLASSES] : "";
                      const itemStyleClass = ITEM_STYLE_CLASSES[(item.style || "normal") as keyof typeof ITEM_STYLE_CLASSES];

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "border-2 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md",
                            item.checked
                              ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300"
                              : cn("bg-white border-slate-200 hover:border-slate-300", itemColorClass),
                            itemStyleClass
                          )}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              {section.chain && (
                                <div className="flex flex-col items-center gap-1 mt-1">
                                  <div className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors",
                                    item.checked
                                      ? "bg-emerald-500 text-white border-emerald-600"
                                      : "bg-white text-slate-600 border-slate-300"
                                  )}>
                                    {idx + 1}
                                  </div>
                                  {idx < section.items.length - 1 && (
                                    <div className="w-0.5 h-8 bg-slate-200 rounded-full" />
                                  )}
                                </div>
                              )}

                              <Checkbox
                                id={item.id}
                                checked={item.checked}
                                onCheckedChange={() => onChecklistToggle(item.id)}
                                className="mt-1.5 w-5 h-5 border-2"
                              />

                              <div className="flex-1 min-w-0">
                                {itemType && (
                                  <div className="inline-flex items-center gap-2 mb-3 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
                                    <span>{itemType.icon}</span>
                                    <span>{itemType.label}</span>
                                  </div>
                                )}
                                <button
                                  onClick={() => toggleItemExpanded(item.id)}
                                  className="w-full text-left group"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className={cn(
                                      "font-semibold text-base leading-tight transition-colors",
                                      item.checked
                                        ? "text-emerald-800 line-through"
                                        : "text-slate-900 group-hover:text-blue-600"
                                    )}>
                                      {item.t}
                                    </h4>
                                    <ChevronRight className={cn(
                                      "w-5 h-5 text-slate-400 transition-transform flex-shrink-0 mt-0.5",
                                      isExpanded && "rotate-90"
                                    )} />
                                  </div>
                                </button>

                                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                                  {item.d}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                  {tagStyle && (
                                    <Badge className={cn(
                                      "text-xs font-semibold border px-2 py-0.5",
                                      tagStyle.bg,
                                      tagStyle.text,
                                      tagStyle.border
                                    )}>
                                      {tagStyle.label}
                                    </Badge>
                                  )}
                                  {secondaryTag && (
                                    <Badge className="text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {secondaryTag}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => openEditItemDialog(item)}
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Modifier
                                  </Button>
                                  {item.custom && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs text-rose-600 border-rose-300 hover:text-rose-700"
                                      onClick={() => deleteItem(item.id)}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Supprimer
                                    </Button>
                                  )}
                                </div>

                                {isExpanded && item.s && (
                                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div
                                      className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: item.s }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {(!section.items || section.items.length === 0) && !section.expls && (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Aucune tâche pour le moment</p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
