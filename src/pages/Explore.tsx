import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Quote, FileText, ChartBar, Layers, RefreshCw, Gauge, LinkIcon, Activity, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExploreFilters, { FilterState } from "@/components/explore/ExploreFilters";

type ExplorationMode = "all" | "qual" | "quant";

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

interface SentimentContent {
  summary: string;
  tags: string[];
  quotes: {
    text: string;
    source: string;
    sourceUrl?: string;
    speaker?: string;
  }[];
}

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
  // Sentiment-specific content
  positiveSentiment: SentimentContent;
  neutralSentiment: SentimentContent;
  negativeSentiment: SentimentContent;
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
    summary: "The data reveals a strong emphasis on streamlining information flow through real-time transcription, structured tagging, and integrated workflows. Organizations are increasingly adopting automated capture systems that reduce manual entry while maintaining data fidelity across departments.\n\nHuman validation and feedback loops remain critical to ensuring accuracy, with senior team members providing oversight at key decision points. The integration of these workflows has shown measurable improvements in both speed and consistency of information processing.\n\nNotably, the most successful implementations combine automated transcription with human review gates, creating a balanced approach that leverages technology for scale while preserving quality through expert oversight.\n\nLooking ahead, organizations are exploring AI-assisted summarization and intelligent routing to further reduce cognitive load on researchers.",
    tags: ["transcription", "tagging", "workflow", "validation", "feedback"],
    positiveSentiment: {
      summary: "Organizations report significant productivity gains from streamlined information capture, with 40% faster retrieval times and reduced manual entry burden. Teams praise the intuitive workflow integration and real-time transcription accuracy.\n\nCross-functional collaboration has flourished with shared taxonomies, enabling faster decision-making cycles. The hybrid human-AI approach is viewed as a major success, delivering both efficiency and accuracy improvements.",
      tags: ["efficiency gains", "automation success", "collaboration", "productivity"],
      quotes: [
        { text: "The new transcription system has completely transformed how we capture meeting insights. What used to take hours now happens in real-time.", source: "Q4 User Feedback Survey", sourceUrl: "/sources/q4-survey", speaker: "Product Manager" }
      ]
    },
    neutralSentiment: {
      summary: "Implementation progress varies across departments, with some teams fully adopting new workflows while others remain in transition. The learning curve is manageable but requires dedicated training time.\n\nCost-benefit analyses show break-even typically achieved within 6-9 months, with ongoing optimization opportunities identified for advanced features.",
      tags: ["implementation", "training", "transition", "adoption"],
      quotes: [
        { text: "They fill out their ranking notes for every firm, every individual. And then they pass that on to the QA, their line manager or their specialist.", source: "13th Jan Workshop Part 1 Transcript", sourceUrl: "/sources/workshop-jan-13" }
      ]
    },
    negativeSentiment: {
      summary: "Some users report frustration with edge cases where automated transcription misses context or technical terminology. Integration with legacy systems remains challenging for certain departments.\n\nConcerns raised about over-reliance on automation potentially degrading institutional knowledge over time. Some senior staff feel the human validation layer adds unnecessary delays.",
      tags: ["accuracy issues", "legacy integration", "delays", "edge cases"],
      quotes: [
        { text: "The system still struggles with our industry-specific jargon. We end up spending time correcting transcripts anyway.", source: "User Feedback Session", sourceUrl: "/sources/feedback", speaker: "Senior Analyst" }
      ]
    },
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
    summary: "Strong emphasis on maintaining consistency and rigorous quality assurance through defined workflows, calibration exercises, human validation, and continuous monitoring.\n\nThe data suggests that organizations investing in structured QA frameworks see significant reductions in rework—often 30-50% fewer revision cycles.\n\nDocumentation plays a crucial role in sustaining quality over time with comprehensive style guides.\n\nEmerging trends include the adoption of inter-rater reliability metrics and systematic bias detection protocols.",
    tags: ["consistency", "quality assurance", "validation", "calibration", "accuracy"],
    positiveSentiment: {
      summary: "Structured QA frameworks have driven remarkable improvements in output consistency, with 30-50% fewer revision cycles reported. Stakeholder confidence has increased measurably.\n\nMonthly calibration sessions have become a valued best practice, with teams reporting stronger alignment on scoring criteria and faster onboarding of new members.",
      tags: ["reduced rework", "stakeholder confidence", "calibration success", "onboarding"],
      quotes: [
        { text: "Since implementing the tiered review system, our error rates have dropped by 40%. The junior analysts catch most issues before they reach senior reviewers.", source: "QA Team Lead Interview", sourceUrl: "/sources/qa-interview" }
      ]
    },
    neutralSentiment: {
      summary: "Quality frameworks require ongoing maintenance and periodic updates to remain effective. The balance between thoroughness and speed continues to require careful management.\n\nOrganizations are still evaluating optimal review layer configurations, with different team sizes requiring different approaches.",
      tags: ["maintenance", "balance", "optimization", "evaluation"],
      quotes: [
        { text: "It's not so much a technicality of how hard it is to put something somewhere, it's more to know what's actually going to make their process less painful.", source: "Interview Transcript", sourceUrl: "/sources/interview-transcript" }
      ]
    },
    negativeSentiment: {
      summary: "Some teams report that extensive QA processes create bottlenecks during peak periods. The overhead of documentation requirements frustrates some analysts.\n\nConcerns exist about checkbox-style compliance replacing genuine quality focus. Inter-rater reliability metrics have revealed larger consistency gaps than expected in some areas.",
      tags: ["bottlenecks", "overhead", "compliance fatigue", "gaps"],
      quotes: [
        { text: "We spend so much time on documentation that we have less time for actual analysis. It feels like quality theater sometimes.", source: "Anonymous Survey Response", sourceUrl: "/sources/survey" }
      ]
    },
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
    summary: "Persistent challenges around cognitive load for researchers, difficulties ensuring data completeness and accuracy, significant admin burden due to manual processes.\n\nOrganizations are exploring automation and workflow optimization to address these pain points.\n\nResource constraints compound these challenges, with teams often operating at or near capacity.\n\nMitigation strategies showing promise include batch processing approaches and protected focus time blocks.",
    tags: ["cognitive load", "data completeness", "admin burden", "accuracy", "workflow integration"],
    positiveSentiment: {
      summary: "Teams implementing batch processing approaches report meaningful reductions in context-switching overhead. Protected focus time initiatives show early promise in improving deep work capacity.\n\nDelegation of routine tasks to specialized support roles has freed analysts for higher-value activities.",
      tags: ["batch processing", "focus time", "delegation", "efficiency"],
      quotes: [
        { text: "The new focus time blocks have been game-changing. I actually complete complex analyses without interruption now.", source: "Analyst Feedback", sourceUrl: "/sources/analyst-feedback" }
      ]
    },
    neutralSentiment: {
      summary: "Automation implementation remains uneven across teams, with progress dependent on local leadership and resource availability. Different stakeholders continue to prioritize different outcomes.\n\nThe balance between thoroughness and efficiency requires ongoing negotiation and adjustment.",
      tags: ["uneven progress", "leadership dependency", "tradeoffs", "negotiation"],
      quotes: []
    },
    negativeSentiment: {
      summary: "Cognitive load remains a primary pain point, with analysts frequently overwhelmed by ad-hoc requests that fragment their work. Admin burden from manual processes significantly impacts morale.\n\nCultural resistance to change has slowed adoption of mitigation strategies. Organizations without dedicated operations roles struggle acutely.",
      tags: ["cognitive overload", "fragmentation", "morale impact", "resistance"],
      quotes: [
        { text: "I'm constantly switching between tasks. By the time I get back to my main project, I've lost all the context I built up.", source: "Research Team Workshop", sourceUrl: "/sources/workshop" }
      ]
    },
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
    summary: "Findings show that human judgment is central at multiple decision points, including validation of completeness, calibration of scoring, and final ranking.\n\nThe research indicates that attempts to fully automate these decision points often result in quality degradation—typically 15-25% higher error rates.\n\nCritical decision points identified include initial scoping, methodology selection, anomaly detection, and final synthesis.\n\nTraining and knowledge transfer emerge as key challenges.",
    tags: ["validation", "calibration", "consistency", "human in the loop", "scoring"],
    positiveSentiment: {
      summary: "The hybrid human-AI approach delivers optimal outcomes, with experienced analysts providing invaluable context that automated systems cannot replicate. Decision frameworks are improving routing efficiency.\n\nMentorship programs are successfully capturing tacit knowledge from senior practitioners, accelerating junior staff development.",
      tags: ["hybrid approach", "expertise", "mentorship", "knowledge capture"],
      quotes: [
        { text: "The decision framework has made it much easier to know when to escalate. I feel more confident in my judgment now.", source: "Junior Analyst Interview", sourceUrl: "/sources/junior-interview" }
      ]
    },
    neutralSentiment: {
      summary: "Organizations continue refining the optimal balance between algorithmic support and human oversight. Different complexity levels require different expertise involvement.\n\nStructured decision logging efforts are ongoing, with mixed success in codifying intuitive judgments.",
      tags: ["balance refinement", "complexity routing", "documentation efforts", "ongoing work"],
      quotes: []
    },
    negativeSentiment: {
      summary: "Knowledge transfer remains challenging, with organizations struggling to codify the intuitive judgments of experienced practitioners. Senior analyst capacity is often a bottleneck.\n\nFully automated approaches have repeatedly resulted in quality degradation, with 15-25% higher error rates on complex decisions.",
      tags: ["knowledge gaps", "capacity limits", "automation failures", "errors"],
      quotes: [
        { text: "We've tried to document everything, but there's so much tacit knowledge that just doesn't translate to written guidelines.", source: "Senior Analyst Interview", sourceUrl: "/sources/senior-interview" }
      ]
    },
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
    summary: "Quantitative analysis reveals consistent revenue growth patterns across key market segments, with notable acceleration in Q3 and Q4.\n\nThe data suggests strong correlation between customer retention rates and revenue stability, with subscription-based models outperforming transactional approaches by 2.3x.\n\nGeographic analysis reveals significant variance in growth rates, with APAC leading at 27% YoY growth.\n\nForward-looking indicators remain positive, with pipeline coverage ratios exceeding 3x targets.",
    tags: ["revenue", "growth", "trends", "quarterly"],
    positiveSentiment: {
      summary: "Revenue growth has exceeded expectations with 18% average improvement in core product lines. Subscription models show 2.3x better lifetime value performance than transactional approaches.\n\nAPAC region leads with 27% YoY growth, demonstrating strong market expansion. Customer success investments are driving 40% lower churn in high-touch accounts.",
      tags: ["exceeding targets", "subscription success", "APAC growth", "retention"],
      quotes: [
        { text: "Our Q4 numbers blew past projections. The subscription pivot was the right call.", source: "Quarterly Earnings Call", sourceUrl: "/sources/earnings" }
      ]
    },
    neutralSentiment: {
      summary: "Emerging markets now represent 23% of total revenue, a significant shift from prior periods. Geographic variance requires differentiated strategies for mature vs. developing regions.\n\nMarket entry costs and localization requirements present barriers to further expansion.",
      tags: ["market shift", "geographic variance", "localization", "strategy"],
      quotes: []
    },
    negativeSentiment: {
      summary: "Margin pressure from competitive pricing actions warrants monitoring. Western European markets show slower growth at 12% compared to other regions.\n\nNew customer acquisition costs remain elevated despite recent improvements. Some product lines face headwinds from market saturation.",
      tags: ["margin pressure", "slow markets", "acquisition costs", "saturation"],
      quotes: [
        { text: "We're seeing increased price competition in our core markets. Margins are under pressure.", source: "CFO Commentary", sourceUrl: "/sources/cfo" }
      ]
    },
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
    summary: "Market positioning data indicates stable share maintenance at 34% of addressable market, with emerging opportunities in adjacent segments.\n\nThe quantitative trends suggest that market leaders are consolidating—top 3 players now control 67% of market.\n\nProduct capability gaps have been identified in three areas: mobile experience, API extensibility, and real-time analytics.\n\nCustomer segmentation reveals that enterprise accounts show highest loyalty at 92% renewal rates.",
    tags: ["market share", "competitive", "positioning"],
    positiveSentiment: {
      summary: "Service quality differentiation is working, with NPS scores 18 points above industry average. Enterprise accounts show exceptional loyalty at 92% renewal rates.\n\nStrategic partnerships and ecosystem development are strengthening market position against consolidating competitors.",
      tags: ["NPS leadership", "enterprise loyalty", "partnerships", "differentiation"],
      quotes: [
        { text: "Our integration capabilities are a major competitive advantage. Customers choose us because we work with their existing stack.", source: "Sales Team Report", sourceUrl: "/sources/sales" }
      ]
    },
    neutralSentiment: {
      summary: "Market share remains stable at 34%, neither gaining nor losing significant ground. Adjacent segment opportunities represent potential 15% expansion with appropriate investment.\n\nCompetitive dynamics continue to evolve as market leaders consolidate their positions.",
      tags: ["stability", "opportunity", "market dynamics", "consolidation"],
      quotes: []
    },
    negativeSentiment: {
      summary: "Product capability gaps in mobile, APIs, and real-time analytics are limiting growth potential. Mid-tier market position faces pressure from both larger and smaller competitors.\n\nSMB segment shows volatility with higher churn than enterprise accounts. Market share has declined slightly over recent periods.",
      tags: ["capability gaps", "competitive pressure", "SMB churn", "decline"],
      quotes: [
        { text: "We're losing deals because of our mobile experience. Competitors have leapfrogged us there.", source: "Product Strategy Meeting", sourceUrl: "/sources/product" }
      ]
    },
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
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");

  // Reset sentiment filter when theme changes
  const handleThemeSelect = (theme: Theme | null) => {
    setSelectedTheme(theme);
    setSentimentFilter("all");
  };

  // Get content based on sentiment filter
  const getFilteredContent = (theme: Theme) => {
    switch (sentimentFilter) {
      case "positive":
        return theme.positiveSentiment;
      case "neutral":
        return theme.neutralSentiment;
      case "negative":
        return theme.negativeSentiment;
      default:
        return {
          summary: theme.summary,
          tags: theme.tags,
          quotes: theme.quotes
        };
    }
  };

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
              onClick={() => handleThemeSelect(theme)}
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
      <Sheet open={!!selectedTheme} onOpenChange={(open) => !open && handleThemeSelect(null)}>
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
                      {/* Left: Clickable Sentiment Breakdown with Visual Bar */}
                      <div className="col-span-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setSentimentFilter(sentimentFilter === "positive" ? "all" : "positive")}
                            className={`text-center p-2 rounded-lg transition-all cursor-pointer ${
                              sentimentFilter === "positive" 
                                ? "bg-emerald-100 ring-2 ring-emerald-500" 
                                : "hover:bg-muted"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1 text-base font-medium text-emerald-600">
                              <TrendingUp className="w-3.5 h-3.5" />
                              +{selectedTheme.positiveChange.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">Positive</span>
                          </button>
                          <button 
                            onClick={() => setSentimentFilter(sentimentFilter === "neutral" ? "all" : "neutral")}
                            className={`text-center p-2 rounded-lg transition-all cursor-pointer ${
                              sentimentFilter === "neutral" 
                                ? "bg-muted ring-2 ring-muted-foreground" 
                                : "hover:bg-muted"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1 text-base font-medium text-muted-foreground">
                              {selectedTheme.neutralPercent.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">Neutral</span>
                          </button>
                          <button 
                            onClick={() => setSentimentFilter(sentimentFilter === "negative" ? "all" : "negative")}
                            className={`text-center p-2 rounded-lg transition-all cursor-pointer ${
                              sentimentFilter === "negative" 
                                ? "bg-rose-100 ring-2 ring-rose-500" 
                                : "hover:bg-muted"
                            }`}
                          >
                            <span className="flex items-center justify-center gap-1 text-base font-medium text-rose-600">
                              <TrendingDown className="w-3.5 h-3.5" />
                              {Math.abs(selectedTheme.negativeChange).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase">Negative</span>
                          </button>
                        </div>
                        
                        {/* Shorter Horizontal Sentiment Bar */}
                        <div className="h-1.5 rounded-full overflow-hidden flex bg-muted max-w-[70%]">
                          <div 
                            className={`h-full transition-all ${sentimentFilter === "positive" ? "bg-emerald-600" : "bg-emerald-500"}`}
                            style={{ width: `${selectedTheme.positiveChange}%` }}
                          />
                          <div 
                            className={`h-full transition-all ${sentimentFilter === "neutral" ? "bg-muted-foreground/50" : "bg-muted-foreground/30"}`}
                            style={{ width: `${selectedTheme.neutralPercent}%` }}
                          />
                          <div 
                            className={`h-full transition-all ${sentimentFilter === "negative" ? "bg-rose-600" : "bg-rose-500"}`}
                            style={{ width: `${Math.abs(selectedTheme.negativeChange)}%` }}
                          />
                        </div>
                        
                        {/* Filter indicator */}
                        {sentimentFilter !== "all" && (
                          <button 
                            onClick={() => setSentimentFilter("all")}
                            className="text-[10px] text-primary hover:underline flex items-center gap-1"
                          >
                            ← View all sentiments
                          </button>
                        )}
                      </div>
                      
                      {/* Center: Sparkline & Delta */}
                      <div className="col-span-4 border-l border-r border-border/50 px-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground uppercase">Mention Volume</span>
                            <Select defaultValue="7d">
                              <SelectTrigger className="h-5 w-[70px] text-[10px] border-none bg-muted/50 px-1.5 focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7d" className="text-xs">7 days</SelectItem>
                                <SelectItem value="14d" className="text-xs">14 days</SelectItem>
                                <SelectItem value="30d" className="text-xs">30 days</SelectItem>
                                <SelectItem value="90d" className="text-xs">90 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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
                          <span className="text-[9px] text-muted-foreground">Start</span>
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

                  {/* Summary - filtered by sentiment */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Summary</h4>
                      {sentimentFilter !== "all" && (
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] ${
                            sentimentFilter === "positive" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : sentimentFilter === "negative"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sentimentFilter} view
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      {getFilteredContent(selectedTheme).summary.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-sm text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tags - filtered by sentiment */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                      {sentimentFilter !== "all" ? `${sentimentFilter.charAt(0).toUpperCase() + sentimentFilter.slice(1)} Tags` : "Related Tags"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getFilteredContent(selectedTheme).tags.map((tag, idx) => {
                        const tagData = getTagTooltipData(tag);
                        return (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant="outline" 
                                className={`text-xs cursor-help ${
                                  sentimentFilter === "positive" 
                                    ? "border-emerald-300 bg-emerald-50" 
                                    : sentimentFilter === "negative"
                                    ? "border-rose-300 bg-rose-50"
                                    : ""
                                }`}
                              >
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

                  {/* Quotes - filtered by sentiment */}
                  <div>
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                      {sentimentFilter !== "all" ? `${sentimentFilter.charAt(0).toUpperCase() + sentimentFilter.slice(1)} Quotes` : "Relevant Quotes"} ({getFilteredContent(selectedTheme).quotes.length})
                    </h4>
                    {getFilteredContent(selectedTheme).quotes.length > 0 ? (
                      <div className="space-y-4">
                        {getFilteredContent(selectedTheme).quotes.map((quote, idx) => (
                          <div 
                            key={idx} 
                            className={`border-l-2 pl-4 py-1 ${
                              sentimentFilter === "positive" 
                                ? "border-emerald-400" 
                                : sentimentFilter === "negative"
                                ? "border-rose-400"
                                : "border-primary/30"
                            }`}
                          >
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
                      <p className="text-sm text-muted-foreground italic">
                        {sentimentFilter !== "all" 
                          ? `No ${sentimentFilter} quotes available for this theme.`
                          : "No quotes available for this theme."}
                      </p>
                    )}
                    
                    {/* Generate More Quotes Button */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
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
