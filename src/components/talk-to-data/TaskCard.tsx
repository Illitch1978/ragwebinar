import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Shield,
  Target,
  MessageSquare,
  Loader2,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  Copy,
  Layers,
} from "lucide-react";
import type { TaskResult, Finding } from "@/pages/TalkToData";
import { toast } from "sonner";

const INTENT_META: Record<string, { icon: typeof Search; label: string; color: string }> = {
  evidence: { icon: Search, label: "Evidence", color: "text-primary" },
  validate: { icon: Shield, label: "Validation", color: "text-emerald-600" },
  insight: { icon: Target, label: "Insight", color: "text-violet-600" },
  conversational: { icon: MessageSquare, label: "Response", color: "text-neutral-500" },
};

const STRENGTH_META: Record<string, { icon: typeof CheckCircle2; label: string; color: string }> = {
  strong: { icon: CheckCircle2, label: "Strong", color: "text-emerald-600" },
  moderate: { icon: MinusCircle, label: "Moderate", color: "text-amber-600" },
  weak: { icon: AlertTriangle, label: "Weak", color: "text-red-500" },
};

interface TaskCardProps {
  task: TaskResult;
  onFollowUp: (query: string) => void;
}

const TaskCard = ({ task, onFollowUp }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(task.status === "complete");
  const intentMeta = INTENT_META[task.intent] || INTENT_META.conversational;
  const IntentIcon = intentMeta.icon;

  const confidencePercent = Math.round((task.confidence || 0) * 100);

  const handleCopy = () => {
    const text = [
      `# ${task.title}`,
      task.summary,
      "",
      ...task.findings.map((f, i) => `${i + 1}. ${f.claim}\n   Evidence: ${f.evidence}`),
      task.counter_evidence ? `\nCounter-evidence: ${task.counter_evidence}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleAddToDeck = () => {
    toast.success("Finding queued for deck insertion", {
      description: task.slide_suggestion?.title || task.title,
    });
  };

  if (task.status === "running") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-neutral-200 p-5"
      >
        <div className="flex items-center gap-3">
          <Loader2 size={16} className="animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Analyzing: <span className="text-foreground font-medium">{task.query}</span>
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-0.5 flex-1 bg-primary/20 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-primary/60"
                animate={{ x: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                style={{ width: "40%" }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (task.status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-red-200 p-5"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-sm text-red-600">{task.summary}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-neutral-200 overflow-hidden"
    >
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-neutral-50/50 transition-colors"
      >
        <div className={`mt-0.5 ${intentMeta.color}`}>
          <IntentIcon size={16} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-[10px] uppercase tracking-[0.12em] font-semibold ${intentMeta.color}`}>
              {intentMeta.label}
            </span>
            {task.confidence > 0 && (
              <span className="text-[10px] uppercase tracking-[0.08em] font-mono text-muted-foreground">
                {confidencePercent}% confidence
              </span>
            )}
          </div>
          <h3 className="font-serif font-bold text-base text-foreground leading-tight">
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {task.summary}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1 text-neutral-300">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-neutral-100">
              {/* Findings */}
              {task.findings.length > 0 && (
                <div className="mt-4 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">
                    Findings
                  </span>
                  {task.findings.map((finding, i) => {
                    const strength = STRENGTH_META[finding.strength] || STRENGTH_META.moderate;
                    const StrengthIcon = strength.icon;
                    return (
                      <div key={i} className="border-l-2 border-neutral-200 pl-4 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StrengthIcon size={12} className={strength.color} />
                          <span className={`text-[10px] uppercase tracking-[0.08em] font-mono ${strength.color}`}>
                            {strength.label}
                          </span>
                          {finding.source_hint && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              · {finding.source_hint}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground">{finding.claim}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {finding.evidence}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Counter Evidence */}
              {task.counter_evidence && (
                <div className="mt-4 bg-amber-50/50 border border-amber-200/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={12} className="text-amber-600" />
                    <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-amber-700">
                      Counter-Evidence
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">{task.counter_evidence}</p>
                </div>
              )}

              {/* Slide Suggestion */}
              {task.slide_suggestion && (
                <div className="mt-4 bg-primary/5 border border-primary/10 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers size={12} className="text-primary" />
                    <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-primary">
                      Deck Suggestion
                    </span>
                    <span className="text-[10px] font-mono text-primary/60 ml-auto">
                      {task.slide_suggestion.type}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-medium">{task.slide_suggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.slide_suggestion.content_preview}</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAddToDeck}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-semibold bg-foreground text-white hover:bg-primary transition-colors"
                >
                  <Plus size={12} />
                  Add to Deck
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-semibold text-neutral-500 border border-neutral-200 hover:border-primary/30 hover:text-primary transition-all"
                >
                  <Copy size={12} />
                  Copy
                </button>
                {task.suggested_actions.slice(0, 2).map((action) => (
                  <button
                    key={action}
                    onClick={() => onFollowUp(action)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.06em] font-medium text-neutral-400 hover:text-primary transition-colors"
                  >
                    <ArrowRight size={10} />
                    {action.length > 40 ? action.slice(0, 37) + "…" : action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
