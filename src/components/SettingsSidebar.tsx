import { Settings, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DECK_PRINCIPLES } from "@/lib/deckPrinciples";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

type DeckLength = 'brief' | 'medium' | 'long' | 'very-long';

interface SettingsSidebarProps {
  deckLength: DeckLength;
  onDeckLengthChange: (length: DeckLength) => void;
}

const DECK_LENGTH_OPTIONS: { value: DeckLength; label: string; description: string; range: string }[] = [
  { value: 'brief', label: 'Brief', description: 'Executive summary', range: '8-12 slides' },
  { value: 'medium', label: 'Medium', description: 'Standard presentation', range: '13-22 slides' },
  { value: 'long', label: 'Long', description: 'Deep-dive analysis', range: '23-30 slides' },
  { value: 'very-long', label: 'Very Long', description: 'Full workshop deck', range: '31-45 slides' },
];

const SettingsSidebar = ({ deckLength, onDeckLengthChange }: SettingsSidebarProps) => {
  const [isPrinciplesOpen, setIsPrinciplesOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-widest hidden sm:inline">
            Settings
          </span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[450px] bg-background border-l border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl text-foreground">
            Generation Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {/* Deck Length */}
          <div>
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Deck Length
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DECK_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onDeckLengthChange(option.value)}
                  className={cn(
                    "relative px-3 py-3 rounded-sm border-2 transition-all duration-200 text-left",
                    deckLength === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <p className="font-medium text-foreground text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.range}</p>
                  {deckLength === option.value && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Deck Principles */}
          <Collapsible open={isPrinciplesOpen} onOpenChange={setIsPrinciplesOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full text-left py-3 border-t border-border">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                  Global Deck Principles
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isPrinciplesOpen && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-4 pt-3">
                <p className="text-xs text-muted-foreground">
                  These principles are applied automatically to all generated presentations.
                </p>
                {Object.entries(DECK_PRINCIPLES).map(([key, principle]) => (
                  <div key={key} className="border-l-2 border-primary/30 pl-3 py-2">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {principle.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {principle.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 font-mono">
                      {principle.rule}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Future settings sections can be added here */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center">
              Additional settings coming soon
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSidebar;
