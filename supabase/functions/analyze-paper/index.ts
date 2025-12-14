import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  content: string;
  summaryLength: string;
  focusAreas: string[];
  outputFormat: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, summaryLength, focusAreas, outputFormat }: AnalyzeRequest = await req.json();

    if (!content || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No content provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lengthGuide = {
      brief: "2-3 paragraphs, around 200 words",
      standard: "4-6 paragraphs, around 500 words",
      detailed: "8-10 paragraphs, around 1000 words",
      comprehensive: "comprehensive coverage, around 1500-2000 words"
    };

    const focusAreasText = focusAreas.length > 0 
      ? `Focus especially on: ${focusAreas.join(", ")}.`
      : "";

    const formatInstructions = outputFormat === "latex" 
      ? "Format the output as LaTeX document with proper \\section{}, \\subsection{}, and mathematical notation where appropriate."
      : "Format the output in clean Markdown with headers, bullet points, and numbered lists.";

    const systemPrompt = `You are an expert academic research analyst. Your task is to analyze and summarize research papers, articles, and academic projects. 
Provide clear, accurate, and well-structured summaries that capture the essence of the research.
Always maintain academic integrity and accurately represent the original work's findings and conclusions.`;

    const userPrompt = `Please analyze and summarize the following research content.

Summary Length: ${lengthGuide[summaryLength as keyof typeof lengthGuide] || lengthGuide.standard}
${focusAreasText}
${formatInstructions}

Structure your analysis with these sections:
1. **Key Findings** - The main discoveries and contributions
2. **Methodology** - Research approach and methods used
3. **Main Results** - Quantitative and qualitative outcomes
4. **Conclusions** - Final takeaways and implications
5. **Limitations & Future Work** - (if mentioned in the source)

Research Content:
${content}`;

    console.log("Calling Lovable AI for paper analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error("No summary generated from AI");
    }

    console.log("Paper analysis completed successfully");

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-paper function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
