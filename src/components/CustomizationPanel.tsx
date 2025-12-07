import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";

interface CustomizationProps {
  customization: {
    summaryLength: string;
    focusAreas: string[];
    outputFormat: string;
  };
  setCustomization: React.Dispatch<React.SetStateAction<{
    summaryLength: string;
    focusAreas: string[];
    outputFormat: string;
  }>>;
}

const CustomizationPanel = ({ customization, setCustomization }: CustomizationProps) => {
  const summaryLengths = [
    { id: "brief", label: "Brief", description: "1-2 pages" },
    { id: "medium", label: "Medium", description: "3-5 pages" },
    { id: "detailed", label: "Detailed", description: "6+ pages" },
  ];

  const focusAreaOptions = [
    { id: "key-findings", label: "Key Findings" },
    { id: "methodology", label: "Methodology" },
    { id: "results", label: "Results & Data" },
    { id: "conclusions", label: "Conclusions" },
    { id: "references", label: "Key References" },
    { id: "math", label: "Mathematical Derivations" },
  ];

  const outputFormats = [
    { id: "pdf", label: "PDF", description: "Universal format" },
    { id: "docx", label: "DOCX", description: "Editable document" },
    { id: "tex", label: "LaTeX", description: "For mathematical content" },
  ];

  const toggleFocusArea = (area: string) => {
    setCustomization(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
        Customize Your Summary
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Summary Length */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Summary Length
          </Label>
          <RadioGroup
            value={customization.summaryLength}
            onValueChange={(value) => setCustomization(prev => ({ ...prev, summaryLength: value }))}
            className="space-y-2"
          >
            {summaryLengths.map((length) => (
              <div key={length.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value={length.id} id={length.id} />
                <div>
                  <Label htmlFor={length.id} className="text-sm font-medium cursor-pointer">
                    {length.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{length.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Focus Areas */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Focus Areas
          </Label>
          <div className="space-y-2">
            {focusAreaOptions.map((area) => (
              <div 
                key={area.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Checkbox
                  id={area.id}
                  checked={customization.focusAreas.includes(area.id)}
                  onCheckedChange={() => toggleFocusArea(area.id)}
                />
                <Label htmlFor={area.id} className="text-sm cursor-pointer">
                  {area.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">
            Output Format
          </Label>
          <RadioGroup
            value={customization.outputFormat}
            onValueChange={(value) => setCustomization(prev => ({ ...prev, outputFormat: value }))}
            className="space-y-2"
          >
            {outputFormats.map((format) => (
              <div key={format.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value={format.id} id={`format-${format.id}`} />
                <div>
                  <Label htmlFor={`format-${format.id}`} className="text-sm font-medium cursor-pointer">
                    {format.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
