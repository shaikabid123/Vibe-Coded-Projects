import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, UserCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";
import { staffingServices } from "@/data/content";

export const Route = createFileRoute("/staffing-services")({
  head: () => ({
    meta: [
      { title: "Staffing Services — SNN Technologies" },
      {
        name: "description",
        content:
          "Strategic staffing solutions: executive recruitment, permanent and temporary staffing, campus hiring, talent acquisition and manpower consultancy.",
      },
      { property: "og:title", content: "Strategic Staffing Solutions — SNN Technologies" },
      {
        property: "og:description",
        content: "Build high-performing teams with the right people, fast.",
      },
    ],
  }),
  component: StaffingPage,
});

function StaffingPage() {
  return (
    <>
      <PageHero
        eyebrow="Staffing Services"
        title={
          <>
            Strategic <span className="text-gradient">Staffing Solutions</span>
          </>
        }
        subtitle="From C-suite search to high-volume campus drives — we connect you with talent that drives results."
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">
            Hire Talent <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {staffingServices.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08}>
              <article className="group hover-lift flex h-full flex-col rounded-2xl border border-border bg-card p-8">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-vibrant text-electric-foreground shadow-soft transition-transform group-hover:scale-110">
                    <UserCheck className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h2 className="text-xl font-bold">{s.title}</h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <ul className="mt-5 grid gap-2.5">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-foreground/85">
                      <Check className="h-4 w-4 shrink-0 text-emerald" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outlineBrand" className="mt-7 w-fit">
                  <Link to="/contact">
                    Request Talent <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title="Need to scale your team quickly?"
        subtitle="Tell us your hiring goals and we'll match you with pre-vetted, high-quality talent."
      />
    </>
  );
}
