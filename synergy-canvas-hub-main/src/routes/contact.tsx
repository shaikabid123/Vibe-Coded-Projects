import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Briefcase, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — SNN Technologies" },
      {
        name: "description",
        content:
          "Get in touch with SNN Technologies. Book a consultation, talk to our experts, or reach us at info@snntechnologies.com.",
      },
      { property: "og:title", content: "Contact SNN Technologies" },
      {
        property: "og:description",
        content: "Let's discuss how we can help you scale talent and technology.",
      },
    ],
  }),
  component: ContactPage,
});

const info = [
  { icon: Mail, label: "General", value: "info@snntechnologies.com", href: "mailto:info@snntechnologies.com" },
  { icon: Briefcase, label: "Careers", value: "careers@snntechnologies.com", href: "mailto:careers@snntechnologies.com" },
  { icon: Phone, label: "Phone", value: "+1 (XXX) XXX-XXXX", href: "tel:+10000000000" },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            Let's Build Something{" "}
            <span className="text-gradient">Great Together</span>
          </>
        }
        subtitle="Book a consultation or send us a message — our experts typically respond within one business day."
      />

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* Left — contact info */}
          <Reveal>
            <div className="flex h-full flex-col gap-5">
              <div className="rounded-3xl gradient-dark p-8 text-slate-200 shadow-elegant">
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Reach out through any channel — we're here to help.
                </p>
                <div className="mt-8 space-y-5">
                  {info.map((c) => (
                    <a key={c.label} href={c.href} className="group flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white transition-colors group-hover:bg-white/20">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-wider text-slate-400">
                          {c.label}
                        </span>
                        <span className="block font-medium text-white">{c.value}</span>
                      </span>
                    </a>
                  ))}
                </div>
                <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
                  <p className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" /> Global Delivery Centers
                  </p>
                  <p className="flex items-center gap-3">
                    <Clock className="h-4 w-4" /> Mon–Fri, 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent! We'll get back to you shortly.");
                (e.currentTarget as HTMLFormElement).reset();
              }}
              className="grid gap-5 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" required placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" type="email" required placeholder="you@company.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-company">Company</Label>
                  <Input id="c-company" placeholder="Company name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="c-phone">Phone</Label>
                  <Input id="c-phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  required
                  rows={5}
                  placeholder="Tell us about your goals or project..."
                />
              </div>
              <Button type="submit" variant="hero" size="xl" className="w-full">
                Send Message
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <div className="pb-12" />
    </>
  );
}
