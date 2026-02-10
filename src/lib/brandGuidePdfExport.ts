import { jsPDF } from "jspdf";

interface BrandGuideExportData {
  name: string;
  description?: string | null;
  design_system: Record<string, any>;
  slide_templates: any[];
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (doc.getTextWidth(testLine) > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function exportBrandGuideToPdf(guide: BrandGuideExportData): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primary: [number, number, number] = [10, 102, 194];
  const text: [number, number, number] = [30, 30, 30];
  const muted: [number, number, number] = [120, 120, 120];

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
    }
  };

  const sectionHeader = (title: string) => {
    checkPage(20);
    y += 6;
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 40, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primary);
    doc.text(title, margin, y);
    y += 8;
  };

  const labelValue = (label: string, value: string) => {
    checkPage(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(label.toUpperCase(), margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...text);
    const lines = wrapText(doc, value, contentWidth);
    lines.forEach(line => {
      checkPage(5);
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 3;
  };

  // ── HEADER ──
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, 4, 'F');
  y = 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...text);
  doc.text(guide.name, margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text('Design Template Specification', margin, y);
  y += 5;
  doc.text(`Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
  y += 10;

  if (guide.description) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(...text);
    const descLines = wrapText(doc, guide.description, contentWidth);
    descLines.forEach(line => { doc.text(line, margin, y); y += 5; });
    y += 5;
  }

  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const ds = guide.design_system;

  // ── OVERVIEW ──
  if (ds.theme) labelValue('Theme', ds.theme);
  if (ds.brand_intent) labelValue('Brand Intent', ds.brand_intent);
  if (ds.design_principles?.length) {
    labelValue('Design Principles', ds.design_principles.join(' • '));
  }
  if (ds.dev_summary) labelValue('Dev Summary', ds.dev_summary);

  // ── COLORS ──
  if (ds.colors) {
    sectionHeader('Colors');
    const renderColor = (name: string, value: any, indent = 0) => {
      const x = margin + indent;
      if (typeof value === 'string') {
        checkPage(8);
        doc.setFillColor(100, 100, 100);
        // Try to render color swatch
        try {
          if (value.startsWith('#')) {
            const hex = value.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            doc.setFillColor(r, g, b);
          }
        } catch { /* ignore */ }
        doc.rect(x, y - 3, 5, 5, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, y - 3, 5, 5, 'S');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...text);
        doc.text(`${name.replace(/_/g, ' ')}: ${value}`, x + 8, y);
        y += 6;
      } else if (typeof value === 'object' && value !== null) {
        if ('hex' in value) {
          renderColor(name, value.hex, indent);
          if (value.usage) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(...muted);
            doc.text(value.usage, x + 8, y);
            y += 5;
          }
        } else {
          checkPage(8);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...muted);
          doc.text(name.replace(/_/g, ' ').toUpperCase(), x, y);
          y += 5;
          Object.entries(value).forEach(([k, v]) => renderColor(k, v, indent + 4));
        }
      }
    };
    Object.entries(ds.colors).forEach(([k, v]) => renderColor(k, v));
    if (ds.color_rules?.length) {
      checkPage(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...muted);
      doc.text('COLOR RULES', margin, y);
      y += 5;
      ds.color_rules.forEach((rule: string) => {
        checkPage(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...text);
        doc.text(`• ${rule}`, margin + 2, y);
        y += 5;
      });
    }
  }

  // ── TYPOGRAPHY ──
  if (ds.typography) {
    sectionHeader('Typography');
    const typo = ds.typography;
    if (typo.font_family) labelValue('Font Family', typo.font_family);
    if (typo.headings) labelValue('Headings', typo.headings);
    if (typo.body) labelValue('Body', typo.body);
    if (typo.mono) labelValue('Mono', typo.mono);
    if (typo.hierarchy) {
      checkPage(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...muted);
      doc.text('HIERARCHY', margin, y);
      y += 5;
      Object.entries(typo.hierarchy).forEach(([level, specs]) => {
        checkPage(6);
        const specStr = Object.entries(specs as Record<string, string>).map(([k, v]) => `${k}: ${v}`).join(', ');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...text);
        doc.text(`${level}: ${specStr}`, margin + 2, y);
        y += 5;
      });
    }
    if (typo.spacing_rules?.length) {
      labelValue('Spacing Rules', typo.spacing_rules.join(' • '));
    }
  }

  // ── BUTTONS ──
  if (ds.buttons) {
    sectionHeader('Buttons');
    Object.entries(ds.buttons).forEach(([variant, spec]) => {
      if (!spec || typeof spec !== 'object') return;
      checkPage(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...text);
      doc.text(variant.charAt(0).toUpperCase() + variant.slice(1), margin, y);
      y += 5;
      Object.entries(spec as Record<string, any>).forEach(([k, v]) => {
        if (typeof v === 'string') {
          checkPage(5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...muted);
          doc.text(`${k.replace(/_/g, ' ')}: ${v}`, margin + 4, y);
          y += 4.5;
        } else if (typeof v === 'object' && v !== null) {
          Object.entries(v).forEach(([sk, sv]) => {
            checkPage(5);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...muted);
            doc.text(`${k}.${sk}: ${sv}`, margin + 4, y);
            y += 4.5;
          });
        }
      });
      y += 3;
    });
  }

  // ── ICONS ──
  const iconSpec = ds.iconography || ds.icons;
  if (iconSpec) {
    sectionHeader('Iconography');
    if (iconSpec.style) labelValue('Style', iconSpec.style);
    if (iconSpec.stroke_width) labelValue('Stroke Width', iconSpec.stroke_width);
    if (iconSpec.forbidden) labelValue('Forbidden', iconSpec.forbidden);
    if (iconSpec.sizes) {
      labelValue('Sizes', Object.entries(iconSpec.sizes).map(([k, v]) => `${k}: ${v}`).join(', '));
    }
  }

  // ── ANIMATION ──
  if (ds.animation_style) {
    sectionHeader('Animation');
    const anim = ds.animation_style;
    if (anim.name) labelValue('Style', anim.name);
    if (anim.description) labelValue('Description', anim.description);
    if (anim.entrance) {
      labelValue('Entrance', Object.entries(anim.entrance).map(([k, v]) => `${k}: ${v}`).join(', '));
    }
    if (anim.hover) {
      labelValue('Hover', Object.entries(anim.hover).map(([k, v]) => `${k}: ${v}`).join(', '));
    }
  }

  // ── EFFECTS ──
  if (ds.effects) {
    sectionHeader('Effects');
    Object.entries(ds.effects).forEach(([k, v]) => {
      checkPage(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...text);
      doc.text(`${k.replace(/_/g, ' ')}: ${v ? 'Enabled' : 'Disabled'}`, margin, y);
      y += 5;
    });
  }

  // ── WRITING STYLE ──
  if (ds.writing_style) {
    sectionHeader('Writing Style');
    if (ds.writing_style.tone?.length) labelValue('Tone', ds.writing_style.tone.join(', '));
    if (ds.writing_style.avoid?.length) labelValue('Avoid', ds.writing_style.avoid.join(', '));
  }

  // ── SLIDE TEMPLATES ──
  if (guide.slide_templates?.length) {
    sectionHeader('Slide Templates');
    guide.slide_templates.forEach((tpl: any, i: number) => {
      checkPage(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...text);
      doc.text(`${i + 1}. ${tpl.type || 'Unknown'}`, margin, y);
      y += 5;
      if (tpl.description) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...muted);
        const lines = wrapText(doc, tpl.description, contentWidth - 4);
        lines.forEach(line => { checkPage(5); doc.text(line, margin + 4, y); y += 4.5; });
      }
      if (tpl.background) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text(`Background: ${tpl.background}`, margin + 4, y);
        y += 4.5;
      }
      if (tpl.elements?.length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text(`Elements: ${tpl.elements.join(', ')}`, margin + 4, y);
        y += 4.5;
      }
      y += 3;
    });
  }

  // ── VALIDATION CHECKLIST ──
  if (ds.validation_checklist?.length) {
    sectionHeader('Validation Checklist');
    ds.validation_checklist.forEach((item: string) => {
      checkPage(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...text);
      doc.text(`☐ ${item}`, margin + 2, y);
      y += 5;
    });
  }

  // ── FOOTER ──
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...muted);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text('Rubiklab Design Template', margin, pageHeight - 10);
    const pr = `Page ${i} of ${totalPages}`;
    doc.text(pr, pageWidth - margin - doc.getTextWidth(pr), pageHeight - 10);
  }

  doc.save(`${guide.name}-design-template.pdf`);
}
