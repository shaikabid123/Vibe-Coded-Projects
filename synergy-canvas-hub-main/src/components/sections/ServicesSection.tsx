import { Link } from "@tanstack/react-router";
import { Check, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { coreServices } from "@/data/content";

export function ServicesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Core Services"
          title={<>Solutions That Drive Growth</>}
          subtitle="Helping organizations scale through talent, technology and innovation."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.08}>
              <article className="group hover-lift gradient-border gradient-border-hover relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${service.gradient} text-electric-foreground shadow-soft transition-transform duration-300 group-hover:scale-110`}
                >
                  <service.icon className="h-7 w-7" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <ul className="mt-5 grid gap-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 shrink-0 text-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/outsourcing-services"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Learn more <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
