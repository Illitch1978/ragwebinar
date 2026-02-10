import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Loader2, MessageSquare, BarChart3, Shield, Target } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import TaskCard from "@/components/talk-to-data/TaskCard";
import MissionsPanel from "@/components/talk-to-data/MissionsPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Finding {
  claim: string;
  evidence: string;
  source_hint: string;
  strength: "strong" | "moderate" | "weak";
}

export interface TaskResult {
  id: string;
  query: string;
  intent: "evidence" | "validate" | "insight" | "conversational";
  title: string;
  summary: string;
  confidence: number;
  findings: Finding[];
  counter_evidence?: string | null;
  suggested_actions: string[];
  slide_suggestion?: {
    type: string;
    title: string;
    content_preview: string;
  } | null;
  timestamp: Date;
  status: "running" | "complete" | "error";
}

const INTENT_PRESETS = [
  { label: "Find evidence for…", icon: Search, intent: "evidence", prefix: "Find the strongest evidence for: " },
  { label: "Validate assumption…", icon: Shield, intent: "validate", prefix: "Validate or refute this assumption: " },
  { label: "Extract insights about…", icon: Target, intent: "insight", prefix: "Extract key insights about: " },
  { label: "Summarize findings on…", icon: BarChart3, intent: "insight", prefix: "Summarize the key findings on: " },
];

const TalkToData = () => {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (feedRef.current && tasks.length > 0) {
      feedRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tasks.length]);

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    const taskId = crypto.randomUUID();
    const newTask: TaskResult = {
      id: taskId,
      query: queryText.trim(),
      intent: "conversational",
      title: "Processing…",
      summary: "",
      confidence: 0,
      findings: [],
      suggested_actions: [],
      timestamp: new Date(),
      status: "running",
    };

    setTasks((prev) => [newTask, ...prev]);
    setQuery("");
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("talk-to-data", {
        body: {
          query: queryText.trim(),
          history: tasks
            .filter((t) => t.status === "complete")
            .slice(0, 3)
            .map((t) => [
              { role: "user", content: t.query },
              { role: "assistant", content: JSON.stringify({ title: t.title, summary: t.summary, findings: t.findings }) },
            ])
            .flat(),
        },
      });

      if (error) throw error;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, ...data, status: "complete" as const }
            : t
        )
      );
    } catch (err: any) {
      console.error("Talk to data error:", err);
      toast.error(err.message || "Failed to process query");
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: "error" as const, title: "Error", summary: err.message || "Something went wrong" }
            : t
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuery(query);
    }
  };

  const handlePreset = (prefix: string) => {
    setQuery(prefix);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F9F8F4] text-foreground font-sans overflow-hidden">
      <AppHeader />

      <div className="flex-1 min-h-0 flex">
        {/* Left: Command + Task Feed */}
        <div className="flex-1 min-w-0 flex flex-col border-r border-neutral-200">
          {/* Command Bar */}
          <div className="border-b border-neutral-200 bg-white/60 backdrop-blur-sm">
            <div className="px-6 lg:px-10 py-5">
              <div className="relative">
                <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-none px-5 py-4 focus-within:border-primary transition-colors shadow-sm">
                  <Search size={18} strokeWidth={1.5} className="text-neutral-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your data anything…"
                    className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-neutral-400 outline-none"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={() => submitQuery(query)}
                    disabled={!query.trim() || isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-white text-xs uppercase tracking-[0.1em] font-semibold hover:bg-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    <span>{isProcessing ? "Working" : "Run"}</span>
                  </button>
                </div>
              </div>

              {/* Intent Presets */}
              <div className="flex items-center gap-2 mt-3">
                {INTENT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePreset(preset.prefix)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-medium text-neutral-400 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                  >
                    <preset.icon size={12} strokeWidth={1.5} />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task Feed */}
          <div ref={feedRef} className="flex-1 min-h-0 overflow-auto">
            <div className="px-6 lg:px-10 py-6">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 max-w-md mx-auto text-center">
                  <div className="w-12 h-12 border border-neutral-200 flex items-center justify-center mb-6">
                    <MessageSquare size={20} strokeWidth={1.5} className="text-neutral-300" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-2">Your research agent</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    Ask questions about your uploaded data. The agent will find evidence,
                    validate assumptions, extract patterns, and prepare findings for your deck.
                  </p>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {[
                      "What are the strongest customer pain points?",
                      "Validate: NPS correlates with retention",
                      "Find evidence for pricing sensitivity",
                      "Compare Q3 vs Q4 sentiment trends",
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => submitQuery(example)}
                        className="text-left px-4 py-3 text-xs text-neutral-500 bg-white border border-neutral-200 hover:border-primary/30 hover:text-primary transition-all leading-relaxed"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onFollowUp={(text) => submitQuery(text)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Missions Panel */}
        <div className="w-[320px] flex-shrink-0 bg-white/40 backdrop-blur-sm">
          <MissionsPanel />
        </div>
      </div>
    </div>
  );
};

export default TalkToData;
