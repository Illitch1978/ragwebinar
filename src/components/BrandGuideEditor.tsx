import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Palette, Type, Zap, Layout, Eye, EyeOff } from "lucide-react";
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

interface DesignSystem {
  brand_intent?: string;
  design_principles?: string[];
  colors?: Record<string, Record<string, { hex?: string; usage?: string }>>;
  color_rules?: string[];
  typography?: Record<string, unknown>;
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
  };
  automation_defaults?: Record<string, string>;
  dev_summary?: string;
}

interface SlideTemplate {
  type: string;
  background?: string;
  elements?: string[];
  typography?: Record<string, string>;
  title_color?: string;
  body_color?: string;
  accent?: string;
}

const ColorSwatch = ({ hex, name, usage }: { hex: string; name: string; usage?: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div 
      className="w-8 h-8 rounded-sm border border-border shrink-0 shadow-sm"
      style={{ backgroundColor: hex }}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-foreground">{name}</span>
        <span className="font-mono text-[10px] text-muted-foreground uppercase">{hex}</span>
      </div>
      {usage && (
        <p className="text-xs text-muted-foreground truncate">{usage}</p>
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
          <div className="text-left">
            <h3 className="font-medium text-foreground">{guide.name}</h3>
            {guide.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{guide.description}</p>
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
                {/* Brand Intent */}
                {!activeSection && designSystem?.brand_intent && (
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Brand Intent</p>
                      <p className="text-sm text-foreground">{designSystem.brand_intent}</p>
                    </div>
                    {designSystem.design_principles && (
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
                    {designSystem.dev_summary && (
                      <div className="bg-muted/30 border border-border rounded-sm p-3">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dev Summary</p>
                        <p className="text-xs text-foreground">{designSystem.dev_summary}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Colors Section */}
                {activeSection === 'colors' && designSystem?.colors && (
                  <div className="space-y-4">
                    {Object.entries(designSystem.colors).map(([category, colors]) => (
                      <div key={category}>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 capitalize">
                          {category.replace(/_/g, ' ')}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4">
                          {Object.entries(colors).map(([name, color]) => (
                            <ColorSwatch 
                              key={name} 
                              hex={color.hex || '#000'} 
                              name={name.replace(/_/g, ' ')} 
                              usage={color.usage} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {designSystem.color_rules && (
                      <div className="border-t border-border pt-4 mt-4">
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
                    {Object.entries(designSystem.typography).map(([category, config]) => (
                      <div key={category}>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2 capitalize">
                          {category.replace(/_/g, ' ')}
                        </p>
                        {typeof config === 'object' && config !== null && (
                          <div className="bg-muted/30 rounded-sm p-3 space-y-1">
                            {Object.entries(config as Record<string, unknown>).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="text-foreground font-mono">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Animation Section */}
                {activeSection === 'animation' && (
                  <AnimationPreview animationStyle={designSystem?.animation_style} />
                )}

                {/* Templates Section */}
                {activeSection === 'templates' && slideTemplates && (
                  <div className="space-y-3">
                    {slideTemplates.map((template, i) => (
                      <div key={i} className="bg-muted/30 border border-border rounded-sm p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-foreground uppercase">{template.type}</span>
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
                        {template.elements && (
                          <ul className="text-xs text-muted-foreground space-y-0.5">
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
            Brand Guide Templates
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
