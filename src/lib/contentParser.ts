// Parser for markdown/text content into structured report data

export interface ParsedSection {
  title: string;
  content: string;
  items?: { label: string; text: string }[];
  score?: number;
  level?: "HIGH" | "MODERATE" | "LOW" | "CRITICAL";
}

export interface ParsedReportData {
  clientName: string;
  clientUrl: string;
  generatedDate: string;
  scope: string;
  score: number;
  healthStatus: string;
  
  executiveSummary: string;
  keyFindings: ParsedSection[];
  recommendations: ParsedSection[];
  
  // Derived metrics
  signals: {
    label: string;
    level: "HIGH" | "MODERATE" | "LOW";
    score: number;
    variant: "default" | "critical" | "blue";
    description: string;
  }[];
  
  waterfall: {
    potential: number;
    losses: { label: string; value: number }[];
    current: number;
  };
  
  heatmap: {
    vector: string;
    maturity: "full" | "three-quarter" | "half" | "quarter";
    observation: string;
    implication: string;
  }[];
  
  matrixItems: {
    x: number;
    y: number;
    label: string;
    highlight: boolean;
  }[];
  
  auditSections: {
    title: string;
    score: number;
    status: string;
    categories: {
      title: string;
      items: { label: string; text: string }[];
    }[];
    strength: string;
    fix: string;
    fixLevel: string;
  }[];
}

// Extract sections from markdown based on headers
function extractSections(content: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = content.split('\n');
  
  let currentHeader = 'intro';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    
    if (h1Match || h2Match || h3Match) {
      // Save previous section
      if (currentContent.length > 0) {
        sections.set(currentHeader.toLowerCase(), currentContent.join('\n').trim());
      }
      currentHeader = (h1Match?.[1] || h2Match?.[1] || h3Match?.[1]) || 'intro';
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentContent.length > 0) {
    sections.set(currentHeader.toLowerCase(), currentContent.join('\n').trim());
  }
  
  return sections;
}

// Extract bullet points from content
function extractBulletPoints(content: string): string[] {
  const lines = content.split('\n');
  return lines
    .filter(line => line.match(/^[-*]\s+/))
    .map(line => line.replace(/^[-*]\s+/, '').trim());
}

// Calculate a simple score based on content analysis
function calculateScore(content: string): number {
  // Simple heuristic - can be made more sophisticated
  const wordCount = content.split(/\s+/).length;
  const hasHeadings = content.includes('#');
  const hasBullets = content.includes('- ') || content.includes('* ');
  
  let score = 50; // Base score
  if (wordCount > 500) score += 10;
  if (wordCount > 1000) score += 10;
  if (hasHeadings) score += 10;
  if (hasBullets) score += 10;
  
  return Math.min(score, 85); // Cap at 85
}

// Determine health status based on score
function getHealthStatus(score: number): string {
  if (score >= 80) return "Excellent health";
  if (score >= 60) return "Good health";
  if (score >= 40) return "Moderate health";
  return "Needs attention";
}

// Parse signals from findings
function parseSignals(findings: string[]): ParsedReportData['signals'] {
  const defaultSignals = [
    { label: "Content Quality", level: "MODERATE" as const, score: 3, variant: "default" as const, description: "Based on uploaded content structure." },
    { label: "Coverage", level: "HIGH" as const, score: 4, variant: "default" as const, description: "Key topics addressed." },
    { label: "Actionability", level: "MODERATE" as const, score: 3, variant: "blue" as const, description: "Clear next steps defined." },
    { label: "Structure", level: "HIGH" as const, score: 4, variant: "default" as const, description: "Well-organized content." },
  ];
  
  // Enhance signals based on actual findings
  if (findings.length > 0) {
    defaultSignals[0].description = findings[0]?.substring(0, 50) + "..." || defaultSignals[0].description;
  }
  
  return defaultSignals;
}

