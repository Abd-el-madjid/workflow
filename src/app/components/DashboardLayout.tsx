import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  LogOut,
  User,
  Cloud,
  ChevronRight,
  ChevronDown,
  PanelRightClose,
  Menu,
  FileText,
  Plus,
  Tag,
  AlertCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Settings,
} from "lucide-react";
import { cn } from "./ui/utils";
import { MainContent } from "./MainContent";
import { RightSidebar } from "./RightSidebar";
import { DocumentsSidebar } from "./DocumentsSidebar";
import { BEFORE_SECS, AFTER_SECS } from "../../imports/data";
import { LETTERS } from "../../imports/Letters";

type DashboardLayoutProps = Record<string, any>;

const BADGE_COLORS = {
  "b-amb": "bg-amber-100 text-amber-800 border-amber-300",
  "b-red": "bg-red-100 text-red-800 border-red-300",
  "b-grn": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "b-blu": "bg-blue-100 text-blue-800 border-blue-300",
  "b-pur": "bg-purple-100 text-purple-800 border-purple-300",
};

const SECTION_ICON_OPTIONS = ["📝", "📌", "🎯", "✈️", "✅", "📄", "🔔", "🛂", "📎", "💡"];
const SECTION_BADGE_PRESETS = [
  { text: "À lire", color: "b-blu" },
  { text: "Important", color: "b-red" },
  { text: "Nouveau", color: "b-grn" },
  { text: "Optionnel", color: "b-amb" },
];

const MENU_ICON_OPTIONS = ["📁", "📌", "✈️", "🎯", "🗂️", "📝", "📨", "💡", "🔔"];
const MENU_COLOR_OPTIONS = [
  { label: "Bleu", value: "from-blue-500 to-cyan-500" },
  { label: "Violet", value: "from-purple-500 to-pink-500" },
  { label: "Orange", value: "from-orange-500 to-red-500" },
  { label: "Vert", value: "from-emerald-500 to-lime-500" },
  { label: "Gris", value: "from-slate-500 to-slate-700" },
];

