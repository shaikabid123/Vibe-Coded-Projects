import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate, inr, statusColor, statusLabel } from "@/lib/format";
import { Building2, FileText } from "lucide-react";

type Company = { id: string; name: string; gst_number: string | null; email: string | null; mobile: string | null; created_at: string };
type Req = { id: string; request_number: string; status: string; employee_count: number; total_amount: number; created_at: string; companies: { name: string } | null; insurance_plans: { name: string } | null };

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — InsureHub" }] }),
  component: Admin,
});

function Admin() {
  const { roles } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [requests, setRequests] = useState<Req[]>([]);

  useEffect(() => {
    (async () => {
      const [c, r] = await Promise.all([
        supabase.from("companies").select("id,name,gst_number,email,mobile,created_at").order("created_at", { ascending: false }),
        supabase.from("insurance_requests").select("id,request_number,status,employee_count,total_amount,created_at,companies(name),insurance_plans(name)").order("created_at", { ascending: false }),
      ]);
      setCompanies((c.data ?? []) as Company[]);
      setRequests((r.data ?? []) as Req[]);
    })();
  }, []);

  if (!roles.includes("admin")) {
    return <Card className="p-6"><p>You don't have admin access.</p></Card>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin panel</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Companies</div><div className="mt-1 text-2xl font-semibold">{companies.length}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Requests</div><div className="mt-1 text-2xl font-semibold">{requests.length}</div></Card>
        <Card className="p-4"><div className="text-xs uppercase text-muted-foreground">Total premium (₹)</div><div className="mt-1 text-2xl font-semibold">{inr(requests.reduce((a, b) => a + Number(b.total_amount ?? 0), 0))}</div></Card>
      </div>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests"><FileText className="mr-2 h-4 w-4" />Requests</TabsTrigger>
          <TabsTrigger value="companies"><Building2 className="mr-2 h-4 w-4" />Companies</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Request #</TableHead><TableHead>Company</TableHead><TableHead>Plan</TableHead>
                <TableHead>Emp</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><Link to="/app/requests/$id" params={{ id: r.id }} className="font-medium hover:underline">{r.request_number}</Link></TableCell>
                    <TableCell>{r.companies?.name ?? "—"}</TableCell>
                    <TableCell>{r.insurance_plans?.name ?? "—"}</TableCell>
                    <TableCell>{r.employee_count}</TableCell>
                    <TableCell>{inr(r.total_amount)}</TableCell>
                    <TableCell><span className={`rounded-full px-2 py-0.5 text-xs ${statusColor(r.status)}`}>{statusLabel(r.status)}</span></TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(r.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="companies">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>GST</TableHead><TableHead>Email</TableHead><TableHead>Mobile</TableHead><TableHead>Joined</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.gst_number ?? "—"}</TableCell>
                    <TableCell>{c.email ?? "—"}</TableCell>
                    <TableCell>{c.mobile ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(c.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}