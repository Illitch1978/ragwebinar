import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Save, StickyNote, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PresenterNotesPanelProps {
  presentationId: string | null;
  currentSlide: number;
  totalSlides: number;
  isDark?: boolean;
}

export const PresenterNotesPanel = ({
  presentationId,
  currentSlide,
  totalSlides,
  isDark = false,
}: PresenterNotesPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load notes from database
  useEffect(() => {
    const loadNotes = async () => {
      if (!presentationId) return;
      
      try {
        const { data, error } = await supabase
          .from('presentations')
          .select('presenter_notes')
          .eq('id', presentationId)
          .single();
        
        if (!error && data?.presenter_notes) {
          setNotes(data.presenter_notes as Record<string, string>);
        }
      } catch (e) {
        console.error('Error loading presenter notes:', e);
      }
    };
    
    loadNotes();
  }, [presentationId]);

  // Save notes to database
  const saveNotes = useCallback(async () => {
    if (!presentationId) {
      toast.error("No presentation ID - cannot save notes");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('presentations')
        .update({ presenter_notes: notes })
        .eq('id', presentationId);
      
      if (error) throw error;
      
      setHasChanges(false);
      toast.success("Notes saved");
    } catch (e) {
      console.error('Error saving notes:', e);
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  }, [presentationId, notes]);

  // Auto-save on blur or after delay
  useEffect(() => {
    if (!hasChanges) return;
    
    const timeout = setTimeout(() => {
      saveNotes();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [notes, hasChanges, saveNotes]);

  const currentNote = notes[String(currentSlide)] || "";

  const handleNoteChange = (value: string) => {
    setNotes(prev => ({
      ...prev,
      [String(currentSlide)]: value
    }));
    setHasChanges(true);
  };

  // Keyboard shortcut to toggle panel (N key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        // Only toggle if not typing in textarea
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsOpen(prev => !prev);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Toggle button - always visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-lg transition-colors",
          "border backdrop-blur-sm shadow-lg",
          isDark 
            ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
            : "bg-background border-border text-foreground hover:bg-muted"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <StickyNote className="w-5 h-5" />}
      </motion.button>

      {/* Notes panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 h-full w-80 z-20 border-l shadow-2xl",
              "flex flex-col",
              isDark 
                ? "bg-[#0a0a0f]/95 border-white/10 text-white backdrop-blur-xl" 
                : "bg-background/95 border-border backdrop-blur-xl"
            )}
          >
            {/* Header */}
            <div className={cn(
              "px-4 py-3 border-b flex items-center justify-between",
              isDark ? "border-white/10" : "border-border"
            )}>
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Presenter Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-mono text-xs",
                  isDark ? "text-white/50" : "text-muted-foreground"
                )}>
                  Slide {currentSlide + 1}/{totalSlides}
                </span>
                {hasChanges && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={saveNotes}
                    disabled={isSaving}
                    className="h-7 px-2"
                  >
                    <Save className={cn("w-3.5 h-3.5", isSaving && "animate-pulse")} />
                  </Button>
                )}
              </div>
            </div>

            {/* Notes editor */}
            <div className="flex-1 p-4 overflow-hidden">
              <Textarea
                value={currentNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Add your presenter notes for this slide..."
                className={cn(
                  "h-full resize-none border-0 focus-visible:ring-0 text-sm leading-relaxed",
                  isDark 
                    ? "bg-white/5 text-white placeholder:text-white/30" 
                    : "bg-muted/50 placeholder:text-muted-foreground/50"
                )}
              />
            </div>

            {/* Save notes button */}
            <div className={cn(
              "px-4 py-3 border-t",
              isDark ? "border-white/10" : "border-border"
            )}>
              <Button
                variant="outline"
                size="sm"
                onClick={saveNotes}
                disabled={!hasChanges || isSaving}
                className={cn(
                  "w-full gap-2",
                  isDark && "border-white/20 text-white hover:bg-white/10",
                  !hasChanges && "opacity-50"
                )}
              >
                {isSaving ? (
                  <>
                    <Save className="w-4 h-4 animate-pulse" />
                    Saving...
                  </>
                ) : hasChanges ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Notes
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Notes Saved
                  </>
                )}
              </Button>
            </div>

            {/* Footer tip */}
            <div className={cn(
              "px-4 py-2 border-t text-xs",
              isDark ? "border-white/10 text-white/40" : "border-border text-muted-foreground"
            )}>
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">N</kbd> to toggle notes
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
