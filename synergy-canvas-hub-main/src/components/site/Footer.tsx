import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Github, Facebook, Mail, Phone, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Why Choose Us", to: "/about" },
      { label: "Our Approach", to: "/about" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Staffing Services", to: "/staffing-services" },
      { label: "Outsourcing Services", to: "/outsourcing-services" },
      { label: "Software Development", to: "/outsourcing-services" },
      { label: "Cloud & DevOps", to: "/outsourcing-services" },
    ],
  },
  {
    title: "Careers",
    links: [
      { label: "Open Roles", to: "/careers" },
      { label: "Life at SNN", to: "/careers" },
      { label: "Apply Now", to: "/careers" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
] as const;

const socials = [
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Github, label: "GitHub" },
  { Icon: Facebook, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden gradient-dark text-slate-200">
      <div className="pointer-events-none absolute inset-0 gradient-aurora opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr]">
          <div className="space-y-5">
            <Logo className="[&_*]:text-white" />
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              Empowering businesses with talent &amp; technology through strategic
              staffing, IT outsourcing and modern engineering.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/15"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-slate-300 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="text-sm text-slate-300">
              Insights on talent &amp; technology, delivered occasionally.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("You're subscribed. Welcome aboard!");
                (e.currentTarget as HTMLFormElement).reset();
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                required
                placeholder="you@company.com"
                className="border-white/15 bg-white/10 text-white placeholder:text-slate-400"
              />
              <Button type="submit" variant="hero" size="icon" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="space-y-2 text-sm text-slate-300">
              <a href="mailto:info@snntechnologies.com" className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4" /> info@snntechnologies.com
              </a>
              <a href="tel:+10000000000" className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4" /> +1 (XXX) XXX-XXXX
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© 2026 SNN Technologies. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
