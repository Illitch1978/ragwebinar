import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Presentation as PresentationIcon, BarChart3, FileText, BookOpen, BriefcaseBusiness, Video } from "lucide-react";
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
        // Strip markdown formatting for clean plain text
        const clean = data.enhanced
          .replace(/^#{1,6}\s+/gm, '')        // remove ### headings
          .replace(/\*\*(.*?)\*\*/g, '$1')     // remove **bold**
          .replace(/\*(.*?)\*/g, '$1')         // remove *italic*
          .replace(/^[-*]\s+/gm, '• ')         // convert list markers to bullets
          .replace(/\n{3,}/g, '\n\n');          // collapse excessive newlines
        setDescription(clean);
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
    <div className="space-y-5">
      {/* Guided Prompts */}
      {showGuided && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
            Quick-Start Guide
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Answer these questions to structure your objectives.
          </p>
          <div className="space-y-2">
            {GUIDED_PROMPTS.map((prompt) => (
              <div key={prompt.key}>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {prompt.label}
                </label>
                <input
                  type="text"
                  value={guidedInputs[prompt.key] || ''}
                  onChange={(e) => handleGuidedChange(prompt.key, e.target.value)}
                  placeholder={prompt.placeholder}
                  className="w-full px-3 py-2 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={compileGuidedToDescription}
              disabled={Object.values(guidedInputs).every(v => !v?.trim())}
              className="mt-1"
            >
              Add to objectives
            </Button>
          </div>
        </div>
      )}

      {/* Project Objectives (mandatory) */}
      <div>
        <div className="flex items-center justify-between mb-2">
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
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project objectives in detail..."
          className="min-h-[200px] px-5 py-4 bg-card border-border text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-1.5">
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
            className="ml-auto"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Enhancing...
              </>
            ) : (
              'Enhance with AI'
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
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
