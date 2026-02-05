import { useState } from "react";
import { BookOpen, FileText, Link2, Database, File, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "data" | "doc";
}

// Mock sources for demonstration - in real app, these would come from the current project
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
    case "pdf":
      return FileText;
    case "link":
      return Link2;
    case "data":
      return Database;
    default:
      return File;
  }
};

const SourcesSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSources = mockSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Book Icon Trigger */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed left-0 top-1/2 -translate-y-1/2 z-50",
              "w-10 h-10 flex items-center justify-center",
              "bg-card border border-border border-l-0 rounded-r-lg",
              "text-muted-foreground hover:text-primary hover:bg-accent",
              "transition-all duration-200 shadow-sm",
              isOpen && "opacity-0 pointer-events-none"
            )}
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>View Sources</p>
        </TooltipContent>
      </Tooltip>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50",
          "transform transition-transform duration-300 ease-in-out shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
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
        <ScrollArea className="h-[calc(100%-120px)]">
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-accent/50 cursor-pointer transition-colors group overflow-hidden"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-foreground truncate block max-w-full">
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <p className="text-xs text-muted-foreground text-center">
            {filteredSources.length} source{filteredSources.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>
    </>
  );
};

export default SourcesSidebar;
