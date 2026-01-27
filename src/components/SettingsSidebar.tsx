import { Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DECK_PRINCIPLES } from "@/lib/deckPrinciples";
import { OUTPUT_FORMAT_PRINCIPLES, OutputFormat } from "@/lib/outputFormatPrinciples";
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

const SettingsSidebar = () => {
  const [isPrinciplesOpen, setIsPrinciplesOpen] = useState(false);
  const [isFormatPrinciplesOpen, setIsFormatPrinciplesOpen] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('proposal');

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
      <SheetContent className="w-[400px] sm:w-[500px] bg-background border-l border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-xl text-foreground">
            Generation Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Output Format Principles */}
          <Collapsible open={isFormatPrinciplesOpen} onOpenChange={setIsFormatPrinciplesOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full text-left py-3 border-b border-border">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                  Output Format Principles
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isFormatPrinciplesOpen && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4 space-y-4">
                {/* Format selector tabs */}
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(OUTPUT_FORMAT_PRINCIPLES) as OutputFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-colors",
                        selectedFormat === format
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      {format.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Selected format details */}
                {selectedFormat && (
                  <div className="space-y-4 bg-card/50 rounded-sm p-4 border border-border">
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {OUTPUT_FORMAT_PRINCIPLES[selectedFormat].name}
                      </h4>
                      <p className="text-xs text-primary font-mono">
                        {OUTPUT_FORMAT_PRINCIPLES[selectedFormat].slideLengthHint}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                        Structure
                      </h5>
                      <ol className="space-y-1">
                        {OUTPUT_FORMAT_PRINCIPLES[selectedFormat].structure.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-primary font-mono">{i + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h5 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                        Tone Guidelines
                      </h5>
                      <ul className="space-y-1">
                        {OUTPUT_FORMAT_PRINCIPLES[selectedFormat].toneGuidelines.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                        Key Features
                      </h5>
                      <ul className="space-y-1">
                        {OUTPUT_FORMAT_PRINCIPLES[selectedFormat].keyFeatures.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex gap-2">
                            <span className="text-primary">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Global Deck Principles */}
          <Collapsible open={isPrinciplesOpen} onOpenChange={setIsPrinciplesOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full text-left py-3 border-b border-border">
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

          {/* Footer */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center">
              These settings guide AI-powered deck generation
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSidebar;
