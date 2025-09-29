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

Analyze these documents and provide a structured summary:
${docList}

Generate a comprehensive analysis with the following sections:

**KEY FINDINGS**
Provide 4-6 bullet points highlighting the most critical insights from these documents.

**FINANCIALS**
Based on the document types (especially Financial Statements), provide estimates for:
- Revenue trends and projections
- Profit margins and operational efficiency
- Cash flow analysis
- Key financial metrics

**MARKET POSITION**
Analyze the company's competitive landscape:
- Market share and positioning
- Competitive advantages
- Industry trends
- Customer base and segments

**OPPORTUNITIES**
Identify growth potential:
- Market expansion possibilities
- Product/service development opportunities
- Strategic advantages
- Synergy potential

**RISKS**
Highlight challenges and concerns:
- Market risks
- Operational challenges
- Financial concerns
- Regulatory or compliance issues

Base your analysis on typical patterns and expectations for these document types in M&A contexts. Be specific, data-driven where possible, and provide actionable insights.`;

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
