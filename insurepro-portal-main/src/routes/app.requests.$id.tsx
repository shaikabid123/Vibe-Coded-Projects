import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { inr, fmtDate, statusColor, statusLabel } from "@/lib/format";
import { Loader2, CreditCard, FileText, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";

type Req = {
  id: string; request_number: string; status: string; employee_count: number;
  base_premium: number; risk_loading: number; tax: number; total_amount: number;
  admin_notes: string | null; created_at: string;
  branches: { name: string; city: string } | null;
  insurance_plans: { id: string; name: string; tier: string; coverage_amount: number } | null;
  companies: { name: string; address: string | null; gst_number: string | null } | null;
};
type EmpRow = { employees: { id: string; first_name: string; last_name: string | null; email: string | null } };
type Pay = { id: string; amount: number; method: string | null; status: string; transaction_ref: string | null; paid_at: string | null };
type Pol = { id: string; policy_number: string; start_date: string; end_date: string; coverage_amount: number; premium_paid: number; employee_count: number };
type Status = "draft"|"submitted"|"under_review"|"approved"|"payment_pending"|"payment_completed"|"policy_generated"|"closed"|"rejected";

const STATUSES = ["draft","submitted","under_review","approved","payment_pending","payment_completed","policy_generated","closed","rejected"];

export const Route = createFileRoute("/app/requests/$id")({
  head: () => ({ meta: [{ title: "Request — InsureHub" }] }),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = useParams({ from: "/app/requests/$id" });
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const [req, setReq] = useState<Req | null>(null);
  const [emps, setEmps] = useState<EmpRow[]>([]);
  const [pay, setPay] = useState<Pay | null>(null);
  const [policy, setPolicy] = useState<Pol | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState("credit_card");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: r } = await supabase
      .from("insurance_requests")
      .select("*,branches(name,city),insurance_plans(id,name,tier,coverage_amount),companies(name,address,gst_number)")
      .eq("id", id).maybeSingle();
    setReq(r as Req | null);
    const { data: e } = await supabase.from("request_employees").select("employees(id,first_name,last_name,email)").eq("request_id", id);
    setEmps((e ?? []) as unknown as EmpRow[]);
    const { data: p } = await supabase.from("payments").select("*").eq("request_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    setPay(p as Pay | null);
    const { data: pol } = await supabase.from("policies").select("*").eq("request_id", id).maybeSingle();
    setPolicy(pol as Pol | null);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(status: string) {
    setBusy(true);
    const { error } = await supabase.from("insurance_requests").update({ status: status as Status }).eq("id", id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Status updated"); load();
  }

  async function initiatePayment() {
    if (!req) return;
    setBusy(true);
    // Record a payment row in pending state and move request to payment_pending
    const { data: p } = await supabase.from("payments").insert({
      request_id: req.id, amount: req.total_amount, method: payMethod, status: "pending",
    }).select("*").single();
    setPay(p as Pay);
    await supabase.from("insurance_requests").update({ status: "payment_pending" }).eq("id", req.id);
    setBusy(false); setPayOpen(false);
    toast.message("Payment initiated. Complete it on the next screen.");
    load();
  }

  async function confirmPayment() {
    if (!pay || !req) return;
    setBusy(true);
    // Simulated successful payment confirmation (real Razorpay flow would happen client-side via SDK)
    const ref = "TXN-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    await supabase.from("payments").update({ status: "completed", transaction_ref: ref, paid_at: new Date().toISOString() }).eq("id", pay.id);
    await supabase.from("insurance_requests").update({ status: "payment_completed" }).eq("id", req.id);
    // Generate policy
    if (req.insurance_plans) {
      const { data: newPol } = await supabase.from("policies").insert({
        request_id: req.id,
        company_id: (await supabase.from("insurance_requests").select("company_id").eq("id", req.id).single()).data!.company_id,
        plan_id: req.insurance_plans.id,
        employee_count: req.employee_count,
        coverage_amount: req.insurance_plans.coverage_amount,
        premium_paid: req.total_amount,
      }).select("*").single();
      setPolicy(newPol as Pol);
      await supabase.from("insurance_requests").update({ status: "policy_generated" }).eq("id", req.id);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("notifications").insert({
          user_id: user.id, title: "Policy generated",
          body: `Policy ${(newPol as Pol).policy_number} is ready.`, link: `/app/requests/${req.id}`,
        });
      }
    }
    setBusy(false);
    toast.success("Payment successful · Policy generated");
    load();
  }

  function downloadPdf() {
    if (!policy || !req) return;
    const html = policyHtml(policy, req, emps);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }

  if (!req) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Request</div>
          <h1 className="text-2xl font-semibold">{req.request_number}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(req.status)}`}>{statusLabel(req.status)}</span>
            · Created {fmtDate(req.created_at)}
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Select value={req.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h3 className="mb-3 font-semibold">Details</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <D label="Branch" value={req.branches ? `${req.branches.name} — ${req.branches.city}` : "—"} />
            <D label="Plan" value={req.insurance_plans?.name ?? "—"} />
            <D label="Coverage" value={inr(req.insurance_plans?.coverage_amount ?? 0)} />
            <D label="Employees" value={String(req.employee_count)} />
          </dl>
          <h4 className="mt-6 mb-2 font-semibold">Covered employees</h4>
          <ul className="divide-y rounded-md border">
            {emps.map((e) => (
              <li key={e.employees.id} className="flex justify-between px-3 py-2 text-sm">
                <span>{e.employees.first_name} {e.employees.last_name ?? ""}</span>
                <span className="text-muted-foreground">{e.employees.email ?? ""}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Premium</h3>
          <dl className="space-y-2 text-sm">
            <D label="Base" value={inr(req.base_premium)} />
            <D label="Risk loading" value={inr(req.risk_loading)} />
            <D label="GST" value={inr(req.tax)} />
            <div className="my-2 border-t" />
            <D label="Total" value={inr(req.total_amount)} bold />
          </dl>
          <div className="mt-4 space-y-2">
            {req.status === "approved" && !pay && (
              <Dialog open={payOpen} onOpenChange={setPayOpen}>
                <DialogTrigger asChild><Button className="w-full"><CreditCard className="mr-2 h-4 w-4" />Pay {inr(req.total_amount)}</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Payment method</DialogTitle></DialogHeader>
                  <Select value={payMethod} onValueChange={setPayMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                  <DialogFooter><Button onClick={initiatePayment} disabled={busy}>Initiate payment</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {pay && pay.status === "pending" && (
              <Button className="w-full" onClick={confirmPayment} disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm payment ({pay.method?.replace("_", " ")})
              </Button>
            )}
            {pay && pay.status === "completed" && (
              <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
                ✓ Paid · {pay.transaction_ref} · {fmtDate(pay.paid_at ?? "")}
              </div>
            )}
            {req.status === "submitted" && isAdmin && (
              <>
                <Button className="w-full" variant="outline" onClick={() => updateStatus("under_review")}>Move to review</Button>
              </>
            )}
            {(req.status === "submitted" || req.status === "under_review") && isAdmin && (
              <Button className="w-full" onClick={() => updateStatus("approved")}>Approve</Button>
            )}
          </div>
        </Card>
      </div>

      {policy && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Policy {policy.policy_number}</h3>
            </div>
            <Button variant="outline" onClick={downloadPdf}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <D label="Start" value={fmtDate(policy.start_date)} />
            <D label="End" value={fmtDate(policy.end_date)} />
            <D label="Coverage" value={inr(policy.coverage_amount)} />
            <D label="Premium" value={inr(policy.premium_paid)} />
          </dl>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="mb-2 font-semibold flex items-center gap-2"><FileText className="h-4 w-4" />Workflow</h3>
        <ol className="flex flex-wrap gap-2 text-xs">
          {STATUSES.filter((s) => s !== "rejected").map((s) => {
            const reached = STATUSES.indexOf(req.status) >= STATUSES.indexOf(s);
            return <li key={s} className={`rounded-full px-2 py-1 ${reached ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{statusLabel(s)}</li>;
          })}
        </ol>
      </Card>
    </div>
  );
}

