import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  LogOut,
  User,
  Cloud,
  ChevronRight,
  ChevronDown,
  PanelRightClose,
  Menu,
  FileText
} from "lucide-react";
import { cn } from "./ui/utils";
import { MainContent } from "./MainContent";
import { RightSidebar } from "./RightSidebar";
import { DocumentsSidebar } from "./DocumentsSidebar";
import { BEFORE_SECS, AFTER_SECS } from "../../imports/data";
import { LETTERS } from "../../imports/Letters";

import type { ChecklistState, ChecklistProgress } from "../hooks/useChecklistAuth";


interface DashboardLayoutProps {
  user: any;
  state: ChecklistState;
  progress: ChecklistProgress;
  saveStatus: string;
  saveLoading: boolean;
  onToggle: (id: string) => void;
  onReset: () => void;
  onLogout: () => void;
  uploadDocument: (file: File, name: string, title: string, groupId: string) => Promise<void>;
  getDocuments: (groupId: string) => Promise<any[]>;
  saveLetter: (letterId: string, title: string, content: string, pdfFile?: File) => Promise<void>;
  getLetter: (letterId: string) => Promise<any>;
}


const BADGE_COLORS = {
  "b-amb": "bg-amber-100 text-amber-800 border-amber-300",
  "b-red": "bg-red-100 text-red-800 border-red-300",
  "b-grn": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "b-blu": "bg-blue-100 text-blue-800 border-blue-300",
  "b-pur": "bg-purple-100 text-purple-800 border-purple-300",
};

const menuData = [
  {
    id: "avant-visa",
    label: "Avant le visa",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
    sections: BEFORE_SECS
  },
  {
    id: "apres-visa",
    label: "Après le visa",
    icon: "✈️",
    color: "from-purple-500 to-pink-500",
    sections: AFTER_SECS
  },
  {
    id: "lettres",
    label: "Lettres",
    icon: "📨",
    color: "from-orange-500 to-red-500",
    sections: LETTERS.map(letter => ({
      ...letter,
      ico: "📝",
      bg: "#fef3c7",
      nm: letter.title,
      badge: { t: "Modèle", c: "b-amb" },
      items: [],
      isLetter: true
    }))
  }
];

