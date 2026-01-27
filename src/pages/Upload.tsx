import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Presentation as PresentationIcon, Loader2, Clock, Trash2, Pencil, Check, X, Link2, Download, Lock, FileOutput } from "lucide-react";
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
import { exportToPptx } from "@/lib/pptxExport";
import { exportToDocx } from "@/lib/docxExport";
import { exportProposalToPdf } from "@/lib/pdfProposalExport";
import ProjectDetailsStep, { OutputFormat, OUTPUT_FORMAT_OPTIONS } from "@/components/creation/ProjectDetailsStep";
import FormatOptionsStep, { DeckLength } from "@/components/creation/FormatOptionsStep";

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

const UploadPage = () => {
  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Project Details
  const [projectName, setProjectName] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('proposal');
  
  // Step 2: Format Options
  const [selectedBrandGuide, setSelectedBrandGuide] = useState<string>("");
  const [deckLength, setDeckLength] = useState<DeckLength>('medium');
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
        created_by: owner || undefined,
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
            createdBy: owner || undefined,
          });
          toast.success("Word document downloaded!");
          setIsGenerating(false);
          // Reset form
          setCurrentStep(1);
          setProjectName("");
          setOwner("");
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
            createdBy: owner || undefined,
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
          <SettingsSidebar />
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
              Content to<br />
              <span className="italic text-primary">Premium Decks</span>
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto font-light">
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
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
              currentStep === 1 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border text-muted-foreground"
            )}>
              <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">1</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">Project Details</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-colors",
              currentStep === 2 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border text-muted-foreground"
            )}>
              <span className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">2</span>
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
                  owner={owner}
                  setOwner={setOwner}
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
                  content={additionalContent}
                  setContent={setAdditionalContent}
                  onBack={() => setCurrentStep(1)}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </motion.div>
            )}
          </AnimatePresence>


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
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {presentation.created_by && (
                            <>
                              <span className="font-medium">{presentation.created_by}</span>
                              <span className="text-muted-foreground/50">•</span>
                            </>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true })}</span>
                          </div>
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
                          {/* Download PPTX button */}
                          {presentation.generated_slides && Array.isArray(presentation.generated_slides) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/presentation?id=${presentation.id}&export=true`);
                              }}
                              title="Download as PowerPoint"
                              className="text-muted-foreground transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {/* Word export button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleExportWord(e, presentation)}
                            title="Download as Word document"
                            className="text-muted-foreground transition-colors"
                          >
                            <FileOutput className="w-4 h-4" />
                          </Button>
                          {/* PDF export button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleExportPdf(e, presentation)}
                            title="Download as PDF proposal"
                            className="text-muted-foreground transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
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
                            className="text-muted-foreground transition-colors"
                          >
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleToggleLock(e, presentation)}
                            title={presentation.is_locked ? "Unlock presentation" : "Lock presentation"}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Lock className={cn(
                              "w-4 h-4 transition-colors",
                              presentation.is_locked ? "text-primary" : "text-muted-foreground"
                            )} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleStartEdit(e, presentation)}
                            disabled={presentation.is_locked}
                            className={cn(
                              "text-muted-foreground transition-colors",
                              presentation.is_locked && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDelete(e, presentation)}
                            disabled={presentation.is_locked}
                            className={cn(
                              "text-muted-foreground hover:text-destructive transition-colors",
                              presentation.is_locked && "opacity-50 cursor-not-allowed hover:text-muted-foreground"
                            )}
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
