import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Upload as UploadIcon, FileText, Search, Database, Filter, File } from "lucide-react";
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
export type ArticlePersona = 'strategist' | 'operator' | 'storyteller' | 'sharp-edge' | 'marketing-guru';
export type WordCountRange = '400' | '600' | '800' | '1000';

const DECK_LENGTH_OPTIONS = [
  { key: 'brief' as DeckLength, label: 'Brief', slides: '8-12' },
  { key: 'medium' as DeckLength, label: 'Medium', slides: '13-22' },
  { key: 'long' as DeckLength, label: 'Long', slides: '23-30' },
  { key: 'very-long' as DeckLength, label: 'Very Long', slides: '31-45' },
];

export const ARTICLE_PERSONA_OPTIONS = [
  { 
    key: 'strategist' as ArticlePersona, 
    label: 'The Strategist',
    description: 'Deliberate, structured, directional. Frames ideas around purpose, trade-offs, and long-term positioning. Builds arguments step by step with calm authority.',
    styleSheet: 'This voice is deliberate, structured, and directional. It frames ideas around purpose, trade-offs, and long-term positioning rather than tactics or trends. Writing flows from first principles, defining the problem space before introducing options, implications, and consequences. Arguments are built step by step, often using contrast between what is tempting and what is strategically sound. The tone is calm, authoritative, and grounded in logic rather than persuasion. Language avoids hype and favors clarity, precision, and disciplined reasoning. The reader should feel guided through a map of the terrain, understanding not just what to do, but why it matters, what it costs, and how it shapes future advantage.',
  },
  { 
    key: 'operator' as ArticlePersona, 
    label: 'The Operator',
    description: 'Practical, grounded, focused on execution. Values what works over abstraction. Centers on process, outcomes, and real-world constraints.',
    styleSheet: 'This voice is practical, grounded, and focused on execution. It values what works over what sounds good, and evidence over abstraction. Writing centers on process, outcomes, and real-world constraints, highlighting how ideas survive contact with reality. The tone is clear, direct, and quietly confident, often using concrete examples, patterns, and lessons learned. Complexity is not avoided, but it is broken into manageable steps and decisions. Language favors action verbs, measurable impact, and operational clarity. The reader should come away with a sense of momentum and applicability, feeling that insights can be tested, applied, and refined in real situations rather than admired from a distance.',
  },
  { 
    key: 'storyteller' as ArticlePersona, 
    label: 'The Storyteller',
    description: 'Leads with narrative and human experience. Ideas introduced through scenes and moments. Confident but inviting, designed to draw readers in.',
    styleSheet: 'This voice leads with narrative and human experience. Ideas are introduced through scenes, characters, or moments before being unpacked into insight. Writing flows with rhythm and pacing, using contrast, tension, and resolution to keep the reader engaged. Abstract concepts are grounded in relatable examples, metaphors, or historical parallels. The tone is confident but inviting, designed to draw the reader into a journey rather than deliver a lecture. Language is vivid without being decorative, purposeful without being dry. The reader should feel carried through the argument, remembering the message not just as information, but as a story that lingers and connects emotionally.',
  },
  { 
    key: 'sharp-edge' as ArticlePersona, 
    label: 'The Sharp Edge',
    description: 'Bold, challenging, deliberately contrarian. Questions assumptions and exposes weak logic. Confident and unapologetic with crisp language.',
    styleSheet: 'This voice is bold, challenging, and deliberately contrarian. It questions assumptions, exposes weak logic, and highlights uncomfortable truths. Writing often sets up a dominant view only to dismantle it with reasoning, examples, or counterintuitive insight. The tone is confident and unapologetic, but not careless, grounded in clarity rather than provocation for its own sake. Language is crisp, sometimes pointed, favoring strong statements over soft qualifiers. The reader should feel unsettled in a productive way, prompted to re-examine beliefs and notice risks, blind spots, or opportunities that conventional thinking tends to ignore.',
  },
  { 
    key: 'marketing-guru' as ArticlePersona, 
    label: 'The Marketing Guru',
    description: 'Audience-first and positioning-driven. Focuses on attention, perception, and how ideas land. Simple but intentional language crafted for impact.',
    styleSheet: 'This voice is audience-first and positioning-driven. It focuses on attention, perception, and how ideas land in the mind of the market. Writing emphasizes clarity of message, emotional resonance, and distinctiveness rather than technical depth. Concepts are framed in terms of value, relevance, and memorability, often linking strategy to brand, identity, and trust. The tone is confident, accessible, and forward-looking, designed to inspire action without sounding promotional. Language is simple but intentional, crafted for impact and recall. The reader should feel that complex ideas have been sharpened into messages that can travel, stick, and shape how a product, service, or idea is perceived.',
  },
];

const WORD_COUNT_OPTIONS = [
  { key: '400' as WordCountRange, label: 'Up to 400', description: 'Brief insight' },
  { key: '600' as WordCountRange, label: 'Up to 600', description: 'Short article' },
  { key: '800' as WordCountRange, label: 'Up to 800', description: 'Standard piece' },
  { key: '1000' as WordCountRange, label: 'Up to 1,000', description: 'In-depth' },
];

