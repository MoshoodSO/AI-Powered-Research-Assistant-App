import { Download, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResultsPreviewProps {
  onBack: () => void;
  outputFormat: string;
}

const ResultsPreview = ({ onBack, outputFormat }: ResultsPreviewProps) => {
  const { toast } = useToast();

  const summaryContent = `Research4Me - Analysis Report

KEY FINDINGS

The research presents novel insights into the application of machine learning models in climate prediction. The study demonstrates a 23% improvement in prediction accuracy compared to traditional methods.

METHODOLOGY

The authors employed a hybrid approach combining:
- Deep learning neural networks
- Statistical ensemble methods  
- Physics-informed constraints

MAIN RESULTS

1. Temperature prediction accuracy: 94.7%
2. Precipitation forecasting: 89.2%
3. Extreme weather event detection: 91.5%

CONCLUSIONS

This research establishes a new benchmark for climate modeling, with significant implications for disaster preparedness and agricultural planning worldwide.
`;

  const handleDownload = () => {
    let blob: Blob;
    let filename: string;

    if (outputFormat === "pdf") {
      // For PDF, create a simple text file (real PDF generation would need a library)
      blob = new Blob([summaryContent], { type: "application/pdf" });
      filename = "research4me-summary.pdf";
    } else if (outputFormat === "docx") {
      // For DOCX, create a simple text file (real DOCX would need a library)
      blob = new Blob([summaryContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      filename = "research4me-summary.docx";
    } else {
      // LaTeX format
      const latexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{Research4Me - Analysis Report}
\\date{\\today}

\\begin{document}
\\maketitle

\\section{Key Findings}
The research presents novel insights into the application of machine learning models in climate prediction. The study demonstrates a 23\\% improvement in prediction accuracy compared to traditional methods.

\\section{Methodology}
The authors employed a hybrid approach combining:
\\begin{itemize}
  \\item Deep learning neural networks
  \\item Statistical ensemble methods
  \\item Physics-informed constraints
\\end{itemize}

\\section{Main Results}
\\begin{enumerate}
  \\item Temperature prediction accuracy: 94.7\\%
  \\item Precipitation forecasting: 89.2\\%
  \\item Extreme weather event detection: 91.5\\%
\\end{enumerate}

\\section{Conclusions}
This research establishes a new benchmark for climate modeling, with significant implications for disaster preparedness and agricultural planning worldwide.

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

  const summaryPreview = `
## Key Findings

The research presents novel insights into the application of machine learning 
models in climate prediction. The study demonstrates a 23% improvement in 
prediction accuracy compared to traditional methods.

## Methodology

The authors employed a hybrid approach combining:
- Deep learning neural networks
- Statistical ensemble methods  
- Physics-informed constraints

## Main Results

1. Temperature prediction accuracy: 94.7%
2. Precipitation forecasting: 89.2%
3. Extreme weather event detection: 91.5%

## Conclusions

This research establishes a new benchmark for climate modeling, 
with significant implications for disaster preparedness and 
agricultural planning worldwide.
  `;

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
          <div className="bg-background rounded-2xl border border-border p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                Summary Preview
              </h3>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground leading-relaxed">
                {summaryPreview}
              </pre>
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Word Count", value: "1,247" },
              { label: "Pages", value: "4" },
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
              Download {outputFormat.toUpperCase()}
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
