import { useState } from "react";
import { 
  Target, 
  Bot, 
  Search, 
  Eye, 
  Wrench,
  FileText,
  Settings,
  FolderOpen,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { title: "Positioning", icon: Target, id: "positioning" },
  { title: "AI consultant", icon: Bot, id: "ai-consultant" },
  { title: "Competitor intel", icon: Search, id: "competitor-intel" },
  { title: "Visibility", icon: Eye, id: "visibility" },
  { title: "Technical", icon: Wrench, id: "technical" },
];

const bottomNavItems = [
  { title: "Reports", icon: FileText, id: "reports" },
  { title: "Settings", icon: Settings, id: "settings" },
  { title: "Projects", icon: FolderOpen, id: "projects" },
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
            <div className="text-lg font-semibold text-foreground">
              mondro<span className="text-primary">.</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
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
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground capitalize mb-2">
            {activeItem.replace("-", " ")}
          </h1>
          <p className="text-muted-foreground">
            Select a section from the sidebar to get started.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