export function DashboardLayout({
  user,
  state,
  progress,
  saveStatus,
  saveLoading,
  onToggle,
  onReset,
  onLogout,
  uploadDocument,
  getDocuments,
  saveLetter,
  getLetter,
}: DashboardLayoutProps) {
  const [selectedMenu, setSelectedMenu] = useState<string>("avant-visa");
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["avant-visa"]));
  const [selectedSection, setSelectedSection] = useState<any>(BEFORE_SECS[0]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isDocumentsSidebarOpen, setIsDocumentsSidebarOpen] = useState(false);
  const [isDocumentsPinned, setIsDocumentsPinned] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const status = saveLoading
    ? "saving"
    : saveStatus === "unsaved"
    ? "unsaved"
    : "saved";
  const currentMenu = menuData.find(m => m.id === selectedMenu);

  const getSectionWithState = (section: any) => {
    if (!section) return section;
    return {
      ...section,
      items: section.items?.map((item: any) => ({
        ...item,
        checked: state[item.id] ?? false,
      })),
    };
  };

  const selectedSectionWithState = getSectionWithState(selectedSection);

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const toggleChecklistItem = (itemId: string) => {
    onToggle(itemId);
  };

  const openDocumentsSidebar = () => {
    setIsDocumentsSidebarOpen(true);
  };

  const toggleDocumentsSidebar = () => {
    setIsDocumentsSidebarOpen((prev) => {
      const next = !prev;
      if (!next && isDocumentsPinned) {
        setIsDocumentsPinned(false);
      }
      return next;
    });
  };

  const toggleDocumentsPin = () => {
    setIsDocumentsPinned((prev) => !prev);
    setIsDocumentsSidebarOpen(true);
  };

  const overallProgress = progress.percentage;
  const allProgress = {
    completed: progress.checked,
    total: progress.total,
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Visa Tracker
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
<Cloud className={cn(
  "w-4 h-4 transition-colors",
  status === "saved" && "text-emerald-600",
  status === "saving" && "text-blue-600 animate-pulse",
  status === "unsaved" && "text-orange-600"
)} />
            <span className={cn(
              "font-medium transition-colors",
              status === "saved" && "text-emerald-700",
              status === "saving" && "text-blue-700",
              status === "unsaved" && "text-orange-700"
            )}>
              {status === "saved" && "Sauvegardé"}
              {status === "saving" && "Sauvegarde..."}
              {status === "unsaved" && "Non sauvegardé"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={saveLoading}
            className="hidden md:inline-flex h-9 px-3 text-slate-700 border-slate-200 hover:bg-slate-100"
          >
            {saveLoading ? "Enregistrement..." : "Réinitialiser"}
          </Button>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                {user.email || user.user_metadata?.full_name || user.id}
              </span>
              <span className="text-xs text-slate-500">Connecté</span>
            </div>
            <span className="text-sm font-semibold text-slate-700 md:hidden truncate max-w-[120px]">
              {user.email ? user.email.split('@')[0] : user.id?.slice(0, 8)}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col border-r border-slate-700/50 shadow-2xl",
          "absolute md:relative z-50 h-[calc(100vh-4rem)] md:h-auto transition-transform duration-300",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          {/* Top section - Progress & Menu */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-6 space-y-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Progression totale</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {overallProgress}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/50">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/50"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400 flex items-center justify-between">
                  <span>{allProgress.completed} sur {allProgress.total} tâches</span>
                  <span className="text-emerald-400 font-medium">
                    {allProgress.total - allProgress.completed} restantes
                  </span>
                </p>
              </div>
            </div>

            <Separator className="bg-slate-700/50" />

            {/* Menu */}
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
                {menuData.map((menu) => (
                  <div key={menu.id}>
                    <button
                      onClick={() => {
                        setSelectedMenu(menu.id);
                        toggleMenu(menu.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        selectedMenu === menu.id
                          ? `bg-gradient-to-r ${menu.color} text-white shadow-lg`
                          : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                      )}
                    >
                      <span className="text-xl">{menu.icon}</span>
                      <span className="flex-1 text-left font-semibold text-sm">{menu.label}</span>
                      {expandedMenus.has(menu.id) ? (
                        <ChevronDown className="w-4 h-4 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 transition-transform" />
                      )}
                    </button>

                    {/* Submenu */}
                    {expandedMenus.has(menu.id) && (
                      <div className="mt-2 ml-2 space-y-1">
                        {menu.sections.map((section: any) => {
                          const sectionCompleted = section.items?.filter((i: any) => state[i.id]).length || 0;
                          const sectionTotal = section.items?.length || 0;

                          return (
                            <button
                              key={section.id}
                              onClick={() => {
                                setSelectedSection(section);
                                setIsMobileSidebarOpen(false);
                                if (!isDocumentsPinned) {
                                  setIsDocumentsSidebarOpen(false);
                                }
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                                selectedSection.id === section.id
                                  ? "bg-slate-800/80 text-white shadow-md border border-slate-700"
                                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-base mt-0.5">{section.ico}</span>
                                <div className="flex-1 min-w-0">
                                  <span className="line-clamp-2 leading-tight block">{section.nm}</span>
                                  {sectionTotal > 0 && (
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                                          style={{ width: `${(sectionCompleted / sectionTotal) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-slate-500 tabular-nums">
                                        {sectionCompleted}/{sectionTotal}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Bottom section - Logout */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <MainContent
            section={selectedSectionWithState}
            state={state}
            onChecklistToggle={toggleChecklistItem}
            getDocuments={getDocuments}
            saveLetter={saveLetter}
            getLetter={getLetter}
          />
        </main>

        {/* Details sidebar */}
        {isRightSidebarOpen && (
          <RightSidebar
            history={selectedSection.history || []}
            onClose={() => {
              setIsRightSidebarOpen(false);
              if (!isDocumentsPinned) {
                setIsDocumentsSidebarOpen(false);
              }
            }}
            groupId={selectedSection.id}
          />
        )}

        {/* Documents sidebar */}
        {(isDocumentsSidebarOpen || isDocumentsPinned) && (
          <DocumentsSidebar
            groupId={selectedSection.id}
            open={isDocumentsSidebarOpen || isDocumentsPinned}
            pinned={isDocumentsPinned}
            onClose={() => {
              setIsDocumentsSidebarOpen(false);
              if (isDocumentsPinned) setIsDocumentsPinned(false);
            }}
            onPinToggle={toggleDocumentsPin}
            uploadDocument={uploadDocument}
            getDocuments={getDocuments}
          />
        )}

        {/* Toggle button for right sidebar */}
        {!isRightSidebarOpen && (
          <button
            onClick={() => setIsRightSidebarOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border border-l-0 border-slate-200 rounded-l-xl p-3 shadow-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-2xl z-30 hidden md:block"
          >
            <PanelRightClose className="w-5 h-5 text-slate-600" />
          </button>
        )}

        {/* Toggle button for documents sidebar */}
        {!isDocumentsSidebarOpen && !isDocumentsPinned && (
          <button
            onClick={toggleDocumentsSidebar}
            className="fixed right-0 top-[60%] -translate-y-1/2 bg-white border border-l-0 border-slate-200 rounded-l-xl p-3 shadow-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-2xl z-30 hidden md:block"
          >
            <FileText className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>
    </div>
  );
}
