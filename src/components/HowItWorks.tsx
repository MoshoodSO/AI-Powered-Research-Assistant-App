import { Upload, Sliders, FileOutput } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Research",
    description: "Drag and drop your PDF, Word document, or paste a link from academic sources like arXiv or Google Scholar.",
  },
  {
    icon: Sliders,
    step: "02",
    title: "Customize Settings",
    description: "Choose your preferred summary length, focus areas, and output format to match your specific requirements.",
  },
  {
    icon: FileOutput,
    step: "03",
    title: "Get Your Summary",
    description: "Receive a beautifully formatted summary in your chosen format—PDF, DOCX, or LaTeX for mathematical content.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Three simple steps to transform your research papers into clear, actionable summaries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="relative z-10 inline-flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-medium">
                  <step.icon className="w-9 h-9 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
