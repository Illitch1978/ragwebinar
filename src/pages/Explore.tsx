import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Quote, FileText, ChartBar, Layers, RefreshCw, Gauge, LinkIcon, Activity } from "lucide-react";
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
  // New enhanced metrics
  sourceCount: number;
  confidenceLevel: "High" | "Medium" | "Low";
  confidencePercent: number;
  deltaFromPrevious: number;
  sparklineData: number[];
  relatedThemes: string[];
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
    sourceCount: 8,
    confidenceLevel: "High",
    confidencePercent: 87,
    deltaFromPrevious: 12,
    sparklineData: [25, 32, 28, 35, 33, 38, 33],
    relatedThemes: ["Quality Assurance", "Workflow Automation"],
    summary: "The data reveals a strong emphasis on streamlining information flow through real-time transcription, structured tagging, and integrated workflows. Organizations are increasingly adopting automated capture systems that reduce manual entry while maintaining data fidelity across departments. The shift toward centralized knowledge repositories has enabled faster decision-making cycles, with teams reporting 40% improvements in information retrieval times.\n\nHuman validation and feedback loops remain critical to ensuring accuracy, with senior team members providing oversight at key decision points. The integration of these workflows has shown measurable improvements in both speed and consistency of information processing. Cross-functional collaboration has emerged as a key enabler, with organizations implementing shared taxonomies and standardized metadata frameworks to bridge departmental silos.\n\nNotably, the most successful implementations combine automated transcription with human review gates, creating a balanced approach that leverages technology for scale while preserving quality through expert oversight. This hybrid model appears to deliver optimal outcomes across both efficiency and accuracy metrics.\n\nLooking ahead, organizations are exploring AI-assisted summarization and intelligent routing to further reduce cognitive load on researchers while maintaining the human-in-the-loop paradigm that ensures contextual accuracy.",
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
    sourceCount: 12,
    confidenceLevel: "High",
    confidencePercent: 92,
    deltaFromPrevious: -3,
    sparklineData: [30, 28, 32, 29, 31, 30, 30],
    relatedThemes: ["Human Judgment", "Operational Efficiency"],
    summary: "Strong emphasis on maintaining consistency and rigorous quality assurance through defined workflows, calibration exercises, human validation, and continuous monitoring. Teams rely on standardized checklists and peer review processes to catch errors before they propagate downstream. The implementation of tiered review systems has proven particularly effective, with junior analysts handling initial passes and senior reviewers focusing on edge cases and strategic decisions.\n\nThe data suggests that organizations investing in structured QA frameworks see significant reductions in rework—often 30-50% fewer revision cycles—and improved stakeholder confidence. Regular calibration sessions between team members help maintain alignment on scoring criteria and interpretation standards, with monthly sync meetings emerging as a best practice.\n\nDocumentation plays a crucial role in sustaining quality over time. Organizations with comprehensive style guides and decision trees report higher consistency scores and faster onboarding of new team members. The most mature teams have developed automated quality checks that flag potential issues before human review.\n\nEmerging trends include the adoption of inter-rater reliability metrics and systematic bias detection protocols, which help identify and address consistency gaps proactively rather than reactively.",
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
    sourceCount: 9,
    confidenceLevel: "Medium",
    confidencePercent: 71,
    deltaFromPrevious: -8,
    sparklineData: [35, 30, 28, 25, 27, 29, 27],
    relatedThemes: ["Resource Management", "Process Optimization"],
    summary: "Persistent challenges around cognitive load for researchers, difficulties ensuring data completeness and accuracy, significant admin burden due to manual processes. These operational constraints often lead to bottlenecks during peak periods and can impact overall team morale. The research identifies context-switching as a primary productivity drain, with analysts frequently interrupted by ad-hoc requests that fragment deep work sessions.\n\nOrganizations are exploring automation and workflow optimization to address these pain points, though implementation remains uneven across teams and departments. The balance between thoroughness and efficiency continues to be a central tension in research operations, with different stakeholders prioritizing different outcomes.\n\nResource constraints compound these challenges, with teams often operating at or near capacity. This leaves little room for process improvement initiatives or skill development, creating a cycle of reactive rather than proactive work patterns. The data suggests that organizations without dedicated operations roles struggle most acutely.\n\nMitigation strategies showing promise include batch processing approaches, protected focus time blocks, and the delegation of routine tasks to specialized support roles. However, cultural resistance to change remains a significant barrier in many organizations.",
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
    sourceCount: 6,
    confidenceLevel: "High",
    confidencePercent: 84,
    deltaFromPrevious: 18,
    sparklineData: [28, 32, 35, 38, 40, 42, 42],
    relatedThemes: ["Decision Automation", "Expert Systems"],
    summary: "Findings show that human judgment is central at multiple decision points, including validation of completeness, calibration of scoring, and final ranking. Experienced team members play a crucial role in interpreting ambiguous data and resolving edge cases where automated systems lack sufficient context. The tacit knowledge held by senior analysts proves particularly valuable in nuanced situations.\n\nThe research indicates that attempts to fully automate these decision points often result in quality degradation—typically 15-25% higher error rates compared to human-reviewed outputs. A hybrid approach combining algorithmic support with human oversight appears to deliver the best outcomes across accuracy and efficiency metrics.\n\nCritical decision points identified include initial scoping, methodology selection, anomaly detection, and final synthesis. Each requires different expertise levels and carries different risk profiles. Organizations are developing decision frameworks that route items appropriately based on complexity and impact.\n\nTraining and knowledge transfer emerge as key challenges, with organizations struggling to codify the intuitive judgments of experienced practitioners. Mentorship programs and structured decision logging are being explored as mechanisms to capture and transmit this expertise to newer team members.",
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
    sourceCount: 14,
    confidenceLevel: "High",
    confidencePercent: 95,
    deltaFromPrevious: 22,
    sparklineData: [32, 35, 38, 42, 45, 48, 45],
    relatedThemes: ["Market Performance", "Financial Metrics"],
    summary: "Quantitative analysis reveals consistent revenue growth patterns across key market segments, with notable acceleration in Q3 and Q4 driven by seasonal demand and strategic product launches. Year-over-year comparisons show double-digit improvements in core product lines—averaging 18% growth—while emerging markets contribute an increasing share of overall revenue, now representing 23% of total.\n\nThe data suggests strong correlation between customer retention rates and revenue stability, with subscription-based models outperforming transactional approaches by 2.3x on lifetime value metrics. Strategic investments in customer success appear to be driving sustainable growth trajectories, with high-touch accounts showing 40% lower churn rates.\n\nGeographic analysis reveals significant variance in growth rates, with APAC leading at 27% YoY growth compared to 12% in mature Western European markets. This suggests substantial untapped potential in developing regions, though market entry costs and localization requirements present barriers.\n\nForward-looking indicators remain positive, with pipeline coverage ratios exceeding 3x targets and new customer acquisition costs declining 15% quarter-over-quarter. However, margin pressure from competitive pricing actions warrants monitoring in the coming quarters.",
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
    sourceCount: 7,
    confidenceLevel: "Medium",
    confidencePercent: 68,
    deltaFromPrevious: -5,
    sparklineData: [28, 26, 24, 23, 22, 23, 22],
    relatedThemes: ["Competitive Analysis", "Strategic Planning"],
    summary: "Market positioning data indicates stable share maintenance at 34% of addressable market, with emerging opportunities in adjacent segments representing potential 15% expansion. Competitive analysis reveals differentiation primarily through service quality and integration capabilities rather than price, with NPS scores 18 points above industry average.\n\nThe quantitative trends suggest that market leaders are consolidating—top 3 players now control 67% of market, up from 58% two years ago—while mid-tier players face increasing pressure from both above and below. Strategic partnerships and ecosystem development appear to be key factors in maintaining and growing market position.\n\nProduct capability gaps have been identified in three areas: mobile experience, API extensibility, and real-time analytics. Addressing these gaps could unlock an estimated 8-12% additional market share based on customer feedback analysis and competitive benchmarking.\n\nCustomer segmentation reveals that enterprise accounts show highest loyalty (92% renewal rates) while SMB segments exhibit more volatility. This suggests differentiated retention strategies may be warranted, with increased investment in enterprise success programs and streamlined self-service for smaller accounts.",
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
                  {/* Enhanced Insight Matrix */}
                  <div className="bg-muted/30 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Insight Matrix</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded ${
                          selectedTheme.confidenceLevel === "High" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : selectedTheme.confidenceLevel === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          {selectedTheme.confidencePercent}% Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-4">
                      {/* Left: Sentiment Breakdown with Visual Bar */}
                      <div className="col-span-5 space-y-3">
                        <div className="flex items-center gap-4">
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
                              {Math.abs(selectedTheme.negativeChange).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">Negative</span>
                          </div>
                        </div>
                        
                        {/* Horizontal Sentiment Bar */}
                        <div className="h-2 rounded-full overflow-hidden flex bg-muted">
                          <div 
                            className="bg-emerald-500 h-full" 
                            style={{ width: `${selectedTheme.positiveChange}%` }}
                          />
                          <div 
                            className="bg-muted-foreground/30 h-full" 
                            style={{ width: `${selectedTheme.neutralPercent}%` }}
                          />
                          <div 
                            className="bg-rose-500 h-full" 
                            style={{ width: `${Math.abs(selectedTheme.negativeChange)}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Center: Sparkline & Delta */}
                      <div className="col-span-4 border-l border-r border-border/50 px-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-muted-foreground uppercase">Trend</span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${
                            selectedTheme.deltaFromPrevious >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}>
                            {selectedTheme.deltaFromPrevious >= 0 ? "↑" : "↓"}
                            {Math.abs(selectedTheme.deltaFromPrevious)}% vs prev
                          </span>
                        </div>
                        
                        {/* Mini Sparkline */}
                        <div className="flex items-end gap-1 h-8">
                          {selectedTheme.sparklineData.map((value, idx) => (
                            <div 
                              key={idx}
                              className="flex-1 bg-primary/60 rounded-sm transition-all hover:bg-primary"
                              style={{ height: `${(value / Math.max(...selectedTheme.sparklineData)) * 100}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-muted-foreground">7d ago</span>
                          <span className="text-[9px] text-muted-foreground">Today</span>
                        </div>
                      </div>
                      
                      {/* Right: Source Count & Related Themes */}
                      <div className="col-span-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium">{selectedTheme.sourceCount}</span>
                            <span className="text-[10px] text-muted-foreground ml-1">sources</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <LinkIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Related</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedTheme.relatedThemes.map((theme, idx) => (
                              <span 
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
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
