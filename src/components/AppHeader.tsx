import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, User, Building2, Users, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsSidebar from "@/components/SettingsSidebar";

const AppHeader = () => {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const navTabs = [
    { label: "Overview", path: "/overview" },
    { label: "Deck", path: "/deck" },
    { label: "Explore", path: "/explore" },
    { label: "Talk to Data", path: "#" },
  ];

  return (
    <>
      <div className="relative z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 lg:px-16 py-4 flex items-center justify-between">
          
          {/* Left: Logo + Divider + Title - all clickable */}
          <Link to="/projects" className="flex items-center gap-6 group">
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
            <nav className="flex items-center mr-4">
              {navTabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.label}
                    to={tab.path}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.1em] font-semibold transition-colors whitespace-nowrap ${
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

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-neutral-600 transition-colors ml-2 outline-none focus:outline-none focus-visible:outline-none">
                  <Settings size={16} strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-[0.1em] font-semibold">Settings</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-neutral-200 shadow-lg z-50">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50">
                  <User size={16} strokeWidth={1.5} className="text-neutral-500" />
                  <span className="text-sm font-medium">Profile & Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Building2 size={16} strokeWidth={1.5} className="text-neutral-500" />
                  <span className="text-sm font-medium">Workspace Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50">
                  <Users size={16} strokeWidth={1.5} className="text-neutral-500" />
                  <span className="text-sm font-medium">Team Access</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-200" />
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 text-red-600">
                  <LogOut size={16} strokeWidth={1.5} />
                  <span className="text-sm font-medium">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Settings Sidebar Sheet */}
      <SettingsSidebar open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default AppHeader;
