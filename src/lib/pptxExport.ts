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

// =============================================================================
// DESIGN TOKENS - Matching Rubiklab Swiss Design System
// =============================================================================
const COLORS = {
  primary: "0A66C2",        // LinkedIn Blue
  darkBg: "050505",         // Deep black for dark slides
  lightBg: "FAFAF8",        // Cream background
  textWhite: "FFFFFF",
  textDark: "1A1A1A",
  mutedWhite: "999999",
  mutedDark: "666666",
  borderLight: "E5E5E5",
};

// Slide dimensions (16:9 @ 10 x 5.625)
const SLIDE = {
  width: 10,
  height: 5.625,
  padding: {
    x: 0.8,
    xLarge: 1.2,
    y: 0.6,
  },
};

// =============================================================================
// HELPER FUNCTIONS - Design Elements
// =============================================================================

// Add grid pattern background (simulated with lines)
const addGridPattern = (slide: PptxGenJS.Slide, alpha: number = 0.03) => {
  const gridSize = 0.8; // inches
  const lineColor = "FFFFFF";
  const trans = Math.round((1 - alpha) * 100);
  
  // Vertical lines
  for (let x = 0; x <= SLIDE.width; x += gridSize) {
    slide.addShape("rect", {
      x: x,
      y: 0,
      w: 0.005,
      h: SLIDE.height,
      fill: { color: lineColor, transparency: trans },
      line: { color: lineColor, width: 0 },
    });
  }
  
  // Horizontal lines  
  for (let y = 0; y <= SLIDE.height; y += gridSize) {
    slide.addShape("rect", {
      x: 0,
      y: y,
      w: SLIDE.width,
      h: 0.005,
      fill: { color: lineColor, transparency: trans },
      line: { color: lineColor, width: 0 },
    });
  }
};

// Add corner frame accents for cover slides
const addCoverFrame = (slide: PptxGenJS.Slide) => {
  const cornerSize = 0.8;
  const lineWidth = 0.015;
  const color = "FFFFFF";
  
  // Top left corner
  slide.addShape("rect", { x: 0.5, y: 0.5, w: cornerSize, h: lineWidth, fill: { color, transparency: 70 } });
  slide.addShape("rect", { x: 0.5, y: 0.5, w: lineWidth, h: cornerSize, fill: { color, transparency: 70 } });
  
  // Top right corner  
  slide.addShape("rect", { x: SLIDE.width - 0.5 - cornerSize, y: 0.5, w: cornerSize, h: lineWidth, fill: { color, transparency: 70 } });
  slide.addShape("rect", { x: SLIDE.width - 0.5, y: 0.5, w: lineWidth, h: cornerSize, fill: { color, transparency: 70 } });
  
  // Bottom left corner
  slide.addShape("rect", { x: 0.5, y: SLIDE.height - 0.5, w: cornerSize, h: lineWidth, fill: { color, transparency: 80 } });
  slide.addShape("rect", { x: 0.5, y: SLIDE.height - 0.5 - cornerSize, w: lineWidth, h: cornerSize, fill: { color, transparency: 80 } });
  
  // Bottom right corner (primary color accent)
  slide.addShape("rect", { x: SLIDE.width - 0.5 - cornerSize, y: SLIDE.height - 0.5, w: cornerSize, h: lineWidth, fill: { color: COLORS.primary, transparency: 60 } });
  slide.addShape("rect", { x: SLIDE.width - 0.5, y: SLIDE.height - 0.5 - cornerSize, w: lineWidth, h: cornerSize, fill: { color: COLORS.primary, transparency: 60 } });
};

// Add corner accent for light slides
const addCornerAccent = (slide: PptxGenJS.Slide, inverted: boolean = false) => {
  const size = 0.6;
  const lineWidth = 0.01;
  const color = inverted ? "FFFFFF" : "1A1A1A";
  const trans = inverted ? 80 : 90;
  
  // Top left only
  slide.addShape("rect", { x: 0.5, y: 0.5, w: size, h: lineWidth, fill: { color, transparency: trans } });
  slide.addShape("rect", { x: 0.5, y: 0.5, w: lineWidth, h: size, fill: { color, transparency: trans } });
};

// Add large decorative background number
const addLargeNumber = (slide: PptxGenJS.Slide, number: string) => {
  slide.addText(number, {
    x: 5,
    y: 1.5,
    w: 5,
    h: 4,
    fontSize: 300,
    color: "FFFFFF",
    fontFace: "Courier New",
    bold: true,
    transparency: 97,
    align: "right",
    valign: "bottom",
  });
};

