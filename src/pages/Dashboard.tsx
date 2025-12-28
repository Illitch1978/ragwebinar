import { useState } from "react";
import PositioningSection from "@/components/dashboard/PositioningSection";
import { 
  Crosshair, 
  Bot, 
  Radar, 
  Search, 
  Wrench,
  BarChart3,
  Settings2,
  Layers,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Positioning", icon: Crosshair, id: "positioning" },
  { title: "AI consultant", icon: Bot, id: "ai-consultant" },
  { title: "Competitor intel", icon: Radar, id: "competitor-intel" },
  { title: "Visibility", icon: Search, id: "visibility" },
  { title: "Technical", icon: Wrench, id: "technical" },
];

const bottomNavItems = [
  { title: "Reports", icon: BarChart3, id: "reports" },
  { title: "Settings", icon: Settings2, id: "settings" },
  { title: "Projects", icon: Layers, id: "projects" },
];

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("positioning");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
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

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                activeItem === item.id
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

        {/* Bottom Navigation */}
        <nav className="p-3 border-t border-border space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                activeItem === item.id
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary capitalize">
              {activeItem.replace("-", " ")}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          {activeItem === "positioning" && <PositioningSection />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
