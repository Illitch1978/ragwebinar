import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

const AppHeader = () => {
  const location = useLocation();
  
  const navTabs = [
    { label: "Overview", path: "/overview" },
    { label: "Deck", path: "/deck" },
    { label: "Talk to Data", path: "#" },
  ];

  return (
    <div className="relative z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
        
        {/* Left: Logo + Divider + Title - all clickable */}
        <Link to="/overview" className="flex items-center gap-6 group">
          {/* Logo - matching footer style */}
          <div className="flex items-baseline gap-0.5 select-none">
            <span className="font-serif font-bold text-xl tracking-tight text-muted-foreground leading-none group-hover:text-[#0D9BDD] transition-colors">rubiklab</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.6)] transform -translate-y-0.5" />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-neutral-300" />

          {/* Title */}
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium group-hover:text-[#0D9BDD] transition-colors">
            Intelligence Studio
          </span>
        </Link>

        {/* Right: Navigation + Settings */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 mr-4">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.label}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.1em] font-semibold transition-all ${
                    isActive 
                      ? "text-[#0D9BDD]" 
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-5 w-px bg-neutral-200" />

          {/* Settings */}
          <button className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-600 transition-colors ml-2">
            <Settings size={16} strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-[0.1em] font-semibold">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
