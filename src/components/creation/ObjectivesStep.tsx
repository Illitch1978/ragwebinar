import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Presentation as PresentationIcon, BarChart3, FileText, BookOpen, BriefcaseBusiness, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type OutputFormat = 'presentation' | 'report' | 'proposal' | 'article' | 'executive-summary' | 'post-meeting';

export const OUTPUT_FORMAT_OPTIONS = [
  {
    key: 'presentation' as OutputFormat,
    label: 'Presentation',
    description: 'Versatile deck for any topic with clear narrative flow',
    Icon: PresentationIcon,
    isSlideFormat: true,
    needsBrandGuide: true,
  },
  {
    key: 'report' as OutputFormat,
    label: 'Report',
    description: 'Data-driven analysis with findings and recommendations',
    Icon: BarChart3,
    isSlideFormat: true,
    needsBrandGuide: true,
  },
  {
    key: 'proposal' as OutputFormat,
    label: 'Proposal Builder',
    description: 'PDF with signature block and configurable T&C',
    Icon: FileText,
    isSlideFormat: true,
    needsBrandGuide: true,
  },
  {
    key: 'article' as OutputFormat,
    label: 'Thought Leadership',
    description: 'Word document (1-5 pages) with insights and evidence',
    Icon: BookOpen,
    isSlideFormat: false,
    needsBrandGuide: false,
  },
  {
    key: 'executive-summary' as OutputFormat,
    label: 'Executive Summary',
    description: 'Word document (2-5 pages) for decision-makers',
    Icon: BriefcaseBusiness,
    isSlideFormat: false,
    needsBrandGuide: false,
  },
  {
    key: 'post-meeting' as OutputFormat,
    label: 'Post-Meeting Deck',
    description: '4-5 slides from AI recording: summary & action items',
    Icon: Video,
    isSlideFormat: true,
    needsBrandGuide: true,
  },
];

// Guided prompt questions to help users define objectives
const GUIDED_PROMPTS = [
  { key: 'goal', label: 'Primary goal', placeholder: 'What is the main objective of this project?' },
  { key: 'audience', label: 'Target audience', placeholder: 'Who will consume this output?' },
  { key: 'metrics', label: 'Success metrics', placeholder: 'How will you measure success?' },
  { key: 'constraints', label: 'Constraints', placeholder: 'Timeline, budget, or scope limitations?' },
];

interface ObjectivesStepProps {
  description: string;
  setDescription: (value: string) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (value: OutputFormat) => void;
  onBack: () => void;
  onNext: () => void;
}

const ObjectivesStep = ({
  description,
  setDescription,
  outputFormat,
  setOutputFormat,
  onBack,
  onNext,
}: ObjectivesStepProps) => {
  const [guidedInputs, setGuidedInputs] = useState<Record<string, string>>({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showGuided, setShowGuided] = useState(true);
  const isValid = description.trim().length > 0;

  const handleGuidedChange = (key: string, value: string) => {
    setGuidedInputs(prev => ({ ...prev, [key]: value }));
  };

  const compileGuidedToDescription = () => {
    const parts: string[] = [];
    GUIDED_PROMPTS.forEach(p => {
      const val = guidedInputs[p.key]?.trim();
      if (val) parts.push(`${p.label}: ${val}`);
    });
    if (parts.length > 0) {
      const compiled = parts.join('\n');
      setDescription(description ? `${description}\n\n${compiled}` : compiled);
      setGuidedInputs({});
      setShowGuided(false);
    }
  };

  const handleEnhanceWithAI = async () => {
    if (!description.trim()) {
      toast.error("Please write some objectives first");
      return;
    }
    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-objectives', {
        body: { objectives: description },
      });
      if (error) throw error;
      if (data?.enhanced) {
        setDescription(data.enhanced);
        toast.success("Objectives enhanced!");
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      toast.error("Could not enhance objectives. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Guided Prompts */}
      {showGuided && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Quick-Start Guide
          </label>
          <p className="text-sm text-muted-foreground mb-4">
            Answer these questions to structure your objectives. They'll be compiled into the field below.
          </p>
          <div className="space-y-3">
            {GUIDED_PROMPTS.map((prompt) => (
              <div key={prompt.key}>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  {prompt.label}
                </label>
                <input
                  type="text"
                  value={guidedInputs[prompt.key] || ''}
                  onChange={(e) => handleGuidedChange(prompt.key, e.target.value)}
                  placeholder={prompt.placeholder}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={compileGuidedToDescription}
              disabled={Object.values(guidedInputs).every(v => !v?.trim())}
              className="mt-2"
            >
              Add to objectives
            </Button>
          </div>
        </div>
      )}

      {/* Project Objectives (mandatory) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
            Project Objectives <span className="text-destructive">*</span>
          </label>
          {!showGuided && (
            <button
              onClick={() => setShowGuided(true)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Show guided prompts
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Define your project goals, key deliverables, and expected outcomes.
        </p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project objectives in detail..."
          className="min-h-[160px] px-6 py-5 bg-card border-border font-mono text-sm"
        />
        <div className="flex items-center justify-between mt-2">
          {description.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {description.length.toLocaleString()} characters
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing || !description.trim()}
            className="ml-auto gap-2"
          >
            {isEnhancing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
          </Button>
        </div>
      </div>

      {/* Output Format Selection */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Output Format
        </label>
        <div className="grid grid-cols-2 gap-4">
          {OUTPUT_FORMAT_OPTIONS.map((option) => {
            const IconComponent = option.Icon;
            return (
              <button
                key={option.key}
                onClick={() => setOutputFormat(option.key)}
                className={cn(
                  "relative px-5 py-4 border-2 transition-all duration-300 text-left group",
                  outputFormat === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 flex items-center justify-center transition-colors shrink-0",
                    outputFormat === option.key ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4 transition-colors",
                      outputFormat === option.key ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm mb-0.5">{option.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {option.description}
                    </p>
                  </div>
                </div>
                {outputFormat === option.key && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-widest gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          size="lg"
          className={cn(
            "relative px-12 py-6 bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
            "font-mono text-[11px] font-bold tracking-[0.3em] uppercase",
            "transition-all duration-500 group"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ObjectivesStep;
