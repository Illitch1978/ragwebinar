import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Download, Loader2, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToPptxWithEmbeddedImages } from "@/lib/pptxImageExport";
import { exportToPdfWithImages } from "@/lib/pdfImageExport";

interface SlideImage {
  slideIndex: number;
  imageUrl: string;
}

export type ExportFormat = "pptx" | "pdf";

interface ScreenshotExporterProps {
  slideContainerRef: React.RefObject<HTMLElement>;
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  presentationTitle: string;
  isDark?: boolean;
  autoStart?: boolean;
  onComplete?: () => void;
  format?: ExportFormat;
}

export const ScreenshotExporter = ({
  slideContainerRef,
  totalSlides,
  currentSlide,
  onSlideChange,
  presentationTitle,
  isDark = false,
  autoStart = false,
  onComplete,
  format = "pptx",
}: ScreenshotExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, phase: "" });
  const [capturedSlides, setCapturedSlides] = useState<SlideImage[]>([]);
  const [exportError, setExportError] = useState<string | null>(null);
  const originalSlideRef = useRef(currentSlide);
  const hasAutoStarted = useRef(false);

  const waitForAssets = useCallback(async (root: HTMLElement) => {
    // Wait for web fonts (important for accurate capture)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docAny = document as any;
    if (docAny.fonts?.ready) {
      try {
        await docAny.fonts.ready;
      } catch {
        // ignore
      }
    }

    // Wait for images in the slide
    const imgs = Array.from(root.querySelectorAll("img"));
    if (imgs.length === 0) return;

    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            const onDone = () => {
              img.removeEventListener("load", onDone);
              img.removeEventListener("error", onDone);
              resolve();
            };
            img.addEventListener("load", onDone);
            img.addEventListener("error", onDone);
            // safety timeout
            setTimeout(onDone, 2000);
          })
      )
    );
  }, []);

  const waitForNonZeroSize = useCallback(async (el: HTMLElement) => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error("Slide container has zero size");
  }, []);

  const captureSlide = useCallback(async (): Promise<string> => {
    if (!slideContainerRef.current) throw new Error("Slide container not found");
    const element = slideContainerRef.current;

    // Ensure the target is measurable and assets are loaded
    await waitForNonZeroSize(element);
    await waitForAssets(element);

    // Let layout/AnimatePresence settle
    await new Promise((resolve) => setTimeout(resolve, 300));

    const rect = element.getBoundingClientRect();
    console.log(`Capturing slide - element size: ${rect.width}x${rect.height}`);

    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      // Monkey-patch createPattern to gracefully handle 0-sized canvases
      // instead of throwing (html2canvas bug with background patterns)
      const origCreatePattern = CanvasRenderingContext2D.prototype.createPattern;
      CanvasRenderingContext2D.prototype.createPattern = function (image: any, repetition: string | null) {
        if (image instanceof HTMLCanvasElement && (image.width === 0 || image.height === 0)) {
          return null;
        }
        return origCreatePattern.call(this, image, repetition);
      };

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#0a0a0f",
          logging: false,
          width: rect.width,
          height: rect.height,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          windowWidth: rect.width,
          windowHeight: rect.height,
          foreignObjectRendering: false,
          removeContainer: true,
          onclone: (_clonedDoc, clonedEl) => {
            // Disable animations/transitions in clone for stable capture
            const style = _clonedDoc.createElement("style");
            style.textContent = `
              *, *::before, *::after { 
                animation: none !important; 
                animation-delay: 0s !important;
                transition: none !important; 
              }
              .animate-ping { display: none !important; }
            `;
            (_clonedDoc.head || _clonedDoc.body)?.appendChild(style);

            // Force ALL elements visible — html2canvas reads inline styles,
            // so we must set them inline rather than relying on CSS cascade.
            const allEls = [clonedEl, ...Array.from(clonedEl.querySelectorAll('*'))];
            allEls.forEach((el) => {
              if (el instanceof HTMLElement) {
                // Force opacity to 1 inline (overrides framer-motion's opacity: 0)
                el.style.opacity = '1';
                // Remove transforms that may push content off-screen,
                // but preserve position/layout transforms via CSS
                el.style.transform = 'none';
              }
            });

            // Remove canvases from the clone
            _clonedDoc.querySelectorAll("canvas").forEach((c) => c.remove());
            
            // Force the cloned element to have explicit dimensions
            if (clonedEl instanceof HTMLElement) {
              clonedEl.style.width = `${rect.width}px`;
              clonedEl.style.height = `${rect.height}px`;
            }
          },
        });

        // Restore original
        CanvasRenderingContext2D.prototype.createPattern = origCreatePattern;

        console.log(`Canvas captured: ${canvas.width}x${canvas.height}`);

        // Some failures yield a 0x0 canvas; treat as error so we retry.
        if (!canvas.width || !canvas.height) {
          throw new Error("Captured canvas is empty");
        }

        return canvas.toDataURL("image/png", 1.0);
      } catch (err) {
        CanvasRenderingContext2D.prototype.createPattern = origCreatePattern;
        console.error(`Capture attempt ${attempt + 1} failed:`, err);
        lastError = err;
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      }
    }

    throw (lastError instanceof Error
      ? lastError
      : new Error("Slide capture failed"));
  }, [slideContainerRef, waitForAssets, waitForNonZeroSize]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);
    originalSlideRef.current = currentSlide;
    const slides: SlideImage[] = [];

    try {
      const slidesToCapture = Math.min(totalSlides, 3); // DEBUG: limit to 3 slides for quick testing
      setExportProgress({ current: 0, total: slidesToCapture, phase: "Capturing slides..." });

      for (let i = 0; i < slidesToCapture; i++) {
        setExportProgress({ current: i + 1, total: totalSlides, phase: "Capturing slides..." });
        
        // Navigate to the slide
        onSlideChange(i);
        
        // Wait for the slide to render and animate in
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Capture the slide
        const imageUrl = await captureSlide();
        slides.push({ slideIndex: i, imageUrl });
      }

      setCapturedSlides(slides);
      setExportProgress({ current: 0, total: totalSlides, phase: format === "pdf" ? "Generating PDF..." : "Generating PowerPoint..." });

      // Generate the output file based on format
      if (format === "pdf") {
        const { exportToPdfWithImages } = await import("@/lib/pdfImageExport");
        await exportToPdfWithImages(slides, presentationTitle, (current, total) => {
          setExportProgress({ current, total, phase: "Embedding slides..." });
        });
      } else {
        await exportToPptxWithEmbeddedImages(slides, presentationTitle, (current, total) => {
          setExportProgress({ current, total, phase: "Embedding slides..." });
        });
      }

      setExportProgress({ current: totalSlides, total: totalSlides, phase: "Complete!" });
      
      // Return to original slide
      onSlideChange(originalSlideRef.current);
      
      // Reset after a moment and call onComplete
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress({ current: 0, total: 0, phase: "" });
        setCapturedSlides([]);
        onComplete?.();
      }, 2000);

    } catch (error) {
      console.error("Export failed:", error);
      const message = error instanceof Error ? error.message : "Export failed";
      setExportError(message);
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0, phase: "" });
      onSlideChange(originalSlideRef.current);
      // Don't auto-navigate away on failure
    }
  }, [totalSlides, currentSlide, onSlideChange, captureSlide, presentationTitle, onComplete, format]);

  // Auto-start export when autoStart is true
  useEffect(() => {
    if (autoStart && !hasAutoStarted.current && totalSlides > 0) {
      hasAutoStarted.current = true;
      // Small delay to ensure slides are loaded
      setTimeout(() => {
        handleExport();
      }, 1000);
    }
  }, [autoStart, totalSlides, handleExport]);

  return (
    <>
      {/* Export Button - hidden in autoStart mode */}
      {!autoStart && (
        <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
        className={cn(
          "transition-all",
          isDark 
            ? "text-white/60 hover:text-white hover:bg-white/10" 
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Download as PowerPoint (screenshot-based)"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="ml-2 text-xs font-mono">
          {isExporting ? "Exporting..." : "Download PPT"}
        </span>
      </Button>
      )}

      {/* Export Progress Overlay */}
      <AnimatePresence>
        {(isExporting || exportError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="flex flex-col items-center gap-6">
                {exportError ? (
                  <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center">
                    <X className="w-6 h-6 text-white/70" />
                  </div>
                ) : exportProgress.phase === "Complete!" ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-mono text-white/60">
                        {exportProgress.current}/{exportProgress.total}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {exportError ? "Export failed" : exportProgress.phase || "Preparing export..."}
                  </h3>
                  <p className="text-sm text-white/60">
                    {exportError
                      ? exportError
                      : exportProgress.phase === "Complete!"
                        ? "Your PowerPoint has been downloaded!"
                        : `Processing slide ${exportProgress.current} of ${exportProgress.total}`}
                  </p>
                </div>

                {/* Progress bar */}
                {!exportError && (
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(exportProgress.current / exportProgress.total) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {exportError && (
                  <Button
                    variant="secondary"
                    onClick={() => setExportError(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                )}

                {/* Preview of captured slides */}
                {capturedSlides.length > 0 && (
                  <div className="flex gap-2 flex-wrap justify-center max-h-24 overflow-hidden">
                    {capturedSlides.slice(-6).map((slide) => (
                      <div
                        key={slide.slideIndex}
                        className="w-16 h-9 rounded overflow-hidden border border-white/20"
                      >
                        <img
                          src={slide.imageUrl}
                          alt={`Slide ${slide.slideIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScreenshotExporter;
