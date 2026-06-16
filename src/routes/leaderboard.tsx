import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { leaderboard } from "@/lib/eco-data";
import { Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — EcoTrack" }, { name: "description", content: "See top eco-friendly users and where you rank in the EcoTrack community." }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 animate-fade-up text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Leaderboard</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Community <span className="gradient-text">champions</span></h1>
          <p className="mt-2 text-muted-foreground">The week's top changemakers.</p>
        </header>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 items-end">
          {[podium[1], podium[0], podium[2]].map((u, i) => {
            const heights = ["h-32 sm:h-40", "h-40 sm:h-52", "h-24 sm:h-32"];
            const tones = ["bg-muted", "bg-gradient-primary", "bg-accent"];
            const ranks = [2, 1, 3];
            return (
              <div key={u.name} className="text-center">
                <div className="glass rounded-2xl p-3 sm:p-4 mb-2 inline-flex flex-col items-center w-full">
                  <div className="text-3xl sm:text-4xl">{u.badge}</div>
                  <p className="mt-2 font-semibold text-sm sm:text-base truncate w-full">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.points.toLocaleString()} pts</p>
                </div>
                <div className={`${heights[i]} ${tones[i]} rounded-t-2xl grid place-items-center text-primary-foreground font-display font-bold text-2xl sm:text-3xl`}>
                  {ranks[i] === 1 ? <Crown className="h-7 w-7" /> : `#${ranks[i]}`}
                </div>
              </div>
            );
          })}
        </div>

        <Card className="glass border-0 overflow-hidden">
          <ul className="divide-y divide-border/50">
            {rest.map((u) => (
              <li key={u.rank} className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 ${u.you ? "bg-primary/10" : ""}`}>
                <span className="grid h-9 w-9 place-items-center rounded-full glass font-semibold shrink-0">{u.rank}</span>
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-2xl shrink-0">{u.badge}</span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{u.name}{u.you && <span className="ml-2 text-xs text-primary">(you)</span>}</p>
                    <p className="text-xs text-muted-foreground">{u.saved} kg CO₂ saved this month</p>
                  </div>
                </div>
                <span className="font-semibold text-sm sm:text-base tabular-nums">{u.points.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Medal className="h-4 w-4" /> Updated hourly · Reset every Monday
        </p>
      </div>
    </div>
  );
}
