import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { approachSteps } from "@/data/content";

export function ApproachSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Approach"
          title={<>How We Deliver Impact</>}
          subtitle="A proven, four-step framework that turns business goals into measurable outcomes."
        />

        <div className="relative mt-16">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 gradient-vibrant opacity-30 lg:block" />
          <div className="grid gap-8 lg:grid-cols-4">
            {approachSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.12}>
                <div className="relative text-center lg:text-left">
                  <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-vibrant text-lg font-bold text-electric-foreground shadow-glow lg:mx-0">
                    {step.step}
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
