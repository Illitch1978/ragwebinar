import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Presentation as PresentationIcon, Loader2, Clock, Trash2, Pencil, Check, X, Link2, Download, Lock, FileOutput, ChevronDown, Search, LockOpen } from "lucide-react";
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
import ProjectDetailsStep, { AnalysisTone, ProjectLanguage } from "@/components/creation/ProjectDetailsStep";
import ObjectivesStep, { OutputFormat, OUTPUT_FORMAT_OPTIONS } from "@/components/creation/ObjectivesStep";
import MetadataStep, { MetadataField } from "@/components/creation/MetadataStep";
import ThemeStep from "@/components/creation/ThemeStep";
import FormatOptionsStep, { DeckLength, ArticlePersona, WordCountRange } from "@/components/creation/FormatOptionsStep";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UploadPage = () => {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Project Details
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState<ProjectLanguage>('en-us');
  const [analysisTone, setAnalysisTone] = useState<AnalysisTone>('balanced');
  
  // Step 2: Objectives & Output Format
  const [description, setDescription] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('proposal');
  
  // Step 3: Metadata
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);
  
  // Step 4: Themes
  const [themes, setThemes] = useState<string[]>([]);
  
  // Format Options (used during generation)
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

  const handleExportPdf = (e: React.MouseEvent, presentation: Presentation) => {
    e.stopPropagation();
    // Use the working PPTX screenshot-based export
    sessionStorage.setItem('rubiklab-presentation-id', presentation.id);
    sessionStorage.setItem('rubiklab-client', presentation.client_name || 'Client');
    if (presentation.generated_slides) {
      sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(presentation.generated_slides));
    }
    navigate(`/presentation?id=${presentation.id}&export=true`);
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
      <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-16 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-[3rem] font-bold text-[#1C1C1C] mb-5 tracking-tight leading-tight">
              Content to Premium Decks
            </h1>
            <p className="font-serif text-[1.4rem] text-[#003366] font-medium italic max-w-2xl mx-auto leading-relaxed">
              Transform raw content into polished presentations, proposals, and executive documents.
            </p>
          </div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            {[
              { num: 1, label: 'Project Details' },
              { num: 2, label: 'Objectives' },
              { num: 3, label: 'Metadata' },
              { num: 4, label: 'Themes' },
            ].map((step, i) => (
              <div key={step.num} className="flex items-center gap-3">
                {i > 0 && <div className="w-6 h-px bg-border" />}
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 border transition-colors",
                  currentStep === step.num
                    ? "border-primary bg-primary/10 text-primary"
                    : currentStep > step.num
                    ? "border-primary/40 bg-primary/5 text-primary/70"
                    : "border-border text-muted-foreground"
                )}>
                  <span className={cn(
                    "w-5 h-5 flex items-center justify-center text-[10px] font-bold",
                    currentStep > step.num ? "bg-primary text-primary-foreground" : "bg-current/20"
                  )}>
                    {currentStep > step.num ? '✓' : step.num}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest hidden sm:inline">{step.label}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Wizard Steps */}
          {currentStep === 1 && (
            <div>
              <ProjectDetailsStep
                projectName={projectName}
                setProjectName={setProjectName}
                language={language}
                setLanguage={setLanguage}
                analysisTone={analysisTone}
                setAnalysisTone={setAnalysisTone}
                onNext={() => setCurrentStep(2)}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <ObjectivesStep
                description={description}
                setDescription={setDescription}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <MetadataStep
                metadataFields={metadataFields}
                setMetadataFields={setMetadataFields}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <ThemeStep
                themes={themes}
                setThemes={setThemes}
                description={description}
                onBack={() => setCurrentStep(3)}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}


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
                
                {/* Results List - shows exactly 3 items */}
                <div className="max-h-[195px] overflow-y-auto">
                  {filteredPresentations?.length === 0 ? (
                    <div className="px-6 py-4 text-sm text-muted-foreground">
                      No projects match "{projectSearch}"
                    </div>
                  ) : (
                    <TooltipProvider delayDuration={300}>
                      {filteredPresentations?.map((presentation) => (
                        <div
                          key={presentation.id}
                          onClick={() => handleOpenSaved(presentation)}
                          className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 group cursor-pointer"
                        >
                          {/* Title and metadata */}
                          <div className="flex-1 min-w-0">
                            {editingId === presentation.id ? (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className="flex-1 bg-transparent border-b border-primary text-foreground text-sm focus:outline-none"
                                  autoFocus
                                />
                                <button onClick={handleSaveEdit} className="p-1 hover:bg-muted rounded">
                                  <Check className="w-3.5 h-3.5 text-green-600" />
                                </button>
                                <button onClick={handleCancelEdit} className="p-1 hover:bg-muted rounded">
                                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                  {presentation.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true })}
                                </p>
                              </>
                            )}
                          </div>
                          
                          {/* Action icons */}
                          {editingId !== presentation.id && (
                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {/* Lock/Unlock */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => handleToggleLock(e, presentation)}
                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                  >
                                    {presentation.is_locked ? (
                                      <Lock className="w-3.5 h-3.5 text-primary" />
                                    ) : (
                                      <LockOpen className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  {presentation.is_locked ? "Unlock" : "Lock"}
                                </TooltipContent>
                              </Tooltip>
                              
                              {/* Download PPTX */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => handleExportPdf(e, presentation)}
                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Download PPTX
                                </TooltipContent>
                              </Tooltip>

                              {/* Copy Link */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(`${window.location.origin}/presentation?id=${presentation.id}`);
                                      toast.success("Link copied!");
                                    }}
                                    className="p-1.5 hover:bg-muted rounded transition-colors"
                                  >
                                    <Link2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Copy link
                                </TooltipContent>
                              </Tooltip>
                              
                              {/* Edit title */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => handleStartEdit(e, presentation)}
                                    className={cn(
                                      "p-1.5 hover:bg-muted rounded transition-colors",
                                      presentation.is_locked && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={presentation.is_locked}
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Edit name
                                </TooltipContent>
                              </Tooltip>
                              
                              {/* Delete */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => handleDelete(e, presentation)}
                                    className={cn(
                                      "p-1.5 hover:bg-muted rounded transition-colors",
                                      presentation.is_locked && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={presentation.is_locked}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  Delete
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      ))}
                    </TooltipProvider>
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
