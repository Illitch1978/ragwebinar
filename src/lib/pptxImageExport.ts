import PptxGenJS from "pptxgenjs";

interface SlideImage {
  slideIndex: number;
  imageUrl: string;
}

// Slide dimensions (16:9 @ 10 x 5.625)
const SLIDE = {
  width: 10,
  height: 5.625,
};

/**
 * Creates a PPTX from slide screenshot images
 * Each slide is a full-bleed image for pixel-perfect accuracy
 */
export const exportToPptxFromImages = async (
  slideImages: SlideImage[],
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

  // Sort slides by index
  const sortedSlides = [...slideImages].sort((a, b) => a.slideIndex - b.slideIndex);

  for (const slideImage of sortedSlides) {
    const slide = pptx.addSlide();

    // Add the screenshot as a full-slide background image
    slide.addImage({
      path: slideImage.imageUrl,
      x: 0,
      y: 0,
      w: SLIDE.width,
      h: SLIDE.height,
      sizing: { type: "cover", w: SLIDE.width, h: SLIDE.height },
    });
  }

  // Generate filename from title
  const filename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Download the file
  await pptx.writeFile({ fileName: `${filename}.pptx` });
};

/**
 * Fetches an image and converts it to base64 for embedding
 */
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

/**
 * Creates a PPTX with embedded base64 images (no external URLs)
 */
export const exportToPptxWithEmbeddedImages = async (
  slideImages: SlideImage[],
  title: string = "Presentation",
  onProgress?: (current: number, total: number) => void
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

  // Sort slides by index
  const sortedSlides = [...slideImages].sort((a, b) => a.slideIndex - b.slideIndex);

  // Convert all images to base64 and add to slides
  for (let i = 0; i < sortedSlides.length; i++) {
    const slideImage = sortedSlides[i];
    onProgress?.(i + 1, sortedSlides.length);

    const slide = pptx.addSlide();

    try {
      // Convert URL to base64
      const base64Data = await imageUrlToBase64(slideImage.imageUrl);

      // Add the screenshot as a full-slide background image
      slide.addImage({
        data: base64Data,
        x: 0,
        y: 0,
        w: SLIDE.width,
        h: SLIDE.height,
        sizing: { type: "contain", w: SLIDE.width, h: SLIDE.height },
      });
    } catch (error) {
      console.error(`Error processing slide ${i + 1}:`, error);
      // Add a placeholder slide if image fails
      slide.background = { color: "050505" };
      slide.addText(`Slide ${i + 1} - Image failed to load`, {
        x: 1,
        y: 2.5,
        w: 8,
        h: 0.5,
        fontSize: 24,
        color: "FFFFFF",
        fontFace: "Arial",
        align: "center",
      });
    }
  }

  // Generate filename from title
  const filename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Download the file
  await pptx.writeFile({ fileName: `${filename}.pptx` });
};
