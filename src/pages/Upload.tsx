import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Pencil, Check, X, Link2, Download, Lock, Search, LockOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePresentations, useDeletePresentation, useUpdatePresentation, useTogglePresentationLock, Presentation } from "@/hooks/usePresentations";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import AppHeader from "@/components/AppHeader";
import { exportToDocx } from "@/lib/docxExport";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UploadPage = () => {
  const navigate = useNavigate();
  
  const { data: savedPresentations, isLoading: isLoadingPresentations } = usePresentations();
  const deletePresentation = useDeletePresentation();
  const updatePresentation = useUpdatePresentation();
  const toggleLock = useTogglePresentationLock();
  
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

  const handleOpenSaved = (presentation: Presentation) => {
    const hasGeneratedSlides = presentation.generated_slides && 
      Array.isArray(presentation.generated_slides) && 
      presentation.generated_slides.length > 0;
    
    sessionStorage.setItem('rubiklab-content', presentation.content);
    sessionStorage.setItem('rubiklab-client', presentation.client_name || 'Client');
    sessionStorage.setItem('rubiklab-presentation-id', presentation.id);
    sessionStorage.setItem('rubiklab-brand-guide-id', presentation.brand_guide_id || '');
    
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
            <h1 className="font-serif text-[3rem] font-bold text-foreground mb-5 tracking-tight leading-tight">
              Deck Builder
            </h1>
            <p className="font-serif text-[1.4rem] text-primary font-medium italic max-w-2xl mx-auto leading-relaxed">
              Manage your presentations, proposals, and executive documents.
            </p>
          </div>

          {/* Saved Presentations with Search */}
          {savedPresentations && savedPresentations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
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
                <div className="max-h-[400px] overflow-y-auto">
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
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
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
            <div className="flex justify-center">
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
