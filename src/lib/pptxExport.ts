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
}

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
  
  // Define colors
  const primaryColor = "E85D04"; // Orange primary
  const darkBg = "0A0A0F";
  const lightBg = "FAFAF8";
  const textDark = "1A1A1A";
  const textLight = "FFFFFF";

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    const isDark = slideData.dark;
    
    // Set background
    slide.background = { color: isDark ? darkBg : lightBg };
    
    const textColor = isDark ? textLight : textDark;
    const mutedColor = isDark ? "999999" : "666666";

    switch (slideData.type) {
      case "cover":
      case "title":
        // Kicker
        if (slideData.kicker) {
          slide.addText(slideData.kicker, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 0.4,
            fontSize: 10,
            color: primaryColor,
            fontFace: "Arial",
            bold: false,
          });
        }
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 2,
            w: 9,
            h: 1.5,
            fontSize: 44,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 0.6,
            fontSize: 18,
            color: mutedColor,
            fontFace: "Arial",
          });
        }
        break;

      case "section":
      case "section-divider":
        // Section number
        if (slideData.kicker) {
          slide.addText(slideData.kicker, {
            x: 0.5,
            y: 2,
            w: 1,
            h: 0.5,
            fontSize: 14,
            color: primaryColor,
            fontFace: "Courier New",
          });
        }
        // Section title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 2.5,
            w: 9,
            h: 1.5,
            fontSize: 40,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        break;

      case "text-stack":
      case "content":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        // Content
        if (slideData.content) {
          slide.addText(slideData.content, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 3.5,
            fontSize: 16,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
          });
        }
        break;

      case "bullet-list":
      case "bullets":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        // Bullets
        if (slideData.items && slideData.items.length > 0) {
          const bulletText = slideData.items.map(item => ({
            text: item.text || item.label || "",
            options: { bullet: true, color: textColor, fontSize: 16 }
          }));
          slide.addText(bulletText, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 3.5,
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
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        // Metrics
        if (slideData.metrics && slideData.metrics.length > 0) {
          const metricWidth = 9 / slideData.metrics.length;
          slideData.metrics.forEach((metric, i) => {
            // Value
            slide.addText(metric.value, {
              x: 0.5 + (i * metricWidth),
              y: 2,
              w: metricWidth - 0.2,
              h: 1,
              fontSize: 48,
              color: primaryColor,
              fontFace: "Arial",
              bold: true,
              align: "center",
            });
            // Label
            slide.addText(metric.label, {
              x: 0.5 + (i * metricWidth),
              y: 3,
              w: metricWidth - 0.2,
              h: 0.5,
              fontSize: 14,
              color: mutedColor,
              fontFace: "Arial",
              align: "center",
            });
          });
        }
        break;

      case "two-column":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        // Left column
        if (slideData.leftColumn) {
          slide.addText(slideData.leftColumn, {
            x: 0.5,
            y: 1.5,
            w: 4.25,
            h: 3.5,
            fontSize: 14,
            color: textColor,
            fontFace: "Arial",
            valign: "top",
          });
        }
        // Right column
        if (slideData.rightColumn) {
          slide.addText(slideData.rightColumn, {
            x: 5.25,
            y: 1.5,
            w: 4.25,
            h: 3.5,
            fontSize: 14,
            color: textColor,
            fontFace: "Arial",
            valign: "top",
          });
        }
        break;

      case "quote":
        // Quote text
        if (slideData.quote || slideData.title) {
          slide.addText(`"${slideData.quote || slideData.title}"`, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 2,
            fontSize: 28,
            color: textColor,
            fontFace: "Georgia",
            italic: true,
            align: "center",
            valign: "middle",
          });
        }
        // Author
        if (slideData.author) {
          slide.addText(`— ${slideData.author}`, {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 0.5,
            fontSize: 14,
            color: mutedColor,
            fontFace: "Arial",
            align: "center",
          });
        }
        break;

      case "cta":
      case "closing":
        // Title
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 2,
            w: 9,
            h: 1,
            fontSize: 44,
            color: textColor,
            fontFace: "Arial",
            bold: true,
            align: "center",
          });
        }
        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5,
            y: 3.2,
            w: 9,
            h: 0.6,
            fontSize: 18,
            color: mutedColor,
            fontFace: "Arial",
            align: "center",
          });
        }
        break;

      default:
        // Generic slide
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 28,
            color: textColor,
            fontFace: "Arial",
            bold: true,
          });
        }
        if (slideData.content) {
          slide.addText(slideData.content, {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 3.5,
            fontSize: 16,
            color: mutedColor,
            fontFace: "Arial",
            valign: "top",
          });
        }
    }

    // Add footer with branding on all slides
    slide.addText("rubiklab", {
      x: 0.5,
      y: 5.1,
      w: 2,
      h: 0.3,
      fontSize: 10,
      color: mutedColor,
      fontFace: "Arial",
    });

    // Slide number
    slide.addText(`${index + 1}`, {
      x: 9,
      y: 5.1,
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
