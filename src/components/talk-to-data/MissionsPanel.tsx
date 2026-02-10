import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  status: "queued" | "running" | "complete";
  progress?: number;
  result?: string;
  createdAt: Date;
}

const MISSION_TEMPLATES = [
  {
    title: "Marketing campaign from top insights",
    description: "Design a multi-channel marketing campaign addressing the top 3 learnings from qualitative data",
  },
  {
    title: "Competitive positioning analysis",
    description: "Synthesize all competitive mentions and build a positioning framework with recommendations",
  },
  {
    title: "Executive summary & recommendations",
    description: "Create a board-ready executive summary with prioritized strategic recommendations",
  },
  {
    title: "Customer journey pain-point map",
    description: "Map the end-to-end customer journey and highlight friction points with severity rankings",
  },
  {
    title: "Pricing strategy deep-dive",
    description: "Analyze all pricing-related feedback and build a sensitivity model with optimal tier recommendations",
  },
  {
    title: "Churn risk factor analysis",
    description: "Identify leading indicators of churn from qualitative and quantitative signals across all data sources",
  },
  {
    title: "Feature prioritization matrix",
    description: "Score and rank feature requests by impact, frequency, and strategic alignment to product roadmap",
  },
  {
    title: "Stakeholder sentiment report",
    description: "Generate a stakeholder-ready report on brand sentiment, NPS drivers, and perception trends",
  },
  {
    title: "Market opportunity assessment",
    description: "Identify untapped market segments and whitespace opportunities based on customer data patterns",
  },
  {
    title: "Retention strategy playbook",
    description: "Build a data-backed retention playbook with tactics mapped to key churn drivers and segments",
  },
  {
    title: "Content strategy from voice of customer",
    description: "Extract recurring themes and language patterns to inform content pillars and messaging hierarchy",
  },
  {
    title: "Operational efficiency audit",
    description: "Analyze support tickets and feedback to identify process bottlenecks and automation opportunities",
  },
];

const MissionsPanel = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const launchMission = (title: string, description: string) => {
    const mission: Mission = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "queued",
      createdAt: new Date(),
    };
    setMissions((prev) => [mission, ...prev]);
    setShowTemplates(false);
    toast.success("Mission queued", { description: title });

    // Simulate progress
    setTimeout(() => {
      setMissions((prev) =>
        prev.map((m) => (m.id === mission.id ? { ...m, status: "running", progress: 0 } : m))
      );
    }, 800);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 25;
      if (p >= 100) {
        clearInterval(interval);
        setMissions((prev) =>
          prev.map((m) =>
            m.id === mission.id
              ? { ...m, status: "complete", progress: 100, result: "Mission complete — findings ready for review. Key deliverables have been prepared based on your project data." }
              : m
          )
        );
      } else {
        setMissions((prev) =>
          prev.map((m) => (m.id === mission.id ? { ...m, progress: Math.min(p, 95) } : m))
        );
      }
    }, 2000);
  };

  const STATUS_ICON = {
    queued: <Clock size={14} className="text-muted-foreground" />,
    running: <Loader2 size={14} className="text-primary animate-spin" />,
    complete: <CheckCircle2 size={14} className="text-emerald-600" />,
  };

  // Show 5 suggested templates
  const suggestedTemplates = MISSION_TEMPLATES.slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between flex-shrink-0">
        <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-foreground">
          Agentic Missions
        </span>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-[0.08em] font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus size={12} />
          {showTemplates ? "Close" : "Browse all"}
        </button>
      </div>

      {/* Content area — fills remaining height */}
      <div className="flex-1 min-h-0 overflow-auto">
        {showTemplates ? (
          /* Full template library */
          <div className="p-3 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground px-1 mb-2 block">
              Task library · {MISSION_TEMPLATES.length} templates
            </span>
            {MISSION_TEMPLATES.map((t) => (
              <button
                key={t.title}
                onClick={() => launchMission(t.title, t.description)}
                className="w-full text-left p-3 border border-neutral-200 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <p className="text-xs font-semibold text-foreground leading-tight">{t.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>
              </button>
            ))}
          </div>
        ) : missions.length === 0 ? (
          /* Suggested templates + description */
          <div className="flex flex-col h-full">
            <div className="p-3 space-y-1">
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground px-1 mb-2 block">
                Suggested for your data
              </span>
              {suggestedTemplates.map((t) => (
                <button
                  key={t.title}
                  onClick={() => launchMission(t.title, t.description)}
                  className="w-full text-left px-3 py-2.5 hover:bg-primary/5 transition-all group"
                >
                  <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">{t.description}</p>
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-end justify-center px-6 pb-6 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                Launch long-running agentic tasks that synthesize across your entire dataset.
              </p>
            </div>
          </div>
        ) : (
          /* Active missions */
          <div className="p-3 space-y-2">
            {missions.map((mission) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 border border-neutral-200 bg-white"
              >
                <div className="flex items-start gap-2">
                  {STATUS_ICON[mission.status]}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-tight truncate">
                      {mission.title}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground mt-0.5">
                      {mission.status === "running"
                        ? `${Math.round(mission.progress || 0)}% complete`
                        : mission.status === "complete"
                        ? "Done"
                        : "Queued"}
                    </p>
                  </div>
                  {mission.status === "complete" && (
                    <ChevronRight size={12} className="text-muted-foreground mt-0.5" />
                  )}
                </div>
                {mission.status === "running" && (
                  <div className="mt-2 h-1 bg-neutral-100 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{ width: `${mission.progress || 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
                {mission.status === "complete" && mission.result && (
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    {mission.result}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsPanel;
