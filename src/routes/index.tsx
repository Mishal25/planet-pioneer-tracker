import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Calculator, Leaf, Sparkles, TreePine, Users, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoTrack — Track Your Carbon Footprint, Build a Greener Future" },
      { name: "description", content: "Calculate your daily, monthly and annual CO₂ footprint. Get personalized tips, complete eco challenges, and join a community making a difference." },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "284k", label: "Tonnes CO₂ saved", icon: Wind, tone: "leaf" },
  { value: "42,180", label: "Active changemakers", icon: Users, tone: "ocean" },
  { value: "13,524", label: "Trees equivalent", icon: TreePine, tone: "sun" },
  { value: "1.8M", label: "Eco challenges done", icon: Sparkles, tone: "coral" },
];

const features = [
  { icon: Calculator, title: "Smart Calculator", desc: "Quantify your daily carbon in 60 seconds — transport, energy, food, waste." },
  { icon: BarChart3,  title: "Living Dashboard", desc: "See weekly and monthly trends with beautiful, honest charts." },
  { icon: Sparkles,   title: "Personalized Tips", desc: "Recommendations based on your actual habits, not generic advice." },
  { icon: TreePine,   title: "Tree Equivalents", desc: "Translate kilograms of CO₂ into trees, flights, and shower minutes." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-primary mb-6">
              <Leaf className="h-3.5 w-3.5" /> Climate action, one habit at a time
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Track Your Carbon Footprint,{" "}
              <span className="gradient-text">Build a Greener Future</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              EcoTrack turns climate anxiety into clear action. Measure your real impact, learn what moves the needle, and watch your footprint shrink week after week.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/calculator">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow gap-2">
                  Calculate Footprint <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="glass">Learn More</Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["🌱","🌿","🍃","🌳"].map((e, i) => (
                  <div key={i} className="h-9 w-9 rounded-full glass grid place-items-center text-base">{e}</div>
                ))}
              </div>
              <span>Loved by 42k+ everyday climate champions</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-up">
            <div className="glass rounded-3xl p-6 sm:p-8 glow animate-float">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Today's footprint</p>
                  <p className="font-display text-4xl font-bold mt-1">9.2 <span className="text-base font-normal text-muted-foreground">kg CO₂</span></p>
                </div>
                <div className="rounded-full bg-leaf/15 text-leaf px-3 py-1 text-xs font-semibold">-18% vs avg</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Transport", val: 35, color: "bg-leaf" },
                  { label: "Energy",    val: 25, color: "bg-ocean" },
                  { label: "Food",      val: 22, color: "bg-sun" },
                  { label: "Waste",     val: 18, color: "bg-coral" },
                ].map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="font-medium">{b.val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[["7-day", "↓ 12%"],["Trees", "47"],["Streak", "9d"]].map(([k,v]) => (
                  <div key={k} className="glass rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="font-semibold mt-1">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="glass border-0 p-6">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${s.tone}/15 text-${s.tone} mb-4`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Everything you need to live <span className="gradient-text">lighter</span></h2>
            <p className="mt-4 text-muted-foreground">From a 60-second calculator to a community leaderboard, EcoTrack makes sustainability feel like a game worth winning.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="glass border-0 p-6 hover:-translate-y-1 transition-transform">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awareness */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl glass rounded-3xl p-8 sm:p-12 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">Small actions, planet-scale impact.</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              The average person emits ~4.7 tonnes of CO₂ per year. EcoTrack users cut that by 22% within their first three months — just by paying attention.
            </p>
          </div>
          <Link to="/calculator">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow gap-2">
              Start free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
