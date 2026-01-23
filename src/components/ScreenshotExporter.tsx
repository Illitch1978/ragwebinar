import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Download, Loader2, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToPptxWithEmbeddedImages } from "@/lib/pptxImageExport";

interface SlideImage {
  slideIndex: number;
  imageUrl: string;
}

interface ScreenshotExporterProps {
  slideContainerRef: React.RefObject<HTMLElement>;
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
  presentationTitle: string;
  isDark?: boolean;
  autoStart?: boolean;
  onComplete?: () => void;
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
}: ScreenshotExporterProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, phase: "" });
  const [capturedSlides, setCapturedSlides] = useState<SlideImage[]>([]);
  const originalSlideRef = useRef(currentSlide);
  const hasAutoStarted = useRef(false);

  const captureSlide = useCallback(async (): Promise<string> => {
    if (!slideContainerRef.current) {
      throw new Error("Slide container not found");
    }

    const element = slideContainerRef.current;
    
    // Ensure element has dimensions
    const width = element.offsetWidth || element.clientWidth || 1920;
    const height = element.offsetHeight || element.clientHeight || 1080;
    
    if (width === 0 || height === 0) {
      console.warn("Slide container has zero dimensions, using fallback");
    }

    // Wait longer for animations and complex backgrounds to settle
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0a0f", // Fallback dark background
        logging: false,
        width: Math.max(width, 1920),
        height: Math.max(height, 1080),
        windowWidth: 1920,
        windowHeight: 1080,
        // Ignore problematic elements that cause canvas errors
        ignoreElements: (el) => {
          // Ignore elements with complex SVG patterns that break html2canvas
          if (el.tagName === 'PATTERN' || el.tagName === 'DEFS') return true;
          // Ignore ping animations which can cause issues
          if (el.classList?.contains('animate-ping')) return true;
          return false;
        },
        onclone: (clonedDoc) => {
          // Remove problematic animations from cloned document
          const pingElements = clonedDoc.querySelectorAll('.animate-ping');
          pingElements.forEach(el => el.remove());
        }
      });

      return canvas.toDataURL("image/png", 1.0);
    } catch (error) {
      console.error("html2canvas error:", error);
      // Return a fallback canvas for failed captures
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 1920;
      fallbackCanvas.height = 1080;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, 1920, 1080);
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Slide capture failed', 960, 540);
      }
      return fallbackCanvas.toDataURL("image/png", 1.0);
    }
  }, [slideContainerRef]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    originalSlideRef.current = currentSlide;
    const slides: SlideImage[] = [];

    try {
      setExportProgress({ current: 0, total: totalSlides, phase: "Capturing slides..." });

      // Capture each slide
      for (let i = 0; i < totalSlides; i++) {
        setExportProgress({ current: i + 1, total: totalSlides, phase: "Capturing slides..." });
        
        // Navigate to the slide
        onSlideChange(i);
        
        // Wait for the slide to render and animate in
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Capture the slide
        const imageUrl = await captureSlide();
        slides.push({ slideIndex: i, imageUrl });
      }

      setCapturedSlides(slides);
      setExportProgress({ current: 0, total: totalSlides, phase: "Generating PowerPoint..." });

      // Generate the PPTX
      await exportToPptxWithEmbeddedImages(slides, presentationTitle, (current, total) => {
        setExportProgress({ current, total, phase: "Embedding slides..." });
      });

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
      setIsExporting(false);
      setExportProgress({ current: 0, total: 0, phase: "" });
      onSlideChange(originalSlideRef.current);
      onComplete?.();
    }
  }, [totalSlides, currentSlide, onSlideChange, captureSlide, presentationTitle, onComplete]);

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
        {isExporting && (
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
                {exportProgress.phase === "Complete!" ? (
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
                    {exportProgress.phase || "Preparing export..."}
                  </h3>
                  <p className="text-sm text-white/60">
                    {exportProgress.phase === "Complete!"
                      ? "Your PowerPoint has been downloaded!"
                      : `Processing slide ${exportProgress.current} of ${exportProgress.total}`}
                  </p>
                </div>

                {/* Progress bar */}
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
