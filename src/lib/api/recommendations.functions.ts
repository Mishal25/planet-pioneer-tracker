import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "../ai-gateway.server";

const FootprintInputSchema = z.object({
  carKm: z.number(),
  bikeKm: z.number(),
  busKm: z.number(),
  trainKm: z.number(),
  flightHoursYear: z.number(),
  electricityKwh: z.number(),
  waterLiters: z.number(),
  diet: z.enum(["vegan", "vegetarian", "eggetarian", "non-vegetarian"]),
  wasteKg: z.number(),
});

const BreakdownSchema = z.object({
  transport: z.number(),
  energy: z.number(),
  water: z.number(),
  food: z.number(),
  waste: z.number(),
  total: z.number(),
});

const HistoryPointSchema = z.object({
  day: z.string(),
  kg: z.number(),
});

const InputSchema = z.object({
  input: FootprintInputSchema,
  breakdown: BreakdownSchema,
  history: z.array(HistoryPointSchema).optional(),
});

const ActionSchema = z.object({
  title: z.string().describe("Short, action-oriented title (max 8 words)"),
  description: z.string().describe("1-2 sentence explanation of what to do and why it matters"),
  category: z.enum(["transport", "energy", "food", "water", "waste", "lifestyle"]),
  impactKgPerWeek: z.number().describe("Estimated weekly CO2 reduction in kg if followed"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  emoji: z.string().describe("A single emoji representing the action"),
});

const OutputSchema = z.object({
  summary: z.string().describe("2-sentence personalized summary of the user's footprint and biggest opportunity"),
  actions: z.array(ActionSchema).min(5).max(7).describe("5-7 personalized weekly actions, ordered by impact"),
});

export type RecommendationsResult = z.infer<typeof OutputSchema>;

export const generateRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<RecommendationsResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const gateway = createLovableAiGatewayProvider(key);

    const historyLine = data.history?.length
      ? `Recent 7-day history (kg CO2/day): ${data.history.map((h) => `${h.day}=${h.kg}`).join(", ")}.`
      : "No history available yet.";

    const prompt = `You are an expert sustainability coach. Generate a personalized weekly action plan for a user based on their carbon footprint data.

User's daily footprint breakdown (kg CO2):
- Transport: ${data.breakdown.transport.toFixed(2)}
- Energy: ${data.breakdown.energy.toFixed(2)}
- Food: ${data.breakdown.food.toFixed(2)}
- Water: ${data.breakdown.water.toFixed(3)}
- Waste: ${data.breakdown.waste.toFixed(2)}
- TOTAL: ${data.breakdown.total.toFixed(2)} kg/day

Lifestyle inputs:
- Car: ${data.input.carKm} km/day, Bike: ${data.input.bikeKm}, Bus: ${data.input.busKm}, Train: ${data.input.trainKm}
- Flights: ${data.input.flightHoursYear} hours/year
- Electricity: ${data.input.electricityKwh} kWh/day, Water: ${data.input.waterLiters} L/day
- Diet: ${data.input.diet}, Waste: ${data.input.wasteKg} kg/day

${historyLine}

Generate 5-7 SPECIFIC, actionable weekly recommendations tailored to THIS user's biggest emission sources. Prioritize high-impact, realistic actions. Include estimated CO2 savings in kg/week.`;

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({ schema: OutputSchema }),
      prompt,
    });

    return experimental_output;
  });
