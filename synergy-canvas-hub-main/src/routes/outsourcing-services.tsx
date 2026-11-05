import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Building2,
  Code2,
  Smartphone,
  Cloud,
  BarChart3,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";
import { outsourcingServices } from "@/data/content";

export const Route = createFileRoute("/outsourcing-services")({
  head: () => ({
    meta: [
      { title: "Outsourcing Services — SNN Technologies" },
      {
        name: "description",
        content:
          "Technology outsourcing that accelerates growth: IT outsourcing, software development, web & mobile apps, cloud & DevOps, data analytics and AI/ML.",
      },
      { property: "og:title", content: "Technology Outsourcing — SNN Technologies" },
      {
        property: "og:description",
        content: "Dedicated teams and managed services that scale with your business.",
      },
    ],
  }),
  component: OutsourcingPage,
});

const icons: LucideIcon[] = [Building2, Code2, Smartphone, Cloud, BarChart3, Brain];
const grads = [
  "gradient-primary",
  "gradient-vibrant",
  "gradient-emerald",
  "gradient-sunset",
  "gradient-primary",
  "gradient-vibrant",
];

function OutsourcingPage() {
  return (
    <>
      <PageHero
        eyebrow="Outsourcing Services"
        title={
          <>
            Technology Outsourcing That{" "}
            <span className="text-gradient">Accelerates Growth</span>
          </>
        }
        subtitle="Offload complexity to expert teams and focus on what matters most — your business."
      >
        <Button asChild variant="hero" size="xl">
          <Link to="/contact">
            Start a Project <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHero>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {outsourcingServices.map((s, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={s.title} delay={0.05}>
                <article className="hover-lift overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
                    <div className="p-8 sm:p-10">
                      <div className="flex items-center gap-4">
                        <span
                          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${grads[i]} text-electric-foreground shadow-soft`}
                        >
                          <Icon className="h-7 w-7" strokeWidth={1.8} />
                        </span>
                        <h2 className="text-2xl font-bold">{s.title}</h2>
                      </div>
                      <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
                        {s.overview}
                      </p>
                      <div className="mt-6">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Key Features
                        </h3>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-foreground/85">
                              <Check className="h-4 w-4 shrink-0 text-emerald" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button asChild variant="outlineBrand" className="mt-7">
                        <Link to="/contact">
                          Discuss This Service <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="relative gradient-aurora bg-surface p-8 sm:p-10">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Our Process
                      </h3>
                      <div className="mt-5 space-y-4">
                        {s.process.map((step, idx) => (
                          <div key={step} className="flex items-center gap-4">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-vibrant text-sm font-bold text-electric-foreground">
                              {idx + 1}
                            </span>
                            <span className="font-medium">{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 rounded-2xl glass p-5">
                        <h4 className="text-sm font-semibold">Benefits</h4>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Faster delivery, reduced costs and access to specialized expertise —
                          backed by 100% commitment to quality.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Let's accelerate your technology roadmap"
        subtitle="Partner with SNN Technologies for outsourcing that delivers measurable impact."
      />
    </>
  );
}
