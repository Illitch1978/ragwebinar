import { domToBlob } from "modern-screenshot";
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
  const blob = await domToBlob(element, {
    scale,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  if (!blob) throw new Error("Failed to capture slide");
  return blob;
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
