import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ActionSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(["transport", "energy", "food", "water", "waste", "lifestyle"]),
  impactKgPerWeek: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  emoji: z.string(),
});

const SavePlanSchema = z.object({
  summary: z.string(),
  actions: z.array(ActionSchema).min(1),
  breakdown: z.object({
    transport: z.number(),
    energy: z.number(),
    water: z.number(),
    food: z.number(),
    waste: z.number(),
    total: z.number(),
  }),
  input: z.record(z.string(), z.unknown()),
  totalKgPerDay: z.number(),
});

export type SavedPlan = {
  id: string;
  summary: string;
  actions: z.infer<typeof ActionSchema>[];
  breakdown: z.infer<typeof SavePlanSchema>["breakdown"];
  input: Record<string, unknown>;
  total_kg_per_day: number;
  created_at: string;
};

export const savePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SavePlanSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("ai_action_plans")
      .insert({
        user_id: userId,
        summary: data.summary,
        actions: data.actions,
        breakdown: data.breakdown,
        input: data.input,
        total_kg_per_day: data.totalKgPerDay,
      })
      .select("id, created_at")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string, created_at: row.created_at as string };
  });

export const listPlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SavedPlan[]> => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("ai_action_plans")
      .select("id, summary, actions, breakdown, input, total_kg_per_day, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as SavedPlan[];
  });

export const deletePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("ai_action_plans").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
