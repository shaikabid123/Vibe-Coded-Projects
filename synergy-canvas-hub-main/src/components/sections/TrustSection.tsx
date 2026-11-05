import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { stats } from "@/data/content";

const logos = ["Northwind", "Acme Corp", "Vertex", "Lumina", "Quantix", "Brightwave"];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-surface px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted By Growing Businesses
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((logo) => (
              <span
                key={logo}
                className="font-display text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="hover-lift rounded-2xl border border-border bg-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient sm:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
