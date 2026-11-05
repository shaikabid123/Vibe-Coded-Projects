import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { recommendPlan } from "@/lib/ai.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ai-recommend")({
  head: () => ({ meta: [{ title: "AI Plan Advisor — InsureHub" }] }),
  component: AIRecommend,
});

type Result = { recommended_plan_name: string; rationale: string; estimated_annual_cost_inr: number; alternative: string };

function AIRecommend() {
  const recommend = useServerFn(recommendPlan);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [form, setForm] = useState({ employee_count: 25, budget_per_employee_monthly: 1500, risk_profile: "medium" as "low"|"medium"|"high", notes: "" });

  async function run() {
    setLoading(true);
    try {
      const r = await recommend({ data: form });
      setResult(r);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" />AI Plan Advisor</h1>
        <p className="text-sm text-muted-foreground">Get a plan recommendation based on your headcount, budget and risk profile.</p>
      </div>
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div><Label>Employees</Label><Input type="number" value={form.employee_count} onChange={(e) => setForm({ ...form, employee_count: Number(e.target.value) })} /></div>
          <div><Label>Budget/emp/mo ₹</Label><Input type="number" value={form.budget_per_employee_monthly} onChange={(e) => setForm({ ...form, budget_per_employee_monthly: Number(e.target.value) })} /></div>
          <div>
            <Label>Risk profile</Label>
            <Select value={form.risk_profile} onValueChange={(v) => setForm({ ...form, risk_profile: v as "low"|"medium"|"high" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3"><Label>Notes (optional)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <Button className="mt-4" onClick={run} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Get recommendation
        </Button>
      </Card>
      {result && (
        <Card className="p-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Recommended plan</div>
          <div className="mt-1 text-2xl font-semibold text-accent">{result.recommended_plan_name}</div>
          <p className="mt-3 text-sm">{result.rationale}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div><div className="text-xs text-muted-foreground">Est. annual cost</div><div className="font-semibold">{inr(result.estimated_annual_cost_inr)}</div></div>
            <div><div className="text-xs text-muted-foreground">Alternative</div><div className="font-semibold">{result.alternative || "—"}</div></div>
          </div>
        </Card>
      )}
    </div>
  );
}