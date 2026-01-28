import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Palette, Type, Zap, Layout, MousePointer, Shapes, Image, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandGuide } from "@/hooks/useBrandGuides";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BrandGuideEditorProps {
  brandGuides: BrandGuide[] | undefined;
  isLoading: boolean;
}

// Color can be flat string or nested object with hex/usage
type ColorValue = string | { hex?: string; usage?: string } | Record<string, { hex?: string; usage?: string }>;

interface ButtonSpec {
  variant?: string;
  background?: string;
  text_color?: string;
  border?: string;
  hover?: string;
  padding?: string;
  border_radius?: string;
  states?: {
    default?: string;
    hover?: string;
    active?: string;
    disabled?: string;
  };
}

interface IconSpec {
  style?: string;
  stroke_width?: string;
  sizes?: Record<string, string>;
  colors?: string[];
  allowed_colors?: string[];
  forbidden?: string;
}

interface DesignSystem {
  theme?: string;
  brand_intent?: string;
  design_principles?: string[];
  // Colors can be flat (Swiss) or nested categories (DataExpert)
  colors?: Record<string, ColorValue>;
  color_rules?: string[];
  // Typography can be flat (Swiss) or nested (DataExpert)
  typography?: {
    font_family?: string;
    headings?: string;
    body?: string;
    mono?: string;
    hierarchy?: Record<string, { color?: string; weight?: string; case?: string }>;
    spacing_rules?: string[];
    [key: string]: unknown;
  };
  // Button specifications
  buttons?: {
    primary?: ButtonSpec;
    secondary?: ButtonSpec;
    ghost?: ButtonSpec;
    sizes?: Record<string, string>;
    [key: string]: ButtonSpec | Record<string, string> | undefined;
  };
  // Icon specifications
  iconography?: IconSpec;
  icons?: IconSpec;
  // Effects (Swiss style)
  effects?: Record<string, boolean>;
  // Charts (DataExpert style)
  charts?: {
    style?: string;
    color_mapping?: Record<string, string>;
    labels_axes?: Record<string, string>;
  };
  // Grid system (DataExpert style)
  grid_system?: {
    zones?: string[];
    content_blocks?: string;
  };
  // Functional elements (DataExpert style)
  functional_elements?: Record<string, Record<string, string>>;
  // Writing style (DataExpert style)
  writing_style?: {
    tone?: string[];
    avoid?: string[];
  };
  // Validation checklist (DataExpert style)
  validation_checklist?: string[];
  // Automation defaults (DataExpert style)
  automation_defaults?: Record<string, string>;
  animation_style?: {
    name?: string;
    description?: string;
    entrance?: {
      type?: string;
      direction?: string;
      duration?: number;
      stagger?: number;
      easing?: string;
    };
    section_divider?: {
      type?: string;
      duration?: number;
      easing?: string;
    };
    elements?: Record<string, { type?: string; stagger?: number; delay?: number; duration?: number }>;
    hover?: {
      scale?: number;
      duration?: number;
    };
    micro_interactions?: Record<string, { type?: string; duration?: number; easing?: string }>;
  };
  dev_summary?: string;
}

interface SlideTemplate {
  type: string;
  description?: string;
  background?: string;
  elements?: string[];
  typography?: Record<string, string>;
  title_color?: string;
  body_color?: string;
  accent?: string;
}

// Helper to convert HSL string to approximate hex for display
const hslToDisplayColor = (color: string): string => {
  if (color.startsWith('#')) return color;
  if (color.startsWith('hsl')) return color; // Keep HSL as-is for CSS
  return color;
};

