import { useState, createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, FileText, Link2, Database, File, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Context to share sidebar state
const SourcesSidebarContext = createContext<{ isOpen: boolean }>({ isOpen: false });
export const useSourcesSidebar = () => useContext(SourcesSidebarContext);

interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "data" | "doc";
}

const mockSources: Source[] = [
  { id: "1", name: "Adobe-2024-Digital-Trends-Report.pdf", type: "pdf" },
  { id: "2", name: "Data-Driven-Marketing-2024.pdf", type: "pdf" },
  { id: "3", name: "Everest-Group-Chief-Market-Analysis.pdf", type: "pdf" },
  { id: "4", name: "Intero Digital 2024 The State of Marketing", type: "pdf" },
  { id: "5", name: "The 2024 State of Marketing Report", type: "pdf" },
  { id: "6", name: "The CMO Survey-Highlights.pdf", type: "pdf" },
  { id: "7", name: "How AI Is Rewriting the Marketing Playbook", type: "link" },
  { id: "8", name: "Marketing in the Age of AI", type: "link" },
  { id: "9", name: "The Meta CMO Interview - Full Transcript", type: "doc" },
  { id: "10", name: "Aws-cloud adoption framework", type: "pdf" },
  { id: "11", name: "Stanford AI Index Report 2025", type: "pdf" },
  { id: "12", name: "Us-ai-institute-state-of-ai-findings", type: "pdf" },
  { id: "13", name: "CIO AI Playbook", type: "pdf" },
  { id: "14", name: "Accenture-Art-of-AI-Maturity", type: "pdf" },
  { id: "15", name: "BCG-Wheres-the-Value-in-AI", type: "pdf" },
  { id: "16", name: "McKinsey The-agentic-com...", type: "link" },
];

const getSourceIcon = (type: Source["type"]) => {
  switch (type) {
    case "pdf": return FileText;
    case "link": return Link2;
    case "data": return Database;
    default: return File;
  }
};

const SIDEBAR_WIDTH = 260;

const SourcesSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const filteredSources = mockSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allowedRoutes = ['/upload', '/overview', '/explore', '/cockpit', '/talk-to-data'];
  const isAllowed = allowedRoutes.some(route => location.pathname.startsWith(route));

  if (!isAllowed) {
    return (
      <SourcesSidebarContext.Provider value={{ isOpen: false }}>
        {children}
      </SourcesSidebarContext.Provider>
    );
  }

  return (
    <SourcesSidebarContext.Provider value={{ isOpen }}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar Panel */}
        <div
          className="flex-shrink-0 bg-card border-r border-border h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
          style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
        >
          <div style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }} className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Sources
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm bg-background"
                />
              </div>
            </div>

            {/* Sources List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No sources found
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    {filteredSources.map((source) => {
                      const Icon = getSourceIcon(source.type);
                      return (
                        <div
                          key={source.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-accent/50 cursor-pointer transition-colors group min-w-0"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-foreground truncate flex-1 w-0">
                                {source.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="break-words">{source.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card">
              <p className="text-xs text-muted-foreground text-center">
                {filteredSources.length} source{filteredSources.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0 relative">
          {/* Floating trigger */}
          {!isOpen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsOpen(true)}
                  className={cn(
                    "fixed left-0 top-1/2 -translate-y-1/2 z-50",
                    "w-10 h-10 flex items-center justify-center",
                    "bg-card border border-border border-l-0 rounded-r-lg",
                    "text-muted-foreground hover:text-primary hover:bg-primary/10",
                    "transition-all duration-200 shadow-sm"
                  )}
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>View Sources</p>
              </TooltipContent>
            </Tooltip>
          )}
          {children}
        </div>
      </div>
    </SourcesSidebarContext.Provider>
  );
};

export default SourcesSidebar;
