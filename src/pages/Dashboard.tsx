import { useState } from "react";
import PositioningSection from "@/components/dashboard/PositioningSection";
import VisibilitySection from "@/components/dashboard/VisibilitySection";
import {
  Gem,
  MessageSquare,
  FileText,
  Menu,
  Settings2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const productNavItems = [
  { 
    title: "Intelligence", 
    icon: Gem, 
    id: "intelligence",
    description: "Positioning, Visibility, Technical, Friction, Trust, Competitor Intel"
  },
  { 
    title: "Strategy Room", 
    icon: MessageSquare, 
    id: "strategy-room",
    description: "AI-powered virtual boardroom with expert personas"
  },
  { 
    title: "Report", 
    icon: FileText, 
    id: "report",
    description: "Snapshot view of your digital presence"
  },
];

const intelligenceSubTabs = [
  { title: "Positioning", id: "positioning" },
  { title: "Visibility", id: "visibility" },
  { title: "Technical", id: "technical" },
  { title: "Friction", id: "friction" },
  { title: "Trust", id: "trust" },
  { title: "Competitor Intel", id: "competitor-intel" },
];

const bottomNavItems = [
  { title: "Settings", icon: Settings2, id: "settings" },
];

// Logo component matching landing page
const EvolvedLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
  <div className="flex items-center gap-1.5 group cursor-pointer">
    <span className={`font-serif font-bold tracking-tight text-foreground transition-colors duration-700 group-hover:text-primary ${size === 'small' ? 'text-2xl' : 'text-3xl'}`}>mondro</span>
    <div className="relative flex items-center justify-center">
      <div className={`absolute bg-primary rounded-full animate-ping opacity-20 ${size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}></div>
      <div className={`bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)] ${size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}></div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeProduct, setActiveProduct] = useState("intelligence");
  const [activeIntelligenceTab, setActiveIntelligenceTab] = useState("positioning");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex dashboard-light">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-card border-r border-border flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && <EvolvedLogo size="small" />}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-muted/20 rounded-md transition-colors"
          >
            <Menu className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Product Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {productNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveProduct(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left group",
                activeProduct === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                sidebarCollapsed && "justify-center"
              )}
            >
              {sidebarCollapsed ? (
                <item.icon className="h-5 w-5 flex-shrink-0" />
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase block">{item.title}</span>
                    <span className="text-xs text-muted-foreground/70 block mt-0.5 leading-tight">
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground/50 transition-transform",
                    activeProduct === item.id && "rotate-90"
                  )} />
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <nav className="p-3 border-t border-border space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveProduct(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                activeProduct === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                sidebarCollapsed && "justify-center"
              )}
            >
              {sidebarCollapsed ? (
                <item.icon className="h-5 w-5 flex-shrink-0" />
              ) : (
                <span className="font-medium">{item.title}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Badge */}
        <div className="p-3 border-t border-border">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg",
            sidebarCollapsed ? "justify-center" : ""
          )}>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-muted-foreground">JS</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">John Smith</span>
                <span className="text-xs text-muted-foreground">Senior Partner</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Intelligence Header with Sub-tabs */}
        {activeProduct === "intelligence" && (
          <div className="border-b border-border/50 px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Sub-tabs - matching landing page nav style */}
              <div className="flex items-center gap-8 lg:gap-12">
                {intelligenceSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveIntelligenceTab(tab.id)}
                    className={cn(
                      "relative font-mono text-[11px] lg:text-[13px] font-bold tracking-[0.3em] uppercase transition-colors group",
                      activeIntelligenceTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {tab.title}
                    <span className={cn(
                      "absolute bottom-[-4px] left-0 h-px bg-primary transition-all duration-400",
                      activeIntelligenceTab === tab.id ? "w-full" : "w-0 group-hover:w-full"
                    )}></span>
                  </button>
                ))}
              </div>
              
              {/* Client Info */}
              <a 
                href="https://meridianwest.co.uk/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg font-semibold text-foreground font-serif hover:text-primary transition-colors"
              >
                Meridian West
              </a>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {activeProduct === "intelligence" && (
            <>
              {activeIntelligenceTab === "positioning" && <PositioningSection />}
              {activeIntelligenceTab === "visibility" && <VisibilitySection />}
              {activeIntelligenceTab === "technical" && (
                <div className="text-muted-foreground">Technical analysis coming soon...</div>
              )}
              {activeIntelligenceTab === "friction" && (
                <div className="text-muted-foreground">Friction analysis coming soon...</div>
              )}
              {activeIntelligenceTab === "trust" && (
                <div className="text-muted-foreground">Trust analysis coming soon...</div>
              )}
              {activeIntelligenceTab === "competitor-intel" && (
                <div className="text-muted-foreground">Competitor Intel coming soon...</div>
              )}
            </>
          )}
          {activeProduct === "strategy-room" && (
            <div className="text-muted-foreground">Strategy Room coming soon...</div>
          )}
          {activeProduct === "report" && (
            <div className="text-muted-foreground">Report view coming soon...</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
