export const INITIAL_PLACEHOLDERS = [
  "yourwebsite.com",
  "google.com",
  "apple.com",
  "Enter a URL to audit...",
  "stripe.com",
  "framer.com",
  "airbnb.com"
];

export const DIMENSIONS = [
  { 
    id: 'tech', 
    title: 'TECHNICAL FOUNDATION', 
    desc: 'Checks how your website behaves in real conditions: load speed, stability, mobile responsiveness, and core search-readiness signals.', 
    tags: ['SPEED', 'STABILITY', 'MOBILE', 'SEO/GEO'] 
  },
  { 
    id: 'visual', 
    title: 'VISUAL CLARITY', 
    desc: 'Assessing visual language, hierarchy, balance, and first impression to understand how clearly your message comes across.', 
    tags: ['HIERARCHY', 'LAYOUT', 'CONTRAST', 'CREDIBILITY'] 
  },
  { 
    id: 'ux', 
    title: 'UX USER FLOW', 
    desc: 'Reviews navigation logic and interaction patterns to assess how easily visitors complete key actions.', 
    tags: ['NAVIGATION', 'EFFORT', 'PATH', 'ACTION'] 
  },
  { 
    id: 'audience', 
    title: 'POSITIONING CLARITY', 
    desc: 'Evaluates whether your messaging resonates with your audience and clearly positions your offer as relevant and credible.', 
    tags: ['RELEVANCE', 'VALUE', 'TRUST', 'FOCUS'] 
  }
];
