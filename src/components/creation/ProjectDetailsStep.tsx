import { cn } from "@/lib/utils";
import { ArrowRight, Scale, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AnalysisTone = 'balanced' | 'critical' | 'commercial' | 'risk-compliance';
export type ProjectLanguage = 'en-us' | 'en-uk';

const ANALYSIS_TONE_OPTIONS: { key: AnalysisTone; label: string; description: string; Icon: typeof Scale }[] = [
  {
    key: 'balanced',
    label: 'Balanced',
    description: 'A well-rounded analysis highlighting both positive and negative aspects',
    Icon: Scale,
  },
  {
    key: 'critical',
    label: 'Critical',
    description: 'Focuses on identifying areas for improvement and potential issues',
    Icon: AlertTriangle,
  },
  {
    key: 'commercial',
    label: 'Commercial Focus',
    description: 'Revenue, market opportunity, and ROI-driven perspective',
    Icon: TrendingUp,
  },
  {
    key: 'risk-compliance',
    label: 'Risk & Compliance',
    description: 'Regulatory, risk mitigation, and governance lens',
    Icon: Shield,
  },
];

interface ProjectDetailsStepProps {
  projectName: string;
  setProjectName: (value: string) => void;
  language: ProjectLanguage;
  setLanguage: (value: ProjectLanguage) => void;
  analysisTone: AnalysisTone;
  setAnalysisTone: (value: AnalysisTone) => void;
  onNext: () => void;
}

const ProjectDetailsStep = ({
  projectName,
  setProjectName,
  language,
  setLanguage,
  analysisTone,
  setAnalysisTone,
  onNext,
}: ProjectDetailsStepProps) => {
  return (
    <div className="space-y-8">
      {/* Project Name */}
      <div>
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
      </div>

      {/* Project Language */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Project Language
        </label>
        <div className="flex gap-2">
          {[
            { key: 'en-us' as ProjectLanguage, label: 'English (US)' },
            { key: 'en-uk' as ProjectLanguage, label: 'English (UK)' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setLanguage(opt.key)}
              className={cn(
                "px-5 py-2.5 border-2 text-sm font-medium transition-all duration-300",
                language === opt.key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 bg-card"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Tone */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Analysis Tone
        </label>
        <div className="grid grid-cols-2 gap-4">
          {ANALYSIS_TONE_OPTIONS.map((option) => {
            const IconComponent = option.Icon;
            return (
              <button
                key={option.key}
                onClick={() => setAnalysisTone(option.key)}
                className={cn(
                  "relative px-5 py-4 border-2 transition-all duration-300 text-left group",
                  analysisTone === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 flex items-center justify-center transition-colors shrink-0",
                    analysisTone === option.key ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4 transition-colors",
                      analysisTone === option.key ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm mb-0.5">{option.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {option.description}
                    </p>
                  </div>
                </div>
                {analysisTone === option.key && (
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onNext}
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

export default ProjectDetailsStep;
