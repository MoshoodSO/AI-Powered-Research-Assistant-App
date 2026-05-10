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

    const systemPrompt = `You are an expert academic research analyst with deep knowledge of scholarly literature across disciplines.
Your task is to analyze research papers and produce rigorous, well-structured academic summaries.
You MUST always include in-text APA 7th edition citations (Author, Year) when referencing the source work or related literature, identify research gaps, and provide a full APA-formatted reference list at the end.
Maintain strict academic integrity and accurately represent the work's findings.`;

    const userPrompt = `Please analyze and summarize the following research content.

Summary Length: ${lengthGuide[summaryLength as keyof typeof lengthGuide] || lengthGuide.standard}
${focusAreasText}
${formatInstructions}

Structure your analysis with these EXACT sections (in order):

1. **Citation (APA 7th)** - Provide the full APA 7th edition citation for the source work itself. If author/year/title/venue are missing, infer them from the content where possible and clearly mark uncertain fields with [unknown].
2. **Key Findings** - Main discoveries and contributions, with in-text APA citations (Author, Year).
3. **Methodology** - Research approach, design, sample, and methods used.
4. **Main Results** - Quantitative and qualitative outcomes, with citations where relevant.
5. **Conclusions** - Final takeaways and broader implications.
6. **Research Gaps** - Explicitly identify 3-5 gaps, unanswered questions, or limitations in the current work and the field. Each gap should be a numbered item with a 1-2 sentence explanation of why it matters and what future research could address it.
7. **References (APA 7th)** - A numbered reference list in proper APA 7th edition format, including:
   - The source work itself
   - All works cited in the analysis above (every in-text citation must appear here)
   - Use hanging-indent style formatting in markdown (each reference on its own line, prefixed with the number).
   - Include DOI/URL when available.

Rules:
- Every in-text citation (Author, Year) MUST have a matching entry in the References section.
- Do not fabricate references — only cite works actually mentioned in or directly relevant to the source content.
- Use proper APA 7th formatting: Author, A. A. (Year). Title of work. *Journal Name*, Volume(Issue), pages. https://doi.org/...

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
