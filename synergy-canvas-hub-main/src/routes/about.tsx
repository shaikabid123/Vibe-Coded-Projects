import { createFileRoute } from "@tanstack/react-router";
import { Target, Layers, Award, Handshake, Eye, Rocket } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { CTASection } from "@/components/site/CTASection";
import { stats } from "@/data/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SNN Technologies" },
      {
        name: "description",
        content:
          "SNN Technologies is a trusted staffing and technology services company helping organizations modernize operations, build skilled teams and achieve measurable outcomes.",
      },
      { property: "og:title", content: "About SNN Technologies" },
      {
        property: "og:description",
        content: "Building strong teams and delivering smart technology for global businesses.",
      },
    ],
  }),
  component: AboutPage,
});

const highlights = [
  { icon: Target, title: "Client-Centric Approach", text: "Your goals shape every decision we make." },
  { icon: Layers, title: "Flexible Engagement Models", text: "Scale up or down with adaptable contracts." },
  { icon: Award, title: "Proven Expertise", text: "A track record of measurable business outcomes." },
  { icon: Handshake, title: "Long-Term Partnerships", text: "We invest in lasting, trusted relationships." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Building Strong Teams.{" "}
            <span className="text-gradient">Delivering Smart Technology.</span>
          </>
        }
        subtitle="A trusted staffing and technology services partner committed to measurable business outcomes."
      />

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-5 text-pretty leading-relaxed text-muted-foreground">
              <p>
                SNN Technologies is a trusted staffing and technology services company
                committed to helping organizations modernize operations, build skilled
                teams and achieve measurable business outcomes.
              </p>
              <p>
                We combine industry insight, technical expertise and execution
                excellence to deliver scalable solutions aligned with long-term business
                goals. From sourcing exceptional talent to engineering modern cloud and
                AI platforms, we operate as a true extension of your team.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {stats.slice(0, 4).map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold text-gradient">
                      <Counter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="hover-lift rounded-2xl gradient-vibrant p-7 text-electric-foreground sm:col-span-2">
                <Eye className="h-8 w-8" />
                <h3 className="mt-4 text-lg font-bold">Our Vision</h3>
                <p className="mt-2 text-sm text-white/90">
                  To be the most trusted partner for businesses building world-class teams
                  and transformative technology.
                </p>
              </div>
              <div className="hover-lift rounded-2xl border border-border bg-card p-7">
                <Rocket className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-bold">Our Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Empower organizations to scale with the right talent and technology.
                </p>
              </div>
              <div className="hover-lift rounded-2xl border border-border bg-card p-7">
                <Award className="h-7 w-7 text-emerald" />
                <h3 className="mt-4 font-bold">Our Values</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Integrity, excellence and partnership in everything we deliver.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What Sets Us Apart"
            title={<>Highlights That Define Us</>}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <ApproachSection />
      <WhyChooseSection />
      <CTASection />
    </>
  );
}
