import {
  Briefcase,
  ShieldCheck,
  Expand,
  Headphones,
  Lightbulb,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { whyChooseUs } from "@/data/content";

const icons: LucideIcon[] = [Briefcase, ShieldCheck, Expand, Headphones, Lightbulb, Handshake];

export function WhyChooseSection() {
  return (
    <section className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={<>Why Businesses Choose SNN Technologies</>}
          subtitle="The credibility of an enterprise partner with the agility of a modern technology company."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <div className="group hover-lift relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-vibrant opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:gradient-vibrant group-hover:text-electric-foreground">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
