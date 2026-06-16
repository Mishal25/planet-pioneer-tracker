import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { badges, monthlyHistory, weeklyHistory } from "@/lib/eco-data";
import { Award, Flame, Target, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EcoTrack" }, { name: "description", content: "Track your weekly and monthly carbon trends, goals, streaks, and achievement badges." }] }),
  component: Dashboard,
});

function Dashboard() {
  const goal = 10; // kg/day
  const todays = 9.2;
  const progress = Math.min(100, Math.round(((goal - todays) / goal) * 100 + 50));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between mb-10 animate-fade-up">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Dashboard</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold truncate">Hello, <span className="gradient-text">Eco-Hero</span></h1>
            <p className="mt-2 text-muted-foreground">Here's how your footprint is trending.</p>
          </div>
          <div className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2 shrink-0">
            <Flame className="h-4 w-4 text-coral" /> 9-day streak
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat icon={TrendingDown} tone="leaf"  label="Today"   value={`${todays} kg`} hint="↓ 12% vs last week" />
          <Stat icon={Target}       tone="ocean" label="Goal"    value={`${goal} kg/day`} hint={`${progress}% on track`} />
          <Stat icon={Award}        tone="sun"   label="Badges"  value={`${badges.filter(b=>b.earned).length}/${badges.length}`} hint="Keep going" />
          <Stat icon={Flame}        tone="coral" label="Points"  value="2,980" hint="Top 10% community" />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <Card className="glass border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Weekly footprint</h3>
              <span className="text-xs text-muted-foreground">kg CO₂ / day</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={weeklyHistory}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="var(--leaf)" stopOpacity={0.7}/>
                      <stop offset="100%" stopColor="var(--leaf)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="kg" stroke="var(--leaf)" strokeWidth={3} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass border-0 p-6">
            <h3 className="font-semibold mb-2">Goal progress</h3>
            <p className="text-sm text-muted-foreground mb-4">Stay under {goal} kg CO₂/day this month.</p>
            <div className="space-y-4">
              {[
                { label: "Daily avg",    val: 78 },
                { label: "Transit days", val: 60 },
                { label: "Plant meals",  val: 45 },
                { label: "Energy cuts",  val: 32 },
              ].map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{g.label}</span>
                    <span className="text-muted-foreground">{g.val}%</span>
                  </div>
                  <Progress value={g.val} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="glass border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Monthly trend</h3>
              <span className="text-xs text-muted-foreground">kg CO₂ / month</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={monthlyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="kg" stroke="var(--ocean)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass border-0 p-6">
            <h3 className="font-semibold mb-4">Achievement badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div key={b.name} className={`rounded-xl p-4 text-center border ${b.earned ? "glass border-primary/30" : "bg-muted/30 border-border opacity-60"}`}>
                  <div className="text-3xl">{b.emoji}</div>
                  <p className="mt-2 text-sm font-semibold">{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, tone, label, value, hint }: { icon: any; tone: string; label: string; value: string; hint: string }) {
  return (
    <Card className="glass border-0 p-5">
      <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${tone}/15 text-${tone} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </Card>
  );
}
