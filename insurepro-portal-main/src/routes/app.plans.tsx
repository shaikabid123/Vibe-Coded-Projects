import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { inr } from "@/lib/format";
import { Shield, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Plan = {
  id: string; name: string; tier: string; monthly_premium: number; coverage_amount: number;
  hospital_network: string | null; benefits: string[] | null; waiting_period_months: number | null;
  maternity_coverage: boolean; is_active: boolean;
};

export const Route = createFileRoute("/app/plans")({
  head: () => ({ meta: [{ title: "Plans — InsureHub" }] }),
  component: Plans,
});

function emptyPlan(): Partial<Plan> {
  return { name: "", tier: "classic", monthly_premium: 0, coverage_amount: 0, benefits: [], waiting_period_months: 0, maternity_coverage: false, is_active: true };
}

function Plans() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("insurance_plans").select("*").order("monthly_premium");
    setPlans((data ?? []) as Plan[]);
  };
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      name: editing.name ?? "",
      tier: editing.tier ?? "classic",
      monthly_premium: Number(editing.monthly_premium ?? 0),
      coverage_amount: Number(editing.coverage_amount ?? 0),
      hospital_network: editing.hospital_network ?? null,
      benefits: Array.isArray(editing.benefits) ? editing.benefits : (editing.benefits as unknown as string ?? "").toString().split(",").map((s) => s.trim()).filter(Boolean),
      waiting_period_months: Number(editing.waiting_period_months ?? 0),
      maternity_coverage: !!editing.maternity_coverage,
      is_active: editing.is_active ?? true,
    };
    const res = editing.id
      ? await supabase.from("insurance_plans").update(payload).eq("id", editing.id)
      : await supabase.from("insurance_plans").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("insurance_plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Insurance plans</h1>
          <p className="text-sm text-muted-foreground">{isAdmin ? "Create and manage available plans." : "Available plans you can purchase."}</p>
        </div>
        {isAdmin && (
          <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
            <DialogTrigger asChild><Button onClick={() => setEditing(emptyPlan())}><Plus className="mr-2 h-4 w-4" />New plan</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editing?.id ? "Edit plan" : "New plan"}</DialogTitle></DialogHeader>
              {editing && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                  <div><Label>Tier (classic/bronze/premium)</Label><Input value={editing.tier ?? ""} onChange={(e) => setEditing({ ...editing, tier: e.target.value })} /></div>
                  <div><Label>Monthly premium ₹</Label><Input type="number" value={editing.monthly_premium ?? 0} onChange={(e) => setEditing({ ...editing, monthly_premium: Number(e.target.value) })} /></div>
                  <div><Label>Coverage amount ₹</Label><Input type="number" value={editing.coverage_amount ?? 0} onChange={(e) => setEditing({ ...editing, coverage_amount: Number(e.target.value) })} /></div>
                  <div className="md:col-span-2"><Label>Hospital network</Label><Input value={editing.hospital_network ?? ""} onChange={(e) => setEditing({ ...editing, hospital_network: e.target.value })} /></div>
                  <div className="md:col-span-2"><Label>Benefits (comma separated)</Label><Input value={Array.isArray(editing.benefits) ? editing.benefits.join(", ") : (editing.benefits as unknown as string) ?? ""} onChange={(e) => setEditing({ ...editing, benefits: e.target.value as unknown as string[] })} /></div>
                  <div><Label>Waiting period (months)</Label><Input type="number" value={editing.waiting_period_months ?? 0} onChange={(e) => setEditing({ ...editing, waiting_period_months: Number(e.target.value) })} /></div>
                  <div className="flex items-end gap-3">
                    <div className="flex items-center gap-2"><Switch checked={!!editing.maternity_coverage} onCheckedChange={(v) => setEditing({ ...editing, maternity_coverage: v })} /><Label>Maternity</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
                  </div>
                </div>
              )}
              <DialogFooter><Button onClick={save}>Save plan</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-accent/15 text-accent"><Shield className="h-4 w-4" /></span>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.tier}</div>
                </div>
              </div>
              {!p.is_active && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Inactive</span>}
            </div>
            <div className="mt-4 text-3xl font-semibold">{inr(p.monthly_premium)}<span className="text-sm font-normal text-muted-foreground">/employee/mo</span></div>
            <div className="mt-1 text-sm text-muted-foreground">Coverage up to {inr(p.coverage_amount)}</div>
            <ul className="mt-4 space-y-1.5 text-sm">
              {(p.benefits ?? []).map((b, i) => <li key={i} className="flex gap-2"><span className="text-accent">✓</span>{b}</li>)}
            </ul>
            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(p)}><Pencil className="mr-1 h-3 w-3" />Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="mr-1 h-3 w-3" />Delete</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}