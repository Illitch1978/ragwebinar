import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";

interface ExportOptions {
  title: string;
  clientName?: string;
  content: string;
  format: 'article' | 'executive-summary';
  createdBy?: string;
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

export async function exportToDocx(options: ExportOptions): Promise<void> {
  const { title, clientName, content, format, createdBy } = options;
  
  const sections = parseContent(content);
  const children: Paragraph[] = [];
  
  // Document title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title || (format === 'executive-summary' ? 'Executive Summary' : 'Thought Leadership'),
          bold: true,
          size: 48, // 24pt
          font: "Georgia",
        }),
      ],
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Client name subtitle
  if (clientName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: clientName,
            italics: true,
            size: 28,
            color: "666666",
          }),
        ],
        spacing: { after: 600 },
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  // Horizontal rule
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: "CCCCCC",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  // Content sections
  for (const section of sections) {
    switch (section.type) {
      case 'heading':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                bold: true,
                size: 36, // 18pt
                font: "Georgia",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          })
        );
        break;
        
      case 'subheading':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                bold: true,
                size: 28, // 14pt
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          })
        );
        break;
        
      case 'bullet':
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${section.text}`,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
            indent: { left: 720 }, // 0.5 inch
          })
        );
        break;
        
      case 'paragraph':
      default:
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                size: 24, // 12pt
              }),
            ],
            spacing: { after: 200 },
          })
        );
        break;
    }
  }
  
  // Footer with creator and date
  children.push(
    new Paragraph({
      border: {
        top: {
          color: "CCCCCC",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      spacing: { before: 600 },
    })
  );
  
  const footerText = [
    createdBy ? `Created by ${createdBy}` : null,
    `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    'Powered by Rubiklab',
  ].filter(Boolean).join(' | ');
  
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: footerText,
          size: 18,
          color: "999999",
          italics: true,
        }),
      ],
      spacing: { before: 200 },
      alignment: AlignmentType.CENTER,
    })
  );
  
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });
  
  const blob = await Packer.toBlob(doc);
  
  // Download the file
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title || 'document'}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
