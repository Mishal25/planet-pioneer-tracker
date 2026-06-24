import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, Trash2, TrendingDown, Loader2, Sparkles } from "lucide-react";

import { listPlans, deletePlan, type SavedPlan } from "@/lib/api/plans.functions";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Plan history — EcoTrack" },
      { name: "description", content: "Revisit every AI-generated weekly action plan you've saved." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const list = useServerFn(listPlans);
  const del = useServerFn(deletePlan);
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ai-plans"],
    queryFn: () => list(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-plans"] }),
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">History</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Your saved <span className="gradient-text">action plans</span></h1>
          <p className="mt-2 text-muted-foreground">Every plan you save from the calculator lives here.</p>
        </header>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        )}
        {isError && (
          <Card className="glass border-0 p-6 text-sm text-coral">{(error as Error)?.message}</Card>
        )}
        {data && data.length === 0 && (
          <Card className="glass border-0 p-10 text-center">
            <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="font-medium">No saved plans yet</p>
            <p className="text-sm text-muted-foreground mt-1">Generate a plan from the calculator and hit “Save to history”.</p>
          </Card>
        )}

        <div className="space-y-5">
          {data?.map((p) => <PlanCard key={p.id} plan={p} onDelete={() => deleteMut.mutate(p.id)} deleting={deleteMut.isPending && deleteMut.variables === p.id} />)}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, onDelete, deleting }: { plan: SavedPlan; onDelete: () => void; deleting: boolean }) {
  const date = new Date(plan.created_at);
  return (
    <Card className="glass border-0 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Weekly action plan</h3>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{plan.actions.length} actions</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Saved {date.toLocaleDateString(undefined, { dateStyle: "medium" })} · {date.toLocaleTimeString(undefined, { timeStyle: "short" })} · {plan.total_kg_per_day.toFixed(1)} kg CO₂/day at the time
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} disabled={deleting} className="text-muted-foreground hover:text-coral gap-1">
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete
        </Button>
      </div>

      <p className="text-sm leading-relaxed bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">{plan.summary}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {plan.actions.map((a, i) => (
          <div key={i} className="rounded-xl p-4 bg-muted/40 border border-border/50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{a.emoji}</span>
                <p className="font-medium truncate">{a.title}</p>
              </div>
              <Badge variant="secondary" className="capitalize text-[10px] shrink-0">{a.difficulty}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{a.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="flex items-center gap-1 text-leaf font-medium">
                <TrendingDown className="h-3 w-3" />
                −{a.impactKgPerWeek.toFixed(1)} kg/week
              </span>
              <span className="text-muted-foreground capitalize">· {a.category}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
