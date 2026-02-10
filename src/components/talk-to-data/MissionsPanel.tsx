import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Plus,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
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
    icon: Rocket,
  },
  {
    title: "Competitive positioning analysis",
    description: "Synthesize all competitive mentions and build a positioning framework with recommendations",
    icon: Target,
  },
  {
    title: "Executive summary & recommendations",
    description: "Create a board-ready executive summary with prioritized strategic recommendations",
    icon: TrendingUp,
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} strokeWidth={1.5} className="text-primary" />
          <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-foreground">
            Missions
          </span>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-[0.08em] font-semibold text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus size={12} />
          New
        </button>
      </div>

      {/* Templates dropdown */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-neutral-200"
          >
            <div className="p-3 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground px-1">
                Long-term tasks
              </span>
              {MISSION_TEMPLATES.map((t) => (
                <button
                  key={t.title}
                  onClick={() => launchMission(t.title, t.description)}
                  className="w-full text-left p-3 border border-neutral-200 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <t.icon size={14} strokeWidth={1.5} className="text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-tight">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission List */}
      <div className="flex-1 min-h-0 overflow-auto">
        {missions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center mb-3">
              <Rocket size={16} strokeWidth={1.5} className="text-neutral-300" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Launch long-running agentic tasks that synthesize across your entire dataset.
            </p>
            <button
              onClick={() => setShowTemplates(true)}
              className="mt-3 text-[10px] uppercase tracking-[0.08em] font-semibold text-primary hover:underline"
            >
              Browse templates →
            </button>
          </div>
        ) : (
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