interface FormatOptionsStepProps {
  outputFormat: OutputFormat;
  brandGuides: BrandGuide[] | undefined;
  isLoadingBrandGuides: boolean;
  selectedBrandGuide: string;
  setSelectedBrandGuide: (value: string) => void;
  deckLength: DeckLength;
  setDeckLength: (value: DeckLength) => void;
  articlePersona: ArticlePersona;
  setArticlePersona: (value: ArticlePersona) => void;
  wordCountRange: WordCountRange;
  setWordCountRange: (value: WordCountRange) => void;
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
  articlePersona,
  setArticlePersona,
  wordCountRange,
  setWordCountRange,
  content,
  setContent,
  onBack,
  onGenerate,
  isGenerating,
}: FormatOptionsStepProps) => {
  const formatConfig = OUTPUT_FORMAT_OPTIONS.find(f => f.key === outputFormat);
  const showBrandGuide = formatConfig?.needsBrandGuide ?? true;
  const showDeckOptions = formatConfig?.isSlideFormat ?? true;
  const isArticleFormat = outputFormat === 'article';
  
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span className="font-mono text-[10px] uppercase tracking-wider">Step 2</span>
        <span>•</span>
        <span className="font-medium text-foreground">{formatConfig?.label}</span>
      </div>

      {/* Data Sources Selection - placeholder for library integration */}
      <div>
        <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
          Data Sources
        </label>
        <div className="bg-card border border-border">
          {/* Search Bar */}
          <div className="relative border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sources..."
              className="w-full pl-12 pr-4 py-3 bg-transparent text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none"
              disabled
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted/50 transition-colors" disabled>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          {/* Placeholder Source List */}
          <div className="max-h-[180px] overflow-y-auto">
            {[
              { name: 'The Impact of Social Media In...', type: 'doc' },
              { name: 'Galaxy Research Journal', type: 'doc' },
              { name: 'Sustainable fashion consumpt...', type: 'doc' },
              { name: 'Street Interviews - Germany', type: 'data' },
              { name: 'Podcast Ready Set Click', type: 'data' },
              { name: 'Sustainable fashion forum', type: 'data' },
            ].map((source, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 flex items-center gap-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer opacity-60"
              >
                <div className="w-4 h-4 border border-muted-foreground/40 flex items-center justify-center">
                  {/* Checkbox placeholder */}
                </div>
                {source.type === 'doc' ? (
                  <File className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <Database className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="text-sm text-foreground truncate">{source.name}</span>
              </div>
            ))}
          </div>
          
          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground italic">
              Data library coming soon — connect your research files and datasets
            </p>
          </div>
        </div>
      </div>

      {/* Design Template Selection - only for slide-based formats */}
      {showBrandGuide && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Design Template
          </label>
          <Select
            value={selectedBrandGuide}
            onValueChange={setSelectedBrandGuide}
            disabled={isLoadingBrandGuides}
          >
            <SelectTrigger className="w-full bg-card border-border h-12">
              <SelectValue placeholder={isLoadingBrandGuides ? "Loading..." : "Select a template"} />
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
        </div>
      )}

      {/* Template Details */}
      {showBrandGuide && (
        <div>
          <BrandGuideEditor 
            brandGuides={brandGuides} 
            isLoading={isLoadingBrandGuides} 
          />
        </div>
      )}

      {/* Deck Length - only for slide-based formats */}
      {showDeckOptions && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Deck Length
          </label>
          <div className="grid grid-cols-4 gap-3">
            {DECK_LENGTH_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setDeckLength(option.key)}
                className={cn(
                  "relative px-4 py-3 border-2 transition-all duration-300 text-center",
                  deckLength === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <p className="font-medium text-sm text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.slides} slides</p>
                {deckLength === option.key && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Article Persona Selection - only for Thought Leadership */}
      {isArticleFormat && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Writing Persona
          </label>
          <div className="space-y-3">
            {ARTICLE_PERSONA_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setArticlePersona(option.key)}
                className={cn(
                  "relative w-full px-5 py-4 border-2 transition-all duration-300 text-left group",
                  articlePersona === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground mb-1">{option.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  {articlePersona === option.key && (
                    <div className="w-1.5 h-1.5 bg-primary shrink-0 mt-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Word Count Range - only for Thought Leadership */}
      {isArticleFormat && (
        <div>
          <label className="block font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-3">
            Word Count
          </label>
          <div className="grid grid-cols-4 gap-3">
            {WORD_COUNT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setWordCountRange(option.key)}
                className={cn(
                  "relative px-4 py-3 border-2 transition-all duration-300 text-center",
                  wordCountRange === option.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <p className="font-medium text-sm text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
                {wordCountRange === option.key && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Additional Content Upload */}
      <div>
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
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
      </div>
    </div>
  );
};

export default FormatOptionsStep;
