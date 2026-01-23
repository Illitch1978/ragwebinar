import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, Sparkles, ArrowRight, FileBarChart, Presentation as PresentationIcon, Loader2, Clock, Trash2, Pencil, Check, X, Settings, ChevronDown, Link2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePresentations, useCreatePresentation, useDeletePresentation, useUpdatePresentation, Presentation } from "@/hooks/usePresentations";
import { useBrandGuides } from "@/hooks/useBrandGuides";
import { DECK_PRINCIPLES } from "@/lib/deckPrinciples";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BrandGuideEditor from "@/components/BrandGuideEditor";
import { exportToPptx } from "@/lib/pptxExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// Rubiklab Logo component
const RubiklabLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
  <div className="flex items-center gap-1.5 group cursor-pointer">
    <span className={cn(
      "font-serif font-bold tracking-tight text-muted-foreground transition-colors duration-700 group-hover:text-primary",
      size === 'small' ? 'text-xl' : 'text-2xl'
    )}>
      rubiklab
    </span>
    <div className="relative flex items-center justify-center">
      <div className={cn(
        "absolute bg-primary rounded-full animate-ping opacity-20",
        size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'
      )} />
      <div className={cn(
        "bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]",
        size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2'
      )} />
    </div>
  </div>
);

type OutputFormat = 'report' | 'presentation';
type DeckLength = 'brief' | 'medium' | 'long' | 'very-long';

const DECK_LENGTH_OPTIONS: { value: DeckLength; label: string; description: string; range: string }[] = [
  { value: 'brief', label: 'Brief', description: 'Executive summary', range: '8-12 slides' },
  { value: 'medium', label: 'Medium', description: 'Standard presentation', range: '13-22 slides' },
  { value: 'long', label: 'Long', description: 'Deep-dive analysis', range: '23-30 slides' },
  { value: 'very-long', label: 'Very Long', description: 'Full workshop deck', range: '31-45 slides' },
];

