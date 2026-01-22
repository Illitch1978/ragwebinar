// Global deck generation principles
// These rules apply to ALL brand guides and templates

export const DECK_PRINCIPLES = {
  visualVariety: {
    title: "Visual Variety",
    description: "Never have two consecutive slides with exactly the same design layout.",
    rule: "Each slide must differ from its immediate predecessor in structure, layout, or visual emphasis.",
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
    description: "Balance information density with visual impact.",
    rule: "Key insight slides should be punchy; supporting slides can carry more detail.",
  },
  typographicHierarchy: {
    title: "Typographic Hierarchy",
    description: "Maintain clear visual hierarchy on every slide.",
    rule: "Primary message should be immediately scannable within 3 seconds.",
  },
};

export const DECK_LENGTHS = {
  brief: { min: 8, max: 12, label: "Brief", description: "Executive summary" },
  medium: { min: 13, max: 22, label: "Medium", description: "Standard presentation" },
  long: { min: 23, max: 30, label: "Long", description: "Deep-dive analysis" },
  "very-long": { min: 31, max: 45, label: "Very Long", description: "Full workshop deck" },
} as const;

export type DeckLengthKey = keyof typeof DECK_LENGTHS;
