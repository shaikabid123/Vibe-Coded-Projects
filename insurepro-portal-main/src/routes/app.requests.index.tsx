import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyCompanyId } from "@/lib/company";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDate, statusColor, statusLabel } from "@/lib/format";
import { Search, Plus } from "lucide-react";

type Row = {
  id: string; request_number: string; status: string; employee_count: number;
  created_at: string; updated_at: string;
  branches: { name: string; city: string } | null;
  insurance_plans: { name: string } | null;
};

export const Route = createFileRoute("/app/requests/")({
  head: () => ({ meta: [{ title: "Requests — InsureHub" }] }),
  component: Requests,
});

function Requests() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    (async () => {
      const cid = await getMyCompanyId();
      if (!cid) return;
      const { data } = await supabase
        .from("insurance_requests")
        .select("id,request_number,status,employee_count,created_at,updated_at,branches(name,city),insurance_plans(name)")
        .eq("company_id", cid)
        .order("created_at", { ascending: false });
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  const cities = useMemo(() => Array.from(new Set(rows.map((r) => r.branches?.city).filter(Boolean))) as string[], [rows]);

  const filtered = rows.filter((r) => {
    if (city !== "all" && r.branches?.city !== city) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q && !r.request_number.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Requests</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
        <Link to="/app/requests/new"><Button><Plus className="mr-2 h-4 w-4" />New request</Button></Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by request #" />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-44"><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["draft","submitted","under_review","approved","payment_pending","payment_completed","policy_generated","closed","rejected"].map((s) => (
              <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead><TableHead>Branch</TableHead><TableHead>Plan</TableHead>
              <TableHead>Employees</TableHead><TableHead>Status</TableHead>
              <TableHead>Created</TableHead><TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell><Link to="/app/requests/$id" params={{ id: r.id }} className="font-medium text-foreground hover:underline">{r.request_number}</Link></TableCell>
                <TableCell>{r.branches ? `${r.branches.name} — ${r.branches.city}` : "—"}</TableCell>
                <TableCell>{r.insurance_plans?.name ?? "—"}</TableCell>
                <TableCell>{r.employee_count}</TableCell>
                <TableCell><span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(r.status)}`}>{statusLabel(r.status)}</span></TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(r.updated_at)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No requests match.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}