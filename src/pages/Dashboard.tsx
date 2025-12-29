import { useState } from "react";
import PositioningSection from "@/components/dashboard/PositioningSection";
import VisibilitySection from "@/components/dashboard/VisibilitySection";
import {
  Brain,
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
    icon: Brain, 
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

const bottomNavItems = [
  { title: "Settings", icon: Settings2, id: "settings" },
];

const Dashboard = () => {
  const [activeProduct, setActiveProduct] = useState("intelligence");
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
          {!sidebarCollapsed && (
            <div className="logo">
              mondro<span className="dot"></span>
            </div>
          )}
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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="font-medium block">{item.title}</span>
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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
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
      <main className="flex-1 p-6 overflow-auto">
        {activeProduct === "intelligence" && <PositioningSection />}
        {activeProduct === "strategy-room" && (
          <div className="text-muted-foreground">Strategy Room coming soon...</div>
        )}
        {activeProduct === "report" && (
          <div className="text-muted-foreground">Report view coming soon...</div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
