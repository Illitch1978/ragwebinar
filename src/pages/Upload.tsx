import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText, Sparkles, ArrowRight, FileBarChart, Presentation, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

// Rubiklab Logo component
const RubiklabLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
  <div className="flex items-center gap-1.5 group cursor-pointer">
    <span className={cn(
      "font-serif font-bold tracking-tight text-foreground transition-colors duration-700 group-hover:text-primary",
      size === 'small' ? 'text-2xl' : 'text-3xl'
    )}>
      Rubiklab
    </span>
    <div className="relative flex items-center justify-center">
      <div className={cn(
        "absolute bg-primary rounded-full animate-ping opacity-20",
        size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'
      )} />
      <div className={cn(
        "bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]",
        size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'
      )} />
    </div>
  </div>
);

type OutputFormat = 'report' | 'presentation';

const UploadPage = () => {
  const [content, setContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('report');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  };

  const extractTextFromHTML = (html: string): string => {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    
    // Extract text from slides if it's a reveal.js presentation
    const slides = doc.querySelectorAll('section');
    if (slides.length > 0) {
      let content = '';
      slides.forEach((slide, index) => {
        const heading = slide.querySelector('h1, h2');
        const body = slide.querySelector('.body, .lead, p');
        const bullets = slide.querySelectorAll('li, .line');
        
        if (heading) {
          content += `## ${heading.textContent?.trim()}\n\n`;
        }
        if (body) {
          content += `${body.textContent?.trim()}\n\n`;
        }
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
    
    // Fallback: just get body text
    return doc.body?.textContent?.trim() || '';
  };

  const handleFile = async (file: File) => {
    setIsProcessingFile(true);
    
    try {
      // Text/Markdown files
      if (file.type === "text/plain" || file.type === "text/markdown" || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setContent(text);
      }
      // HTML files
      else if (file.type === "text/html" || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        const html = await file.text();
        const extractedText = extractTextFromHTML(html);
        setContent(extractedText);
      }
      // PDF files
      else if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        const extractedText = await extractTextFromPDF(file);
        setContent(extractedText);
      }
      else {
        alert("Please upload a .txt, .md, .html, or .pdf file");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert("Error processing file. Please try again.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleGenerate = () => {
    if (!content.trim()) {
      alert("Please add some content first");
      return;
    }
    
    setIsGenerating(true);
    
    // Store content in sessionStorage for the report to consume
    sessionStorage.setItem('rubiklab-content', content);
    sessionStorage.setItem('rubiklab-client', clientName || 'Client');
    sessionStorage.setItem('rubiklab-format', outputFormat);
    
    // Navigate to appropriate view after a brief animation
    setTimeout(() => {
      navigate(outputFormat === 'presentation' ? '/presentation' : '/report');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border">
        <div className="container mx-auto px-6 lg:px-16 py-6 flex justify-between items-center">
          <RubiklabLogo />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Rubiklab.ai
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-16 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12 lg:mb-16"
          >
            <h1 className="font-serif text-4xl lg:text-6xl text-foreground mb-6 tracking-tight">
              Strategic<br />
              <span className="italic text-primary">Intelligence Reports</span>
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto font-light">
              Transform your analysis into a premium presentation deck. 
              Paste your content or upload a file to begin.
            </p>
          </motion.div>

          {/* Client Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Client / Project Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client or project name..."
              className="w-full px-6 py-4 bg-card border border-border rounded-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </motion.div>

          {/* Format Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setOutputFormat('report')}
                className={cn(
                  "relative px-6 py-5 rounded-sm border-2 transition-all duration-300 text-left group",
                  outputFormat === 'report'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    outputFormat === 'report' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <FileBarChart className={cn(
                      "w-5 h-5 transition-colors",
                      outputFormat === 'report' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Strategic Report</p>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analysis deck with executive synthesis
                    </p>
                  </div>
                </div>
                {outputFormat === 'report' && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              <button
                onClick={() => setOutputFormat('presentation')}
                className={cn(
                  "relative px-6 py-5 rounded-sm border-2 transition-all duration-300 text-left group",
                  outputFormat === 'presentation'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    outputFormat === 'presentation' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <Presentation className={cn(
                      "w-5 h-5 transition-colors",
                      outputFormat === 'presentation' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Presentation</p>
                    <p className="text-sm text-muted-foreground">
                      Webinar-style slides with focused messaging
                    </p>
                  </div>
                </div>
                {outputFormat === 'presentation' && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Upload/Paste Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="mb-8"
          >
            <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
              {outputFormat === 'presentation' ? 'Slide Content' : 'Report Content'}
            </label>
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-sm p-8 mb-4 cursor-pointer transition-all duration-300",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.html,.htm,.pdf,text/plain,text/markdown,text/html,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary/20" : "bg-muted",
                  isProcessingFile && "animate-pulse"
                )}>
                  {isProcessingFile ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <UploadIcon className={cn(
                      "w-6 h-6 transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    {isProcessingFile ? "Processing file..." : "Drop your file here, or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports .txt, .md, .html, and .pdf files
                  </p>
                </div>
              </div>
            </div>

            {/* Or divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Or paste content
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Textarea */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Markdown or plain text content here...

# Executive Summary
Your strategic analysis content...

## Key Findings
- Finding 1
- Finding 2

## Recommendations
..."
              className="min-h-[300px] bg-card border-border focus:border-primary resize-none font-mono text-sm"
            />
            
            {content && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{content.length.toLocaleString()} characters</span>
              </div>
            )}
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleGenerate}
              disabled={!content.trim() || isGenerating}
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
                  Generate Presentation
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-center text-muted-foreground text-sm mt-8 font-light"
          >
            Your content will be transformed into a premium strategic report deck
          </motion.p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
          <RubiklabLogo size="small" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Rubiklab.ai © 2026
          </span>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
