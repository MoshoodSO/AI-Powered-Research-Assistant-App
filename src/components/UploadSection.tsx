import { useState, useCallback, useRef } from "react";
import { Upload, Link2, FileText, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CustomizationPanel from "./CustomizationPanel";
import ProcessingState from "./ProcessingState";
import ResultsPreview from "./ResultsPreview";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
}

const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [paperUrl, setPaperUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [customization, setCustomization] = useState({
    summaryLength: "medium",
    focusAreas: ["key-findings", "methodology"],
    outputFormat: "pdf",
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // For PDF and DOCX, we get base64 - for now extract readable text
        // In production, you'd use a proper parser library
        if (file.type === "application/pdf") {
          // Basic text extraction - will work for text-based PDFs
          resolve(text || `[PDF Content from ${file.name}]`);
        } else {
          resolve(text || `[Document content from ${file.name}]`);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type === "application/pdf" || 
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.type === "text/plain"
    );

    if (validFiles.length > 0) {
      const processedFiles: UploadedFile[] = [];
      for (const file of validFiles) {
        try {
          const content = await extractTextFromFile(file);
          processedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            content,
          });
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) added successfully.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, Word, or text documents.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const processedFiles: UploadedFile[] = [];
      for (const file of Array.from(files)) {
        try {
          const content = await extractTextFromFile(file);
          processedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            content,
          });
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      toast({
        title: "Files uploaded",
        description: `${processedFiles.length} file(s) added successfully.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0 && !paperUrl) {
      toast({
        title: "No input provided",
        description: "Please upload a file or enter a paper URL.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare content for analysis
      let contentToAnalyze = "";
      
      if (uploadedFiles.length > 0) {
        contentToAnalyze = uploadedFiles.map(f => f.content).join("\n\n---\n\n");
      }
      
      if (paperUrl) {
        contentToAnalyze += `\n\n[Research paper from URL: ${paperUrl}]\nPlease analyze based on this academic source.`;
      }

      // Map summary length to API format
      const summaryLengthMap: Record<string, string> = {
        short: "brief",
        medium: "standard",
        long: "detailed",
        comprehensive: "comprehensive"
      };

      const { data, error } = await supabase.functions.invoke("analyze-paper", {
        body: {
          content: contentToAnalyze,
          summaryLength: summaryLengthMap[customization.summaryLength] || "standard",
          focusAreas: customization.focusAreas,
          outputFormat: customization.outputFormat,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data.summary);
      setShowResults(true);
      toast({
        title: "Analysis complete!",
        description: "Your summary is ready for download.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <ProcessingState />;
  }

  if (showResults) {
    return (
      <ResultsPreview 
        onBack={() => {
          setShowResults(false);
          setUploadedFiles([]);
          setPaperUrl("");
          setAnalysisResult("");
        }}
        outputFormat={customization.outputFormat}
        summary={analysisResult}
      />
    );
  }

  return (
    <section id="upload" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Start Your Analysis
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Upload your research paper or paste a link to get started.
          </p>
        </div>

        <div className="card-elevated rounded-3xl p-8 md:p-12 border border-border/50">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-accent/50 hover:bg-accent/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Drag & Drop Files Here
            </h3>
            <p className="text-muted-foreground font-body mb-4">
              or click to browse your computer
            </p>
            <p className="text-sm text-muted-foreground/70 font-body">
              Supports PDF, DOC, DOCX, TXT files up to 50MB
            </p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground font-body">or enter a URL</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* URL Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Paste arXiv, ResearchGate, or Google Scholar link..."
                value={paperUrl}
                onChange={(e) => setPaperUrl(e.target.value)}
                className="pl-12 h-12 rounded-xl border-border bg-background"
              />
            </div>
          </div>

          {/* Customization Panel */}
          <CustomizationPanel 
            customization={customization}
            setCustomization={setCustomization}
          />

          {/* Analyze Button */}
          <div className="mt-8 text-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleAnalyze}
              disabled={uploadedFiles.length === 0 && !paperUrl}
            >
              Analyze Paper
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
