import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThemeStepProps {
  themes: string[];
  setThemes: (themes: string[]) => void;
  description: string; // objectives text for AI generation
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ThemeStep = ({
  themes,
  setThemes,
  description,
  onBack,
  onGenerate,
  isGenerating,
}: ThemeStepProps) => {
  const [newTheme, setNewTheme] = useState('');
  const [isGeneratingThemes, setIsGeneratingThemes] = useState(false);

  const addTheme = () => {
    if (!newTheme.trim() || themes.includes(newTheme.trim())) return;
    setThemes([...themes, newTheme.trim()]);
    setNewTheme('');
  };

  const removeTheme = (idx: number) => {
    setThemes(themes.filter((_, i) => i !== idx));
  };

  const handleGenerateThemes = async () => {
    if (!description.trim()) {
      toast.error("Please define objectives in Step 2 first");
      return;
    }
    setIsGeneratingThemes(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-themes', {
        body: { objectives: description },
      });
      if (error) throw error;
      if (data?.themes && Array.isArray(data.themes)) {
        setThemes(data.themes);
        toast.success(`Generated ${data.themes.length} themes`);
      }
    } catch (err) {
      console.error('Theme generation error:', err);
      toast.error("Could not generate themes. Please try again.");
    } finally {
      setIsGeneratingThemes(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-card border border-border p-5">
        <p className="text-sm text-foreground mb-1">
          Hit <strong>Generate Themes</strong> for an AI-generated list based on your business objectives, or type in your own.
        </p>
        <p className="text-xs text-muted-foreground">
          These are the key topics you want to analyze in your research.
        </p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          💡 Tip: Start with broad topics (e.g. <em>product usage</em>, <em>purchase drivers</em>), then refine based on what emerges in the data.
        </p>
      </div>

      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
          Themes
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateThemes}
          disabled={isGeneratingThemes}
          className="gap-2"
        >
          {isGeneratingThemes ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {isGeneratingThemes ? 'Generating...' : 'Generate themes'}
        </Button>
      </div>

      {/* Themes List */}
      {themes.length > 0 && (
        <div className="space-y-2">
          {themes.map((theme, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-5 py-3 bg-card border border-border group hover:border-primary/30 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">{theme}</span>
              <button
                onClick={() => removeTheme(idx)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Theme */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
          Add New Theme
        </label>
        <p className="text-xs text-muted-foreground mb-3">Key topics to analyze in your research</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTheme}
            onChange={(e) => setNewTheme(e.target.value)}
            placeholder="Enter theme name"
            className="flex-1 px-4 py-2.5 bg-card border border-border rounded-sm text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && addTheme()}
          />
          <Button variant="outline" onClick={addTheme} disabled={!newTheme.trim()} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="font-mono text-[11px] uppercase tracking-widest gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className={cn(
            "relative px-12 py-6 bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
            "font-mono text-[11px] font-bold tracking-[0.3em] uppercase",
            "transition-all duration-500 group"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Project
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ThemeStep;
