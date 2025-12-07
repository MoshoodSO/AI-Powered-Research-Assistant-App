import { BookOpen, Sparkles, FileSearch, FileOutput } from "lucide-react";

const ProcessingState = () => {
  const steps = [
    { icon: FileSearch, label: "Extracting content", active: true },
    { icon: BookOpen, label: "Analyzing structure", active: true },
    { icon: Sparkles, label: "Generating summary", active: true },
    { icon: FileOutput, label: "Formatting output", active: false },
  ];

  return (
    <section id="upload" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-2xl">
        <div className="card-elevated rounded-3xl p-12 border border-border/50 text-center">
          {/* Animated Logo */}
          <div className="relative w-32 h-32 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-accent/30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center animate-spin-slow">
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Analyzing Your Paper
          </h2>
          <p className="text-muted-foreground font-body mb-10">
            Our AI is reading and understanding your research document.
          </p>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  step.active ? "bg-accent/10" : "bg-secondary/30"
                }`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  step.active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`font-body ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {step.active && (
                  <div className="ml-auto w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessingState;
