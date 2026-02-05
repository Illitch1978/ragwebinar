import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Quote, FileText, ChartBar, Layers, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExploreFilters, { FilterState } from "@/components/explore/ExploreFilters";

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
    sourceUrl?: string;
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
    summary: "The data reveals a strong emphasis on streamlining information flow through real-time transcription, structured tagging, and integrated workflows. Organizations are increasingly adopting automated capture systems that reduce manual entry while maintaining data fidelity across departments.\n\nHuman validation and feedback loops remain critical to ensuring accuracy, with senior team members providing oversight at key decision points. The integration of these workflows has shown measurable improvements in both speed and consistency of information processing.",
    tags: ["transcription", "tagging", "workflow", "validation", "feedback"],
    quotes: [
      { text: "A ranking is never followed by one person alone. It's always a kind of a discussion between a more experienced or senior person and the person who's done all the work.", source: "13th Jan Workshop Part 1 Transcript", sourceUrl: "/sources/workshop-jan-13", speaker: "Senior Researcher" },
      { text: "They fill out their ranking notes for every firm, every individual. And then they pass that on to the QA, their line manager or their specialist.", source: "13th Jan Workshop Part 1 Transcript", sourceUrl: "/sources/workshop-jan-13" }
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
    summary: "Strong emphasis on maintaining consistency and rigorous quality assurance through defined workflows, calibration exercises, human validation, and continuous monitoring. Teams rely on standardized checklists and peer review processes to catch errors before they propagate downstream.\n\nThe data suggests that organizations investing in structured QA frameworks see significant reductions in rework and improved stakeholder confidence. Regular calibration sessions between team members help maintain alignment on scoring criteria and interpretation standards.",
    tags: ["consistency", "quality assurance", "validation", "calibration", "accuracy"],
    quotes: [
      { text: "It's not so much a technicality of how hard it is to put something somewhere, it's more to know what's actually going to make their process less painful.", source: "Interview Transcript", sourceUrl: "/sources/interview-transcript" }
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
    summary: "Persistent challenges around cognitive load for researchers, difficulties ensuring data completeness and accuracy, significant admin burden due to manual processes. These operational constraints often lead to bottlenecks during peak periods and can impact overall team morale.\n\nOrganizations are exploring automation and workflow optimization to address these pain points, though implementation remains uneven. The balance between thoroughness and efficiency continues to be a central tension in research operations.",
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
    summary: "Findings show that human judgment is central at multiple decision points, including validation of completeness, calibration of scoring, and final ranking. Experienced team members play a crucial role in interpreting ambiguous data and resolving edge cases.\n\nThe research indicates that attempts to fully automate these decision points often result in quality degradation. A hybrid approach combining algorithmic support with human oversight appears to deliver the best outcomes across accuracy and efficiency metrics.",
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
    summary: "Quantitative analysis reveals consistent revenue growth patterns across key market segments, with notable acceleration in Q3 and Q4. Year-over-year comparisons show double-digit improvements in core product lines while emerging markets contribute an increasing share.\n\nThe data suggests strong correlation between customer retention rates and revenue stability, with subscription-based models outperforming transactional approaches. Strategic investments in customer success appear to be driving sustainable growth trajectories.",
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
    summary: "Market positioning data indicates stable share maintenance with emerging opportunities in adjacent segments. Competitive analysis reveals differentiation primarily through service quality and integration capabilities rather than price.\n\nThe quantitative trends suggest that market leaders are consolidating while mid-tier players face increasing pressure. Strategic partnerships and ecosystem development appear to be key factors in maintaining and growing market position.",
    tags: ["market share", "competitive", "positioning"],
    quotes: []
  }
];

const initialFilters: FilterState = {
  source: "",
  sourceType: "",
  year: "",
  audienceType: "",
  market: "",
};

