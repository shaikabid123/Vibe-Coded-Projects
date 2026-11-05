import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { AnimatedBackground } from "./AnimatedBackground";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

export function CTASection({
  title = "Ready to build your high-performing team?",
  subtitle = "Partner with SNN Technologies to scale talent and technology with confidence.",
}: CTASectionProps) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl gradient-dark px-6 py-16 text-center shadow-elegant sm:px-12">
        <AnimatedBackground particles={10} />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-slate-300">{subtitle}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="glass"
                className="text-white [&]:bg-white/10"
              >
                <Link to="/contact">Talk to Experts</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