// Generate waterfall data from content
function generateWaterfall(score: number): ParsedReportData['waterfall'] {
  const gap = 100 - score;
  return {
    potential: 100,
    losses: [
      { label: "Content Gaps", value: -Math.round(gap * 0.4) },
      { label: "Structure Issues", value: -Math.round(gap * 0.3) },
      { label: "Missing Details", value: -Math.round(gap * 0.3) },
    ],
    current: score
  };
}


// Main parser function
export function parseMarkdownToReport(rawContent: string, clientName: string): ParsedReportData {
  const sections = extractSections(rawContent);
  const score = calculateScore(rawContent);
  
  // Extract key sections
  const executiveSummary = sections.get('executive summary') || 
                           sections.get('summary') || 
                           sections.get('overview') ||
                           sections.get('intro') ||
                           rawContent.substring(0, 500);
  
  const findingsContent = sections.get('key findings') || 
                          sections.get('findings') || 
                          sections.get('analysis') || "";
  const findings = extractBulletPoints(findingsContent);
  
  const recommendationsContent = sections.get('recommendations') || 
                                  sections.get('next steps') || 
                                  sections.get('action items') || "";
  const recommendations = extractBulletPoints(recommendationsContent);
  
  // Build parsed sections
  const keyFindingSections: ParsedSection[] = findings.map((finding, i) => ({
    title: `Finding ${i + 1}`,
    content: finding,
    level: i === 0 ? "HIGH" : i === 1 ? "MODERATE" : "LOW"
  }));
  
  const recommendationSections: ParsedSection[] = recommendations.map((rec, i) => ({
    title: `Recommendation ${i + 1}`,
    content: rec,
    score: 100 - (i * 10)
  }));
  
  // Generate audit sections from content
  const auditSections: ParsedReportData['auditSections'] = [];
  
  // Content analysis
  auditSections.push({
    title: "Content Analysis",
    score: Math.min(score + 5, 100),
    status: score > 60 ? "Good" : "Moderate",
    categories: [
      {
        title: "Key Insights",
        items: findings.slice(0, 3).map((f, i) => ({
          label: `Insight ${i + 1}`,
          text: f
        }))
      }
    ],
    strength: findings[0] || "Comprehensive analysis provided.",
    fix: recommendations[0] || "Continue developing content.",
    fixLevel: "priority"
  });
  
  // Recommendations section
  if (recommendations.length > 0) {
    auditSections.push({
      title: "Strategic Recommendations",
      score: Math.min(score + 10, 100),
      status: "Actionable",
      categories: [
        {
          title: "Priority Actions",
          items: recommendations.slice(0, 3).map((r, i) => ({
            label: `Action ${i + 1}`,
            text: r
          }))
        }
      ],
      strength: "Clear action items defined.",
      fix: "Implement in priority order.",
      fixLevel: "high"
    });
  }
  
  return {
    clientName: clientName || "Client Report",
    clientUrl: "",
    generatedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    scope: "Strategic analysis and recommendations based on provided content",
    score,
    healthStatus: getHealthStatus(score),
    executiveSummary,
    keyFindings: keyFindingSections,
    recommendations: recommendationSections,
    signals: parseSignals(findings),
    waterfall: generateWaterfall(score),
    heatmap: [], // Legacy heatmap removed
    matrixItems: [
      { x: 20, y: 80, label: recommendations[0]?.substring(0, 20) || "Quick Win 1", highlight: true },
      { x: 30, y: 70, label: recommendations[1]?.substring(0, 20) || "Quick Win 2", highlight: true },
      { x: 60, y: 75, label: recommendations[2]?.substring(0, 20) || "Strategic Goal", highlight: false },
      { x: 75, y: 35, label: "Long-term Vision", highlight: false },
    ],
    auditSections
  };
}

// Get report data from session storage or use defaults
export function getReportDataFromSession(): ParsedReportData | null {
  if (typeof window === 'undefined') return null;
  
  const content = sessionStorage.getItem('rubiklab-content');
  const clientName = sessionStorage.getItem('rubiklab-client') || 'Client Report';
  
  if (!content) return null;
  
  return parseMarkdownToReport(content, clientName);
}
