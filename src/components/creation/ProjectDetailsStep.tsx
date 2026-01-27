import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Presentation as PresentationIcon, FileBarChart, Target, BookOpen, BriefcaseBusiness, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    Icon: FileBarChart,
    isSlideFormat: true,
    needsBrandGuide: true,
  },
  {
    key: 'proposal' as OutputFormat,
    label: 'Proposal Builder',
    description: 'PDF with signature block and configurable T&C',
    Icon: Target,
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

interface ProjectDetailsStepProps {
  projectName: string;
  setProjectName: (value: string) => void;
  owner: string;
  setOwner: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (value: OutputFormat) => void;
  onNext: () => void;
}

const ProjectDetailsStep = ({
  projectName,
  setProjectName,
  owner,
  setOwner,
  description,
  setDescription,
  outputFormat,
  setOutputFormat,
  onNext,
}: ProjectDetailsStepProps) => {
  const isValid = description.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Project Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Project / Client Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project or client name..."
          className="w-full px-6 py-4 bg-card border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
        />
      </motion.div>

      {/* Owner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Owner / Created By
        </label>
        <input
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Your name..."
          className="w-full px-6 py-4 bg-card border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
        />
      </motion.div>

      {/* Description (mandatory) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Project Content <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste your content, meeting notes, or analysis here...

# Executive Summary
Your strategic analysis content...

## Key Findings
- Finding 1
- Finding 2"
          className="min-h-[180px] px-6 py-5 bg-card border-border font-mono text-sm"
        />
        {description.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {description.length.toLocaleString()} characters
          </p>
        )}
      </motion.div>

      {/* Output Format Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
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
                  "relative px-5 py-4 rounded-sm border-2 transition-all duration-300 text-left group",
                  outputFormat === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0",
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
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center pt-4"
      >
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
      </motion.div>
    </div>
  );
};

export default ProjectDetailsStep;
