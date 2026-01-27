// Global deck generation principles
// These rules apply to ALL brand guides and templates

export const DECK_PRINCIPLES = {
  visualVariety: {
    title: "Visual Variety",
    description: "Never have two consecutive slides with exactly the same design layout.",
    rule: "Each slide must differ from its immediate predecessor in structure, layout, or visual emphasis. Avoid repetitive patterns like multiple two-column or three-point slides in sequence.",
  },
  layoutMixing: {
    title: "Layout Mixing",
    description: "Alternate between different layout types to maintain visual interest.",
    rule: "Use split-insight, text-stack, bullet-list, metrics, and two-column layouts in rotation. Never use the same layout type more than twice before switching.",
  },
  sectionDividers: {
    title: "Section Dividers",
    description: "Insert a section divider slide every 5-10 slides maximum.",
    rule: "Break content into digestible narrative chunks with visual breathing room.",
  },
  narrativeArc: {
    title: "Narrative Arc",
    description: "Follow a strategic story structure throughout the presentation.",
    rule: "Opening → Context → Problem → Solution → Evidence → Call to Action",
  },
  contentDensity: {
    title: "Content Density",
    description: "Maintain premium content density to avoid sparse, unfinished appearance.",
    rule: "Minimum 4-5 items per list slide. Each item needs a label AND detailed description (not just titles). Three-point lists look repetitive and boring.",
  },
  typographicHierarchy: {
    title: "Typographic Hierarchy",
    description: "Maintain clear visual hierarchy on every slide.",
    rule: "Primary message should be immediately scannable within 3 seconds.",
  },
  keyTermHighlighting: {
    title: "Key Term Highlighting",
    description: "Emphasize important concepts with bold + primary color formatting.",
    rule: "Use <strong class=\"text-primary\"> to highlight 1-2 key phrases per paragraph. This breaks up text walls and guides the reader's eye to core concepts.",
  },
  contrastReadability: {
    title: "Contrast & Readability",
    description: "Ensure text is always legible against its background.",
    rule: "Analysis/content slides use WHITE backgrounds (dark: false). Grey text on dark backgrounds is unreadable. Reserve dark backgrounds for cover, section-dividers, and closing slides only.",
  },
  quoteIntegration: {
    title: "Quote Integration",
    description: "Quotes should have visual context, not standalone text.",
    rule: "First quote slide displays author portrait. Subsequent quotes use large centered text with decorative elements. Never leave quotes as plain text blocks—they look weird and unfinished.",
  },
  premiumPolish: {
    title: "Premium Polish",
    description: "Every slide should look complete and intentional.",
    rule: "Expand bullet points with rich, actionable descriptions. Labels + detailed text creates consultant-grade deliverables. Sparse slides signal incomplete work.",
  },
};

export const DECK_LENGTHS = {
  brief: { min: 8, max: 12, label: "Brief", description: "Executive summary" },
  medium: { min: 13, max: 22, label: "Medium", description: "Standard presentation" },
  long: { min: 23, max: 30, label: "Long", description: "Deep-dive analysis" },
  "very-long": { min: 31, max: 45, label: "Very Long", description: "Full workshop deck" },
} as const;

export type DeckLengthKey = keyof typeof DECK_LENGTHS;

// Layout type distribution guidelines
export const LAYOUT_GUIDELINES = {
  analysisSlides: {
    preferredTypes: ["split-insight", "text-stack", "bullet-list"],
    avoidConsecutive: ["two-column", "bullet-list"],
    note: "split-insight provides visual variety with key insight callouts",
  },
  contentSlides: {
    minimumItems: 4,
    idealItems: 5,
    requireLabels: true,
    requireDescriptions: true,
  },
  quoteSlides: {
    firstQuote: "portrait layout with author image",
    subsequentQuotes: "centered large text with decorative elements",
    neverUse: "plain text block without visual context",
  },
  backgroundRules: {
    darkBackgrounds: ["cover", "section-divider", "closing", "cta"],
    lightBackgrounds: ["text-stack", "bullet-list", "metrics", "two-column", "split-insight", "quote"],
  },
};
