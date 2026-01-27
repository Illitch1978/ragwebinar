import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Upload as UploadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BrandGuideEditor from "@/components/BrandGuideEditor";
import { OUTPUT_FORMAT_OPTIONS, OutputFormat } from "./ProjectDetailsStep";
import { BrandGuide } from "@/hooks/useBrandGuides";
import { useRef, useState } from "react";

export type DeckLength = 'brief' | 'medium' | 'long' | 'very-long';

const DECK_LENGTH_OPTIONS = [
  { key: 'brief' as DeckLength, label: 'Brief', slides: '8-12' },
  { key: 'medium' as DeckLength, label: 'Medium', slides: '13-22' },
  { key: 'long' as DeckLength, label: 'Long', slides: '23-30' },
  { key: 'very-long' as DeckLength, label: 'Very Long', slides: '31-45' },
];

interface FormatOptionsStepProps {
  outputFormat: OutputFormat;
  brandGuides: BrandGuide[] | undefined;
  isLoadingBrandGuides: boolean;
  selectedBrandGuide: string;
  setSelectedBrandGuide: (value: string) => void;
  deckLength: DeckLength;
  setDeckLength: (value: DeckLength) => void;
  content: string;
  setContent: (value: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const FormatOptionsStep = ({
  outputFormat,
  brandGuides,
  isLoadingBrandGuides,
  selectedBrandGuide,
  setSelectedBrandGuide,
  deckLength,
  setDeckLength,
  content,
  setContent,
  onBack,
  onGenerate,
  isGenerating,
}: FormatOptionsStepProps) => {
  const formatConfig = OUTPUT_FORMAT_OPTIONS.find(f => f.key === outputFormat);
  const showBrandGuide = formatConfig?.needsBrandGuide ?? true;
  const showDeckOptions = formatConfig?.isSlideFormat ?? true;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const extractTextFromHTML = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    
    const slides = doc.querySelectorAll('section');
    if (slides.length > 0) {
      let content = '';
      slides.forEach((slide) => {
        const heading = slide.querySelector('h1, h2');
        const body = slide.querySelector('.body, .lead, p');
        const bullets = slide.querySelectorAll('li, .line');
        
        if (heading) content += `## ${heading.textContent?.trim()}\n\n`;
        if (body) content += `${body.textContent?.trim()}\n\n`;
        if (bullets.length > 0) {
          bullets.forEach(bullet => {
            const text = bullet.textContent?.trim();
            if (text) content += `- ${text}\n`;
          });
          content += '\n';
        }
      });
      return content.trim();
    }
    
    return doc.body?.textContent?.trim() || '';
  };

  const handleFile = async (file: File) => {
    setIsProcessingFile(true);
    try {
      if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setContent(text);
      } else if (file.type === "text/html" || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const html = await file.text();
        const extractedText = extractTextFromHTML(html);
        setContent(extractedText);
      } else {
        alert("Please upload a .txt, .md, or .html file");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert("Error processing file. Please try again.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-4"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider">Step 2</span>
        <span>•</span>
        <span className="font-medium text-foreground">{formatConfig?.label}</span>
      </motion.div>

      {/* Brand Guide Selection - only for slide-based formats */}
      {showBrandGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Brand Guide / Template
          </label>
          <Select
            value={selectedBrandGuide}
            onValueChange={setSelectedBrandGuide}
            disabled={isLoadingBrandGuides}
          >
            <SelectTrigger className="w-full bg-card border-border h-12">
              <SelectValue placeholder={isLoadingBrandGuides ? "Loading..." : "Select a brand guide"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {brandGuides?.map((guide) => (
                <SelectItem key={guide.id} value={guide.id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span>{guide.name}</span>
                    {guide.is_default && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Brand Guide Editor */}
      {showBrandGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <BrandGuideEditor 
            brandGuides={brandGuides} 
            isLoading={isLoadingBrandGuides} 
          />
        </motion.div>
      )}

      {/* Deck Length - only for slide-based formats */}
      {showDeckOptions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Deck Length
          </label>
          <div className="grid grid-cols-4 gap-3">
            {DECK_LENGTH_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setDeckLength(option.key)}
                className={cn(
                  "relative px-4 py-3 rounded-sm border-2 transition-all duration-300 text-center",
                  deckLength === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <p className="font-medium text-sm text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.slides} slides</p>
                {deckLength === option.key && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Additional Content Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Additional Content (Optional)
        </label>
        
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {/* Compact Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative px-6 py-4 cursor-pointer transition-all duration-300 border-b border-border flex items-center justify-center gap-4",
              isDragging ? "bg-primary/5" : "hover:bg-muted/30"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.html,.htm,text/plain,text/markdown,text/html"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className={cn(
              "w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 shrink-0",
              isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30",
              isProcessingFile && "animate-pulse border-primary"
            )}>
              {isProcessingFile ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <UploadIcon className={cn(
                  "w-4 h-4 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground/60"
                )} />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">
                {isProcessingFile ? "Processing file..." : "Drop file or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports .txt, .md, and .html
              </p>
            </div>
          </div>

          {/* Or divider */}
          <div className="flex items-center justify-center py-2 bg-muted/20">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Or paste additional content
            </span>
          </div>

          {/* Textarea */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add any additional context, notes, or content..."
            className="min-h-[120px] bg-transparent border-0 focus:ring-0 focus-visible:ring-0 resize-none font-mono text-sm px-6 py-5"
          />
          
          {content && (
            <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>{content.length.toLocaleString()} characters</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-between items-center pt-4"
      >
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="font-mono text-[11px] tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className={cn(
            "relative px-12 py-6 bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
            "font-mono text-[11px] font-bold tracking-[0.3em] uppercase",
            "transition-all duration-500 group",
            isGenerating && "bg-primary text-primary-foreground"
          )}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 mr-3 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              Generate
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default FormatOptionsStep;