const menuData = [
  {
    id: "avant-visa",
    label: "Avant le visa",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
    sections: BEFORE_SECS.map((section) => ({ ...section, custom: false })),
    custom: false,
  },
  {
    id: "apres-visa",
    label: "Après le visa",
    icon: "✈️",
    color: "from-purple-500 to-pink-500",
    sections: AFTER_SECS.map((section) => ({ ...section, custom: false })),
    custom: false,
  },
  {
    id: "lettres",
    label: "Lettres",
    icon: "📨",
    color: "from-orange-500 to-red-500",
    sections: LETTERS.map((letter) => ({
      ...letter,
      ico: "📝",
      bg: "#fef3c7",
      nm: letter.title,
      badge: { t: "Modèle", c: "b-amb" },
      items: [],
      isLetter: true,
      custom: false,
    })),
    custom: false,
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
  setState,
  onShowDataManager,
}: DashboardLayoutProps) {
  const [menuState, setMenuState] = useState(menuData);
  const [selectedMenu, setSelectedMenu] = useState<string>(menuData[0]?.id || "avant-visa");
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set([menuData[0]?.id || "avant-visa"]));
  const [selectedSection, setSelectedSection] = useState<any>(menuData[0]?.sections?.[0] || BEFORE_SECS[0]);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [newMenuTitle, setNewMenuTitle] = useState("");
  const [newMenuIcon, setNewMenuIcon] = useState("📁");
  const [newMenuColor, setNewMenuColor] = useState("from-slate-500 to-slate-600");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionIcon, setNewSectionIcon] = useState("📝");
  const [newSectionBadgeText, setNewSectionBadgeText] = useState("");
  const [newSectionBadgeColor, setNewSectionBadgeColor] = useState("b-blu");
  const [newSectionNoteText, setNewSectionNoteText] = useState("");
  const [newSectionNoteColor, setNewSectionNoteColor] = useState("n-grn");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isDocumentsSidebarOpen, setIsDocumentsSidebarOpen] = useState(false);
  const [isDocumentsPinned, setIsDocumentsPinned] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const status = saveLoading
    ? "saving"
    : saveStatus === "unsaved"
    ? "unsaved"
    : "saved";
  const currentMenu = menuState.find(m => m.id === selectedMenu);

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

  const updateSection = (updatedSection: any) => {
    setMenuState((prev) =>
      prev.map((menu) => ({
        ...menu,
        sections: menu.sections.map((section: any) =>
          section.id === updatedSection.id ? updatedSection : section
        ),
      }))
    );
    setSelectedSection(updatedSection);
  };

  const generateMenuId = (title: string) => {
    return title
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const generateSectionId = (title: string) => {
    return title
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCreateSection = () => {
    if (!newSectionTitle.trim()) return;

    const generatedId = generateSectionId(newSectionTitle) || `sec-${Date.now()}`;
    const newSection = {
      id: generatedId,
      nm: newSectionTitle.trim(),
      ico: newSectionIcon || "📝",
      badge: newSectionBadgeText.trim()
        ? { t: newSectionBadgeText.trim(), c: newSectionBadgeColor }
        : null,
      note: newSectionNoteText.trim()
        ? { t: newSectionNoteText.trim(), c: newSectionNoteColor }
        : null,
      items: [],
      custom: true,
    };

    setMenuState((prev: any) =>
      prev.map((menu: any) =>
        menu.id === selectedMenu
          ? { ...menu, sections: [...menu.sections, newSection] }
          : menu
      )
    );
    setSelectedSection(newSection);
    setIsAddSectionOpen(false);
    setNewSectionTitle("");
    setNewSectionIcon("📝");
    setNewSectionBadgeText("");
    setNewSectionBadgeColor("b-blu");
    setNewSectionNoteText("");
    setNewSectionNoteColor("n-grn");
  };

  const handleCreateMenu = () => {
    if (!newMenuTitle.trim()) return;

    const generatedMenuId = generateMenuId(newMenuTitle) || `menu-${Date.now()}`;
    const initialSection = {
      id: `${generatedMenuId}-section-1`,
      nm: "Nouvelle section",
      ico: "📝",
      items: [],
      custom: true,
    };

    const newMenu = {
      id: generatedMenuId,
      label: newMenuTitle.trim(),
      icon: newMenuIcon,
      color: newMenuColor,
      sections: [initialSection],
      custom: true,
    };

    setMenuState((prev: any) => [...prev, newMenu]);
    setSelectedMenu(newMenu.id);
    setExpandedMenus((prev) => new Set(prev).add(newMenu.id));
    setSelectedSection(initialSection);
    setIsAddMenuOpen(false);
    setNewMenuTitle("");
    setNewMenuIcon("📁");
    setNewMenuColor("from-slate-500 to-slate-600");
  };

  const openAddSectionDialog = (menuId: string) => {
    setSelectedMenu(menuId);
    setExpandedMenus((prev) => new Set(prev).add(menuId));
    setIsAddSectionOpen(true);
    setEditingSection(null);
    setNewSectionTitle("");
    setNewSectionIcon("📝");
    setNewSectionBadgeText("");
    setNewSectionBadgeColor("b-blu");
    setNewSectionNoteText("");
    setNewSectionNoteColor("n-grn");
  };

  const openEditSectionDialog = (section: any) => {
    setEditingSection(section);
    setSelectedSection(section);
    setNewSectionTitle(section.nm || "");
    setNewSectionIcon(section.ico || "📝");
    setNewSectionBadgeText(section.badge?.t || "");
    setNewSectionBadgeColor(section.badge?.c || "b-blu");
    setNewSectionNoteText(section.note?.t || "");
    setNewSectionNoteColor(section.note?.c || "n-grn");
    setIsAddSectionOpen(true);
  };

  const handleSaveSection = () => {
    if (!newSectionTitle.trim()) return;

    if (editingSection) {
      const updatedSection = {
        ...editingSection,
        nm: newSectionTitle.trim(),
        ico: newSectionIcon || "📝",
        badge: newSectionBadgeText.trim()
          ? { t: newSectionBadgeText.trim(), c: newSectionBadgeColor }
          : null,
        note: newSectionNoteText.trim()
          ? { t: newSectionNoteText.trim(), c: newSectionNoteColor }
          : null,
      };

      setMenuState((prev: any) =>
        prev.map((menu: any) =>
          menu.id === selectedMenu
            ? {
                ...menu,
                sections: menu.sections.map((section: any) =>
                  section.id === editingSection.id ? updatedSection : section
                ),
              }
            : menu
        )
      );
      setSelectedSection(updatedSection);
      setEditingSection(null);
      setIsAddSectionOpen(false);
      return;
    }

    handleCreateSection();
  };

  const openEditMenuDialog = (menu: any) => {
    setEditingMenu(menu);
    setSelectedMenu(menu.id);
    setNewMenuTitle(menu.label || "");
    setNewMenuIcon(menu.icon || "📁");
    setNewMenuColor(menu.color || "from-slate-500 to-slate-600");
    setIsAddMenuOpen(true);
  };

  const handleSaveMenu = () => {
    if (!newMenuTitle.trim()) return;

    if (editingMenu) {
      const updatedMenu = {
        ...editingMenu,
        label: newMenuTitle.trim(),
        icon: newMenuIcon,
        color: newMenuColor,
      };

      setMenuState((prev: any) =>
        prev.map((menu: any) =>
          menu.id === editingMenu.id ? updatedMenu : menu
        )
      );
      setEditingMenu(null);
      setIsAddMenuOpen(false);
      return;
    }

    handleCreateMenu();
  };

  const handleDeleteMenuById = (menuId: string) => {
    const menuToDelete = menuState.find((menu) => menu.id === menuId);
    if (!(menuToDelete as any)?.custom) return;

    setMenuState((prev: any) => {
      const updatedMenus = prev.filter((menu: any) => menu.id !== menuId);
      const nextMenu = updatedMenus[0];
      if (nextMenu) {
        setSelectedMenu(nextMenu.id);
        setExpandedMenus((prevExpanded) => new Set(prevExpanded).add(nextMenu.id));
        setSelectedSection(nextMenu.sections?.[0] || null);
      } else {
        setSelectedMenu("");
        setSelectedSection(null);
      }
      return updatedMenus;
    });
  };

  const handleDeleteSection = () => {
    if (!selectedSection?.custom) return;

    setMenuState((prev: any) =>
      prev.map((menu: any) => {
        if (menu.id !== selectedMenu) return menu;
        const updatedSections = menu.sections.filter(
          (section: any) => section.id !== selectedSection.id
        );
        return { ...menu, sections: updatedSections };
      })
    );

    const currentMenu = menuState.find((menu) => menu.id === selectedMenu);
    const nextSection = currentMenu?.sections?.find(
      (section: any) => section.id !== selectedSection.id
    );

    setSelectedSection(nextSection || currentMenu?.sections?.[0] || null);
    setIsAddSectionOpen(false);
  };

  const handleDeleteMenu = () => {
    if (!(currentMenu as any)?.custom) return;

    setMenuState((prev: any) => {
      const updatedMenus = prev.filter((menu: any) => menu.id !== selectedMenu);
      const nextMenu = updatedMenus[0];
      if (nextMenu) {
        setSelectedMenu(nextMenu.id);
        setExpandedMenus((prevExpanded) => new Set(prevExpanded).add(nextMenu.id));
        setSelectedSection(nextMenu.sections?.[0] || null);
      } else {
        setSelectedMenu("");
        setSelectedSection(null);
      }
      return updatedMenus;
    });
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
          <Button
            variant="outline"
            size="sm"
            onClick={onShowDataManager}
            className="hidden md:inline-flex h-9 px-3 text-slate-700 border-slate-200 hover:bg-slate-100"
          >
            Gérer les données
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
                {menuState.map((menu) => (
                  <div key={menu.id}>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedMenu(menu.id);
                          toggleMenu(menu.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openAddSectionDialog(menu.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                          aria-label="Ajouter une section"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                              aria-label="Actions du chapitre"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            {menu.custom ? (
                              <>
                                <DropdownMenuItem onSelect={() => openEditMenuDialog(menu)}>
                                  <Edit3 className="w-4 h-4" /> Modifier le chapitre
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() => handleDeleteMenuById(menu.id)}
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" /> Supprimer le chapitre
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem disabled>
                                <Edit3 className="w-4 h-4" /> Aucune action disponible
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Submenu */}
                    {expandedMenus.has(menu.id) && (
                      <div className="mt-2 ml-2 space-y-1">
                        {menu.sections.map((section: any) => {
                          const sectionCompleted = section.items?.filter((i: any) => state[i.id]).length || 0;
                          const sectionTotal = section.items?.length || 0;
                          const isCustomSection = !!section.custom;

                          return (
                            <div key={section.id} className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedSection(section);
                                  setIsMobileSidebarOpen(false);
                                  if (!isDocumentsPinned) {
                                    setIsDocumentsSidebarOpen(false);
                                  }
                                }}
                                className={cn(
                                  "flex-1 text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                                  selectedSection?.id === section.id
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
                              {isCustomSection ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                                      aria-label="Actions de la section"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-44">
                                    <DropdownMenuItem onSelect={() => openEditSectionDialog(section)}>
                                      <Edit3 className="w-4 h-4" /> Modifier la section
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onSelect={() => {
                                        setSelectedSection(section);
                                        handleDeleteSection();
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" /> Supprimer la section
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openEditSectionDialog(section)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                                  aria-label="Modifier la section"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="px-4 pb-4 pt-3 border-t border-slate-700/50 bg-slate-950/60">
              <div className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-1">
                  <Dialog open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="w-full justify-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un chapitre
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingMenu ? "Modifier le chapitre" : "Nouveau chapitre"}</DialogTitle>
                        <DialogDescription>
                          {editingMenu
                            ? "Modifiez les informations du chapitre."
                            : "Ajoutez un nouveau chapitre au menu principal."}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>ID du chapitre</Label>
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                            {generateMenuId(newMenuTitle) || "sera généré automatiquement"}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="menu-name">Nom du chapitre</Label>
                          <Input
                            id="menu-name"
                            value={newMenuTitle}
                            onChange={(e) => setNewMenuTitle(e.target.value)}
                            placeholder="Nom du chapitre"
                          />
                        </div>
                        <div>
                          <Label htmlFor="menu-icon">Icône du chapitre</Label>
                          <Select
                            value={newMenuIcon}
                            onValueChange={(value) => setNewMenuIcon(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une icône" />
                            </SelectTrigger>
                            <SelectContent>
                              {MENU_ICON_OPTIONS.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="menu-color">Couleur du chapitre</Label>
                          <Select
                            value={newMenuColor}
                            onValueChange={(value) => setNewMenuColor(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une couleur" />
                            </SelectTrigger>
                            <SelectContent>
                              {MENU_COLOR_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-between gap-2 pt-2">
                          <Button variant="outline" onClick={() => setIsAddMenuOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleSaveMenu} disabled={!newMenuTitle.trim()}>
                            {editingMenu ? "Enregistrer" : "Créer"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingSection ? "Modifier la section" : "Nouvelle section"}</DialogTitle>
                    <DialogDescription>
                      {editingSection
                        ? "Modifiez les informations de la section."
                        : "Ajoutez une nouvelle section à ce chapitre."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>ID de section</Label>
                      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {generateSectionId(newSectionTitle) || "sera généré automatiquement"}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="section-name">Nom de la section</Label>
                      <Input
                        id="section-name"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="Nom de la section"
                      />
                    </div>
                    <div>
                      <Label htmlFor="section-icon">Icône</Label>
                      <Select
                        value={newSectionIcon}
                        onValueChange={(value) => setNewSectionIcon(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une icône" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_ICON_OPTIONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="badge-text">Badge</Label>
                      <Select
                        value={newSectionBadgeText}
                        onValueChange={(value) => {
                          setNewSectionBadgeText(value);
                          const preset = SECTION_BADGE_PRESETS.find((item) => item.text === value);
                          if (preset) setNewSectionBadgeColor(preset.color);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un badge" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTION_BADGE_PRESETS.map((badge) => (
                            <SelectItem key={badge.text} value={badge.text}>
                              {badge.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="badge-color">Couleur du badge</Label>
                      <Select
                        value={newSectionBadgeColor}
                        onValueChange={(value) => setNewSectionBadgeColor(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="b-amb">Ambre</SelectItem>
                          <SelectItem value="b-grn">Vert</SelectItem>
                          <SelectItem value="b-blu">Bleu</SelectItem>
                          <SelectItem value="b-red">Rouge</SelectItem>
                          <SelectItem value="b-pur">Violet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="note-text">Note</Label>
                      <Textarea
                        id="note-text"
                        value={newSectionNoteText}
                        onChange={(e) => setNewSectionNoteText(e.target.value)}
                        placeholder="Texte de note"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="note-color">Couleur de note</Label>
                      <Select
                        value={newSectionNoteColor}
                        onValueChange={(value) => setNewSectionNoteColor(value)}
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
                    <div className="flex justify-between gap-2 pt-2">
                      <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleSaveSection} disabled={!newSectionTitle.trim()}>
                        {editingSection ? "Enregistrer" : "Créer"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
            setState={setState}
            onUpdateSection={updateSection}
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
