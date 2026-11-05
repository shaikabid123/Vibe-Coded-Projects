import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Upload,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — SNN Technologies" },
      {
        name: "description",
        content:
          "Build your career with SNN Technologies. Career growth, continuous learning, diverse opportunities and a supportive culture. Apply now.",
      },
      { property: "og:title", content: "Careers at SNN Technologies" },
      {
        property: "og:description",
        content: "Join a team where talent thrives. Explore opportunities and apply today.",
      },
    ],
  }),
  component: CareersPage,
});

const features = [
  { icon: TrendingUp, title: "Career Growth", text: "Clear paths, mentorship and real ownership." },
  { icon: GraduationCap, title: "Continuous Learning", text: "Certifications, training and learning budgets." },
  { icon: Globe2, title: "Diverse Opportunities", text: "Work across industries, domains and technologies." },
  { icon: HeartHandshake, title: "Supportive Culture", text: "Collaborative, inclusive and people-first." },
];

function CareersPage() {
  const [fileName, setFileName] = useState("");

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build Your Career With{" "}
            <span className="text-gradient">SNN Technologies</span>
          </>
        }
        subtitle="Join a team where talent thrives. We invest in your growth as much as our clients' success."
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl gradient-vibrant text-electric-foreground">
                    <f.icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Apply Now"
            title={<>Send Us Your Resume</>}
            subtitle="Tell us about yourself and we'll be in touch about matching opportunities."
          />

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Application submitted! Our team will reach out soon.");
                (e.currentTarget as HTMLFormElement).reset();
                setFileName("");
              }}
              className="mt-10 grid gap-5 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required placeholder="Jane Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="jane@email.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required placeholder="+1 (555) 000-0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" required placeholder="e.g. Software Engineer" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="resume">Upload Resume</Label>
                <label
                  htmlFor="resume"
                  className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                >
                  {fileName ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald" />
                      <span className="font-medium text-foreground">{fileName}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Click to upload (PDF, DOC — max 5MB)</span>
                    </>
                  )}
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
              </div>

              <Button type="submit" variant="hero" size="xl" className="w-full">
                Apply Now
              </Button>

              <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Or email us at{" "}
                <a href="mailto:careers@snntechnologies.com" className="font-medium text-primary">
                  careers@snntechnologies.com
                </a>
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
