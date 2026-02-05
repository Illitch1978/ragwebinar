import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Quote, FileText, ChartBar, Layers } from "lucide-react";

type ExplorationMode = "all" | "qual" | "quant";

interface Theme {
  id: string;
  name: string;
  type: "qual" | "quant";
  coverage: number;
  positiveChange: number;
  neutralPercent: number;
  negativeChange: number;
  summary: string;
  tags: string[];
  quotes: {
    text: string;
    source: string;
    speaker?: string;
  }[];
}

const mockThemes: Theme[] = [
  {
    id: "1",
    name: "Information Flow and Communication",
    type: "qual",
    coverage: 30.9,
    positiveChange: 33.1,
    neutralPercent: 54.0,
    negativeChange: -12.9,
    summary: "The data reveals a strong emphasis on streamlining information flow through real-time transcription, structured tagging, and integrated workflows, with ongoing human validation and feedback loops to ensure accuracy.",
    tags: ["transcription", "tagging", "workflow", "validation", "feedback"],
    quotes: [
      { text: "A ranking is never followed by one person alone. It's always a kind of a discussion between a more experienced or senior person and the person who's done all the work.", source: "13th Jan Workshop Part 1 Transcript", speaker: "Senior Researcher" },
      { text: "They fill out their ranking notes for every firm, every individual. And then they pass that on to the QA, their line manager or their specialist.", source: "13th Jan Workshop Part 1 Transcript" }
    ]
  },
  {
    id: "2",
    name: "Consistency and Quality Assurance",
    type: "qual",
    coverage: 48.3,
    positiveChange: 29.6,
    neutralPercent: 55.6,
    negativeChange: -14.9,
    summary: "Strong emphasis on maintaining consistency and rigorous quality assurance through defined workflows, calibration exercises, human validation, and continuous monitoring.",
    tags: ["consistency", "quality assurance", "validation", "calibration", "accuracy"],
    quotes: [
      { text: "It's not so much a technicality of how hard it is to put something somewhere, it's more to know what's actually going to make their process less painful.", source: "Interview Transcript" }
    ]
  },
  {
    id: "3",
    name: "Operational Constraints and Challenges",
    type: "qual",
    coverage: 47.0,
    positiveChange: 27.2,
    neutralPercent: 55.4,
    negativeChange: -17.4,
    summary: "Persistent challenges around cognitive load for researchers, difficulties ensuring data completeness and accuracy, significant admin burden due to manual processes.",
    tags: ["cognitive load", "data completeness", "admin burden", "accuracy", "workflow integration"],
    quotes: []
  },
  {
    id: "4",
    name: "Human Judgment and Decision Points",
    type: "qual",
    coverage: 24.4,
    positiveChange: 41.8,
    neutralPercent: 45.9,
    negativeChange: -12.3,
    summary: "Findings show that human judgment is central at multiple decision points, including validation of completeness, calibration of scoring, and final ranking.",
    tags: ["validation", "calibration", "consistency", "human in the loop", "scoring"],
    quotes: []
  },
  {
    id: "5",
    name: "Revenue Growth Trends",
    type: "quant",
    coverage: 35.2,
    positiveChange: 45.0,
    neutralPercent: 40.0,
    negativeChange: -15.0,
    summary: "Quantitative analysis reveals consistent revenue growth patterns across key market segments, with notable acceleration in Q3 and Q4.",
    tags: ["revenue", "growth", "trends", "quarterly"],
    quotes: []
  },
  {
    id: "6",
    name: "Market Share Analysis",
    type: "quant",
    coverage: 28.7,
    positiveChange: 22.5,
    neutralPercent: 60.0,
    negativeChange: -17.5,
    summary: "Market positioning data indicates stable share maintenance with emerging opportunities in adjacent segments.",
    tags: ["market share", "competitive", "positioning"],
    quotes: []
  }
];

