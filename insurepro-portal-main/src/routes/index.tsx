import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Shield, Building2, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InsureHub — Group Health Insurance for Modern Companies" },
      { name: "description", content: "Manage employees across branches, buy group health plans, and track policies in one dashboard." },
      { property: "og:title", content: "InsureHub — Group Health Insurance for Modern Companies" },
      { property: "og:description", content: "Manage employees across branches, buy group health plans, and track policies in one dashboard." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </span>
          InsureHub
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth"><Button size="sm">Get started</Button></Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built for HR teams & brokers
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Group health insurance, <span className="text-accent">finally simple.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Onboard branches, manage employees, compare plans, complete underwriting, and issue
            policies — all in one workspace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/auth"><Button size="lg" className="gap-2">Start free <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No card required", "Multi-branch ready", "AI plan recommendations"].map((f) => (
              <span key={f} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" /> {f}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { icon: Building2, title: "Multi-branch", desc: "Manage Hyderabad, Chennai, Bangalore and beyond from one dashboard." },
            { icon: Users, title: "Employee-first", desc: "Bulk import, medical underwriting, and per-employee coverage tracking." },
            { icon: Sparkles, title: "AI-assisted", desc: "Get plan recommendations matched to your headcount, budget and risk." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6">
              <Icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} InsureHub. All rights reserved.
      </footer>
    </div>
  );
}
