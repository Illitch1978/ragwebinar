import { jsPDF } from "jspdf";

interface SlideImage {
  slideIndex: number;
  imageUrl: string;
}

/**
 * Gets the natural dimensions of a base64/data-URL image
 */
const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1920, height: 1080 }); // fallback
    img.src = dataUrl;
  });
};

/**
 * Creates a landscape PDF from slide screenshot images.
 * Each slide becomes a full-bleed page sized to match the captured image aspect ratio.
 */
export const exportToPdfWithImages = async (
  slideImages: SlideImage[],
  title: string = "Presentation",
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  const sortedSlides = [...slideImages].sort((a, b) => a.slideIndex - b.slideIndex);

  if (sortedSlides.length === 0) return;

  // Determine page size from first slide
  const firstDims = await getImageDimensions(sortedSlides[0].imageUrl);
  // Convert pixels to mm (1px ≈ 0.264583mm at 96dpi)
  const pxToMm = 0.264583;
  const pageW = firstDims.width * pxToMm;
  const pageH = firstDims.height * pxToMm;

  const doc = new jsPDF({
    orientation: pageW > pageH ? "landscape" : "portrait",
    unit: "mm",
    format: [Math.min(pageW, pageH), Math.max(pageW, pageH)],
  });

  for (let i = 0; i < sortedSlides.length; i++) {
    onProgress?.(i + 1, sortedSlides.length);

    if (i > 0) {
      doc.addPage([Math.min(pageW, pageH), Math.max(pageW, pageH)], pageW > pageH ? "landscape" : "portrait");
    }

    try {
      doc.addImage(
        sortedSlides[i].imageUrl,
        "PNG",
        0,
        0,
        pageW,
        pageH,
        undefined,
        "FAST"
      );
    } catch (error) {
      console.error(`Error adding slide ${i + 1} to PDF:`, error);
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, pageW, pageH, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text(`Slide ${i + 1} — image failed`, pageW / 2, pageH / 2, {
        align: "center",
      });
    }
  }

  const filename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  doc.save(`${filename}.pdf`);
};
