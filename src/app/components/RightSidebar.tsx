import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { History, PanelRightOpen, Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  action: string;
  date: string;
  user: string;
}

interface RightSidebarProps {
  history: HistoryItem[];
  onClose: () => void;
  groupId: string;
}

export function RightSidebar({ history, onClose, groupId }: RightSidebarProps) {
  return (
    <aside className="w-80 bg-gradient-to-br from-slate-50 to-white border-l border-slate-200 flex flex-col min-h-0 shadow-xl hidden lg:flex">
      <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-5">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Détails</h3>
          <p className="text-xs text-slate-500">Section : {groupId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <PanelRightOpen className="w-5 h-5 text-slate-600" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Historique</h4>
              <p className="text-xs text-slate-500">Suivi des actions</p>
            </div>
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
  );
}
