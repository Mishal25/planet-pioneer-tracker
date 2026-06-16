import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/eco-data";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [{ title: "Educational Resources — EcoTrack" }, { name: "description", content: "Articles, guides and tips on climate change, renewable energy, sustainable living, and reducing your carbon footprint." }] }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 animate-fade-up max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Resources</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Learn the <span className="gradient-text">science</span> behind your habits</h1>
          <p className="mt-3 text-muted-foreground">Short, honest reads on climate, energy, and the everyday choices that move the needle.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <Card key={a.id} className="glass border-0 overflow-hidden hover:-translate-y-1 transition group cursor-pointer">
              <div className="h-40 grid place-items-center text-6xl bg-gradient-primary/10 border-b border-border/50 group-hover:scale-105 transition-transform">
                {a.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">{a.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{a.read}</span>
                </div>
                <h3 className="font-semibold text-lg leading-snug">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
