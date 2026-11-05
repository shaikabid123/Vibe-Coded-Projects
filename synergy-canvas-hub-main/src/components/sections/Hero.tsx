import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Users, Cloud, Brain, Code2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { Counter } from "@/components/site/Counter";

const orbitCards = [
  { icon: Users, label: "Talent Network", grad: "gradient-primary", pos: "left-0 top-6" },
  { icon: Code2, label: "Development", grad: "gradient-emerald", pos: "right-2 top-0" },
  { icon: Brain, label: "AI Services", grad: "gradient-vibrant", pos: "left-6 bottom-8" },
  { icon: Cloud, label: "Cloud Infra", grad: "gradient-sunset", pos: "right-0 bottom-16" },
];

const floatStats = [
  { value: 80, suffix: "+", label: "Corporate Clients" },
  { value: 30, suffix: "K+", label: "Talent Network" },
  { value: 100, suffix: "%", label: "Quality" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
      <AnimatedBackground particles={22} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Left */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> Staffing &amp; Technology Partner
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Empowering Businesses with{" "}
            <span className="text-gradient">Talent &amp; Technology</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            SNN Technologies helps organizations build high-performing teams and
            scalable technology solutions through strategic staffing, IT
            outsourcing, software development, cloud transformation, analytics and
            AI services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outlineBrand" size="xl">
              <Link to="/outsourcing-services">Explore Services</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            {floatStats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-foreground sm:text-3xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — composed 3D-style visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-[480px]"
        >
          <div className="absolute inset-6 rounded-[2.5rem] gradient-vibrant opacity-20 blur-2xl" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="animate-spin-slow [animation-duration:40s]">
              <div className="h-64 w-64 rounded-full border border-dashed border-primary/30 sm:h-72 sm:w-72" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative grid h-32 w-32 place-items-center rounded-3xl gradient-vibrant text-electric-foreground shadow-elegant animate-float">
              <TrendingUp className="h-12 w-12" strokeWidth={1.6} />
            </div>
          </div>

          {orbitCards.map((card, i) => (
            <motion.div
              key={card.label}
              className={`absolute ${card.pos} glass rounded-2xl px-4 py-3 shadow-soft`}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${card.grad} text-electric-foreground`}>
                  <card.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">{card.label}</span>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-soft"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-gradient">100% Commitment</div>
              <div className="text-[11px] text-muted-foreground">to Quality &amp; Delivery</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
