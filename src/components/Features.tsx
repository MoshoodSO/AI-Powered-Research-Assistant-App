import { FileText, Link2, Settings2, Download, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multiple Input Formats",
    description: "Upload PDFs, Word documents, or paste links from arXiv, ResearchGate, Google Scholar, and more.",
  },
  {
    icon: Settings2,
    title: "Customizable Summaries",
    description: "Adjust summary length, focus areas, and detail level to match your specific needs.",
  },
  {
    icon: Download,
    title: "Flexible Export",
    description: "Export your summaries as PDF, DOCX, or LaTeX format for mathematical content.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get comprehensive summaries in seconds, not hours. Save time for what matters.",
  },
  {
    icon: Link2,
    title: "Direct URL Support",
    description: "Simply paste a link to any research paper and we'll fetch and analyze it for you.",
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Your research documents are processed securely and never stored permanently.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Everything you need to transform complex research into actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-elevated p-8 rounded-2xl border border-border/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
