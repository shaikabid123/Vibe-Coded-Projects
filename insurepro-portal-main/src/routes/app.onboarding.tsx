import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/app/onboarding")({
  head: () => ({ meta: [{ title: "Set up your company — InsureHub" }] }),
  component: Onboarding,
});

function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", gst_number: "", contact_person: "", email: "", mobile: "", address: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("companies")
      .insert({ ...form, owner_id: user.id })
      .select("id")
      .single();
    if (error) { setLoading(false); return toast.error(error.message); }
    await supabase.from("profiles").update({ company_id: data.id }).eq("id", user.id);
    toast.success("Company created!");
    router.navigate({ to: "/app/branches" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Tell us about your company</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll use this for policy documents and contracts.</p>
      <Card className="mt-6 p-6">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field id="name" label="Company name *" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field id="gst" label="GST number" value={form.gst_number} onChange={(v) => setForm({ ...form, gst_number: v })} />
          <Field id="cp" label="Contact person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} />
          <Field id="email" label="Contact email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field id="mob" label="Mobile" value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v })} />
          <div className="md:col-span-2">
            <Label htmlFor="addr">Address</Label>
            <Input id="addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <Button type="submit" className="md:col-span-2" disabled={loading}>Create company</Button>
        </form>
      </Card>
    </div>
  );
}

function Field(props: { id: string; label: string; type?: string; required?: boolean; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor={props.id}>{props.label}</Label>
      <Input id={props.id} type={props.type} required={props.required} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}