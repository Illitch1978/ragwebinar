import PptxGenJS from "pptxgenjs";

interface Slide {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  kicker?: string;
  items?: Array<{ label?: string; text?: string; value?: string }>;
  metrics?: Array<{ value: string; label: string; trend?: string }>;
  leftColumn?: string;
  rightColumn?: string;
  quote?: string;
  author?: string;
  dark?: boolean;
  sectionNumber?: string;
}

// Helper to add blue accent bar on left side of dark slides
const addBlueAccentBar = (slide: PptxGenJS.Slide, primaryColor: string) => {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 0.08,
    h: 5.63,
    fill: { color: primaryColor },
  });
};

// Helper to add large decorative section number
const addSectionNumber = (slide: PptxGenJS.Slide, number: string, primaryColor: string) => {
  slide.addText(number, {
    x: 6,
    y: 2.5,
    w: 4,
    h: 3,
    fontSize: 200,
    color: primaryColor,
    fontFace: "Arial",
    bold: true,
    transparency: 85,
    align: "right",
    valign: "bottom",
  });
};

export const exportToPptx = async (
  slides: Slide[],
  title: string = "Presentation"
): Promise<void> => {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = "Rubiklab";
  pptx.title = title;
  pptx.subject = title;
  pptx.company = "Rubiklab Intelligence Capital";
  
  // Set 16:9 layout
  pptx.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
  pptx.layout = "CUSTOM";
  
  // Define Rubiklab brand colors
  const primaryColor = "0A66C2"; // LinkedIn Blue
  const darkBg = "0A0A0F";
  const lightBg = "FAFAF8";
  const textDark = "1A1A1A";
  const textLight = "FFFFFF";
  const mutedLight = "AAAAAA";
  const mutedDark = "666666";
  
  // Slide types that should have dark backgrounds
  const darkSlideTypes = ["cover", "title", "section", "section-divider", "cta", "closing", "quote"];
  
  // Track section numbers
  let sectionCount = 0;

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    // Use dark background for specific slide types OR if explicitly set
    const isDark = slideData.dark || darkSlideTypes.includes(slideData.type);
    
    // Set background
    slide.background = { color: isDark ? darkBg : lightBg };
    
    const textColor = isDark ? textLight : textDark;
    const mutedColor = isDark ? mutedLight : mutedDark;

    // Add blue accent bar on dark slides
    if (isDark) {
      addBlueAccentBar(slide, primaryColor);
    }

    switch (slideData.type) {
      case "cover":
      case "title":
        // Large decorative "01" in background
        addSectionNumber(slide, "01", primaryColor);
        
        // Kicker text above title
        if (slideData.kicker) {
          slide.addText(slideData.kicker.toUpperCase(), {
            x: 0.6,
            y: 1.2,
            w: 6,
            h: 0.3,
            fontSize: 11,
            color: primaryColor,
            fontFace: "Arial",
            bold: false,
            charSpacing: 3,
          });
        }
        
        // Main title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.6,
            y: 1.6,
            w: 7,
            h: 1.8,
            fontSize: 40,
            color: textColor,
            fontFace: "Georgia",
            bold: true,
            valign: "top",
          });
        }
        
        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.6,
            y: 3.6,
            w: 6,
            h: 0.5,
            fontSize: 14,
            color: mutedColor,
            fontFace: "Arial",
          });
        }
        break;

      case "section":
      case "section-divider":
        sectionCount++;
        const sectionNum = slideData.sectionNumber || slideData.kicker || String(sectionCount).padStart(2, "0");
        
        // Large decorative section number in background
        addSectionNumber(slide, sectionNum, primaryColor);
        
        // Section number label
        slide.addText(sectionNum, {
          x: 0.6,
          y: 1.8,
          w: 1,
          h: 0.4,
          fontSize: 14,
          color: primaryColor,
          fontFace: "Courier New",
          bold: true,
        });
        
        // Section title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.6,
            y: 2.3,
            w: 7,
            h: 1.5,
            fontSize: 36,
            color: textColor,
            fontFace: "Georgia",
            bold: true,
            valign: "top",
          });
        }
        
        // Subtitle if present
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.6,
            y: 3.8,
            w: 6,
            h: 0.5,
            fontSize: 14,
            color: mutedColor,
            fontFace: "Arial",
          });
        }
        break;

      case "text-stack":
      case "content":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.4,
            w: 9,
            h: 0.7,
            fontSize: 26,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        
        // Blue underline accent
        slide.addShape("rect", {
          x: 0.5,
          y: 1.1,
          w: 0.8,
          h: 0.04,
          fill: { color: primaryColor },
        });
        
        // Content
        if (slideData.content) {
          slide.addText(slideData.content, {
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.6,
            fontSize: 15,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
            lineSpacingMultiple: 1.3,
          });
        }
        break;

      case "bullet-list":
      case "bullets":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.4,
            w: 9,
            h: 0.7,
            fontSize: 26,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        
        // Blue underline accent
        slide.addShape("rect", {
          x: 0.5,
          y: 1.1,
          w: 0.8,
          h: 0.04,
          fill: { color: primaryColor },
        });
        
        // Bullets with blue bullet points
        if (slideData.items && slideData.items.length > 0) {
          const bulletText = slideData.items.map(item => ({
            text: item.text || item.label || "",
            options: { 
              bullet: { type: "bullet" as const, color: primaryColor },
              color: textColor, 
              fontSize: 15,
              lineSpacingMultiple: 1.4,
            }
          }));
          slide.addText(bulletText, {
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.6,
            fontFace: "Arial",
            valign: "top",
          });
        }
        break;

      case "metrics":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.4,
            w: 9,
            h: 0.7,
            fontSize: 26,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        
        // Blue underline accent
        slide.addShape("rect", {
          x: 0.5,
          y: 1.1,
          w: 0.8,
          h: 0.04,
          fill: { color: primaryColor },
        });
        
        // Metrics in cards
        if (slideData.metrics && slideData.metrics.length > 0) {
          const metricWidth = 8.5 / slideData.metrics.length;
          slideData.metrics.forEach((metric, i) => {
            const xPos = 0.5 + (i * metricWidth) + (i * 0.15);
            
            // Card background
            slide.addShape("rect", {
              x: xPos,
              y: 1.6,
              w: metricWidth,
              h: 2.2,
              fill: { color: isDark ? "1A1A1F" : "F5F5F5" },
              line: { color: primaryColor, width: 0.5, dashType: "solid" },
            });
            
            // Value
            slide.addText(metric.value, {
              x: xPos,
              y: 1.9,
              w: metricWidth,
              h: 0.9,
              fontSize: 40,
              color: primaryColor,
              fontFace: "Georgia",
              bold: true,
              align: "center",
            });
            
            // Label
            slide.addText(metric.label, {
              x: xPos + 0.1,
              y: 2.9,
              w: metricWidth - 0.2,
              h: 0.6,
              fontSize: 12,
              color: mutedColor,
              fontFace: "Arial",
              align: "center",
              valign: "top",
            });
          });
        }
        break;

      case "two-column":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.4,
            w: 9,
            h: 0.7,
            fontSize: 26,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        
        // Blue underline accent
        slide.addShape("rect", {
          x: 0.5,
          y: 1.1,
          w: 0.8,
          h: 0.04,
          fill: { color: primaryColor },
        });
        
        // Vertical divider line
        slide.addShape("rect", {
          x: 4.9,
          y: 1.4,
          w: 0.02,
          h: 3.4,
          fill: { color: isDark ? "333333" : "DDDDDD" },
        });
        
        // Left column
        if (slideData.leftColumn) {
          slide.addText(slideData.leftColumn, {
            x: 0.5,
            y: 1.4,
            w: 4.2,
            h: 3.6,
            fontSize: 14,
            color: textColor,
            fontFace: "Arial",
            valign: "top",
            lineSpacingMultiple: 1.3,
          });
        }
        
        // Right column
        if (slideData.rightColumn) {
          slide.addText(slideData.rightColumn, {
            x: 5.2,
            y: 1.4,
            w: 4.2,
            h: 3.6,
            fontSize: 14,
            color: textColor,
            fontFace: "Arial",
            valign: "top",
            lineSpacingMultiple: 1.3,
          });
        }
        break;

      case "quote":
        // Large opening quote mark
        slide.addText("\u201C", {
          x: 0.6,
          y: 0.8,
          w: 1,
          h: 1,
          fontSize: 120,
          color: primaryColor,
          fontFace: "Georgia",
          transparency: 70,
        });
        
        // Quote text
        if (slideData.quote || slideData.title) {
          const quoteText = slideData.quote || slideData.title || "";
          slide.addText(quoteText, {
            x: 0.8,
            y: 1.8,
            w: 8,
            h: 2,
            fontSize: 28,
            color: textColor,
            fontFace: "Georgia",
            italic: true,
            valign: "top",
            lineSpacingMultiple: 1.2,
          });
        }
        
        // Author attribution
        if (slideData.author) {
          // Author line with blue accent
          slide.addShape("rect", {
            x: 0.8,
            y: 4.1,
            w: 0.4,
            h: 0.03,
            fill: { color: primaryColor },
          });
          
          slide.addText(slideData.author, {
            x: 1.4,
            y: 3.95,
            w: 5,
            h: 0.4,
            fontSize: 13,
            color: mutedColor,
            fontFace: "Arial",
            valign: "middle",
          });
        }
        break;

      case "cta":
      case "closing":
        // Large decorative arrow accent
        slide.addText("\u2192", {
          x: 7,
          y: 1.5,
          w: 3,
          h: 3,
          fontSize: 180,
          color: primaryColor,
          fontFace: "Arial",
          transparency: 85,
          align: "right",
        });
        
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.6,
            y: 2,
            w: 7,
            h: 1.2,
            fontSize: 36,
            color: textColor,
            fontFace: "Georgia",
            bold: true,
            valign: "middle",
          });
        }
        
        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.6,
            y: 3.3,
            w: 6,
            h: 0.5,
            fontSize: 15,
            color: mutedColor,
            fontFace: "Arial",
          });
        }
        break;

      default:
        // Generic slide with accent bar for consistency
        slide.addShape("rect", {
          x: 0.5,
          y: 1.1,
          w: 0.8,
          h: 0.04,
          fill: { color: primaryColor },
        });
        
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.4,
            w: 9,
            h: 0.7,
            fontSize: 26,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        if (slideData.content) {
          slide.addText(slideData.content, {
            x: 0.5,
            y: 1.4,
            w: 9,
            h: 3.6,
            fontSize: 15,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
            lineSpacingMultiple: 1.3,
          });
        }
    }

    // Add footer with branding on all slides
    slide.addText("rubiklab", {
      x: 0.5,
      y: 5.15,
      w: 2,
      h: 0.3,
      fontSize: 10,
      color: mutedColor,
      fontFace: "Arial",
    });
    
    // Blue dot after logo
    slide.addShape("ellipse", {
      x: 1.32,
      y: 5.28,
      w: 0.08,
      h: 0.08,
      fill: { color: primaryColor },
    });

    // Slide number
    slide.addText(`${index + 1}`, {
      x: 9,
      y: 5.15,
      w: 0.5,
      h: 0.3,
      fontSize: 10,
      color: mutedColor,
      fontFace: "Courier New",
      align: "right",
    });
  });

  // Download the file
  await pptx.writeFile({ fileName: `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pptx` });
};
