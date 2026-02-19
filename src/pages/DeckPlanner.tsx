import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Send, RotateCcw, ArrowRight, Layers, X,
  ChevronRight, MessageSquare, Presentation, BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDeckCollection } from "@/contexts/DeckCollectionContext";
import { useBrandGuides } from "@/hooks/useBrandGuides";
import { useCreatePresentation } from "@/hooks/usePresentations";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Slide type display config
const SLIDE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  "cover": { label: "Cover", color: "bg-foreground text-background" },
  "section-divider": { label: "Section", color: "bg-primary/15 text-primary" },
  "text-stack": { label: "Text", color: "bg-muted text-muted-foreground" },
  "bullet-list": { label: "Bullets", color: "bg-muted text-muted-foreground" },
  "quote": { label: "Quote", color: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  "metrics": { label: "Metrics", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  "two-column": { label: "Split", color: "bg-muted text-muted-foreground" },
  "cta": { label: "CTA", color: "bg-primary/15 text-primary" },
  "closing": { label: "Closing", color: "bg-foreground text-background" },
};

interface SlideOutline {
  index: number;
  type: string;
  title: string;
  brief: string;
  sourceRef?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DECK_PLANNER_INTRO = `I've analyzed your objectives and collected research items to propose this 20-slide structure. The narrative flows from context → problem → insights → recommendations → next steps.

You can refine anything by chatting with me below — try things like:
- "Add a slide about competitive landscape after slide 4"
- "Change slide 7 to a quote from the research"
- "Remove the second section divider"
- "Make the closing slide stronger"`;

export default function DeckPlanner() {
  const navigate = useNavigate();
  const { items: collectedItems } = useDeckCollection();
  const { data: brandGuides } = useBrandGuides();
  const createPresentation = useCreatePresentation();

  const [objectives, setObjectives] = useState(() =>
    sessionStorage.getItem("rubiklab-objectives") || ""
  );
  const [clientName] = useState(() =>
    sessionStorage.getItem("rubiklab-client") || "Client"
  );

  const [slides, setSlides] = useState<SlideOutline[]>([]);
  const [rationale, setRationale] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate on mount if objectives exist
  useEffect(() => {
    if (objectives.trim() && !hasGenerated) {
      handleSuggestStructure();
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestStructure = async () => {
    if (!objectives.trim()) {
      toast.error("Please set project objectives first");
      return;
    }

    setIsLoading(true);
    setHasGenerated(false);

    try {
      const { data, error } = await supabase.functions.invoke("plan-deck", {
        body: {
          mode: "suggest",
          objectives,
          collectedItems: collectedItems.map(i => ({
            type: i.type,
            source: i.source,
            title: i.title,
            content: i.content,
          })),
        },
      });

      if (error) throw error;

      setSlides(data.slides || []);
      setRationale(data.rationale || "");
      setHasGenerated(true);

      // Add intro message
      setMessages([
        { role: "assistant", content: DECK_PLANNER_INTRO },
      ]);
    } catch (err: any) {
      console.error("plan-deck error:", err);
      toast.error(err.message || "Failed to generate deck structure");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatEdit = async () => {
    const instruction = chatInput.trim();
    if (!instruction || isChatSending) return;

    setChatInput("");
    setIsChatSending(true);

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: instruction },
    ];
    setMessages(newMessages);

    try {
      const { data, error } = await supabase.functions.invoke("plan-deck", {
        body: {
          mode: "edit",
          existingStructure: slides,
          editInstruction: instruction,
          objectives,
        },
      });

      if (error) throw error;

      const updatedSlides = data.slides || slides;
      setSlides(updatedSlides);

      // Find what changed for the response message
      const changed = updatedSlides.length !== slides.length
        ? `Updated deck to ${updatedSlides.length} slides.`
        : "Done — I've applied your change to the structure.";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: changed },
      ]);
    } catch (err: any) {
      toast.error(err.message || "Failed to apply edit");
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't apply that change. Please try rephrasing." },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleGenerate = async () => {
    if (!slides.length) return;
    setIsGenerating(true);

    try {
      // Store the outline in session for the generation step
      const outlineText = slides
        .map(s => `Slide ${s.index} [${s.type}]: ${s.title}\n${s.brief}${s.sourceRef ? `\nSource: ${s.sourceRef}` : ""}`)
        .join("\n\n");

      const defaultBrandGuide = brandGuides?.find(bg => bg.is_default) || brandGuides?.[0];

      // Build content from objectives + collected items + outline
      const content = [
        `PROJECT: ${clientName}`,
        `\nOBJECTIVES:\n${objectives}`,
        collectedItems.length > 0
          ? `\nRESEARCH ITEMS:\n${collectedItems.map(i => `[${i.type.toUpperCase()}] ${i.title}: ${i.content}`).join("\n\n")}`
          : "",
        `\nAPPROVED DECK OUTLINE:\n${outlineText}`,
      ].filter(Boolean).join("\n");

      // Save to DB
      const presentation = await createPresentation.mutateAsync({
        title: `${clientName} — Deck`,
        content,
        client_name: clientName,
        brand_guide_id: defaultBrandGuide?.id,
      });

      // Store in session for the generation engine
      sessionStorage.setItem("rubiklab-presentation-id", presentation.id);
      sessionStorage.setItem("rubiklab-client", clientName);
      sessionStorage.setItem("rubiklab-content", content);
      sessionStorage.setItem("rubiklab-brand-guide-id", defaultBrandGuide?.id || "");
      sessionStorage.setItem("rubiklab-deck-outline", JSON.stringify(slides));

      toast.success("Generating your deck…");
      navigate(`/deck-generate?id=${presentation.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to start generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const typeConfig = (type: string) =>
    SLIDE_TYPE_CONFIG[type] || { label: type, color: "bg-muted text-muted-foreground" };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-foreground flex flex-col">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <AppHeader />

      <main className="relative z-10 flex-1 flex flex-col pt-16" style={{ height: "calc(100vh - 64px)" }}>
        {/* Top bar */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Deck Planner
            </span>
            {hasGenerated && (
              <span className="text-xs text-muted-foreground">
                — {slides.length} slides
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasGenerated && (
              <button
                onClick={handleSuggestStructure}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            )}

            {collectedItems.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-sm">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {collectedItems.length} research items
                </span>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!hasGenerated || isGenerating || slides.length === 0}
              className="gap-2 font-mono text-[11px] uppercase tracking-widest"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4" />
                  Generate Deck
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Slide outline */}
          <div className="w-[55%] border-r border-border flex flex-col overflow-hidden">
            {/* Loading state */}
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground font-mono">
                  Analyzing objectives & research…
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !hasGenerated && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center max-w-sm">
                  <h3 className="font-serif text-xl font-bold mb-2">Ready to plan your deck</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {objectives
                      ? "Click below to generate a 20-slide structure tailored to your objectives."
                      : "Set your project objectives first, then return here to plan your deck."}
                  </p>
                </div>
                {objectives && (
                  <Button onClick={handleSuggestStructure} className="gap-2">
                    <Layers className="w-4 h-4" />
                    Generate Structure
                  </Button>
                )}
              </div>
            )}

            {/* Slide list */}
            {!isLoading && hasGenerated && slides.length > 0 && (
              <div className="flex-1 overflow-y-auto">
                {rationale && (
                  <div className="px-5 py-3 border-b border-border bg-primary/5">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{rationale}</p>
                  </div>
                )}

                <div className="divide-y divide-border">
                  {slides.map((slide, i) => {
                    const cfg = typeConfig(slide.type);
                    const isSectionType =
                      slide.type === "cover" ||
                      slide.type === "section-divider" ||
                      slide.type === "closing" ||
                      slide.type === "cta";

                    return (
                      <motion.div
                        key={slide.index}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className={cn(
                          "flex items-start gap-4 px-5 py-3.5 group transition-colors hover:bg-muted/30",
                          isSectionType && "bg-muted/20"
                        )}
                      >
                        {/* Slide number */}
                        <div className="w-8 shrink-0 text-right">
                          <span className="font-mono text-[11px] text-muted-foreground/50">
                            {String(slide.index).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Type badge */}
                        <div className="shrink-0 pt-0.5">
                          <span className={cn("font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm", cfg.color)}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium leading-snug mb-0.5",
                            isSectionType ? "text-foreground" : "text-foreground"
                          )}>
                            {slide.title}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {slide.brief}
                          </p>
                          {slide.sourceRef && (
                            <p className="text-[10px] text-primary/70 mt-1 flex items-center gap-1">
                              <BookOpen className="w-2.5 h-2.5" />
                              {slide.sourceRef}
                            </p>
                          )}
                        </div>

                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Chat panel */}
          <div className="w-[45%] flex flex-col overflow-hidden bg-card">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Refine Structure
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {!hasGenerated && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    Generate the deck structure first, then chat with me to refine it.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Building your narrative…</p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isChatSending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Updating…</span>
                  </div>
                </motion.div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-border shrink-0">
              {/* Suggestion chips */}
              {hasGenerated && messages.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    "Add a competitive landscape slide",
                    "Make the opening stronger",
                    "Add more evidence slides",
                    "Shorten to 15 slides",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setChatInput(s)}
                      className="text-[11px] px-2.5 py-1 rounded-sm bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatEdit();
                    }
                  }}
                  disabled={!hasGenerated || isChatSending}
                  placeholder={hasGenerated ? "Ask me to change the structure…" : "Generate structure first…"}
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleChatEdit}
                  disabled={!chatInput.trim() || isChatSending || !hasGenerated}
                  className="px-4 py-2.5 bg-foreground text-background rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Generate CTA */}
              {hasGenerated && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        Happy with the structure? Generate deck
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