const Explore = () => {
  const [mode, setMode] = useState<ExplorationMode>("all");
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const filteredThemes = mockThemes.filter(theme => {
    if (mode === "all") return true;
    return theme.type === mode;
  });

  const getModeIcon = (m: ExplorationMode) => {
    switch (m) {
      case "qual": return <FileText className="w-3.5 h-3.5" />;
      case "quant": return <ChartBar className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 lg:px-16 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Explore</h1>
            <p className="text-sm text-muted-foreground">Discover themes, patterns, and insights from your research data</p>
          </div>
          
          {/* Segmented Control */}
          <ToggleGroup 
            type="single" 
            value={mode} 
            onValueChange={(value) => value && setMode(value as ExplorationMode)}
            className="bg-muted/50 rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="all" 
              className="px-4 py-2 text-xs font-medium uppercase tracking-wide data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm rounded-md transition-all flex items-center gap-2"
            >
              {getModeIcon("all")}
              All
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="qual" 
              className="px-4 py-2 text-xs font-medium uppercase tracking-wide data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm rounded-md transition-all flex items-center gap-2"
            >
              {getModeIcon("qual")}
              Qualitative
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="quant" 
              className="px-4 py-2 text-xs font-medium uppercase tracking-wide data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm rounded-md transition-all flex items-center gap-2"
            >
              {getModeIcon("quant")}
              Quantitative
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredThemes.length}</span> themes
          </span>
          <div className="h-4 w-px bg-border" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredThemes.filter(t => t.type === "qual").length}</span> qualitative
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredThemes.filter(t => t.type === "quant").length}</span> quantitative
          </span>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredThemes.map((theme) => (
            <Card 
              key={theme.id}
              className="group cursor-pointer hover:shadow-md transition-all border-border/60 hover:border-primary/30"
              onClick={() => setSelectedTheme(theme)}
            >
              <CardContent className="p-5">
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] uppercase tracking-wide ${
                      theme.type === "qual" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {theme.type === "qual" ? "Qualitative" : "Quantitative"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{theme.coverage.toFixed(1)}% coverage</span>
                </div>

                {/* Title */}
                <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {theme.name}
                </h3>

                {/* Insight Metrics */}
                <div className="flex items-center gap-3 mb-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    +{theme.positiveChange.toFixed(1)}%
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Minus className="w-3 h-3" />
                    {theme.neutralPercent.toFixed(1)}%
                  </span>
                  <span className="flex items-center gap-1 text-rose-600">
                    <TrendingDown className="w-3 h-3" />
                    {theme.negativeChange.toFixed(1)}%
                  </span>
                </div>

                {/* Summary */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {theme.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {theme.tags.slice(0, 3).map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {theme.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-muted-foreground text-[10px]">
                      +{theme.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Quotes indicator */}
                {theme.quotes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Quote className="w-3 h-3" />
                    <span>{theme.quotes.length} quote{theme.quotes.length > 1 ? "s" : ""}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Theme Detail Drawer */}
      <Sheet open={!!selectedTheme} onOpenChange={(open) => !open && setSelectedTheme(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
          {selectedTheme && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] uppercase tracking-wide ${
                      selectedTheme.type === "qual" 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {selectedTheme.type === "qual" ? "Qualitative" : "Quantitative"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{selectedTheme.coverage.toFixed(1)}% coverage</span>
                </div>
                <SheetTitle className="text-xl font-semibold text-foreground">
                  {selectedTheme.name}
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="py-6 space-y-6">
                  {/* Insight Metrics */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Insight Matrix</h4>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-lg font-medium text-emerald-600">
                          <TrendingUp className="w-4 h-4" />
                          +{selectedTheme.positiveChange.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">Positive</span>
                      </div>
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-lg font-medium text-muted-foreground">
                          {selectedTheme.neutralPercent.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">Neutral</span>
                      </div>
                      <div className="text-center">
                        <span className="flex items-center justify-center gap-1 text-lg font-medium text-rose-600">
                          <TrendingDown className="w-4 h-4" />
                          {selectedTheme.negativeChange.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">Negative</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Summary</h4>
                    <p className="text-sm text-foreground leading-relaxed">{selectedTheme.summary}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Related Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTheme.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quotes */}
                  {selectedTheme.quotes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                        Relevant Quotes ({selectedTheme.quotes.length})
                      </h4>
                      <div className="space-y-4">
                        {selectedTheme.quotes.map((quote, idx) => (
                          <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                            <p className="text-sm text-foreground italic leading-relaxed mb-2">
                              "{quote.text}"
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FileText className="w-3 h-3" />
                              <span>{quote.source}</span>
                              {quote.speaker && (
                                <>
                                  <span>•</span>
                                  <span>{quote.speaker}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Explore;
