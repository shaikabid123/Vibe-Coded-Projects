import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SNN Technologies — Empowering Businesses with Talent & Technology" },
      {
        name: "description",
        content:
          "Strategic staffing, IT outsourcing, software development, cloud transformation, analytics and AI services for high-performing teams and scalable technology.",
      },
      { property: "og:title", content: "SNN Technologies — Talent & Technology" },
      {
        property: "og:description",
        content:
          "Build high-performing teams and scalable technology solutions with SNN Technologies.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <AboutSection />
      <ApproachSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
