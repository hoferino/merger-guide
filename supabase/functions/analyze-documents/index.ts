import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documents } = await req.json();
    
    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No documents provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build document context for the AI
    const docList = documents.map((doc: any) => 
      `- ${doc.name} (${doc.type}, ${doc.size})`
    ).join('\n');

    const prompt = `You are a financial analyst expert specializing in M&A deal analysis.

I have a list of document names and types from a company being evaluated for acquisition. Based ONLY on the document names, types, and typical contents of such documents in M&A contexts, provide a realistic and detailed analysis.

Documents available:
${docList}

IMPORTANT: You cannot access the actual document contents. Instead, use your knowledge of what these document types typically contain in M&A deals to generate a realistic, data-driven analysis. Make reasonable assumptions based on industry standards and typical patterns.

Generate a comprehensive analysis with these sections:

**KEY FINDINGS**
Provide 4-6 specific bullet points about what these documents typically reveal in M&A contexts. Be concrete and data-driven.

**FINANCIALS**
Based on financial documents being present, estimate typical metrics for a mid-market company:
- Revenue range and growth trends (provide specific numbers)
- Typical profit margins for this type of business
- Cash flow characteristics
- Key financial ratios

**MARKET POSITION**
Analyze what these documents suggest about market positioning:
- Likely market segment and competitive position
- Customer base characteristics
- Competitive advantages indicated by document types present
- Industry context

**OPPORTUNITIES**
Identify 3-4 specific growth opportunities that these documents would typically reveal:
- Market expansion possibilities
- Product/service development
- Strategic advantages
- M&A synergy potential

**RISKS**
Highlight 3-4 key risks that would be apparent from these document types:
- Market and competitive risks
- Operational challenges
- Financial concerns
- Regulatory or compliance issues

Be specific with numbers where appropriate. Format the response with clear section headers using **bold** markdown.`;

    console.log('Calling Lovable AI Gateway with documents:', documents.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a financial analyst expert specializing in M&A deal analysis.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      console.error('No summary in AI response:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to generate summary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully generated summary, length:', summary.length);

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-documents function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
