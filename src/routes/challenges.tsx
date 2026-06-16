import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { challenges } from "@/lib/eco-data";
import { CheckCircle2, Circle, Trophy } from "lucide-react";

export const Route = createFileRoute("/challenges")({
  head: () => ({ meta: [{ title: "Eco Challenges — EcoTrack" }, { name: "description", content: "Take daily and weekly eco challenges, earn points, and turn sustainability into a game worth winning." }] }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [done, setDone] = useState<Set<number>>(new Set([1, 3]));
  const toggle = (id: number) =>
    setDone((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const points = challenges.filter((c) => done.has(c.id)).reduce((a, c) => a + c.points, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between mb-10 animate-fade-up">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Challenges</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold truncate">Make doing good <span className="gradient-text">addictive</span></h1>
            <p className="mt-2 text-muted-foreground">Complete tasks. Earn points. Climb the leaderboard.</p>
          </div>
          <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0">
            <Trophy className="h-5 w-5 text-sun" />
            <div>
              <p className="text-xs text-muted-foreground">Points earned</p>
              <p className="font-display font-bold text-xl">{points}</p>
            </div>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((c) => {
            const isDone = done.has(c.id);
            return (
              <Card key={c.id} className={`glass border-0 p-5 transition ${isDone ? "ring-2 ring-primary" : "hover:-translate-y-0.5"}`}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">{c.period}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-lg">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-sun">+{c.points} pts</span>
                  <Button
                    size="sm"
                    variant={isDone ? "default" : "outline"}
                    className={isDone ? "bg-gradient-primary text-primary-foreground" : "glass"}
                    onClick={() => toggle(c.id)}
                  >
                    {isDone ? <><CheckCircle2 className="h-4 w-4 mr-1" /> Done</> : <><Circle className="h-4 w-4 mr-1" /> Complete</>}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
