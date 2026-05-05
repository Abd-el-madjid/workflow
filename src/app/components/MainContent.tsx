import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { AlertCircle, Calendar, CheckCircle2, Clock, Upload as UploadIcon, ChevronRight } from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";

interface MainContentProps {
  section: any;
  onChecklistToggle: (itemId: string) => void;
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

export function MainContent({ section, onChecklistToggle }: MainContentProps) {
  const [letterContent, setLetterContent] = useState(section.content || "");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isLetter = section.isLetter || section.content;

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
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
                    Modifiez ce modèle directement dans l'éditeur ci-dessous. Vos modifications seront automatiquement sauvegardées.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="letter-content" className="text-base font-semibold text-slate-800">
                  Contenu de la lettre
                </Label>
                <Textarea
                  id="letter-content"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="min-h-[600px] font-mono text-sm leading-relaxed border-2 focus:border-blue-400 rounded-xl"
                  placeholder="Tapez votre lettre ici..."
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md">
                  Sauvegarder
                </Button>
                <Button variant="outline" className="border-2 hover:bg-slate-50">
                  Exporter en PDF
                </Button>
                <Button variant="outline" className="border-2 hover:bg-slate-50">
                  Réinitialiser
                </Button>
              </div>
            </div>
          ) : (
            // Regular checklist view
            <>
              {/* Checklist Section */}
              {section.items && section.items.length > 0 && (
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

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "border-2 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md",
                            item.checked
                              ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300"
                              : "bg-white border-slate-200 hover:border-slate-300"
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
              )}

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
