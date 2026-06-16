import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bike, Bus, Car, Lightbulb, Plane, Train, Trash2, Droplets, Utensils, ArrowRight, Sparkles, Wand2, Loader2, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { calcDaily, impactLevel, recommendations, treesEquivalent, weeklyHistory, type Diet, type FootprintInput } from "@/lib/eco-data";
import { generateRecommendations, type RecommendationsResult } from "@/lib/api/recommendations.functions";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Carbon Footprint Calculator — EcoTrack" },
      { name: "description", content: "Calculate your daily, monthly, and annual carbon footprint in 60 seconds with personalized tips to reduce it." },
    ],
  }),
  component: CalculatorPage,
});

const COLORS = ["var(--leaf)", "var(--ocean)", "var(--sun)", "var(--coral)", "var(--chart-5)"];

const defaults: FootprintInput = {
  carKm: 18, bikeKm: 2, busKm: 4, trainKm: 6, flightHoursYear: 8,
  electricityKwh: 9, waterLiters: 140, diet: "vegetarian", wasteKg: 0.8,
};

function CalculatorPage() {
  const [input, setInput] = useState<FootprintInput>(defaults);
  const breakdown = useMemo(() => calcDaily(input), [input]);
  const level = impactLevel(breakdown.total);

  const pieData = [
    { name: "Transport", value: +breakdown.transport.toFixed(2) },
    { name: "Energy",    value: +breakdown.energy.toFixed(2) },
    { name: "Food",      value: +breakdown.food.toFixed(2) },
    { name: "Waste",     value: +breakdown.waste.toFixed(2) },
    { name: "Water",     value: +breakdown.water.toFixed(3) },
  ];

  const barData = [
    { period: "Daily",   kg: +breakdown.total.toFixed(1) },
    { period: "Weekly",  kg: +(breakdown.total * 7).toFixed(0) },
    { period: "Monthly", kg: +(breakdown.total * 30).toFixed(0) },
    { period: "Annual",  kg: +(breakdown.total * 365).toFixed(0) },
  ];

  const recs = recommendations(breakdown, input);
  const trees = treesEquivalent(breakdown.total * 365);

  const set = <K extends keyof FootprintInput>(k: K, v: FootprintInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 animate-fade-up">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Calculator</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Your carbon footprint, <span className="gradient-text">in 60 seconds</span></h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">Adjust the inputs below — your results update live.</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
          {/* Inputs */}
          <Card className="glass border-0 p-6 space-y-8">
            <Section icon={<Car className="h-4 w-4" />} title="Transportation" subtitle="Distances per day · flight hours per year">
              <NumberField label="Car (km/day)" icon={<Car className="h-4 w-4" />} value={input.carKm} onChange={(v) => set("carKm", v)} max={200} />
              <NumberField label="Bike (km/day)" icon={<Bike className="h-4 w-4" />} value={input.bikeKm} onChange={(v) => set("bikeKm", v)} max={100} />
              <NumberField label="Bus (km/day)" icon={<Bus className="h-4 w-4" />} value={input.busKm} onChange={(v) => set("busKm", v)} max={200} />
              <NumberField label="Train (km/day)" icon={<Train className="h-4 w-4" />} value={input.trainKm} onChange={(v) => set("trainKm", v)} max={300} />
              <NumberField label="Flight (hours/year)" icon={<Plane className="h-4 w-4" />} value={input.flightHoursYear} onChange={(v) => set("flightHoursYear", v)} max={200} />
            </Section>

            <Section icon={<Lightbulb className="h-4 w-4" />} title="Home & Utilities">
              <SliderField label="Electricity" unit="kWh/day"  value={input.electricityKwh} onChange={(v) => set("electricityKwh", v)} max={50} step={0.5} />
              <SliderField label="Water"       unit="L/day"    value={input.waterLiters}    onChange={(v) => set("waterLiters", v)}    max={500} step={5} />
              <SliderField label="Waste"       unit="kg/day"   value={input.wasteKg}        onChange={(v) => set("wasteKg", v)}        max={10}  step={0.1} icon={<Trash2 className="h-4 w-4" />} />
            </Section>

            <Section icon={<Utensils className="h-4 w-4" />} title="Diet">
              <RadioGroup value={input.diet} onValueChange={(v) => set("diet", v as Diet)} className="grid grid-cols-2 gap-2">
                {(["vegan","vegetarian","eggetarian","non-vegetarian"] as Diet[]).map((d) => (
                  <Label key={d} htmlFor={d}
                    className={`glass cursor-pointer rounded-xl p-3 flex items-center gap-2 capitalize transition ${input.diet===d ? "ring-2 ring-primary text-primary" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem id={d} value={d} className="sr-only" />
                    <span className="text-lg">{({vegan:"🌱",vegetarian:"🥗",eggetarian:"🥚","non-vegetarian":"🍖"} as any)[d]}</span>
                    {d}
                  </Label>
                ))}
              </RadioGroup>
            </Section>

            <Droplets className="hidden" />
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="glass border-0 p-6 glow">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Daily CO₂</p>
                  <p className="font-display text-5xl font-bold mt-1">{breakdown.total.toFixed(1)}<span className="text-lg font-normal text-muted-foreground"> kg</span></p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold bg-${level.tone}/15 text-${level.tone}`}>
                  {level.label} impact
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{level.desc}</p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <Metric label="Monthly" value={`${(breakdown.total*30).toFixed(0)} kg`} />
                <Metric label="Annual"  value={`${(breakdown.total*365/1000).toFixed(2)} t`} />
                <Metric label="Trees to offset" value={`${trees}`} />
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="glass border-0 p-6">
                <h3 className="font-semibold mb-3">Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={3}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass border-0 p-6">
                <h3 className="font-semibold mb-3">Over time</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="period" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                      <Bar dataKey="kg" fill="var(--leaf)" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="glass border-0 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Personalized suggestions</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {recs.map((r) => (
                  <div key={r.title} className="rounded-xl p-4 bg-muted/40 border border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.icon}</span>
                      <p className="font-medium">{r.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/dashboard"><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2">Save to dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link to="/challenges"><Button variant="outline" className="glass">Find challenges</Button></Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function NumberField({ label, icon, value, onChange, max }: { label: string; icon?: React.ReactNode; value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <Label className="truncate text-sm">{label}</Label>
      </div>
      <Input
        type="number"
        inputMode="numeric"
        value={value}
        min={0} max={max}
        onChange={(e) => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className="w-24 text-right"
      />
    </div>
  );
}

function SliderField({ label, unit, value, onChange, max, step, icon }: { label: string; unit: string; value: number; onChange: (v: number) => void; max: number; step: number; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="flex items-center gap-2">{icon}{label}</span>
        <span className="text-muted-foreground tabular-nums">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={0} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}
