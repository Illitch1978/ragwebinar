import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Download, ArrowLeft, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBrandGuides } from "@/hooks/useBrandGuides";
import AppHeader from "@/components/AppHeader";
import { cn } from "@/lib/utils";
import ScreenshotExporter from "@/components/ScreenshotExporter";

// Re-use the same Presentation renderer inline by importing slide component logic
// We do a lazy inline approach: import and use the existing page as iframe or navigate
// Instead, we drive generation here and redirect to /presentation with the chat panel active

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function DeckGenerate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presentationId = searchParams.get("id");
  const { data: brandGuides } = useBrandGuides();

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedSlides, setGeneratedSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clientName = sessionStorage.getItem("rubiklab-client") || "Client";
  const content = sessionStorage.getItem("rubiklab-content") || "";
  const brandGuideId = sessionStorage.getItem("rubiklab-brand-guide-id") || "";
  const outline = JSON.parse(sessionStorage.getItem("rubiklab-deck-outline") || "[]");

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    generateDeck();
  }, []);

  // Animate progress bar during generation
  useEffect(() => {
    if (isGenerating) {
      progressInterval.current = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 4, 88));
      }, 800);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isGenerating]);

  const generateDeck = async () => {
    setIsGenerating(true);
    setProgress(5);

    try {
      const brandGuide =
        brandGuides?.find(bg => bg.id === brandGuideId) ||
        brandGuides?.find(bg => bg.is_default) ||
        brandGuides?.[0];

      // Build a richer content string using the outline as instructions
      const outlineInstructions = outline.length > 0
        ? `\n\nFOLLOW THIS APPROVED STRUCTURE (${outline.length} slides):\n${outline.map((s: any) => `Slide ${s.index} [${s.type}]: ${s.title}\n  → ${s.brief}`).join("\n")}`
        : "";

      const { data, error } = await supabase.functions.invoke("generate-presentation", {
        body: {
          content: content + outlineInstructions,
          clientName,
          brandGuide,
          instructions: `Follow the approved deck structure exactly. Use the slide types and titles as specified. Expand each slide's content richly based on the objectives and research items provided. Generate compelling, data-rich content for each slide.`,
          length: outline.length > 25 ? "long" : outline.length > 15 ? "medium" : "brief",
        },
      });

      if (error) throw error;

      const slides = data.slides || [];
      setGeneratedSlides(slides);

      // Save to DB
      if (presentationId) {
        await supabase
          .from("presentations")
          .update({ generated_slides: slides })
          .eq("id", presentationId);
      }

      // Store in session
      sessionStorage.setItem("rubiklab-generated-slides", JSON.stringify(slides));
      sessionStorage.setItem("rubiklab-presentation-id", presentationId || "");

      setMessages([
        {
          role: "assistant",
          content: `Your ${slides.length}-slide deck is ready! Navigate through the slides on the left. You can ask me to make changes — try:\n\n• "Add a slide about competitive landscape after slide 4"\n• "Change the title on slide 2 to something more impactful"\n• "Add a quote from the research on slide 8"\n• "Make slide 12 a metrics slide"`,
        },
      ]);
    } catch (err: any) {
      console.error("generate deck error:", err);
      toast.error(err.message || "Failed to generate deck");
      setMessages([
        { role: "assistant", content: "Generation failed. Please go back and try again." },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatEdit = async () => {
    const instruction = chatInput.trim();
    if (!instruction || isChatSending || !generatedSlides.length) return;

    setChatInput("");
    setIsChatSending(true);
    setMessages(prev => [...prev, { role: "user", content: instruction }]);

    try {
      // Use plan-deck in edit mode but for actual slide content
      const { data, error } = await supabase.functions.invoke("edit-slide", {
        body: {
          instruction,
          slides: generatedSlides,
          currentSlideIndex,
          clientName,
        },
      });

      if (error) throw error;

      const updatedSlides = data.slides || generatedSlides;
      setGeneratedSlides(updatedSlides);

      // Save to DB
      if (presentationId) {
        await supabase
          .from("presentations")
          .update({ generated_slides: updatedSlides })
          .eq("id", presentationId);
      }

      sessionStorage.setItem("rubiklab-generated-slides", JSON.stringify(updatedSlides));

      const responseMsg = data.message || "Done — changes applied to the deck.";
      setMessages(prev => [...prev, { role: "assistant", content: responseMsg }]);
    } catch (err: any) {
      toast.error(err.message || "Could not apply edit");
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't apply that change. Please try rephrasing." },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleOpenFullPresentation = () => {
    navigate(`/presentation?id=${presentationId}`);
  };

  const handleExport = () => {
    navigate(`/presentation?id=${presentationId}&export=true`);
  };

  const slide = generatedSlides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col">
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
            <button
              onClick={() => navigate("/deck")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Planner
            </button>
            <div className="w-px h-4 bg-border" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {clientName}
            </span>
            {!isGenerating && generatedSlides.length > 0 && (
              <span className="text-xs text-muted-foreground">
                — {generatedSlides.length} slides
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isGenerating && generatedSlides.length > 0 && (
              <>
                <button
                  onClick={handleOpenFullPresentation}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-sm hover:bg-muted"
                >
                  Full View
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-foreground text-background rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export PPTX
                </button>
              </>
            )}
          </div>
        </div>

        {/* Generation progress */}
        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                <span className="text-sm text-foreground font-medium">Generating your deck…</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress < 30
                  ? "Analyzing objectives and research items…"
                  : progress < 60
                  ? "Building slide content and narrative…"
                  : progress < 85
                  ? "Polishing structure and formatting…"
                  : "Almost there…"}
              </p>
            </div>
          </div>
        )}

        {/* Split view: slides + chat */}
        {!isGenerating && generatedSlides.length > 0 && (
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: Slide preview strip + current slide */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
              {/* Slide nav */}
              <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0 bg-card">
                <button
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-muted-foreground">
                  Slide {currentSlideIndex + 1} of {generatedSlides.length}
                </span>
                <button
                  onClick={() => setCurrentSlideIndex(Math.min(generatedSlides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === generatedSlides.length - 1}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide strip */}
              <div className="flex gap-2 p-3 overflow-x-auto border-b border-border bg-muted/30 shrink-0">
                {generatedSlides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={cn(
                      "shrink-0 w-24 h-16 border-2 rounded-sm overflow-hidden transition-all text-[6px] font-medium flex items-center justify-center",
                      i === currentSlideIndex
                        ? "border-primary"
                        : "border-transparent hover:border-border",
                      s.dark ? "bg-neutral-900 text-white" : "bg-white text-neutral-900"
                    )}
                  >
                    <span className="px-1 text-center leading-tight line-clamp-2">{s.title || s.type}</span>
                  </button>
                ))}
              </div>

              {/* Current slide preview (simple card view) */}
              <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "w-full max-w-2xl rounded-sm border border-border shadow-lg p-10 min-h-[320px] flex flex-col",
                      slide?.dark
                        ? "bg-neutral-900 text-white border-neutral-700"
                        : "bg-white text-neutral-900"
                    )}
                  >
                    {/* Slide type badge */}
                    <div className="flex items-center gap-2 mb-6">
                      <span className={cn(
                        "font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm",
                        slide?.dark ? "bg-white/10 text-white/60" : "bg-neutral-100 text-neutral-500"
                      )}>
                        {slide?.type}
                      </span>
                      <span className={cn(
                        "font-mono text-[9px]",
                        slide?.dark ? "text-white/30" : "text-neutral-400"
                      )}>
                        Slide {currentSlideIndex + 1}
                      </span>
                    </div>

                    {/* Title */}
                    {slide?.title && (
                      <h2 className={cn(
                        "font-serif text-2xl font-bold mb-4 leading-tight",
                        slide?.dark ? "text-white" : "text-neutral-900"
                      )}>
                        {slide.title}
                      </h2>
                    )}

                    {/* Subtitle */}
                    {slide?.subtitle && (
                      <p className={cn(
                        "text-base mb-4",
                        slide?.dark ? "text-white/70" : "text-neutral-600"
                      )}>
                        {slide.subtitle}
                      </p>
                    )}

                    {/* Content */}
                    {slide?.content && (
                      <p className={cn(
                        "text-sm leading-relaxed",
                        slide?.dark ? "text-white/60" : "text-neutral-600"
                      )}
                        dangerouslySetInnerHTML={{ __html: slide.content }}
                      />
                    )}

                    {/* Items */}
                    {slide?.items && slide.items.length > 0 && (
                      <ul className="space-y-3 mt-2">
                        {slide.items.slice(0, 5).map((item: any, i: number) => (
                          <li key={i} className="flex gap-3">
                            <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-2" />
                            <div>
                              {item.label && (
                                <span className={cn("font-semibold text-sm", slide?.dark ? "text-white" : "text-neutral-800")}>
                                  {item.label}{item.text ? ": " : ""}
                                </span>
                              )}
                              {item.text && (
                                <span className={cn("text-sm", slide?.dark ? "text-white/60" : "text-neutral-600")}
                                  dangerouslySetInnerHTML={{ __html: item.text }}
                                />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Quote */}
                    {slide?.quote && (
                      <blockquote className={cn(
                        "border-l-2 border-primary pl-4 text-base italic mt-2",
                        slide?.dark ? "text-white/80" : "text-neutral-700"
                      )}>
                        "{slide.quote}"
                        {slide?.author && (
                          <cite className={cn("block text-sm not-italic mt-2", slide?.dark ? "text-white/50" : "text-neutral-500")}>
                            — {slide.author}
                          </cite>
                        )}
                      </blockquote>
                    )}

                    {/* Metrics */}
                    {slide?.metrics && slide.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {slide.metrics.slice(0, 4).map((m: any, i: number) => (
                          <div key={i} className={cn("p-4 rounded-sm", slide?.dark ? "bg-white/5" : "bg-neutral-50")}>
                            <div className={cn("font-serif text-3xl font-bold", slide?.dark ? "text-white" : "text-neutral-900")}>
                              {m.value}
                            </div>
                            <div className={cn("text-xs mt-1", slide?.dark ? "text-white/50" : "text-neutral-500")}>
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Chat panel */}
            <div className="w-[380px] shrink-0 flex flex-col overflow-hidden bg-card">
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Edit Deck
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "max-w-[90%] rounded-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isChatSending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Applying…</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Suggestion chips */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-col gap-1.5">
                  {[
                    `Add a slide about competition after slide ${Math.min(5, generatedSlides.length)}`,
                    "Make the opening slide title more compelling",
                    "Add a quote slide from the research",
                    "Change slide 3 to a metrics slide",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setChatInput(s)}
                      className="text-left text-[11px] px-3 py-2 rounded-sm bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border shrink-0">
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
                    disabled={isChatSending}
                    placeholder="Edit a slide or restructure…"
                    className="flex-1 px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={handleChatEdit}
                    disabled={!chatInput.trim() || isChatSending}
                    className="px-3 py-2.5 bg-foreground text-background rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleOpenFullPresentation}
                  className="w-full mt-2.5 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-sm hover:bg-muted transition-colors"
                >
                  Open full presentation view →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
