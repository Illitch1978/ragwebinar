import { Link } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import AppHeader from "@/components/AppHeader";

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
    title: "Atrium Home Services: CX & Intent Study",
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
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F9F8F4] text-[#1C1C1C] font-sans overflow-hidden selection:bg-[#E1F5FE] selection:text-[#0D9BDD]">
      {/* App Header */}
      <AppHeader />

      {/* Main Content */}
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
                  Illitch.
                </h1>
                <div className="h-1 w-20 bg-[#0D9BDD] mt-6" />
              </div>

              {/* Create Project Button */}
              <Link
                to="/deck"
                className="bg-[#1C1C1C] text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] shadow-md transition-colors duration-200 hover:bg-[#0D9BDD]"
              >
                Create Project
              </Link>
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
    </div>
  );
};

export default Projects;
