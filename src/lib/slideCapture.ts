import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";

export interface CapturedSlide {
  slideIndex: number;
  imageUrl: string;
  storagePath: string;
}

/**
 * Captures the current slide as a high-resolution PNG
 */
export const captureSlideElement = async (
  element: HTMLElement,
  scale: number = 2
): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, "image/png", 1.0);
  });
};

/**
 * Uploads a slide screenshot to Supabase storage
 */
export const uploadSlideScreenshot = async (
  blob: Blob,
  presentationId: string,
  slideIndex: number
): Promise<string> => {
  const filename = `${presentationId}/slide-${String(slideIndex + 1).padStart(3, "0")}.png`;

  const { data, error } = await supabase.storage
    .from("slide-screenshots")
    .upload(filename, blob, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading screenshot:", error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("slide-screenshots")
    .getPublicUrl(filename);

  return urlData.publicUrl;
};

/**
 * Cleans up slide screenshots after export
 */
export const cleanupSlideScreenshots = async (
  presentationId: string,
  slideCount: number
): Promise<void> => {
  const filesToDelete: string[] = [];

  for (let i = 0; i < slideCount; i++) {
    filesToDelete.push(
      `${presentationId}/slide-${String(i + 1).padStart(3, "0")}.png`
    );
  }

  const { error } = await supabase.storage
    .from("slide-screenshots")
    .remove(filesToDelete);

  if (error) {
    console.error("Error cleaning up screenshots:", error);
  }
};
