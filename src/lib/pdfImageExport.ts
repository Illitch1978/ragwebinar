import { jsPDF } from "jspdf";

interface SlideImage {
  slideIndex: number;
  imageUrl: string;
}

/**
 * Creates a landscape PDF from slide screenshot images.
 * Each slide becomes a full-bleed page.
 */
export const exportToPdfWithImages = async (
  slideImages: SlideImage[],
  title: string = "Presentation",
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  // 16:9 landscape dimensions in mm (roughly A4-landscape proportions but 16:9)
  const slideWidth = 338.67; // mm (roughly 16:9 at this scale)
  const slideHeight = 190.5;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [slideWidth, slideHeight],
  });

  const sortedSlides = [...slideImages].sort((a, b) => a.slideIndex - b.slideIndex);

  for (let i = 0; i < sortedSlides.length; i++) {
    onProgress?.(i + 1, sortedSlides.length);

    if (i > 0) {
      doc.addPage([slideWidth, slideHeight], "landscape");
    }

    try {
      doc.addImage(
        sortedSlides[i].imageUrl,
        "PNG",
        0,
        0,
        slideWidth,
        slideHeight,
        undefined,
        "FAST"
      );
    } catch (error) {
      console.error(`Error adding slide ${i + 1} to PDF:`, error);
      // Black placeholder page
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, slideWidth, slideHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text(`Slide ${i + 1} — image failed`, slideWidth / 2, slideHeight / 2, {
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
