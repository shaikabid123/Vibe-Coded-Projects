import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { statusLabel } from "@/lib/format";
import { Users, FileText, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — InsureHub" }] }),
  component: Dashboard,
});

const COLORS = ["#0ea5e9", "#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#22c55e", "#64748b"];

function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, active: 0, pending: 0, approved: 0, closed: 0 });
  const [reqByCity, setReqByCity] = useState<{ name: string; value: number }[]>([]);
  const [reqByStatus, setReqByStatus] = useState<{ name: string; value: number }[]>([]);
  const [monthly, setMonthly] = useState<{ name: string; requests: number }[]>([]);
  const [byPlan, setByPlan] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: company } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
      if (!company) return;
      const [emp, requests, policies] = await Promise.all([
        supabase.from("employees").select("id", { count: "exact", head: true }).eq("company_id", company.id),
        supabase.from("insurance_requests").select("id,status,created_at,plan_id,branch_id,branches(city),insurance_plans(name)").eq("company_id", company.id),
        supabase.from("policies").select("id,plan_id,insurance_plans(name)").eq("company_id", company.id),
      ]);
      const reqs = requests.data ?? [];
      setStats({
        employees: emp.count ?? 0,
        active: policies.data?.length ?? 0,
        pending: reqs.filter((r) => ["submitted", "under_review", "payment_pending"].includes(r.status)).length,
        approved: reqs.filter((r) => ["approved", "policy_generated", "payment_completed"].includes(r.status)).length,
        closed: reqs.filter((r) => r.status === "closed").length,
      });
      const cityMap = new Map<string, number>();
      reqs.forEach((r) => {
        const city = (r as { branches?: { city?: string } | null }).branches?.city ?? "Unassigned";
        cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
      });
      setReqByCity(Array.from(cityMap, ([name, value]) => ({ name, value })));
      const statusMap = new Map<string, number>();
      reqs.forEach((r) => statusMap.set(r.status, (statusMap.get(r.status) ?? 0) + 1));
      setReqByStatus(Array.from(statusMap, ([name, value]) => ({ name: statusLabel(name), value })));
      const monMap = new Map<string, number>();
      reqs.forEach((r) => {
        const m = new Date(r.created_at).toLocaleString("en-US", { month: "short" });
        monMap.set(m, (monMap.get(m) ?? 0) + 1);
      });
      setMonthly(Array.from(monMap, ([name, requests]) => ({ name, requests })));
      const planMap = new Map<string, number>();
      (policies.data ?? []).forEach((p) => {
        const name = (p as { insurance_plans?: { name?: string } | null }).insurance_plans?.name ?? "Unknown";
        planMap.set(name, (planMap.get(name) ?? 0) + 1);
      });
      setByPlan(Array.from(planMap, ([name, value]) => ({ name, value })));
    })();
  }, []);

  const cards = [
    { label: "Total Employees", value: stats.employees, icon: Users },
    { label: "Active Policies", value: stats.active, icon: ShieldCheck },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "Approved", value: stats.approved, icon: CheckCircle2 },
    { label: "Closed", value: stats.closed, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Track requests, employees and active coverage at a glance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{c.value}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Requests by City</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={reqByCity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Requests by Status</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={reqByStatus} dataKey="value" nameKey="name" outerRadius={80} label>
                  {reqByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#14b8a6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Active Policies by Plan</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byPlan} dataKey="value" nameKey="name" outerRadius={80} label>
                  {byPlan.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}