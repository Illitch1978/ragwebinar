import { jsPDF } from "jspdf";

interface ProposalExportOptions {
  title: string;
  clientName?: string;
  content: string;
  createdBy?: string;
  termsAndConditions?: string;
}

// Parse markdown-like content into structured sections
function parseContent(content: string) {
  const lines = content.split('\n');
  const sections: { type: 'heading' | 'subheading' | 'paragraph' | 'bullet'; text: string }[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('# ')) {
      sections.push({ type: 'heading', text: trimmed.slice(2) });
    } else if (trimmed.startsWith('## ')) {
      sections.push({ type: 'subheading', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('### ')) {
      sections.push({ type: 'subheading', text: trimmed.slice(4) });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      sections.push({ type: 'bullet', text: trimmed.slice(2) });
    } else if (/^\d+\.\s/.test(trimmed)) {
      sections.push({ type: 'bullet', text: trimmed.replace(/^\d+\.\s/, '') });
    } else {
      sections.push({ type: 'paragraph', text: trimmed });
    }
  }
  
  return sections;
}

// Wrap text to fit within a given width
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

export async function exportProposalToPdf(options: ProposalExportOptions): Promise<void> {
  const { title, clientName, content, createdBy, termsAndConditions } = options;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  
  const primaryColor: [number, number, number] = [10, 102, 194]; // LinkedIn Blue
  const textColor: [number, number, number] = [30, 30, 30];
  const mutedColor: [number, number, number] = [120, 120, 120];
  
  // Helper to check if we need a new page
  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };
  
  // ========== HEADER ==========
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 4, 'F');
  y = 30;
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...textColor);
  const titleLines = wrapText(doc, title || 'Proposal', contentWidth);
  titleLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 10;
  });
  
  // Client name
  if (clientName) {
    y += 2;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(...mutedColor);
    doc.text(`Prepared for: ${clientName}`, margin, y);
    y += 8;
  }
  
  // Date
  y += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  const dateStr = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Date: ${dateStr}`, margin, y);
  y += 15;
  
  // Horizontal line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  // ========== CONTENT ==========
  const sections = parseContent(content);
  
  for (const section of sections) {
    switch (section.type) {
      case 'heading':
        checkNewPage(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        const headingLines = wrapText(doc, section.text, contentWidth);
        headingLines.forEach((line) => {
          doc.text(line, margin, y);
          y += 7;
        });
        y += 5;
        break;
        
      case 'subheading':
        checkNewPage(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...textColor);
        const subLines = wrapText(doc, section.text, contentWidth);
        subLines.forEach((line) => {
          doc.text(line, margin, y);
          y += 6;
        });
        y += 4;
        break;
        
      case 'bullet':
        checkNewPage(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        const bulletLines = wrapText(doc, section.text, contentWidth - 10);
        bulletLines.forEach((line, i) => {
          if (i === 0) {
            doc.text('•', margin + 2, y);
          }
          doc.text(line, margin + 8, y);
          y += 5;
        });
        y += 2;
        break;
        
      case 'paragraph':
      default:
        checkNewPage(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...textColor);
        const paraLines = wrapText(doc, section.text, contentWidth);
        paraLines.forEach((line) => {
          doc.text(line, margin, y);
          y += 5;
        });
        y += 4;
        break;
    }
  }
  
  // ========== TERMS AND CONDITIONS ==========
  if (termsAndConditions) {
    checkNewPage(50);
    y += 10;
    
    doc.setDrawColor(...mutedColor);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    doc.text('Terms and Conditions', margin, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    const tcLines = wrapText(doc, termsAndConditions, contentWidth);
    tcLines.forEach((line) => {
      checkNewPage(5);
      doc.text(line, margin, y);
      y += 4;
    });
    y += 10;
  }
  
  // ========== SIGNATURE BLOCK ==========
  checkNewPage(60);
  y += 10;
  
  doc.setDrawColor(...mutedColor);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text('Client Approval', margin, y);
  y += 12;
  
  // Signature line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  
  const signatureY = y + 15;
  doc.setDrawColor(...textColor);
  doc.setLineWidth(0.5);
  doc.line(margin, signatureY, margin + 80, signatureY);
  doc.text('Signature', margin, signatureY + 5);
  
  // Date line
  doc.line(pageWidth - margin - 50, signatureY, pageWidth - margin, signatureY);
  doc.text('Date', pageWidth - margin - 50, signatureY + 5);
  
  y = signatureY + 15;
  
  // Name line
  doc.line(margin, y, margin + 80, y);
  doc.text('Printed Name', margin, y + 5);
  
  // Title line
  doc.line(pageWidth - margin - 80, y, pageWidth - margin, y);
  doc.text('Title', pageWidth - margin - 80, y + 5);
  
  // ========== FOOTER ==========
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(...mutedColor);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    
    const footerLeft = createdBy ? `Prepared by ${createdBy}` : 'Powered by Rubiklab';
    doc.text(footerLeft, margin, pageHeight - 10);
    
    const footerRight = `Page ${i} of ${totalPages}`;
    const footerRightWidth = doc.getTextWidth(footerRight);
    doc.text(footerRight, pageWidth - margin - footerRightWidth, pageHeight - 10);
  }
  
  // Download the file
  doc.save(`${title || 'proposal'}.pdf`);
}
