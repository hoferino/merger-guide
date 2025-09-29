-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create analysis_sessions table
CREATE TABLE public.analysis_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id TEXT NOT NULL,
  name TEXT NOT NULL,
  selected_document_ids TEXT[] DEFAULT '{}',
  summary TEXT,
  custom_prompts JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated_outputs table
CREATE TABLE public.generated_outputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('summary', 'teaser', 'cim')),
  content TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_outputs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now since we don't have auth)
CREATE POLICY "Allow all operations on analysis_sessions"
  ON public.analysis_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on generated_outputs"
  ON public.generated_outputs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_analysis_sessions_deal_id ON public.analysis_sessions(deal_id);
CREATE INDEX idx_generated_outputs_session_id ON public.generated_outputs(session_id);
CREATE INDEX idx_generated_outputs_type ON public.generated_outputs(type);

-- Create trigger for updated_at
CREATE TRIGGER update_analysis_sessions_updated_at
  BEFORE UPDATE ON public.analysis_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for auto-naming
CREATE OR REPLACE FUNCTION public.generate_analysis_name()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'Analysis ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI');
END;
$$;