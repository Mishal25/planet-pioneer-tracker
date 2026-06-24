import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Leaf, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/calculator", label: "Calculator" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/challenges", label: "Challenges" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/resources", label: "Resources" },
] as const;


function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("eco-theme");
    const isDark = stored ? stored === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("eco-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

export function SiteLayout() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setEmail(session?.user.email ?? null);
        router.invalidate();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);
  const signOut = async () => { await supabase.auth.signOut(); };


  return (
    <div className="min-h-screen flex flex-col bg-hero">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-leaf/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-ocean/20 blur-3xl animate-blob" />
      </div>

      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary glow">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display font-bold text-lg tracking-tight truncate">EcoTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {email ? (
              <>
                <Link to="/history" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="gap-2"><User className="h-4 w-4" /> History</Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" title={email}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
            )}
            <Link to="/calculator" className="hidden sm:block">
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow">Get Started</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

        </div>

        {open && (
          <div className="md:hidden border-t border-border/50 px-4 py-2 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm",
                  pathname === n.to ? "bg-primary/15 text-primary" : "hover:bg-muted/50"
                )}
              >
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-border/50 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-display font-bold">EcoTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">Track your carbon footprint, build a greener future — one habit at a time.</p>
          </div>
          <FooterCol title="Product" items={[["Calculator","/calculator"],["Dashboard","/dashboard"],["Challenges","/challenges"]]} />
          <FooterCol title="Learn"   items={[["Resources","/resources"],["Leaderboard","/leaderboard"]]} />
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <p className="text-sm text-muted-foreground">hello@ecotrack.app</p>
            <div className="flex gap-3 mt-3 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Twitter</a>
              <a href="#" className="hover:text-primary">Instagram</a>
              <a href="#" className="hover:text-primary">GitHub</a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EcoTrack. Built for a cooler planet.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="hover:text-primary">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
