import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Presentation as PresentationIcon, Loader2, Clock, Trash2, Pencil, Check, X, Link2, Download, Lock, FileOutput, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePresentations, useCreatePresentation, useDeletePresentation, useUpdatePresentation, useTogglePresentationLock, Presentation } from "@/hooks/usePresentations";
import { useBrandGuides } from "@/hooks/useBrandGuides";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import SettingsSidebar from "@/components/SettingsSidebar";
import AppHeader from "@/components/AppHeader";
import { exportToPptx } from "@/lib/pptxExport";
import { exportToDocx } from "@/lib/docxExport";
import { exportProposalToPdf } from "@/lib/pdfProposalExport";
import ProjectDetailsStep, { OutputFormat, OUTPUT_FORMAT_OPTIONS } from "@/components/creation/ProjectDetailsStep";
import FormatOptionsStep, { DeckLength, ArticlePersona, WordCountRange } from "@/components/creation/FormatOptionsStep";

const UploadPage = () => {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('proposal');
  
  // Step 2: Format Options
  const [selectedBrandGuide, setSelectedBrandGuide] = useState<string>("");
  const [deckLength, setDeckLength] = useState<DeckLength>('medium');
  const [articlePersona, setArticlePersona] = useState<ArticlePersona>('strategist');
  const [wordCountRange, setWordCountRange] = useState<WordCountRange>('600');
  const [additionalContent, setAdditionalContent] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  
  const { data: savedPresentations, isLoading: isLoadingPresentations } = usePresentations();
  const { data: brandGuides, isLoading: isLoadingBrandGuides } = useBrandGuides();
  const createPresentation = useCreatePresentation();
  const deletePresentation = useDeletePresentation();
  const updatePresentation = useUpdatePresentation();
  const toggleLock = useTogglePresentationLock();
  
  // Set default brand guide when data loads
  useEffect(() => {
    if (brandGuides && !selectedBrandGuide) {
      const defaultGuide = brandGuides.find(bg => bg.is_default);
      if (defaultGuide) {
        setSelectedBrandGuide(defaultGuide.id);
      }
    }
  }, [brandGuides, selectedBrandGuide]);
  
  // Edit state for presentation titles
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<Presentation | null>(null);
  
  // Search state for saved projects
  const [projectSearch, setProjectSearch] = useState("");
  
  // Filter presentations based on search
  const filteredPresentations = savedPresentations?.filter(p => 
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.client_name && p.client_name.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const handleGenerate = async () => {
    const fullContent = additionalContent 
      ? `${description}\n\n---\n\n${additionalContent}` 
      : description;
    
    if (!fullContent.trim()) {
      toast.error("Please add project content");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const selectedGuide = brandGuides?.find(bg => bg.id === selectedBrandGuide);
      const formatConfig = OUTPUT_FORMAT_OPTIONS.find(f => f.key === outputFormat);
      
      const title = projectName || `Project ${new Date().toLocaleDateString()}`;
      const saved = await createPresentation.mutateAsync({
        title,
        content: fullContent,
        client_name: projectName || undefined,
        brand_guide_id: selectedBrandGuide || undefined,
        created_by: undefined,
      });
      
      // For non-slide formats, handle document export directly
      if (!formatConfig?.isSlideFormat) {
        if (outputFormat === 'article' || outputFormat === 'executive-summary') {
          toast.info("Generating Word document...");
          await exportToDocx({
            title,
            clientName: projectName || undefined,
            content: fullContent,
            format: outputFormat,
            createdBy: undefined,
          });
          toast.success("Word document downloaded!");
          setIsGenerating(false);
          // Reset form
          setCurrentStep(1);
          setProjectName("");
          setDescription("");
          setAdditionalContent("");
          return;
        }
      }
      
      // For proposal format, also generate PDF
      if (outputFormat === 'proposal') {
        // Get T&C from brand guide if available
        const termsAndConditions = selectedGuide?.terms_and_conditions as string | undefined;
        
        // Generate both slides and PDF
        toast.info("Generating proposal...");
        
        // Generate slides first
        const { data: generateData, error: generateError } = await supabase.functions.invoke(
          'generate-presentation',
          {
            body: {
              content: fullContent,
              clientName: projectName || 'Proposal',
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
          toast.error("Failed to generate slides.");
        } else if (generateData?.slides) {
          await supabase
            .from('presentations')
            .update({ generated_slides: generateData.slides })
            .eq('id', saved.id);
          
          toast.success(`Generated ${generateData.slides.length} slides!`);
          
          // Also export PDF
          await exportProposalToPdf({
            title,
            clientName: projectName || undefined,
            content: fullContent,
            createdBy: undefined,
            termsAndConditions,
          });
          toast.success("Proposal PDF downloaded!");
        }
        
        sessionStorage.setItem('rubiklab-content', fullContent);
        sessionStorage.setItem('rubiklab-client', projectName || 'Client');
        sessionStorage.setItem('rubiklab-format', outputFormat);
        sessionStorage.setItem('rubiklab-length', deckLength);
        sessionStorage.setItem('rubiklab-presentation-id', saved.id);
        sessionStorage.setItem('rubiklab-brand-guide-id', selectedBrandGuide);
        if (generateData?.slides) {
          sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(generateData.slides));
        }
        
        setTimeout(() => {
          navigate('/presentation');
        }, 500);
        return;
      }
      
      // Standard slide generation
      toast.info("Generating presentation with AI...");
      
      const { data: generateData, error: generateError } = await supabase.functions.invoke(
        'generate-presentation',
        {
          body: {
            content: fullContent,
            clientName: projectName || 'Presentation',
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
        await supabase
          .from('presentations')
          .update({ generated_slides: generateData.slides })
          .eq('id', saved.id);
        
        toast.success(`Generated ${generateData.slides.length} slides!`);
      }
      
      sessionStorage.setItem('rubiklab-content', fullContent);
      sessionStorage.setItem('rubiklab-client', projectName || 'Client');
      sessionStorage.setItem('rubiklab-format', outputFormat);
      sessionStorage.setItem('rubiklab-length', deckLength);
      sessionStorage.setItem('rubiklab-presentation-id', saved.id);
      sessionStorage.setItem('rubiklab-brand-guide-id', selectedBrandGuide);
      if (generateData?.slides) {
        sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(generateData.slides));
      }
      
      setTimeout(() => {
        navigate('/presentation');
      }, 500);
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error("Error generating presentation");
      setIsGenerating(false);
    }
  };

  const handleOpenSaved = (presentation: Presentation) => {
    const hasGeneratedSlides = presentation.generated_slides && 
      Array.isArray(presentation.generated_slides) && 
      presentation.generated_slides.length > 0;
    
    sessionStorage.setItem('rubiklab-content', presentation.content);
    sessionStorage.setItem('rubiklab-client', presentation.client_name || 'Client');
    sessionStorage.setItem('rubiklab-format', outputFormat);
    sessionStorage.setItem('rubiklab-presentation-id', presentation.id);
    sessionStorage.setItem('rubiklab-brand-guide-id', presentation.brand_guide_id || selectedBrandGuide);
    
    if (hasGeneratedSlides) {
      sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(presentation.generated_slides));
      navigate('/presentation');
    } else {
      navigate('/report');
    }
  };

  const handleDelete = (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    if (presentation.is_locked) {
      toast.error("Cannot delete a locked presentation");
      return;
    }
    setPresentationToDelete(presentation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!presentationToDelete) return;
    try {
      await deletePresentation.mutateAsync(presentationToDelete.id);
      toast.success("Presentation deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete presentation");
    } finally {
      setPresentationToDelete(null);
    }
  };

  const handleToggleLock = async (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    try {
      await toggleLock.mutateAsync({ 
        id: presentation.id, 
        is_locked: !presentation.is_locked 
      });
      toast.success(presentation.is_locked ? "Presentation unlocked" : "Presentation locked");
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle lock");
    }
  };

  const handleStartEdit = (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    if (presentation.is_locked) {
      toast.error("Cannot edit a locked presentation");
      return;
    }
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

  const handleExportWord = async (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    try {
      toast.info("Generating Word document...");
      await exportToDocx({
        title: presentation.title,
        clientName: presentation.client_name || undefined,
        content: presentation.content,
        format: 'article',
        createdBy: presentation.created_by || undefined,
      });
      toast.success("Word document downloaded!");
    } catch (error) {
      console.error('Word export error:', error);
      toast.error("Failed to export Word document");
    }
  };

  const handleExportPdf = async (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    try {
      toast.info("Generating PDF...");
      const selectedGuide = brandGuides?.find(bg => bg.id === presentation.brand_guide_id);
      await exportProposalToPdf({
        title: presentation.title,
        clientName: presentation.client_name || undefined,
        content: presentation.content,
        createdBy: presentation.created_by || undefined,
        termsAndConditions: selectedGuide?.terms_and_conditions as string | undefined,
      });
      toast.success("PDF downloaded!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#1C1C1C] font-sans flex flex-col selection:bg-[#E1F5FE] selection:text-[#0D9BDD]">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-16 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-12 lg:mb-16"
          >
            <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1C1C] mb-6 tracking-tight">
              Content to Premium Decks
            </h1>
            <p className="font-serif text-xl lg:text-2xl text-[#003366] font-medium italic max-w-2xl mx-auto leading-relaxed">
              Transform raw content into polished presentations, proposals, and executive documents.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 border transition-colors",
              currentStep === 1 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border text-muted-foreground"
            )}>
              <span className="w-6 h-6 bg-current/20 flex items-center justify-center text-xs font-bold">1</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">Project Details</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 border transition-colors",
              currentStep === 2 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border text-muted-foreground"
            )}>
              <span className="w-6 h-6 bg-current/20 flex items-center justify-center text-xs font-bold">2</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">Options & Generate</span>
            </div>
          </motion.div>

          {/* Wizard Steps */}
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectDetailsStep
                  projectName={projectName}
                  setProjectName={setProjectName}
                  description={description}
                  setDescription={setDescription}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat}
                  onNext={() => setCurrentStep(2)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FormatOptionsStep
                  outputFormat={outputFormat}
                  brandGuides={brandGuides}
                  isLoadingBrandGuides={isLoadingBrandGuides}
                  selectedBrandGuide={selectedBrandGuide}
                  setSelectedBrandGuide={setSelectedBrandGuide}
                  deckLength={deckLength}
                  setDeckLength={setDeckLength}
                  articlePersona={articlePersona}
                  setArticlePersona={setArticlePersona}
                  wordCountRange={wordCountRange}
                  setWordCountRange={setWordCountRange}
                  content={additionalContent}
                  setContent={setAdditionalContent}
                  onBack={() => setCurrentStep(1)}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </motion.div>
            )}
          </AnimatePresence>


          {/* Saved Presentations with Search */}
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
                  Recent Projects
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({savedPresentations.length})
                </span>
              </div>
              
              {/* Combined Search & Results Container */}
              <div className="bg-card border border-border">
                {/* Search Input */}
                <div className="relative border-b border-border">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-12 pr-6 py-3 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  {projectSearch && (
                    <button
                      onClick={() => setProjectSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Results List */}
                <div className="max-h-[240px] overflow-y-auto">
                  {filteredPresentations?.length === 0 ? (
                    <div className="px-6 py-4 text-sm text-muted-foreground">
                      No projects match "{projectSearch}"
                    </div>
                  ) : (
                    filteredPresentations?.map((presentation) => (
                      <button
                        key={presentation.id}
                        onClick={() => handleOpenSaved(presentation)}
                        className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {presentation.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true })}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </button>
                    ))
                  )}
                </div>
              </div>
              
              {projectSearch && filteredPresentations && filteredPresentations.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  {filteredPresentations.length} of {savedPresentations.length} projects match "{projectSearch}"
                </p>
              )}
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
          <div className="flex items-baseline gap-0.5 select-none">
            <span className="font-serif font-bold text-xl tracking-tight text-muted-foreground leading-none">rubiklab</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.6)] transform -translate-y-0.5" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Rubiklab Intelligence Capital © 2026
          </span>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        presentationTitle={presentationToDelete?.title || ""}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UploadPage;