// Add vertical blue accent bar (for section dividers)
const addVerticalAccentBar = (slide: PptxGenJS.Slide) => {
  // Main accent bar
  slide.addShape("rect", {
    x: 0,
    y: SLIDE.height * 0.2,
    w: 0.06,
    h: SLIDE.height * 0.6,
    fill: { color: COLORS.primary },
  });
  
  // Horizontal extension line from bar
  slide.addShape("rect", {
    x: 0.06,
    y: SLIDE.height * 0.5,
    w: 1,
    h: 0.008,
    fill: { color: COLORS.primary, transparency: 50 },
  });
};

// Add footer logo with blue dot
const addFooter = (slide: PptxGenJS.Slide, slideNumber: number, isDark: boolean) => {
  const y = SLIDE.height - 0.4;
  
  // Logo text
  slide.addText("Rubiklab", {
    x: SLIDE.padding.xLarge,
    y: y,
    w: 1.2,
    h: 0.25,
    fontSize: 11,
    color: isDark ? "AAAAAA" : "888888",
    fontFace: "Georgia",
    bold: true,
  });
  
  // Blue dot
  slide.addShape("ellipse", {
    x: SLIDE.padding.xLarge + 0.92,
    y: y + 0.095,
    w: 0.07,
    h: 0.07,
    fill: { color: COLORS.primary },
  });
  
  // Slide number
  slide.addText(String(slideNumber).padStart(2, "0"), {
    x: SLIDE.width - 1,
    y: y,
    w: 0.6,
    h: 0.25,
    fontSize: 10,
    color: isDark ? COLORS.mutedWhite : COLORS.mutedDark,
    fontFace: "Courier New",
    align: "right",
  });
};

