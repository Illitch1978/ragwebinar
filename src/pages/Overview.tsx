import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ArrowLeft, Plus, FileText, Settings } from "lucide-react";

const Overview = () => {
  const location = useLocation();
  
  const navTabs = [
    { label: "Overview", path: "/overview" },
    { label: "Analysis Deck", path: "/upload" },
    { label: "Talk to Data", path: "#" },
    { label: "Team's Room", path: "#" },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F9F8F4] text-[#1C1C1C] font-sans overflow-hidden selection:bg-[#E1F5FE] selection:text-[#0D9BDD]">
      
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col z-30">
        
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-neutral-100 justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
            <div className="flex items-baseline gap-1 select-none">
              <span className="font-serif font-bold text-2xl tracking-tight text-black leading-none lowercase">lab</span>
              <div className="w-2 h-2 rounded-full bg-[#0D9BDD] shadow-[0_0_8px_rgba(13,155,221,0.6)] transform -translate-y-1" />
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-50 rounded-md text-neutral-400 transition-colors">
            <ChevronRight size={16} className="transform rotate-180" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Active Project */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Project
            </div>
            <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 space-y-3">
              <div className="font-bold text-sm leading-snug">Atrium Home Services: CX & Intent</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-white border border-neutral-200 text-neutral-600 px-2 py-0.5 font-bold uppercase tracking-wide">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Source Material */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Source Material</div>
              <button className="text-neutral-400 hover:text-[#0D9BDD] transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {["Source_Document_v1.pdf", "Source_Document_v2.pdf", "Source_Document_v3.pdf"].map((file, i) => (
                <div key={i} className="group flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors border border-transparent hover:border-neutral-100">
                  <div className="text-neutral-300 group-hover:text-[#0D9BDD] transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="text-xs font-medium text-neutral-700 group-hover:text-neutral-900 truncate">
                    {file}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* App Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          
          {/* Breadcrumb / Back */}
          <div className="flex items-center gap-4 text-sm">
            <button className="text-neutral-400 hover:text-[#1C1C1C] transition-colors flex items-center gap-2 font-medium group">
              <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                <ArrowLeft size={14} />
              </div>
              <span className="uppercase tracking-wide text-xs font-bold">Projects</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-0">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.label}
                  to={tab.path}
                  className={`px-8 py-3 text-xs uppercase tracking-[0.15em] font-bold transition-all ${
                    isActive 
                      ? "bg-[#0D9BDD] text-white" 
                      : "bg-transparent text-[#64748B] hover:bg-[rgba(13,155,221,0.05)] hover:text-[#0D9BDD]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {["U1", "U2", "U3"].map((user, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-neutral-600 shadow-sm relative z-0">
                  {user}
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-neutral-200" />
            <button className="p-2 rounded-none transition-colors text-neutral-400 hover:text-[#1C1C1C] hover:bg-neutral-50">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Page Content (Overview) */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="overview-wrapper">
            <div className="overview-container">
              
              {/* Section 1: Editorial Header */}
              <header className="header-section">
                <h1>Atrium Home Services: CX & Intent</h1>
                <p className="framing-sentence">
                  A live view of customer trust and operational risk shaping Atrium's growth across Midwest markets.
                </p>
                <div className="provenance-cue">
                  <span>Updated 12 minutes ago</span>
                  <span>•</span>
                  <span>Seven active sources</span>
                  <span>•</span>
                  <span>Lineage Preserved</span>
                </div>

                <div className="project-brief">
                  <div className="brief-row">
                    <span className="brief-label">Decision</span>
                    <input 
                      className="brief-input" 
                      type="text" 
                      defaultValue="Guide regional leadership on preserving local trust while scaling Atrium branding."
                      readOnly 
                    />
                  </div>
                  <div className="brief-row">
                    <span className="brief-label">Signals</span>
                    <input 
                      className="brief-input" 
                      type="text" 
                      defaultValue="Customer sentiment, service reliability, acquisition messaging, sustainability intent."
                      readOnly 
                    />
                  </div>
                  <div className="brief-row">
                    <span className="brief-label">Audience</span>
                    <input 
                      className="brief-input" 
                      type="text" 
                      defaultValue="Executive team and regional operations managers."
                      readOnly 
                    />
                  </div>
                </div>
              </header>

              {/* Section 2: Decision Context Tiles */}
              <section className="context-tiles">
                <div className="tile">
                  <span className="tile-label">Primary Risk</span>
                  <div className="tile-statement">Reliability perception is driving negative sentiment in urgent categories.</div>
                  <div className="tile-support">No show appointments and pricing inconsistency dominate recent complaints.</div>
                </div>
                <div className="tile">
                  <span className="tile-label">Primary Lever</span>
                  <div className="tile-statement">Local identity outperforms corporate branding in retention.</div>
                  <div className="tile-support">Endorsement language builds trust faster than replacement naming.</div>
                </div>
                <div className="tile">
                  <span className="tile-label">Business Exposure</span>
                  <div className="tile-statement">Direct impact on Midwest expansion and marketing strategy.</div>
                  <div className="tile-support">Referenced in Q1 planning and operations reviews.</div>
                </div>
              </section>

              {/* Section 3: Current Priorities */}
              <section className="priorities-section">
                <div className="section-header">Strategic Priorities</div>

                <div className="priority-item">
                  <div className="priority-title">Protect local brand trust</div>
                  <div>
                    <div className="priority-meaning">Local identity is a stronger retention driver than promotions in core Midwest markets.</div>
                    <div className="next-move">Next Move: Preserve legacy naming in priority regions and attach certification proof points.</div>
                  </div>
                </div>

                <div className="priority-item">
                  <div className="priority-title">Fix reliability perception</div>
                  <div>
                    <div className="priority-meaning">Service consistency is becoming the leading purchase signal in urgent moments.</div>
                    <div className="next-move">Next Move: Surface technician certification and scheduling guarantees inside booking flows.</div>
                  </div>
                </div>

                <div className="priority-item">
                  <div className="priority-title">Use endorsement positioning</div>
                  <div>
                    <div className="priority-meaning">"Powered by Atrium" performs better as reassurance than replacement branding.</div>
                    <div className="next-move">Next Move: Deploy endorsement messaging in Ohio and Indiana and monitor sentiment.</div>
                  </div>
                </div>
              </section>

              {/* Section 4: Action Board (Links) */}
              <section className="action-board">
                <div className="section-header">Recommended Actions</div>
                <p className="section-cue">Based on current signals</p>

                <div className="action-list">
                  <div className="action-item">
                    <span className="action-link">Generate executive summary</span>
                    <div className="action-description">
                      Prepare a C-suite briefing on trust and branding performance across Midwest markets.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Run data audit</span>
                    <div className="action-description">
                      Verify source balance to ensure operational logs aren't overpowering direct customer feedback.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Explore churn risk drivers</span>
                    <div className="action-description">
                      Isolate negative sentiment correlating with cancellations, specifically no-shows and pricing.
                    </div>
                  </div>

                  <div className="action-item">
                    <span className="action-link">Talk to data</span>
                    <div className="action-description">
                      Interrogate the intelligence layer directly to uncover nuanced patterns in reliability clusters.
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
