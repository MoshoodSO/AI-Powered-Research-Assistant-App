import { Download, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResultsPreviewProps {
  onBack: () => void;
  outputFormat: string;
  summary: string;
}

const ResultsPreview = ({ onBack, outputFormat, summary }: ResultsPreviewProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    let blob: Blob;
    let filename: string;

    if (outputFormat === "pdf") {
      // Create a text file with PDF extension (proper PDF would need jsPDF)
      const content = `Research4Me - Analysis Report\n\n${summary}`;
      blob = new Blob([content], { type: "text/plain" });
      filename = "research4me-summary.txt";
    } else if (outputFormat === "docx") {
      // Create a text file (proper DOCX would need docx library)
      const content = `Research4Me - Analysis Report\n\n${summary}`;
      blob = new Blob([content], { type: "text/plain" });
      filename = "research4me-summary.txt";
    } else {
      // LaTeX format
      const escapedSummary = summary
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/#/g, "\\#")
        .replace(/\$/g, "\\$")
        .replace(/_/g, "\\_")
        .replace(/\*\*(.*?)\*\*/g, "\\textbf{$1}")
        .replace(/## (.*?)$/gm, "\\section{$1}")
        .replace(/### (.*?)$/gm, "\\subsection{$1}")
        .replace(/- (.*?)$/gm, "\\item $1")
        .replace(/\d+\. (.*?)$/gm, "\\item $1");

      const latexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{enumitem}
\\title{Research4Me - Analysis Report}
\\date{\\today}

\\begin{document}
\\maketitle

${escapedSummary}

\\end{document}`;
      blob = new Blob([latexContent], { type: "application/x-tex" });
      filename = "research4me-summary.tex";
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: `Your summary has been downloaded as ${filename}.`,
    });
  };

  // Calculate word count
  const wordCount = summary.split(/\s+/).filter(Boolean).length;
  const pageEstimate = Math.ceil(wordCount / 300);

  return (
    <section id="upload" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="card-elevated rounded-3xl p-8 md:p-12 border border-border/50">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Analysis Complete!
            </h2>
            <p className="text-muted-foreground font-body">
              Your research paper has been successfully analyzed and summarized.
            </p>
          </div>

          {/* Summary Preview */}
          <div className="bg-background rounded-2xl border border-border p-8 mb-8 max-h-[500px] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                Summary Preview
              </h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground leading-relaxed">
                {summary}
              </pre>
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Word Count", value: wordCount.toLocaleString() },
              { label: "Pages (est.)", value: pageEstimate.toString() },
              { label: "Format", value: outputFormat.toUpperCase() },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-secondary/50 rounded-xl">
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" onClick={handleDownload}>
              <Download className="w-5 h-5" />
              Download {outputFormat === "latex" ? "TEX" : outputFormat.toUpperCase()}
            </Button>
            <Button variant="outline" size="lg" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
              Analyze Another Paper
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsPreview;