// Add decorative lines at bottom
const addBottomAccentLines = (slide: PptxGenJS.Slide) => {
  slide.addShape("rect", {
    x: SLIDE.padding.xLarge,
    y: SLIDE.height - 1,
    w: 0.8,
    h: 0.02,
    fill: { color: COLORS.primary },
  });
  slide.addShape("rect", {
    x: SLIDE.padding.xLarge + 0.9,
    y: SLIDE.height - 1,
    w: 0.4,
    h: 0.02,
    fill: { color: "FFFFFF", transparency: 90 },
  });
};

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================
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
  pptx.defineLayout({ name: "CUSTOM", width: SLIDE.width, height: SLIDE.height });
  pptx.layout = "CUSTOM";
  
  // Slide types that should have dark backgrounds
  const darkSlideTypes = ["cover", "title", "section", "section-divider", "cta", "closing"];
  
  // Track section numbers
  let sectionCount = 0;

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    const isDark = slideData.dark ?? darkSlideTypes.includes(slideData.type);
    
    // Set background
    slide.background = { color: isDark ? COLORS.darkBg : COLORS.lightBg };
    
    const textColor = isDark ? COLORS.textWhite : COLORS.textDark;
    const mutedColor = isDark ? COLORS.mutedWhite : COLORS.mutedDark;

    // ==========================================================================
    // COVER / TITLE SLIDE
    // ==========================================================================
    if (slideData.type === "cover" || slideData.type === "title") {
      sectionCount++;
      const sectionNum = slideData.kicker || String(sectionCount).padStart(2, "0");
      
      // Background elements
      addGridPattern(slide, 0.03);
      addLargeNumber(slide, sectionNum);
      addCoverFrame(slide);
      
      // Kicker with line
      if (slideData.kicker) {
        slide.addShape("rect", {
          x: SLIDE.padding.xLarge,
          y: 1.4,
          w: 0.4,
          h: 0.015,
          fill: { color: COLORS.primary },
        });
        slide.addText(slideData.kicker.toUpperCase(), {
          x: SLIDE.padding.xLarge + 0.5,
          y: 1.32,
          w: 4,
          h: 0.25,
          fontSize: 9,
          color: COLORS.primary,
          fontFace: "Courier New",
          charSpacing: 4,
        });
      }
      
      // Main title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.6,
          w: 7,
          h: 1.6,
          fontSize: 44,
          color: COLORS.textWhite,
          fontFace: "Georgia",
          bold: true,
          valign: "top",
          lineSpacingMultiple: 0.95,
        });
      }
      
      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: SLIDE.padding.xLarge,
          y: 3.3,
          w: 6,
          h: 0.5,
          fontSize: 16,
          color: COLORS.mutedWhite,
          fontFace: "Arial",
        });
      }
      
      // Date/meta dot
      slide.addShape("ellipse", {
        x: SLIDE.padding.xLarge,
        y: 3.9,
        w: 0.08,
        h: 0.08,
        fill: { color: COLORS.primary },
      });
      slide.addText(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(), {
        x: SLIDE.padding.xLarge + 0.15,
        y: 3.82,
        w: 3,
        h: 0.25,
        fontSize: 9,
        color: COLORS.mutedWhite,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Bottom accent lines
      addBottomAccentLines(slide);
      
      // Right side accent line
      slide.addShape("rect", {
        x: SLIDE.width - 0.02,
        y: 0,
        w: 0.02,
        h: SLIDE.height,
        fill: { color: COLORS.primary, transparency: 80 },
      });
      
      addFooter(slide, index + 1, true);
    }
    
    // ==========================================================================
    // SECTION / SECTION-DIVIDER SLIDE
    // ==========================================================================
    else if (slideData.type === "section" || slideData.type === "section-divider") {
      sectionCount++;
      const sectionNum = slideData.kicker || String(sectionCount).padStart(2, "0");
      
      // Background elements
      addGridPattern(slide, 0.02);
      addLargeNumber(slide, sectionNum);
      addVerticalAccentBar(slide);
      
      // Section label
      slide.addText(`Section ${sectionNum}`, {
        x: SLIDE.padding.xLarge,
        y: 1.8,
        w: 2,
        h: 0.3,
        fontSize: 9,
        color: COLORS.primary,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Main title
      if (slideData.title) {
        slide.addText(slideData.title + ".", {
          x: SLIDE.padding.xLarge,
          y: 2.2,
          w: 7,
          h: 1.4,
          fontSize: 48,
          color: COLORS.textWhite,
          fontFace: "Georgia",
          bold: true,
          valign: "top",
        });
      }
      
      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: SLIDE.padding.xLarge,
          y: 3.7,
          w: 6,
          h: 0.5,
          fontSize: 16,
          color: COLORS.mutedWhite,
          fontFace: "Arial",
        });
      }
      
      // Bottom accent lines
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 4.5,
        w: 0.8,
        h: 0.02,
        fill: { color: COLORS.primary },
      });
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge + 0.9,
        y: 4.5,
        w: 0.3,
        h: 0.02,
        fill: { color: "FFFFFF", transparency: 80 },
      });
      
      addFooter(slide, index + 1, true);
    }
    
    // ==========================================================================
    // TEXT-STACK / CONTENT SLIDE
    // ==========================================================================
    else if (slideData.type === "text-stack" || slideData.type === "content") {
      addCornerAccent(slide);
      
      // Kicker with line
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 0.8,
        w: 0.3,
        h: 0.015,
        fill: { color: COLORS.primary },
      });
      slide.addText("INSIGHT", {
        x: SLIDE.padding.xLarge + 0.4,
        y: 0.72,
        w: 2,
        h: 0.25,
        fontSize: 9,
        color: mutedColor,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.1,
          w: 8,
          h: 1,
          fontSize: 36,
          color: textColor,
          fontFace: "Georgia",
          bold: true,
          valign: "top",
        });
      }
      
      // Content with items
      if (slideData.items && slideData.items.length > 0) {
        slideData.items.forEach((item, idx) => {
          const yPos = 2.3 + (idx * 0.7);
          
          // Left border accent
          slide.addShape("rect", {
            x: SLIDE.padding.xLarge,
            y: yPos,
            w: 0.02,
            h: 0.5,
            fill: { color: COLORS.primary, transparency: 70 },
          });
          
          // Label
          if (item.label) {
            slide.addText(item.label.toUpperCase(), {
              x: SLIDE.padding.xLarge + 0.2,
              y: yPos,
              w: 2,
              h: 0.2,
              fontSize: 8,
              color: COLORS.primary,
              fontFace: "Courier New",
              charSpacing: 2,
            });
          }
          
          // Text
          slide.addText(item.text || item.value || "", {
            x: SLIDE.padding.xLarge + 0.2,
            y: yPos + (item.label ? 0.25 : 0),
            w: 7,
            h: 0.4,
            fontSize: 14,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
          });
        });
      } else if (slideData.content) {
        slide.addText(slideData.content, {
          x: SLIDE.padding.xLarge,
          y: 2.2,
          w: 8,
          h: 2.5,
          fontSize: 16,
          color: mutedColor,
          fontFace: "Arial",
          valign: "top",
          lineSpacingMultiple: 1.4,
        });
      }
      
      addFooter(slide, index + 1, false);
    }
    
    // ==========================================================================
    // BULLET-LIST / BULLETS SLIDE
    // ==========================================================================
    else if (slideData.type === "bullet-list" || slideData.type === "bullets") {
      addCornerAccent(slide);
      
      // Kicker
      slide.addText("KEY POINTS", {
        x: SLIDE.padding.xLarge,
        y: 0.7,
        w: 2,
        h: 0.25,
        fontSize: 9,
        color: mutedColor,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.0,
          w: 8,
          h: 0.9,
          fontSize: 36,
          color: textColor,
          fontFace: "Georgia",
          bold: true,
          valign: "top",
        });
      }
      
      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: SLIDE.padding.xLarge,
          y: 1.8,
          w: 6,
          h: 0.3,
          fontSize: 14,
          color: mutedColor,
          fontFace: "Arial",
        });
      }
      
      // Items in 2-column grid
      if (slideData.items && slideData.items.length > 0) {
        const startY = slideData.subtitle ? 2.3 : 2.0;
        const colWidth = 4;
        const itemHeight = 0.65;
        
        slideData.items.forEach((item, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const xPos = SLIDE.padding.xLarge + (col * (colWidth + 0.3));
          const yPos = startY + (row * itemHeight);
          
          // Left border accent
          slide.addShape("rect", {
            x: xPos,
            y: yPos,
            w: 0.02,
            h: 0.45,
            fill: { color: COLORS.primary, transparency: 70 },
          });
          
          // Value if present
          if (item.value) {
            slide.addText(item.value, {
              x: xPos + 0.15,
              y: yPos,
              w: colWidth - 0.2,
              h: 0.25,
              fontSize: 14,
              color: COLORS.primary,
              fontFace: "Georgia",
              bold: true,
            });
          }
          
          // Text
          slide.addText(item.text || item.label || "", {
            x: xPos + 0.15,
            y: yPos + (item.value ? 0.22 : 0),
            w: colWidth - 0.2,
            h: 0.35,
            fontSize: 12,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
          });
        });
      }
      
      addFooter(slide, index + 1, false);
    }
    
    // ==========================================================================
    // METRICS SLIDE
    // ==========================================================================
    else if (slideData.type === "metrics") {
      addCornerAccent(slide);
      
      // Kicker with line
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 0.8,
        w: 0.3,
        h: 0.015,
        fill: { color: COLORS.primary },
      });
      slide.addText("KEY METRICS", {
        x: SLIDE.padding.xLarge + 0.4,
        y: 0.72,
        w: 2,
        h: 0.25,
        fontSize: 9,
        color: mutedColor,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.1,
          w: 7,
          h: 0.8,
          fontSize: 36,
          color: textColor,
          fontFace: "Georgia",
          bold: true,
        });
      }
      
      // Metrics in grid
      if (slideData.metrics && slideData.metrics.length > 0) {
        const metricWidth = 2;
        const startX = SLIDE.padding.xLarge;
        
        slideData.metrics.slice(0, 4).forEach((metric, idx) => {
          const xPos = startX + (idx * (metricWidth + 0.3));
          
          // Left border accent
          slide.addShape("rect", {
            x: xPos,
            y: 2.2,
            w: 0.02,
            h: 1.5,
            fill: { color: COLORS.primary, transparency: 70 },
          });
          
          // Value
          slide.addText(metric.value, {
            x: xPos + 0.2,
            y: 2.2,
            w: metricWidth - 0.3,
            h: 0.8,
            fontSize: 36,
            color: COLORS.primary,
            fontFace: "Courier New",
            bold: true,
          });
          
          // Label
          slide.addText(metric.label, {
            x: xPos + 0.2,
            y: 3.0,
            w: metricWidth - 0.3,
            h: 0.6,
            fontSize: 11,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
          });
          
          // Trend if present
          if (metric.trend) {
            slide.addText(metric.trend, {
              x: xPos + 0.2,
              y: 3.5,
              w: metricWidth - 0.3,
              h: 0.25,
              fontSize: 9,
              color: COLORS.primary,
              fontFace: "Arial",
            });
          }
        });
      }
      
      addFooter(slide, index + 1, false);
    }
    
    // ==========================================================================
    // TWO-COLUMN SLIDE
    // ==========================================================================
    else if (slideData.type === "two-column") {
      addCornerAccent(slide);
      
      // Kicker with line
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 0.8,
        w: 0.3,
        h: 0.015,
        fill: { color: COLORS.primary },
      });
      slide.addText("ANALYSIS", {
        x: SLIDE.padding.xLarge + 0.4,
        y: 0.72,
        w: 2,
        h: 0.25,
        fontSize: 9,
        color: mutedColor,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.1,
          w: 8,
          h: 0.8,
          fontSize: 36,
          color: textColor,
          fontFace: "Georgia",
          bold: true,
        });
      }
      
      // Divider line
      slide.addShape("rect", {
        x: 4.85,
        y: 2.1,
        w: 0.01,
        h: 2.8,
        fill: { color: COLORS.borderLight },
      });
      
      // Left column
      if (slideData.leftColumn) {
        slide.addText(slideData.leftColumn, {
          x: SLIDE.padding.xLarge,
          y: 2.1,
          w: 3.8,
          h: 2.8,
          fontSize: 13,
          color: textColor,
          fontFace: "Arial",
          valign: "top",
          lineSpacingMultiple: 1.4,
        });
      }
      
      // Right column
      if (slideData.rightColumn) {
        slide.addText(slideData.rightColumn, {
          x: 5.1,
          y: 2.1,
          w: 3.8,
          h: 2.8,
          fontSize: 13,
          color: textColor,
          fontFace: "Arial",
          valign: "top",
          lineSpacingMultiple: 1.4,
        });
      }
      
      addFooter(slide, index + 1, false);
    }
    
    // ==========================================================================
    // QUOTE SLIDE
    // ==========================================================================
    else if (slideData.type === "quote") {
      const quoteText = slideData.quote || slideData.title || "";
      const authorText = slideData.author || slideData.subtitle || "";
      
      // Light background with subtle accent
      slide.background = { color: COLORS.lightBg };
      
      // Decorative corner
      slide.addShape("rect", {
        x: 0.8,
        y: 0.8,
        w: 0.8,
        h: 0.015,
        fill: { color: COLORS.primary, transparency: 90 },
      });
      slide.addShape("rect", {
        x: 0.8,
        y: 0.8,
        w: 0.015,
        h: 0.8,
        fill: { color: COLORS.primary, transparency: 90 },
      });
      
      // Large opening quote mark
      slide.addText("\u201C", {
        x: 0.6,
        y: 0.6,
        w: 1.5,
        h: 1.5,
        fontSize: 140,
        color: COLORS.primary,
        fontFace: "Georgia",
        transparency: 75,
      });
      
      // Quote text
      slide.addText(quoteText, {
        x: SLIDE.padding.xLarge,
        y: 1.8,
        w: 6,
        h: 2,
        fontSize: 26,
        color: COLORS.textDark,
        fontFace: "Georgia",
        valign: "top",
        lineSpacingMultiple: 1.2,
      });
      
      // Author attribution
      if (authorText) {
        // Divider line
        slide.addShape("rect", {
          x: SLIDE.padding.xLarge,
          y: 4.0,
          w: 2,
          h: 0.01,
          fill: { color: COLORS.primary, transparency: 90 },
        });
        
        // Author name
        const authorParts = authorText.split(",");
        slide.addText(authorParts[0].trim(), {
          x: SLIDE.padding.xLarge,
          y: 4.15,
          w: 4,
          h: 0.3,
          fontSize: 14,
          color: COLORS.textDark,
          fontFace: "Arial",
          bold: true,
        });
        
        // Author title if present
        if (authorParts.length > 1) {
          slide.addText(authorParts.slice(1).join(",").trim(), {
            x: SLIDE.padding.xLarge,
            y: 4.4,
            w: 4,
            h: 0.25,
            fontSize: 11,
            color: COLORS.mutedDark,
            fontFace: "Arial",
          });
        }
      }
      
      // Decorative line
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 4.85,
        w: 0.5,
        h: 0.01,
        fill: { color: COLORS.primary },
      });
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge + 0.55,
        y: 4.85,
        w: 0.25,
        h: 0.01,
        fill: { color: COLORS.primary, transparency: 70 },
      });
      
      // Right side decorative panel
      slide.addShape("rect", {
        x: 7,
        y: 0,
        w: 3,
        h: SLIDE.height,
        fill: { color: COLORS.primary, transparency: 97 },
      });
      
      // Bottom right corner accent
      slide.addShape("rect", {
        x: SLIDE.width - 1.3,
        y: SLIDE.height - 0.015,
        w: 0.8,
        h: 0.015,
        fill: { color: COLORS.primary, transparency: 90 },
      });
      slide.addShape("rect", {
        x: SLIDE.width - 0.015,
        y: SLIDE.height - 1.3,
        w: 0.015,
        h: 0.8,
        fill: { color: COLORS.primary, transparency: 90 },
      });
      
      addFooter(slide, index + 1, false);
    }
    
    // ==========================================================================
    // CTA / CLOSING SLIDE
    // ==========================================================================
    else if (slideData.type === "cta" || slideData.type === "closing") {
      // Background elements
      addGridPattern(slide, 0.03);
      addCornerAccent(slide, true);
      
      // Bottom right corner accent
      slide.addShape("rect", {
        x: SLIDE.width - 1.1,
        y: SLIDE.height - 0.5,
        w: 0.6,
        h: 0.01,
        fill: { color: "FFFFFF", transparency: 80 },
      });
      slide.addShape("rect", {
        x: SLIDE.width - 0.5,
        y: SLIDE.height - 1.1,
        w: 0.01,
        h: 0.6,
        fill: { color: "FFFFFF", transparency: 80 },
      });
      
      // Title centered
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: 0,
          y: 2,
          w: SLIDE.width,
          h: 1.2,
          fontSize: 52,
          color: COLORS.textWhite,
          fontFace: "Georgia",
          bold: true,
          align: "center",
          valign: "middle",
        });
      }
      
      // Subtitle
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0,
          y: 3.3,
          w: SLIDE.width,
          h: 0.5,
          fontSize: 16,
          color: COLORS.mutedWhite,
          fontFace: "Arial",
          align: "center",
        });
      }
      
      // Decorative centered lines
      slide.addShape("rect", {
        x: (SLIDE.width - 1.5) / 2,
        y: 4.2,
        w: 0.5,
        h: 0.02,
        fill: { color: COLORS.primary },
      });
      slide.addShape("rect", {
        x: (SLIDE.width - 1.5) / 2 + 0.6,
        y: 4.2,
        w: 0.5,
        h: 0.02,
        fill: { color: COLORS.primary },
      });
      
      addFooter(slide, index + 1, true);
    }
    
    // ==========================================================================
    // DEFAULT / GENERIC SLIDE
    // ==========================================================================
    else {
      addCornerAccent(slide);
      
      // Kicker with line
      slide.addShape("rect", {
        x: SLIDE.padding.xLarge,
        y: 0.8,
        w: 0.3,
        h: 0.015,
        fill: { color: COLORS.primary },
      });
      slide.addText("INSIGHT", {
        x: SLIDE.padding.xLarge + 0.4,
        y: 0.72,
        w: 2,
        h: 0.25,
        fontSize: 9,
        color: mutedColor,
        fontFace: "Courier New",
        charSpacing: 3,
      });
      
      // Title
      if (slideData.title) {
        slide.addText(slideData.title, {
          x: SLIDE.padding.xLarge,
          y: 1.1,
          w: 8,
          h: 1,
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
          x: SLIDE.padding.xLarge,
          y: 2.1,
          w: 6,
          h: 0.4,
          fontSize: 16,
          color: COLORS.primary,
          fontFace: "Arial",
          bold: true,
        });
      }
      
      // Content
      if (slideData.content) {
        slide.addText(slideData.content, {
          x: SLIDE.padding.xLarge,
          y: slideData.subtitle ? 2.6 : 2.2,
          w: 8,
          h: 2.5,
          fontSize: 16,
          color: mutedColor,
          fontFace: "Arial",
          valign: "top",
          lineSpacingMultiple: 1.4,
        });
      }
      
      addFooter(slide, index + 1, false);
    }
  });

  // Download the file
  await pptx.writeFile({ fileName: `${title.replace(/[^a-zA-Z0-9]/g, "_")}.pptx` });
};
