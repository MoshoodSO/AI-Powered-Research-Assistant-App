import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">AI-Powered Research Analysis</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in [animation-delay:0.1s] opacity-0">
          Transform Research Papers
          <br />
          <span className="text-gradient-gold">Into Clear Insights</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body animate-fade-in [animation-delay:0.2s] opacity-0">
          Upload your research papers, articles, or project documents. 
          Our AI analyzes and summarizes them exactly the way you need.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.3s] opacity-0">
          <Button variant="hero" size="xl" onClick={scrollToUpload}>
            Start Analyzing
            <Sparkles className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="xl" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
            Learn More
          </Button>
        </div>

        <div className="mt-16 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground mx-auto" />
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in [animation-delay:0.4s] opacity-0">
          {[
            { value: "50+", label: "Supported Formats" },
            { value: "3", label: "Export Options" },
            { value: "AI", label: "Powered Analysis" },
            { value: "∞", label: "Research Papers" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