function D({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className={bold ? "font-semibold" : ""}>{value}</dd></div>;
}

function policyHtml(policy: Pol, req: Req, emps: EmpRow[]) {
  const empRows = emps.map((e) => `<tr><td>${e.employees.first_name} ${e.employees.last_name ?? ""}</td><td>${e.employees.email ?? ""}</td></tr>`).join("");
  return `<!doctype html><html><head><title>${policy.policy_number}</title>
  <style>
    body{font-family:system-ui,-apple-system,Arial;color:#111;padding:40px;max-width:800px;margin:auto}
    .head{display:flex;justify-content:space-between;border-bottom:3px solid #0e7490;padding-bottom:12px}
    h1{margin:0;color:#0c4a6e}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
    th{background:#f1f5f9}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:20px 0}
    .label{color:#64748b;font-size:11px;text-transform:uppercase}
    .value{font-weight:600}
    .qr{display:inline-block;padding:8px;background:#0c4a6e;color:white;border-radius:6px;font-family:monospace;font-size:11px;margin-top:24px}
  </style></head><body>
  <div class="head"><div><h1>InsureHub</h1><div>Group Health Insurance Policy</div></div>
  <div style="text-align:right"><div class="label">Policy #</div><div class="value">${policy.policy_number}</div></div></div>
  <div class="grid">
    <div><div class="label">Company</div><div class="value">${req.companies?.name ?? ""}</div></div>
    <div><div class="label">GST</div><div class="value">${req.companies?.gst_number ?? "—"}</div></div>
    <div><div class="label">Plan</div><div class="value">${req.insurance_plans?.name ?? ""}</div></div>
    <div><div class="label">Coverage</div><div class="value">₹${policy.coverage_amount.toLocaleString("en-IN")}</div></div>
    <div><div class="label">Start date</div><div class="value">${policy.start_date}</div></div>
    <div><div class="label">End date</div><div class="value">${policy.end_date}</div></div>
    <div><div class="label">Premium paid</div><div class="value">₹${policy.premium_paid.toLocaleString("en-IN")}</div></div>
    <div><div class="label">Employees covered</div><div class="value">${policy.employee_count}</div></div>
  </div>
  <h3>Covered employees</h3>
  <table><thead><tr><th>Name</th><th>Email</th></tr></thead><tbody>${empRows}</tbody></table>
  <div class="qr">VERIFY: ${policy.policy_number}</div>
  </body></html>`;
}