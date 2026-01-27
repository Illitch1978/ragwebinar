// Output format-specific generation principles
// These define how content should be structured for each output type

export type OutputFormat = 'presentation' | 'report' | 'proposal' | 'article' | 'executive-summary' | 'post-meeting';

export const OUTPUT_FORMAT_PRINCIPLES: Record<OutputFormat, {
  name: string;
  structure: string[];
  toneGuidelines: string[];
  slideLengthHint: string;
  keyFeatures: string[];
}> = {
  presentation: {
    name: "Presentation",
    structure: [
      "Cover slide with title and branding",
      "Agenda or overview slide",
      "Main content sections (5-10 slides)",
      "Key insights and takeaways",
      "Closing slide with next steps",
    ],
    toneGuidelines: [
      "Clear and professional",
      "Balanced mix of visuals and text",
      "Engaging narrative flow",
      "Audience-appropriate language",
    ],
    slideLengthHint: "10-20 slides",
    keyFeatures: [
      "Versatile for any topic",
      "Visual storytelling emphasis",
      "Clear section breaks",
      "Memorable opening and closing",
    ],
  },

  report: {
    name: "Report",
    structure: [
      "Executive summary slide",
      "Background and context",
      "Data and findings (3-6 slides)",
      "Analysis and insights",
      "Recommendations",
      "Appendix if needed",
    ],
    toneGuidelines: [
      "Formal and objective",
      "Data-driven and factual",
      "Clear methodology explanation",
      "Balanced perspective",
    ],
    slideLengthHint: "15-30 slides",
    keyFeatures: [
      "Heavy on data visualization",
      "Structured and methodical",
      "Evidence-based conclusions",
      "Professional formatting",
    ],
  },

  proposal: {
    name: "Proposal Builder",
    structure: [
      "Hook slide with compelling problem statement",
      "Current state / pain points (2-3 slides)",
      "Vision / solution overview",
      "Detailed approach or methodology (3-5 slides)",
      "Evidence: case studies, metrics, testimonials",
      "Investment / pricing (if applicable)",
      "Clear call-to-action with next steps",
    ],
    toneGuidelines: [
      "Persuasive but not pushy",
      "Focus on client outcomes, not features",
      "Use 'you' language, not 'we' language",
      "Quantify benefits wherever possible",
    ],
    slideLengthHint: "15-25 slides",
    keyFeatures: [
      "Problem-solution narrative arc",
      "Social proof and credibility markers",
      "Clear pricing or investment section",
      "Urgency without pressure",
    ],
  },

  article: {
    name: "Article / Thought Leadership",
    structure: [
      "Provocative opening thesis",
      "Context and background (why now?)",
      "Main argument with 3-4 supporting points",
      "Expert quotes or data citations",
      "Counterarguments addressed",
      "Implications and future outlook",
      "Key takeaway / memorable conclusion",
    ],
    toneGuidelines: [
      "Authoritative but accessible",
      "Use storytelling to illustrate points",
      "Balance data with narrative",
      "Invite reflection, not just agreement",
    ],
    slideLengthHint: "12-20 slides",
    keyFeatures: [
      "Strong editorial voice",
      "Quote slides with attribution",
      "Data visualization for key insights",
      "Memorable closing statement",
    ],
  },

  "executive-summary": {
    name: "Executive Summary",
    structure: [
      "One-slide situation overview",
      "Key findings (2-3 bullets max)",
      "Critical implications",
      "Recommended actions",
      "Timeline or next steps",
    ],
    toneGuidelines: [
      "Ruthlessly concise",
      "Lead with conclusions, not process",
      "Every word must earn its place",
      "No jargon or filler phrases",
    ],
    slideLengthHint: "5-8 slides",
    keyFeatures: [
      "Maximum information density",
      "Clear decision points highlighted",
      "Skip the preamble—get to the point",
      "Designed for time-pressed executives",
    ],
  },

  "post-meeting": {
    name: "Post-Meeting Mini Deck",
    structure: [
      "Meeting context (who, when, purpose)",
      "Key discussion points recap",
      "Decisions made",
      "Action items with owners and deadlines",
      "Open questions / parking lot",
      "Next meeting or follow-up date",
    ],
    toneGuidelines: [
      "Factual and objective",
      "Focus on commitments, not opinions",
      "Use clear ownership language",
      "Include specific dates and deadlines",
    ],
    slideLengthHint: "6-10 slides",
    keyFeatures: [
      "Action item checklist format",
      "Clear owner assignments",
      "Timeline for follow-ups",
      "Quick reference for all attendees",
    ],
  },
};

export const getFormatPrinciples = (format: OutputFormat) => {
  return OUTPUT_FORMAT_PRINCIPLES[format] || OUTPUT_FORMAT_PRINCIPLES.proposal;
};