const ColorSwatch = ({ value, name, usage }: { value: string; name: string; usage?: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div 
      className="w-8 h-8 rounded-sm border border-border shrink-0 shadow-sm"
      style={{ backgroundColor: hslToDisplayColor(value) }}
    />
    <div className="flex-1 min-w-0">
      <div className="flex flex-col">
        <span className="font-mono text-xs text-foreground capitalize">{name.replace(/_/g, ' ')}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
      </div>
      {usage && (
        <p className="text-xs text-muted-foreground truncate mt-0.5">{usage}</p>
      )}
    </div>
  </div>
);

const AnimationPreview = ({ animationStyle }: { animationStyle?: DesignSystem['animation_style'] }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!animationStyle) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-medium text-foreground text-sm">{animationStyle.name}</h5>
          <p className="text-xs text-muted-foreground">{animationStyle.description}</p>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-xs font-mono uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
        >
          {isPlaying ? "Reset" : "Preview"}
        </button>
      </div>

      {/* Animation demo */}
      <div className="bg-muted/30 border border-border rounded-sm p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              key="demo"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Simulated slide content */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: animationStyle.entrance?.duration || 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="h-4 w-3/4 bg-foreground/20 rounded-sm"
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: animationStyle.entrance?.duration || 0.5,
                  delay: (animationStyle.entrance?.stagger || 0.08),
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="h-3 w-1/2 bg-foreground/10 rounded-sm"
              />
              <div className="flex gap-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.3 + (i * (animationStyle.elements?.cards?.stagger || 0.1)),
                    }}
                    className="flex-1 h-16 bg-card border border-border rounded-sm"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isPlaying && (
          <div className="text-center py-4 text-muted-foreground text-xs">
            Click "Preview" to see animation
          </div>
        )}
      </div>

      {/* Animation specs */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        {animationStyle.entrance && (
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground uppercase tracking-wider text-[10px]">Entrance</p>
            <p className="text-foreground">Type: {animationStyle.entrance.type}</p>
            <p className="text-foreground">Duration: {animationStyle.entrance.duration}s</p>
            <p className="text-foreground">Stagger: {animationStyle.entrance.stagger}s</p>
          </div>
        )}
        {animationStyle.hover && (
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground uppercase tracking-wider text-[10px]">Hover</p>
            <p className="text-foreground">Scale: {animationStyle.hover.scale}x</p>
            <p className="text-foreground">Duration: {animationStyle.hover.duration}s</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BrandGuideCard = ({ guide }: { guide: BrandGuide }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const designSystem = guide.design_system as unknown as DesignSystem;
  const slideTemplates = guide.slide_templates as unknown as SlideTemplate[];

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'buttons', label: 'Buttons', icon: MousePointer },
    { id: 'logo', label: 'Logo', icon: Image },
    { id: 'icons', label: 'Icons', icon: Shapes },
    { id: 'animation', label: 'Animation', icon: Zap },
    { id: 'templates', label: 'Templates', icon: Layout },
  ];

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div className="text-left flex-1">
            <h3 className="font-medium text-foreground">{guide.name}</h3>
            {guide.description && (
              <p className="text-sm text-muted-foreground">{guide.description}</p>
            )}
          </div>
          {guide.is_default && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              Default
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-200",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="border-t border-border">
              {/* Section tabs */}
              <div className="flex border-b border-border">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-wider transition-colors",
                        activeSection === section.id
                          ? "text-primary bg-primary/5 border-b-2 border-primary -mb-px"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {section.label}
                    </button>
                  );
                })}
              </div>

              {/* Section content */}
              <div className="p-4">
                {/* Overview - when no section is selected */}
                {!activeSection && (
                  <div className="space-y-4">
                    {designSystem?.brand_intent && (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Brand Intent</p>
                        <p className="text-sm text-foreground">{designSystem.brand_intent}</p>
                      </div>
                    )}
                    {designSystem?.design_principles && (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Design Principles</p>
                        <div className="flex flex-wrap gap-2">
                          {designSystem.design_principles.map((principle, i) => (
                            <span key={i} className="text-xs bg-muted px-2 py-1 rounded-sm text-foreground">
                              {principle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {designSystem?.theme && (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Theme</p>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm font-mono">
                          {designSystem.theme}
                        </span>
                      </div>
                    )}
                    {designSystem?.animation_style?.name && (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Animation Style</p>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-sm font-mono">
                          {designSystem.animation_style.name}
                        </span>
                      </div>
                    )}
                    {designSystem?.dev_summary && (
                      <div className="bg-muted/30 border border-border rounded-sm p-3">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dev Summary</p>
                        <p className="text-xs text-foreground">{designSystem.dev_summary}</p>
                      </div>
                    )}
                    {/* Fallback if no specific overview content */}
                    {!designSystem?.brand_intent && !designSystem?.design_principles && !designSystem?.dev_summary && (
                      <p className="text-sm text-muted-foreground">
                        Click a section above to view details about colors, typography, animations, and slide templates.
                      </p>
                    )}
                  </div>
                )}

                {/* Colors Section */}
                {activeSection === 'colors' && designSystem?.colors && (
                  <div className="space-y-4">
                    {Object.entries(designSystem.colors).map(([categoryOrName, value]) => {
                      // Check if this is a flat color (string) or a category (object)
                      if (typeof value === 'string') {
                        // Flat color structure (Swiss)
                        return (
                          <ColorSwatch 
                            key={categoryOrName} 
                            value={value} 
                            name={categoryOrName} 
                          />
                        );
                      } else if (typeof value === 'object' && value !== null) {
                        // Check if it's a direct {hex, usage} object or a category of colors
                        if ('hex' in value && typeof (value as { hex?: string }).hex === 'string') {
                          // Direct color with hex/usage
                          const colorObj = value as { hex: string; usage?: string };
                          return (
                            <ColorSwatch 
                              key={categoryOrName} 
                              value={colorObj.hex} 
                              name={categoryOrName}
                              usage={colorObj.usage}
                            />
                          );
                        } else {
                          // Category of colors (DataExpert nested structure)
                          return (
                            <div key={categoryOrName}>
                              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 capitalize">
                                {categoryOrName.replace(/_/g, ' ')}
                              </p>
                              <div className="grid grid-cols-2 gap-x-4 pl-2 border-l-2 border-border">
                                {Object.entries(value as Record<string, { hex?: string; usage?: string }>).map(([colorName, colorData]) => (
                                  colorData?.hex ? (
                                    <ColorSwatch 
                                      key={colorName} 
                                      value={colorData.hex} 
                                      name={colorName}
                                      usage={colorData.usage}
                                    />
                                  ) : null
                                ))}
                              </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                    {designSystem.effects && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Effects</p>
                        <div className="space-y-2">
                          {Object.entries(designSystem.effects).map(([name, enabled]) => (
                            <div key={name} className="flex items-center gap-2 text-xs">
                              <span className={enabled ? "text-green-500" : "text-muted-foreground"}>
                                {enabled ? "✓" : "○"}
                              </span>
                              <span className="text-foreground capitalize">{name.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {designSystem.color_rules && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Color Rules</p>
                        <ul className="space-y-1">
                          {designSystem.color_rules.map((rule, i) => (
                            <li key={i} className="text-xs text-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Typography Section */}
                {activeSection === 'typography' && designSystem?.typography && (
                  <div className="space-y-4">
                    {/* Font Family (DataExpert) or individual fonts (Swiss) */}
                    {designSystem.typography.font_family ? (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Primary Font</p>
                        <span className="text-lg text-foreground" style={{ fontFamily: `'${designSystem.typography.font_family}', sans-serif` }}>
                          {designSystem.typography.font_family}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Font Stack</p>
                        <div className="space-y-3">
                          {Object.entries(designSystem.typography).map(([purpose, font]) => (
                            typeof font === 'string' ? (
                              <div key={purpose} className="bg-muted/30 rounded-sm p-3 flex items-center justify-between">
                                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{purpose}</span>
                                <span 
                                  className="text-foreground text-lg"
                                  style={{ 
                                    fontFamily: purpose === 'headings' ? "'Playfair Display', serif" : 
                                               purpose === 'mono' ? "'Roboto Mono', monospace" : 
                                               "'Inter', sans-serif"
                                  }}
                                >
                                  {font}
                                </span>
                              </div>
                            ) : null
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hierarchy (DataExpert) */}
                    {designSystem.typography.hierarchy && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Type Hierarchy</p>
                        <div className="space-y-2">
                          {Object.entries(designSystem.typography.hierarchy).map(([level, specs]) => (
                            <div key={level} className="bg-muted/30 rounded-sm p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs text-primary uppercase">{level.replace(/_/g, ' ')}</span>
                              </div>
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                {specs.weight && <span>Weight: <span className="text-foreground">{specs.weight}</span></span>}
                                {specs.color && <span>Color: <span className="text-foreground">{specs.color}</span></span>}
                                {specs.case && <span>Case: <span className="text-foreground">{specs.case}</span></span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spacing Rules (DataExpert) */}
                    {designSystem.typography.spacing_rules && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Spacing Rules</p>
                        <ul className="space-y-1">
                          {designSystem.typography.spacing_rules.map((rule, i) => (
                            <li key={i} className="text-xs text-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Theme (Swiss) */}
                    {designSystem.theme && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Theme</p>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-sm font-mono">
                          {designSystem.theme}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Buttons Section */}
                {activeSection === 'buttons' && (
                  <div className="space-y-6">
                    {/* GlowingButton Specification */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">GlowingButton Effect Specification</p>
                        <p className="text-sm text-foreground">
                          Premium pill-shaped buttons with gradient borders, layered glass effects, and a signature diagonal shimmer sweep.
                        </p>
                      </div>

                      {/* Live Button Preview */}
                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">Live Preview (hover to see effects)</p>
                        <div className="flex flex-wrap gap-6 items-center justify-center p-8 bg-background rounded-sm border border-border">
                          {/* Primary Glowing Button - Exact Spec */}
                          <div className="relative group">
                            {/* Deep Ambient Glow (Behind) - External */}
                            <div 
                              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
                              style={{
                                background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
                                transform: 'scale(1.5)',
                              }}
                            />
                            
                            {/* Gradient Border Container */}
                            <div 
                              className="relative rounded-full p-[1px]"
                              style={{
                                background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.1) 50%, hsl(var(--foreground) / 0.25) 100%)',
                              }}
                            >
                              {/* The Button Content */}
                              <button
                                className="relative px-5 py-2.5 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ease-out group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                                style={{
                                  background: 'linear-gradient(180deg, hsl(240 10% 10%) 0%, hsl(240 10% 6%) 100%)',
                                }}
                              >
                                {/* Top Glass Highlight */}
                                <div 
                                  className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(180deg, hsl(var(--foreground) / 0.08) 0%, transparent 100%)',
                                  }}
                                />
                                
                                {/* Bottom Shadow for depth */}
                                <div 
                                  className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(0deg, hsl(0 0% 0% / 0.3) 0%, transparent 100%)',
                                  }}
                                />
                                
                                {/* Shimmer Effect - Signature diagonal sweep */}
                                <div 
                                  className="brand-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                  style={{
                                    background: 'linear-gradient(105deg, transparent 40%, hsl(var(--foreground) / 0.06) 45%, hsl(var(--foreground) / 0.12) 50%, hsl(var(--foreground) / 0.06) 55%, transparent 60%)',
                                  }}
                                />
                                
                                {/* Text */}
                                <span
                                  className="relative z-10 text-xs font-semibold uppercase tracking-[0.15em] text-foreground/90 group-hover:text-foreground transition-colors duration-300"
                                  style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                  Generate Deck
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Shimmer Animation Styles */}
                        <style>{`
                          .brand-shimmer {
                            transform: translateX(-120%);
                          }
                          .group:hover .brand-shimmer {
                            animation: brand-shimmer-sweep 1.15s ease-out forwards;
                          }
                          @keyframes brand-shimmer-sweep {
                            100% { transform: translateX(120%); }
                          }
                        `}</style>
                      </div>

                      {/* Structure Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 border border-border rounded-sm p-4">
                          <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Structure</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Outer wrapper</span>
                              <span className="text-foreground font-mono">relative group</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Border</span>
                              <span className="text-foreground font-mono">p-[1px] gradient</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Shape</span>
                              <span className="text-foreground font-mono">rounded-full (pill)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Inner</span>
                              <span className="text-foreground font-mono">dark gradient + glass</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/30 border border-border rounded-sm p-4">
                          <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Typography</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Font</span>
                              <span className="text-foreground font-mono">var(--font-heading)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Weight</span>
                              <span className="text-foreground font-mono">font-semibold</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Case</span>
                              <span className="text-foreground font-mono">uppercase</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tracking</span>
                              <span className="text-foreground font-mono">0.15em</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Colors Table */}
                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Colors (HSL-based)</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="border-b border-border">
                              <tr>
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Element</th>
                                <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Border gradient</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">linear-gradient(135deg, hsl(--foreground/0.3) → 0.1 → 0.25)</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Button background</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">linear-gradient(180deg, hsl(240 10% 10%) → hsl(240 10% 6%))</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Top glass highlight</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">hsl(--foreground/0.08) → transparent</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Bottom shadow</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">hsl(0 0% 0% / 0.3) → transparent</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Ambient glow (hover)</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">radial-gradient(hsl(--primary/0.4) → transparent)</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Hover box-shadow</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">0 0 20px hsl(--primary/0.3)</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Shimmer</td>
                                <td className="py-2 font-mono text-muted-foreground text-[10px]">hsl(--foreground/0.06 → 0.12 → 0.06)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Animations Table */}
                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Animations</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="border-b border-border">
                              <tr>
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Effect</th>
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Duration</th>
                                <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Easing</th>
                                <th className="text-left py-2 font-medium text-muted-foreground">Behavior</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Ambient glow fade-in</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">500ms</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">CSS default</td>
                                <td className="py-2 text-muted-foreground">opacity: 0 → 1 on hover</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Box-shadow glow</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">300ms</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">ease-out</td>
                                <td className="py-2 text-muted-foreground">Appears on hover</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Text color</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">300ms</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">CSS default</td>
                                <td className="py-2 text-muted-foreground">foreground/90 → foreground</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-foreground">Shimmer sweep</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">1150ms</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">ease-out</td>
                                <td className="py-2 text-muted-foreground">translateX(-120% → 120%), one-shot</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Key Properties */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-sm p-4">
                        <p className="font-mono text-xs text-amber-600 uppercase font-medium mb-3">Key Properties</p>
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                          <li>• <strong className="text-foreground">No scaling</strong> — zero transform scale effects</li>
                          <li>• <strong className="text-foreground">No translateY</strong> — no vertical movement</li>
                          <li>• <strong className="text-foreground">Rounded: rounded-full</strong> — pill shape</li>
                          <li>• <strong className="text-foreground">Shimmer is the signature</strong> — diagonal light sweep triggered once per hover</li>
                        </ul>
                      </div>

                      {/* Button Sizes */}
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Sizes</p>
                        <div className="flex gap-6 items-end justify-center p-4 bg-muted/20 rounded-sm">
                          <div className="text-center">
                            <div className="relative group mb-2">
                              <div 
                                className="relative rounded-full p-[1px]"
                                style={{
                                  background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.1) 50%, hsl(var(--foreground) / 0.25) 100%)',
                                }}
                              >
                                <button
                                  className="relative px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/90"
                                  style={{
                                    background: 'linear-gradient(180deg, hsl(240 10% 10%) 0%, hsl(240 10% 6%) 100%)',
                                  }}
                                >
                                  Small
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono">sm: px-4 py-2</p>
                          </div>
                          <div className="text-center">
                            <div className="relative group mb-2">
                              <div 
                                className="relative rounded-full p-[1px]"
                                style={{
                                  background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.1) 50%, hsl(var(--foreground) / 0.25) 100%)',
                                }}
                              >
                                <button
                                  className="relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-foreground/90"
                                  style={{
                                    background: 'linear-gradient(180deg, hsl(240 10% 10%) 0%, hsl(240 10% 6%) 100%)',
                                  }}
                                >
                                  Medium
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono">md: px-5 py-2.5</p>
                          </div>
                          <div className="text-center">
                            <div className="relative group mb-2">
                              <div 
                                className="relative rounded-full p-[1px]"
                                style={{
                                  background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.1) 50%, hsl(var(--foreground) / 0.25) 100%)',
                                }}
                              >
                                <button
                                  className="relative px-7 py-3.5 rounded-full text-sm font-semibold uppercase tracking-[0.15em] text-foreground/90"
                                  style={{
                                    background: 'linear-gradient(180deg, hsl(240 10% 10%) 0%, hsl(240 10% 6%) 100%)',
                                  }}
                                >
                                  Large
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono">lg: px-7 py-3.5</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logo Section */}
                {activeSection === 'logo' && (
                  <div className="space-y-6">
                    {/* Logo Display */}
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Primary Logo</p>
                      <div className="bg-muted/30 border border-border rounded-sm p-6 flex items-center justify-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-3xl font-bold tracking-tight text-foreground">
                            rubiklab
                          </span>
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-20" />
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Typography</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Text</span>
                            <span className="text-foreground font-mono">rubiklab</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Case</span>
                            <span className="text-foreground font-mono">lowercase only</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Font</span>
                            <span className="text-foreground font-mono">Playfair Display</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight</span>
                            <span className="text-foreground font-mono">700 (bold)</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <p className="font-mono text-xs text-primary uppercase font-medium mb-3">Dot Indicator</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Color</span>
                            <span className="text-foreground font-mono">primary (LinkedIn Blue)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size</span>
                            <span className="text-foreground font-mono">8px / 0.5rem</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Effect</span>
                            <span className="text-foreground font-mono">glow + pulse</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Position</span>
                            <span className="text-foreground font-mono">right of text</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Placement Rules */}
                    <div className="border-t border-border pt-4">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Placement Rules</p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-sm">
                          <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-bold">1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">One logo per slide</p>
                            <p className="text-xs text-muted-foreground">Single brand logo fixed in the bottom-left footer. No redundant logos.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-sm">
                          <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-bold">2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Footer format</p>
                            <p className="text-xs text-muted-foreground">Use "Rubiklab Intelligence Capital" for full footer attribution.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-sm">
                          <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-bold">3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Interactive behavior</p>
                            <p className="text-xs text-muted-foreground">Clicking the footer logo navigates back to the landing page.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Forbidden Usage */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <p className="font-mono text-[10px] text-destructive uppercase tracking-wider">Do Not</p>
                      </div>
                      <ul className="space-y-1 text-xs text-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Duplicate logos on cover or closing slides
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Use uppercase "RUBIKLAB" or mixed case
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Remove or change the animated dot indicator
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Place logo in slide content areas
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Icons Section */}
                {activeSection === 'icons' && (
                  <div className="space-y-6">
                    {/* Minimal Use Warning */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <p className="font-mono text-[10px] text-amber-700 uppercase tracking-wider font-medium">Minimal Icon Policy</p>
                      </div>
                      <p className="text-sm text-foreground">
                        Icons should be used sparingly and only when they add clear functional value. 
                        Prefer typography and whitespace over iconography for visual hierarchy.
                      </p>
                    </div>

                    {/* When to use icons */}
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Acceptable Use Cases</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-sm">
                          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
                            <MousePointer className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">Interactive elements</p>
                            <p className="text-[10px] text-muted-foreground">Buttons, navigation, actions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-sm">
                          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">Status indicators</p>
                            <p className="text-[10px] text-muted-foreground">Warnings, success, errors</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Icon Specifications (if used) */}
                    <div className="border-t border-border pt-4">
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">If Icons Are Required</p>
                      <div className="bg-muted/30 border border-border rounded-sm p-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Library</span>
                              <span className="text-foreground font-mono">Lucide</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Stroke Width</span>
                              <span className="text-foreground font-mono">1.5px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Style</span>
                              <span className="text-foreground font-mono">outline only</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size (sm)</span>
                              <span className="text-foreground font-mono">16px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size (md)</span>
                              <span className="text-foreground font-mono">20px</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size (lg)</span>
                              <span className="text-foreground font-mono">24px</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Forbidden */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-sm p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <p className="font-mono text-[10px] text-destructive uppercase tracking-wider">Avoid</p>
                      </div>
                      <ul className="space-y-1 text-xs text-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Decorative icons without functional purpose
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Filled/solid icon styles
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Icon-heavy layouts or icon grids
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-0.5">×</span>
                          Using icons as primary content elements
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Animation Section */}
                {activeSection === 'animation' && (
                  <div className="space-y-4">
                    <AnimationPreview animationStyle={designSystem?.animation_style} />
                    
                    {/* Element-specific animations */}
                    {designSystem?.animation_style?.elements && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Element Animations</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(designSystem.animation_style.elements).map(([element, specs]) => (
                            <div key={element} className="bg-muted/30 rounded-sm p-3">
                              <p className="font-mono text-xs text-primary uppercase mb-1">{element}</p>
                              <div className="text-[10px] text-muted-foreground space-y-0.5">
                                {specs.type && <p>Type: <span className="text-foreground">{specs.type}</span></p>}
                                {specs.duration && <p>Duration: <span className="text-foreground">{specs.duration}s</span></p>}
                                {specs.stagger && <p>Stagger: <span className="text-foreground">{specs.stagger}s</span></p>}
                                {specs.delay && <p>Delay: <span className="text-foreground">{specs.delay}s</span></p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Micro-interactions */}
                    {designSystem?.animation_style?.micro_interactions && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Micro-interactions</p>
                        <div className="space-y-2">
                          {Object.entries(designSystem.animation_style.micro_interactions).map(([name, specs]) => (
                            <div key={name} className="flex items-center justify-between bg-muted/30 rounded-sm px-3 py-2">
                              <span className="text-xs text-foreground capitalize">{name.replace(/_/g, ' ')}</span>
                              <div className="flex gap-2 text-[10px] text-muted-foreground">
                                {specs.type && <span className="bg-muted px-1.5 py-0.5 rounded">{specs.type}</span>}
                                {specs.duration && <span>{specs.duration}s</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Divider Animation */}
                    {designSystem?.animation_style?.section_divider && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Section Divider</p>
                        <div className="bg-muted/30 rounded-sm p-3 text-xs">
                          <p className="text-muted-foreground">Type: <span className="text-foreground">{designSystem.animation_style.section_divider.type}</span></p>
                          <p className="text-muted-foreground">Duration: <span className="text-foreground">{designSystem.animation_style.section_divider.duration}s</span></p>
                          {designSystem.animation_style.section_divider.easing && (
                            <p className="text-muted-foreground">Easing: <span className="text-foreground font-mono text-[10px]">{designSystem.animation_style.section_divider.easing}</span></p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Charts (DataExpert) */}
                    {designSystem?.charts && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Chart Styling</p>
                        {designSystem.charts.style && (
                          <p className="text-xs text-foreground mb-3">{designSystem.charts.style}</p>
                        )}
                        {designSystem.charts.color_mapping && (
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(designSystem.charts.color_mapping).map(([name, color]) => (
                              <div key={name} className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-sm border border-border"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-muted-foreground capitalize">{name.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Writing Style (DataExpert) */}
                    {designSystem?.writing_style && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Writing Style</p>
                        <div className="grid grid-cols-2 gap-4">
                          {designSystem.writing_style.tone && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tone</p>
                              <div className="flex flex-wrap gap-1">
                                {designSystem.writing_style.tone.map((t, i) => (
                                  <span key={i} className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-sm">{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {designSystem.writing_style.avoid && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Avoid</p>
                              <div className="flex flex-wrap gap-1">
                                {designSystem.writing_style.avoid.map((a, i) => (
                                  <span key={i} className="text-xs bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded-sm">{a}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Validation Checklist (DataExpert) */}
                    {designSystem?.validation_checklist && (
                      <div className="border-t border-border pt-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Validation Checklist</p>
                        <ul className="space-y-1">
                          {designSystem.validation_checklist.map((item, i) => (
                            <li key={i} className="text-xs text-foreground flex items-start gap-2">
                              <span className="text-muted-foreground">□</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Templates Section */}
                {activeSection === 'templates' && slideTemplates && (
                  <div className="space-y-3">
                    {slideTemplates.map((template, i) => (
                      <div key={i} className="bg-muted/30 border border-border rounded-sm p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-primary uppercase font-medium">{template.type}</span>
                          {template.background && (
                            <div className="flex items-center gap-1.5">
                              <div 
                                className="w-4 h-4 rounded-sm border border-border"
                                style={{ backgroundColor: template.background.split(' ')[0] }}
                              />
                              <span className="font-mono text-[10px] text-muted-foreground">{template.background}</span>
                            </div>
                          )}
                        </div>
                        {template.description && (
                          <p className="text-xs text-foreground mb-2">{template.description}</p>
                        )}
                        {template.elements && (
                          <ul className="text-xs text-muted-foreground space-y-0.5 mt-2 border-t border-border/50 pt-2">
                            {template.elements.map((el, j) => (
                              <li key={j}>• {el}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BrandGuideEditor = ({ brandGuides, isLoading }: BrandGuideEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
          <Palette className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-widest">
            Design Templates
          </span>
          <span className="text-[10px] text-muted-foreground/70 font-mono">
            ({brandGuides?.length || 0})
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Loading brand guides...
            </div>
          ) : brandGuides && brandGuides.length > 0 ? (
            brandGuides.map((guide) => (
              <BrandGuideCard key={guide.id} guide={guide} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No brand guides found
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BrandGuideEditor;