const UploadPage = () => {
  const [content, setContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('report');
  const [deckLength, setDeckLength] = useState<DeckLength>('medium');
  const [selectedBrandGuide, setSelectedBrandGuide] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { data: savedPresentations, isLoading: isLoadingPresentations } = usePresentations();
  const { data: brandGuides, isLoading: isLoadingBrandGuides } = useBrandGuides();
  const createPresentation = useCreatePresentation();
  const deletePresentation = useDeletePresentation();
  const updatePresentation = useUpdatePresentation();
  
  // Set default brand guide when data loads
  const defaultGuide = brandGuides?.find(bg => bg.is_default);
  if (brandGuides && !selectedBrandGuide && defaultGuide) {
    setSelectedBrandGuide(defaultGuide.id);
  }
  
  // Edit state for presentation titles
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };


  const extractTextFromHTML = (html: string): string => {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Extract text from slides if it's a reveal.js presentation
    const slides = doc.querySelectorAll('section');
    if (slides.length > 0) {
      let content = '';
      slides.forEach((slide, index) => {
        const heading = slide.querySelector('h1, h2');
        const body = slide.querySelector('.body, .lead, p');
        const bullets = slide.querySelectorAll('li, .line');
        
        if (heading) {
          content += `## ${heading.textContent?.trim()}\n\n`;
        }
        if (body) {
          content += `${body.textContent?.trim()}\n\n`;
        }
        if (bullets.length > 0) {
          bullets.forEach(bullet => {
            const text = bullet.textContent?.trim();
            if (text) content += `- ${text}\n`;
          });
          content += '\n';
        }
      });
      return content.trim();
    }
    
    // Fallback: just get body text
    return doc.body?.textContent?.trim() || '';
  };

  const handleFile = async (file: File) => {
    setIsProcessingFile(true);
    
    try {
      // Text/Markdown files
      if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setContent(text);
      }
      // HTML files
      else if (file.type === "text/html" || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const html = await file.text();
        const extractedText = extractTextFromHTML(html);
        setContent(extractedText);
      }
      else {
        alert("Please upload a .txt, .md, or .html file");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert("Error processing file. Please try again.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert("Please add some content first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get the selected brand guide data
      const selectedGuide = brandGuides?.find(bg => bg.id === selectedBrandGuide);
      
      // Save initial presentation to database
      const title = clientName || `Presentation ${new Date().toLocaleDateString()}`;
      const saved = await createPresentation.mutateAsync({
        title,
        content,
        client_name: clientName || undefined,
        brand_guide_id: selectedBrandGuide || undefined,
      });
      
      // Call the edge function to generate slides
      toast.info("Generating presentation with AI...");
      
      const { data: generateData, error: generateError } = await supabase.functions.invoke(
        'generate-presentation',
        {
          body: {
            content,
            clientName: clientName || 'Presentation',
            brandGuide: selectedGuide ? {
              name: selectedGuide.name,
              design_system: selectedGuide.design_system,
              slide_templates: selectedGuide.slide_templates,
            } : null,
            length: deckLength,
          },
        }
      );
      
      if (generateError) {
        console.error('Generation error:', generateError);
        toast.error("Failed to generate slides. Using fallback.");
      } else if (generateData?.slides) {
        // Update the presentation with generated slides
        await supabase
          .from('presentations')
          .update({ generated_slides: generateData.slides })
          .eq('id', saved.id);
        
        toast.success(`Generated ${generateData.slides.length} slides!`);
      }
      
      // Store content in sessionStorage for the report to consume
      sessionStorage.setItem('rubiklab-content', content);
      sessionStorage.setItem('rubiklab-client', clientName || 'Client');
      sessionStorage.setItem('rubiklab-format', outputFormat);
      sessionStorage.setItem('rubiklab-length', deckLength);
      sessionStorage.setItem('rubiklab-presentation-id', saved.id);
      sessionStorage.setItem('rubiklab-brand-guide-id', selectedBrandGuide);
      if (generateData?.slides) {
        sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(generateData.slides));
      }
      
      // Navigate to appropriate view after a brief animation
      setTimeout(() => {
        navigate(outputFormat === 'presentation' ? '/presentation' : '/report');
      }, 500);
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error("Error generating presentation");
      setIsGenerating(false);
    }
  };

  const handleOpenSaved = (presentation: Presentation) => {
    // Check if this presentation has AI-generated slides
    const hasGeneratedSlides = presentation.generated_slides && 
      Array.isArray(presentation.generated_slides) && 
      presentation.generated_slides.length > 0;
    
    sessionStorage.setItem('rubiklab-content', presentation.content);
    sessionStorage.setItem('rubiklab-client', presentation.client_name || 'Client');
    sessionStorage.setItem('rubiklab-format', outputFormat);
    sessionStorage.setItem('rubiklab-presentation-id', presentation.id);
    sessionStorage.setItem('rubiklab-brand-guide-id', presentation.brand_guide_id || selectedBrandGuide);
    
    if (hasGeneratedSlides) {
      // AI-generated presentation - store slides and go to /presentation
      sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(presentation.generated_slides));
      navigate('/presentation');
    } else {
      // RAG webinar or legacy content - go to /report (hardcoded content)
      navigate('/report');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this presentation?')) {
      await deletePresentation.mutateAsync(id);
    }
  };

  const handleStartEdit = (e: React.MouseEvent, presentation: { id: string; title: string }) => {
    e.stopPropagation();
    setEditingId(presentation.id);
    setEditingTitle(presentation.title);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingId && editingTitle.trim()) {
      await updatePresentation.mutateAsync({ id: editingId, title: editingTitle.trim() });
      setEditingId(null);
      setEditingTitle("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border">
        <div className="container mx-auto px-6 lg:px-16 py-6 flex justify-between items-center">
          <RubiklabLogo />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-16 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 lg:mb-16"
          >
            <h1 className="font-serif text-4xl lg:text-6xl text-foreground mb-6 tracking-tight">
              Strategic<br />
              <span className="italic text-primary">Intelligence Reports</span>
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto font-light">
              Transform your analysis into a premium presentation deck. 
              Paste your content or upload a file to begin.
            </p>
          </motion.div>

          {/* Client Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Client / Project Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client or project name..."
              className="w-full px-6 py-4 bg-card border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </motion.div>

          {/* Format Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOutputFormat('report')}
                className={cn(
                  "relative px-6 py-5 rounded-sm border-2 transition-all duration-300 text-left group",
                  outputFormat === 'report'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    outputFormat === 'report' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <FileBarChart className={cn(
                      "w-5 h-5 transition-colors",
                      outputFormat === 'report' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Strategic Report</p>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analysis deck with executive synthesis
                    </p>
                  </div>
                </div>
                {outputFormat === 'report' && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              <button
                onClick={() => setOutputFormat('presentation')}
                className={cn(
                  "relative px-6 py-5 rounded-sm border-2 transition-all duration-300 text-left group",
                  outputFormat === 'presentation'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    outputFormat === 'presentation' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <PresentationIcon className={cn(
                      "w-5 h-5 transition-colors",
                      outputFormat === 'presentation' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Presentation</p>
                    <p className="text-sm text-muted-foreground">
                      Webinar-style slides with focused messaging
                    </p>
                  </div>
                </div>
                {outputFormat === 'presentation' && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Deck Length Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Deck Length
            </label>
            <div className="grid grid-cols-4 gap-3">
              {DECK_LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDeckLength(option.value)}
                  className={cn(
                    "relative px-4 py-4 rounded-sm border-2 transition-all duration-300 text-center",
                    deckLength === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <p className="font-medium text-foreground text-sm mb-0.5">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.range}</p>
                  {deckLength === option.value && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Brand Guide Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.22 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Brand Guide / Template
            </label>
            <Select
              value={selectedBrandGuide}
              onValueChange={setSelectedBrandGuide}
              disabled={isLoadingBrandGuides}
            >
              <SelectTrigger className="w-full bg-card border-border h-12">
                <SelectValue placeholder={isLoadingBrandGuides ? "Loading..." : "Select a brand guide"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {brandGuides?.map((guide) => (
                  <SelectItem key={guide.id} value={guide.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span>{guide.name}</span>
                      {guide.is_default && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {brandGuides?.find(bg => bg.id === selectedBrandGuide)?.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {brandGuides.find(bg => bg.id === selectedBrandGuide)?.description}
              </p>
            )}
          </motion.div>

          {/* Settings / Deck Principles (Admin Section) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.24 }}
            className="mb-8 space-y-6"
          >
            {/* Global Deck Principles */}
            <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <Settings className="w-4 h-4" />
                  <span className="font-mono text-[11px] uppercase tracking-widest">
                    Deck Generation Settings
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isSettingsOpen && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="bg-card border border-border rounded-sm p-6 space-y-4">
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4">
                    Global Principles (Apply to all templates)
                  </p>
                  {Object.entries(DECK_PRINCIPLES).map(([key, principle]) => (
                    <div key={key} className="border-l-2 border-primary/30 pl-4 py-2">
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {principle.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        {principle.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 font-mono">
                        {principle.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Brand Guide Templates Viewer */}
            <BrandGuideEditor 
              brandGuides={brandGuides} 
              isLoading={isLoadingBrandGuides} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              {outputFormat === 'presentation' ? 'Slide Content' : 'Report Content'}
            </label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-sm p-8 mb-4 cursor-pointer transition-all duration-300",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.html,.htm,text/plain,text/markdown,text/html"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary/20" : "bg-muted",
                  isProcessingFile && "animate-pulse"
                )}>
                  {isProcessingFile ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <UploadIcon className={cn(
                      "w-6 h-6 transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    {isProcessingFile ? "Processing file..." : "Drop your file here, or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports .txt, .md, and .html files
                  </p>
                </div>
              </div>
            </div>

            {/* Or divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Or paste content
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Textarea */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Markdown or plain text content here...

# Executive Summary
Your strategic analysis content...

## Key Findings
- Finding 1
- Finding 2

## Recommendations
..."
              className="min-h-[300px] bg-card border-border focus:border-primary resize-none font-mono text-sm"
            />
            
            {content && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{content.length.toLocaleString()} characters</span>
              </div>
            )}
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleGenerate}
              disabled={!content.trim() || isGenerating}
              size="lg"
              className={cn(
                "relative px-12 py-6 bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
                "font-mono text-[11px] font-bold tracking-[0.3em] uppercase",
                "transition-all duration-500 group",
                isGenerating && "bg-primary text-primary-foreground"
              )}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-3 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Presentation
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>


          {/* Saved Presentations */}
          {savedPresentations && savedPresentations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="mt-16 pt-12 border-t border-border"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-[1px] bg-primary" />
                <h2 className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                  Saved Presentations
                </h2>
              </div>
              
              <div className="space-y-3">
                {savedPresentations.map((presentation) => (
                  <div
                    key={presentation.id}
                    onClick={() => editingId !== presentation.id && handleOpenSaved(presentation)}
                    className={cn(
                      "group relative flex items-center justify-between p-4 bg-card border border-border rounded-sm transition-all duration-300",
                      editingId !== presentation.id && "hover:border-primary/50 cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                        <PresentationIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingId === presentation.id ? (
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(e as any);
                              if (e.key === 'Escape') handleCancelEdit(e as any);
                            }}
                            className="h-8 text-sm font-medium"
                            autoFocus
                          />
                        ) : (
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {presentation.title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                      {editingId === presentation.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSaveEdit}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* Only show download button if presentation has generated slides */}
                          {presentation.generated_slides && Array.isArray(presentation.generated_slides) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async (e) => {
                                e.stopPropagation();
                                toast.loading("Generating PowerPoint...");
                                try {
                                  await exportToPptx(presentation.generated_slides as any[], presentation.title);
                                  toast.dismiss();
                                  toast.success("PowerPoint downloaded!");
                                } catch (err) {
                                  toast.dismiss();
                                  toast.error("Failed to generate PowerPoint");
                                  console.error(err);
                                }
                              }}
                              title="Download as PowerPoint"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              const guestUrl = `${window.location.origin}/presentation?id=${presentation.id}`;
                              navigator.clipboard.writeText(guestUrl);
                              toast.success("Guest link copied!");
                            }}
                            title="Copy guest link (view only)"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                          >
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleStartEdit(e, presentation)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(e, presentation.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {isLoadingPresentations && (
            <div className="mt-16 pt-12 border-t border-border flex justify-center">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
          <RubiklabLogo size="small" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Rubiklab Intelligence Capital © 2026
          </span>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
