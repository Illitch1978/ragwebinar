import { Link, useLocation } from "react-router-dom";
import { Settings, Home } from "lucide-react";

const AppHeader = () => {
  const location = useLocation();
  
  const navTabs = [
    { label: "Overview", path: "/overview", icon: Home },
    { label: "Deck", path: "/deck" },
    { label: "Talk to Data", path: "#" },
  ];

  return (
    <div className="relative z-30">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        
        {/* Left: Logo + Divider + Title */}
        <div className="flex items-center gap-6 ml-4">
          {/* Logo */}
          <div className="flex items-baseline gap-0.5 select-none">
            <span className="font-serif font-bold text-xl tracking-tight text-neutral-400 leading-none">rubiklab</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0D9BDD] shadow-[0_0_6px_rgba(13,155,221,0.6)] transform -translate-y-0.5" />
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-neutral-300" />

          {/* Title */}
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-medium">
            Intelligence Studio
          </span>
        </div>

        {/* Right: Settings */}
        <button className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-600 transition-colors">
          <Settings size={16} strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-[0.1em] font-semibold">Settings</span>
        </button>
      </div>

      {/* Navigation Tabs - Below header, top left */}
      <div className="px-8 py-3 bg-[#F9F8F4]">
        <nav className="flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const IconComponent = tab.icon;
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
                {IconComponent && <IconComponent size={14} strokeWidth={1.5} />}
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AppHeader;
