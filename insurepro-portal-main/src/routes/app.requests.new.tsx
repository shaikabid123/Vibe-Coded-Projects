import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyCompanyId } from "@/lib/company";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inr } from "@/lib/format";
import { calculatePremium, type MedicalFlags } from "@/lib/pricing";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Branch = { id: string; name: string; city: string };
type Plan = { id: string; name: string; tier: string; monthly_premium: number; coverage_amount: number };
type Emp = { id: string; first_name: string; last_name: string | null; dob: string | null; department: string | null; email: string | null };

type Med = MedicalFlags & { existing_diseases?: string; current_medications?: string };

export const Route = createFileRoute("/app/requests/new")({
  head: () => ({ meta: [{ title: "New Request — InsureHub" }] }),
  component: NewRequest,
});

const STEPS = ["Branch", "Employees", "Plan", "Medical", "Review"];

function NewRequest() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [branchId, setBranchId] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [planId, setPlanId] = useState<string>("");
  const [medical, setMedical] = useState<Record<string, Med>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const cid = await getMyCompanyId();
      if (!cid) return;
      const [{ data: brs }, { data: pls }] = await Promise.all([
        supabase.from("branches").select("id,name,city").eq("company_id", cid),
        supabase.from("insurance_plans").select("id,name,tier,monthly_premium,coverage_amount").eq("is_active", true).order("monthly_premium"),
      ]);
      setBranches((brs ?? []) as Branch[]);
      setPlans((pls ?? []) as Plan[]);
    })();
  }, []);

  useEffect(() => {
    if (!branchId) return setEmployees([]);
    (async () => {
      const cid = await getMyCompanyId();
      if (!cid) return;
      const { data } = await supabase
        .from("employees")
        .select("id,first_name,last_name,dob,department,email")
        .eq("company_id", cid)
        .eq("branch_id", branchId);
      setEmployees((data ?? []) as Emp[]);
    })();
  }, [branchId]);

  const plan = plans.find((p) => p.id === planId);
  const selectedEmps = employees.filter((e) => selected.has(e.id));
  const pricing = plan ? calculatePremium(plan.monthly_premium, selectedEmps.map((e) => ({ dob: e.dob, medical: medical[e.id] }))) : null;

  const canNext = () => {
    if (step === 0) return !!branchId;
    if (step === 1) return selected.size > 0;
    if (step === 2) return !!planId;
    if (step === 3) return true;
    return true;
  };

  async function submit() {
    if (!plan || !pricing) return;
    setSubmitting(true);
    const cid = await getMyCompanyId();
    const { data: { user } } = await supabase.auth.getUser();
    if (!cid || !user) return setSubmitting(false);
    const { data: req, error } = await supabase.from("insurance_requests").insert({
      company_id: cid, branch_id: branchId, plan_id: planId, status: "submitted",
      employee_count: selectedEmps.length, base_premium: pricing.base, risk_loading: pricing.riskLoading,
      tax: pricing.tax, total_amount: pricing.total, created_by: user.id,
    }).select("id,request_number").single();
    if (error || !req) { setSubmitting(false); return toast.error(error?.message ?? "Failed"); }
    await supabase.from("request_employees").insert(selectedEmps.map((e) => ({ request_id: req.id, employee_id: e.id })));
    await supabase.from("medical_records").insert(selectedEmps.map((e) => ({
      request_id: req.id, employee_id: e.id,
      ...(medical[e.id] ?? {}),
    })));
    await supabase.from("notifications").insert({
      user_id: user.id, title: "Request submitted",
      body: `${req.request_number} submitted for review.`, link: `/app/requests/${req.id}`,
    });
    toast.success("Request submitted!");
    router.navigate({ to: "/app/requests/$id", params: { id: req.id } });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New insurance request</h1>
        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Label>Select branch</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger className="max-w-md"><SelectValue placeholder="Pick a branch" /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} — {b.city}</SelectItem>)}</SelectContent>
            </Select>
            {branches.length === 0 && <p className="text-sm text-muted-foreground">No branches yet. Add one first under Branches.</p>}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select employees ({selected.size} of {employees.length})</Label>
              <Button variant="ghost" size="sm" onClick={() => setSelected(selected.size === employees.length ? new Set() : new Set(employees.map((e) => e.id)))}>
                {selected.size === employees.length ? "Clear" : "Select all"}
              </Button>
            </div>
            <div className="max-h-96 overflow-auto rounded-md border">
              {employees.map((e) => (
                <label key={e.id} className="flex cursor-pointer items-center gap-3 border-b px-3 py-2 last:border-0 hover:bg-muted/50">
                  <Checkbox checked={selected.has(e.id)} onCheckedChange={(v) => {
                    const next = new Set(selected); v ? next.add(e.id) : next.delete(e.id); setSelected(next);
                  }} />
                  <div className="flex-1">
                    <div className="font-medium">{e.first_name} {e.last_name ?? ""}</div>
                    <div className="text-xs text-muted-foreground">{e.department ?? "—"} · {e.email ?? ""}</div>
                  </div>
                </label>
              ))}
              {employees.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No employees in this branch.</div>}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-3 md:grid-cols-3">
            {plans.map((p) => (
              <button type="button" key={p.id} onClick={() => setPlanId(p.id)} className={`rounded-lg border p-4 text-left transition ${planId === p.id ? "border-accent ring-2 ring-accent/30" : "hover:border-accent/40"}`}>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.tier}</div>
                <div className="mt-1 font-semibold">{p.name}</div>
                <div className="mt-3 text-2xl font-semibold">{inr(p.monthly_premium)}<span className="text-xs text-muted-foreground">/emp/mo</span></div>
                <div className="mt-1 text-xs text-muted-foreground">Cover {inr(p.coverage_amount)}</div>
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Capture medical declarations for each selected employee.</p>
            <div className="space-y-3">
              {selectedEmps.map((e) => {
                const m = medical[e.id] ?? {};
                const flags: { key: keyof MedicalFlags; label: string }[] = [
                  { key: "diabetes", label: "Diabetes" }, { key: "hypertension", label: "Hypertension" },
                  { key: "heart_disease", label: "Heart disease" }, { key: "asthma", label: "Asthma" },
                  { key: "cancer_history", label: "Cancer history" }, { key: "smoking", label: "Smoking" },
                  { key: "alcohol", label: "Alcohol" }, { key: "pregnancy", label: "Pregnancy" },
                ];
                return (
                  <details key={e.id} className="rounded-md border p-3">
                    <summary className="cursor-pointer font-medium">{e.first_name} {e.last_name}</summary>
                    <div className="mt-3 grid gap-2 md:grid-cols-4">
                      {flags.map((f) => (
                        <label key={f.key} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={!!m[f.key]} onCheckedChange={(v) => setMedical({ ...medical, [e.id]: { ...m, [f.key]: !!v } })} />
                          {f.label}
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <Textarea placeholder="Existing diseases" value={m.existing_diseases ?? ""} onChange={(e2) => setMedical({ ...medical, [e.id]: { ...m, existing_diseases: e2.target.value } })} />
                      <Textarea placeholder="Current medications" value={m.current_medications ?? ""} onChange={(e2) => setMedical({ ...medical, [e.id]: { ...m, current_medications: e2.target.value } })} />
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
        {step === 4 && pricing && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h3 className="font-semibold">Summary</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <Row label="Branch" value={branches.find((b) => b.id === branchId)?.name ?? ""} />
                  <Row label="Plan" value={plan?.name ?? ""} />
                  <Row label="Employees" value={String(selectedEmps.length)} />
                  <Row label="Coverage / employee" value={inr(plan?.coverage_amount ?? 0)} />
                </dl>
              </Card>
              <Card className="p-4 bg-primary text-primary-foreground">
                <h3 className="font-semibold">Annual premium</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <Row label="Base" value={inr(pricing.base)} dark />
                  <Row label="Risk loading" value={inr(pricing.riskLoading)} dark />
                  <Row label="GST (18%)" value={inr(pricing.tax)} dark />
                  <div className="my-2 border-t border-primary-foreground/20" />
                  <Row label="Total" value={inr(pricing.total)} bold dark />
                </dl>
              </Card>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canNext()} onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit request
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value, bold, dark }: { label: string; value: string; bold?: boolean; dark?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={dark ? "text-primary-foreground/70" : "text-muted-foreground"}>{label}</dt>
      <dd className={bold ? "font-semibold" : ""}>{value}</dd>
    </div>
  );
}