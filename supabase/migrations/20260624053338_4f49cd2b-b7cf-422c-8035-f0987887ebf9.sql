
CREATE TABLE public.ai_action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary text NOT NULL,
  actions jsonb NOT NULL,
  breakdown jsonb NOT NULL,
  input jsonb NOT NULL,
  total_kg_per_day numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_action_plans TO authenticated;
GRANT ALL ON public.ai_action_plans TO service_role;

ALTER TABLE public.ai_action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own plans" ON public.ai_action_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own plans" ON public.ai_action_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own plans" ON public.ai_action_plans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX ai_action_plans_user_created_idx ON public.ai_action_plans (user_id, created_at DESC);
