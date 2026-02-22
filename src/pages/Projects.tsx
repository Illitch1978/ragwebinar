import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Clock, Plus, ArrowRight, Loader2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectDetailsStep, { AnalysisTone, ProjectLanguage } from "@/components/creation/ProjectDetailsStep";
import ObjectivesStep, { OutputFormat, OUTPUT_FORMAT_OPTIONS } from "@/components/creation/ObjectivesStep";
import MetadataStep, { MetadataField } from "@/components/creation/MetadataStep";
import ThemeStep from "@/components/creation/ThemeStep";
import { usePresentations, useCreatePresentation } from "@/hooks/usePresentations";
import { useBrandGuides } from "@/hooks/useBrandGuides";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { exportToDocx } from "@/lib/docxExport";
import { exportProposalToPdf } from "@/lib/pdfProposalExport";

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  status: "Active" | "Draft" | "Completed";
  sources: number;
  lastUpdated: string;
  image: string;
  link: string;
}

const projects: ProjectCard[] = [
  {
    id: "1",
    title: "Alpha Home Services: CX & Intent Study",
    category: "Blind Study",
    status: "Active",
    sources: 7,
    lastUpdated: "12M AGO",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    link: "/overview",
  },
  {
    id: "2",
    title: "Q1 Market Trends: HVAC Midwest",
    category: "Trend Analysis",
    status: "Draft",
    sources: 3,
    lastUpdated: "5D AGO",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    link: "/overview",
  },
  {
    id: "3",
    title: "Influencers & Sustainable Consumer Behavior",
    category: "Market Research",
    status: "Completed",
    sources: 12,
    lastUpdated: "2W AGO",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
    link: "/overview",
  },
];

const ProjectCardComponent = ({ project }: { project: ProjectCard }) => {
  const statusColor = project.status === "Active" ? "text-[#0D9BDD]" : "text-neutral-500";

  return (
    <Link
      to={project.link}
      className="group bg-white border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-[#0D9BDD]/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-[420px] relative"
    >
      {/* Image Section */}
      <div className="w-full relative overflow-hidden h-[240px] flex-shrink-0">
        <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/0 transition-all duration-500 z-10" />
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 z-20">
          <div className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-white/90 backdrop-blur-md shadow-sm border border-neutral-200 ${statusColor}`}>
            {project.status}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between flex-1 bg-white relative z-20">
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2">
            {project.category}
          </div>
          <h3 className="text-xl font-bold leading-snug group-hover:text-[#0D9BDD] transition-colors line-clamp-2">
            {project.title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-4 border-t border-neutral-100 mt-4">
          <span className="flex items-center gap-2">
            <FileText size={14} strokeWidth={2} />
            {project.sources} SOURCES
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} strokeWidth={2} />
            {project.lastUpdated}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#0D9BDD] group-hover:w-full transition-all duration-500 ease-out" />
    </Link>
  );
};

const Projects = () => {
  const navigate = useNavigate();

  // Wizard dialog
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState<ProjectLanguage>('en-us');
  const [analysisTone, setAnalysisTone] = useState<AnalysisTone>('balanced');

  // Step 2
  const [description, setDescription] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('proposal');

  // Step 3
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  // Step 4
  const [themes, setThemes] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const { data: brandGuides } = useBrandGuides();
  const createPresentation = useCreatePresentation();

  const [selectedBrandGuide, setSelectedBrandGuide] = useState<string>("");

  useEffect(() => {
    if (brandGuides && !selectedBrandGuide) {
      const defaultGuide = brandGuides.find(bg => bg.is_default);
      if (defaultGuide) setSelectedBrandGuide(defaultGuide.id);
    }
  }, [brandGuides, selectedBrandGuide]);

  const resetWizard = () => {
    setCurrentStep(1);
    setProjectName("");
    setDescription("");
    setOutputFormat('proposal');
    setLanguage('en-us');
    setAnalysisTone('balanced');
    setMetadataFields([]);
    setThemes([]);
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("Please add project objectives");
      return;
    }

    setIsGenerating(true);

    try {
      const selectedGuide = brandGuides?.find(bg => bg.id === selectedBrandGuide);
      const formatConfig = OUTPUT_FORMAT_OPTIONS.find(f => f.key === outputFormat);
      const title = projectName || `Project ${new Date().toLocaleDateString()}`;

      const saved = await createPresentation.mutateAsync({
        title,
        content: description,
        client_name: projectName || undefined,
        brand_guide_id: selectedBrandGuide || undefined,
        created_by: undefined,
      });

      // Non-slide formats: Word export
      if (!formatConfig?.isSlideFormat) {
        toast.info("Generating Word document...");
        await exportToDocx({
          title,
          clientName: projectName || undefined,
          content: description,
          format: outputFormat as 'article' | 'executive-summary',
          createdBy: undefined,
        });
        toast.success("Word document downloaded!");
        setIsGenerating(false);
        setWizardOpen(false);
        resetWizard();
        return;
      }

      // Slide formats: route to the Smart Deck Planner
      sessionStorage.setItem('rubiklab-objectives', description);
      sessionStorage.setItem('rubiklab-client', projectName || 'Client');
      sessionStorage.setItem('rubiklab-brand-guide-id', selectedBrandGuide || '');
      sessionStorage.setItem('rubiklab-format', outputFormat);
      setWizardOpen(false);
      resetWizard();
      navigate('/deck');
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error("Error saving project");
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F9F8F4] text-[#1C1C1C] font-sans overflow-hidden selection:bg-[#E1F5FE] selection:text-[#0D9BDD] pt-4">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div
          className="min-h-full p-8 md:p-12"
          style={{
            backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex items-end justify-between mb-20">
              <div>
                <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-[#1C1C1C] leading-tight">
                  Welcome back,<br />
                  Nadia.
                </h1>
                <div className="h-1 w-20 bg-[#0D9BDD] mt-6" />
              </div>

              <button
                onClick={() => { resetWizard(); setWizardOpen(true); }}
                className="bg-[#1C1C1C] text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-colors duration-200 hover:bg-[#0D9BDD]"
              >
                Create Project
              </button>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCardComponent key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Wizard Dialog */}
      <Dialog open={wizardOpen} onOpenChange={(open) => { if (!isGenerating) setWizardOpen(open); }}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col bg-background border-border p-0">
            <DialogHeader className="px-8 pt-6 pb-4 border-b border-border bg-background z-10 shrink-0">
              <DialogTitle className="font-serif text-2xl font-bold text-foreground text-center mb-4">
                {projectName.trim() ? projectName : 'Create a new project'}
              </DialogTitle>
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-3">
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
            </div>
          </DialogHeader>

          <div className="px-8 py-6 flex-1 overflow-y-auto">
            {currentStep === 1 && (
              <ProjectDetailsStep
                projectName={projectName}
                setProjectName={setProjectName}
                language={language}
                setLanguage={setLanguage}
                analysisTone={analysisTone}
                setAnalysisTone={setAnalysisTone}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <ObjectivesStep
                description={description}
                setDescription={setDescription}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && (
              <MetadataStep
                metadataFields={metadataFields}
                setMetadataFields={setMetadataFields}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 4 && (
              <ThemeStep
                themes={themes}
                setThemes={setThemes}
                description={description}
                onBack={() => setCurrentStep(3)}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
