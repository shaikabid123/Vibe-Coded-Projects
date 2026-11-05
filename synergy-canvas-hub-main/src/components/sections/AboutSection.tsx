import { Link } from "@tanstack/react-router";
import { ArrowRight, Target, Layers, Award, Handshake } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: Target, title: "Client-Centric Approach", text: "Your goals shape every decision we make." },
  { icon: Layers, title: "Flexible Engagement Models", text: "Scale up or down with adaptable contracts." },
  { icon: Award, title: "Proven Expertise", text: "A track record of measurable business outcomes." },
  { icon: Handshake, title: "Long-Term Partnerships", text: "We invest in lasting, trusted relationships." },
];

export function AboutSection() {
  return (
    <section className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full gradient-vibrant" /> About Us
            </span>
            <h2 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-[2.75rem]">
              Building Strong Teams. Delivering Smart Technology.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              SNN Technologies is a trusted staffing and technology services company
              committed to helping organizations modernize operations, build skilled
              teams and achieve measurable business outcomes.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              We combine industry insight, technical expertise and execution excellence
              to deliver scalable solutions aligned with long-term business goals.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/about">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.08}>
              <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-electric-foreground">
                  <h.icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-semibold">{h.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
