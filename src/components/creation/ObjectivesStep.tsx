import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Upload, Presentation as PresentationIcon, BarChart3, FileText, BookOpen, BriefcaseBusiness, Video } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'text/markdown', 'text/html'];
    const allowedExtensions = ['.txt', '.md', '.html'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      toast.error("Please upload a .txt, .md, or .html file");
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      // Strip any HTML tags if it's an HTML file
      const cleaned = ext === '.html'
        ? text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : text;
      
      setDescription(description ? `${description}\n\n${cleaned}` : cleaned);
      setShowGuided(false);
      toast.success(`Content from "${file.name}" added to objectives`);
    } catch {
      toast.error("Could not read file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        const clean = data.enhanced
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/^[-*]\s+/gm, '• ')
          .replace(/\n{3,}/g, '\n\n');
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
    <div className="flex flex-col h-full min-h-0">
      {/* Guided Prompts - only shown before objectives are compiled */}
      {showGuided && !description.trim() ? (
        <div className="flex-1 min-h-0">
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
            Quick-Start Guide
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Answer these questions to structure your objectives, or upload a document below.
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
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={compileGuidedToDescription}
                disabled={Object.values(guidedInputs).every(v => !v?.trim())}
              >
                Add to objectives
              </Button>
              <span className="text-xs text-muted-foreground">or</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? 'Reading...' : 'Upload document'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.html"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <button
              onClick={() => setShowGuided(false)}
              className="text-xs text-primary hover:underline font-medium mt-2"
            >
              Skip — write objectives directly
            </button>
          </div>
        </div>
      ) : (
        /* Project Objectives - full space when guided is hidden */
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
              Project Objectives <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-3">
              {!showGuided && (
                <button
                  onClick={() => setShowGuided(true)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Show guided prompts
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? 'Reading...' : 'Upload document'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.html"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project objectives in detail..."
            className="flex-1 min-h-[200px] px-5 py-4 bg-card border-border text-sm leading-relaxed resize-none"
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
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 shrink-0">
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