const Explore = () => {
  const [mode, setMode] = useState<ExplorationMode>("all");
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // In real implementation, this would trigger a data fetch with filters
    console.log("Applying filters:", filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  // Generate tooltip content for tags with polarity and frequency context
  const getTagTooltipData = (tag: string): string => {
    const tagContexts: Record<string, string> = {
      "transcription": "Mentioned 47 times across sources. Predominantly positive polarity (68%). Often appears in discussions about efficiency gains and workflow automation.",
      "tagging": "Referenced 32 times. Mixed polarity with 52% positive sentiment. Frequently co-occurs with organization and metadata management topics.",
      "workflow": "High frequency term (89 mentions). Strongly positive (74%). Central to discussions about process improvement and operational efficiency.",
      "validation": "Appears 56 times. Neutral to positive polarity (61%). Key theme in quality assurance and accuracy discussions.",
      "feedback": "Moderate frequency (28 mentions). Positive leaning (65%). Often linked to continuous improvement and stakeholder communication.",
      "consistency": "Referenced 41 times. Strongly positive (78%). Core theme in quality standards and reliability discussions.",
      "quality assurance": "High importance term (63 mentions). Positive polarity (71%). Central to compliance and accuracy frameworks.",
      "calibration": "Mentioned 24 times. Neutral polarity (55%). Technical context relating to measurement and standardization.",
      "accuracy": "Frequent term (72 mentions). Mixed polarity (58% positive). Key concern in data integrity discussions.",
      "cognitive load": "Appears 19 times. Negative leaning (62% negative). Associated with user experience pain points.",
      "data completeness": "Referenced 33 times. Mixed polarity. Often raised in context of data quality challenges.",
      "admin burden": "Moderate frequency (21 mentions). Strongly negative (81%). Key pain point in operational discussions.",
      "workflow integration": "Mentioned 27 times. Positive polarity (67%). Linked to system connectivity improvements.",
      "human in the loop": "Appears 38 times. Positive sentiment (69%). Central to AI governance and quality control themes.",
      "scoring": "Referenced 45 times. Neutral polarity. Technical context around evaluation and ranking.",
    };
    return tagContexts[tag] || `This tag appears across multiple sources with varied polarity. Context frequency and sentiment patterns are being analyzed.`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 lg:px-16 py-8">
        {/* Segmented Control - Top Right */}
        <div className="flex justify-end mb-6">
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

        {/* Multi-Filter Bar */}
        <ExploreFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          matchingCount={filteredThemes.length}
        />

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

      {/* Theme Detail Drawer - Near Full Viewport */}
      <Sheet open={!!selectedTheme} onOpenChange={(open) => !open && setSelectedTheme(null)}>
        <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[90vw] overflow-hidden flex flex-col">
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

                  {/* Summary - Two paragraphs */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Summary</h4>
                    <div className="space-y-3">
                      {selectedTheme.summary.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Related Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTheme.tags.map((tag, idx) => {
                        // Generate mock tooltip data based on tag
                        const tagData = getTagTooltipData(tag);
                        return (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs cursor-help">
                                {tag}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                              <p>{tagData}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quotes */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                      Relevant Quotes ({selectedTheme.quotes.length})
                    </h4>
                    {selectedTheme.quotes.length > 0 ? (
                      <div className="space-y-4">
                        {selectedTheme.quotes.map((quote, idx) => (
                          <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                            <p className="text-sm text-foreground italic leading-relaxed mb-2">
                              "{quote.text}"
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <FileText className="w-3 h-3" />
                              {quote.sourceUrl ? (
                                <Link 
                                  to={quote.sourceUrl} 
                                  className="hover:text-primary hover:underline transition-colors"
                                >
                                  {quote.source}
                                </Link>
                              ) : (
                                <span>{quote.source}</span>
                              )}
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
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No quotes available for this theme.</p>
                    )}
                    
                    {/* Generate More Quotes Button */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => console.log("Generate more quotes for:", selectedTheme.name)}
                      >
                        Generate More Quotes
                      </Button>
                    </div>
                  </div>
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
