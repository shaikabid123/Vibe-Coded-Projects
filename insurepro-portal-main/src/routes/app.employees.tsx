import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyCompanyId } from "@/lib/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Upload, Search } from "lucide-react";
import { toast } from "sonner";

type Branch = { id: string; name: string; city: string };
type Employee = {
  id: string; employee_code: string | null; first_name: string; last_name: string | null;
  email: string | null; mobile: string | null; dob: string | null; gender: string | null;
  branch_id: string | null; department: string | null; salary_band: string | null;
  branches?: { name: string; city: string } | null;
};

export const Route = createFileRoute("/app/employees")({
  head: () => ({ meta: [{ title: "Employees — InsureHub" }] }),
  component: Employees,
});

function Employees() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Partial<Employee>>({});

  const load = async () => {
    const cid = await getMyCompanyId();
    if (!cid) return;
    const [{ data: emps }, { data: brs }] = await Promise.all([
      supabase.from("employees").select("*,branches(name,city)").eq("company_id", cid).order("created_at", { ascending: false }),
      supabase.from("branches").select("id,name,city").eq("company_id", cid),
    ]);
    setRows((emps ?? []) as Employee[]);
    setBranches((brs ?? []) as Branch[]);
  };

  useEffect(() => { load(); }, []);

  async function create() {
    const cid = await getMyCompanyId();
    if (!cid) return;
    const { branches: _b, ...rest } = form as Employee & Record<string, unknown>;
    void _b;
    const first_name = (rest.first_name as string) ?? "";
    if (!first_name) return toast.error("First name required");
    const { error } = await supabase.from("employees").insert({ ...rest, company_id: cid, first_name });
    if (error) return toast.error(error.message);
    toast.success("Employee added"); setOpen(false); setForm({}); load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed"); load();
  }

  async function bulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return toast.error("CSV is empty");
    const headers = lines[0].split(",").map((s) => s.trim().toLowerCase());
    const cid = await getMyCompanyId();
    if (!cid) return;
    const rows = lines.slice(1).map((line) => {
      const cells = line.split(",").map((c) => c.trim());
      const o: Record<string, string> = {};
      headers.forEach((h, i) => (o[h] = cells[i] ?? ""));
      const branch = branches.find((b) => b.name.toLowerCase() === (o.branch ?? "").toLowerCase() || b.city.toLowerCase() === (o.branch ?? "").toLowerCase());
      return {
        company_id: cid,
        employee_code: o.employee_id || o.employee_code || null,
        first_name: o.first_name || o.firstname || "",
        last_name: o.last_name || o.lastname || null,
        email: o.email || null,
        mobile: o.mobile || o.phone || null,
        dob: o.dob || o.date_of_birth || null,
        gender: o.gender || null,
        department: o.department || null,
        salary_band: o.salary_band || o.salary || null,
        branch_id: branch?.id ?? null,
      };
    }).filter((r) => r.first_name);
    if (rows.length === 0) return toast.error("No valid rows");
    const { error } = await supabase.from("employees").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${rows.length} employees`);
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (branchFilter !== "all" && r.branch_id !== branchFilter) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return [r.first_name, r.last_name, r.email, r.employee_code, r.department].some((v) => v?.toLowerCase().includes(s));
    });
  }, [rows, q, branchFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Bulk upload (CSV)
          </Button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={bulkUpload} />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add employee</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>New employee</DialogTitle></DialogHeader>
              <div className="grid gap-3 md:grid-cols-2">
                <Fld label="Employee ID" v={form.employee_code ?? ""} on={(v) => setForm({ ...form, employee_code: v })} />
                <Fld label="First name *" v={form.first_name ?? ""} on={(v) => setForm({ ...form, first_name: v })} />
                <Fld label="Last name" v={form.last_name ?? ""} on={(v) => setForm({ ...form, last_name: v })} />
                <Fld label="Email" type="email" v={form.email ?? ""} on={(v) => setForm({ ...form, email: v })} />
                <Fld label="Mobile" v={form.mobile ?? ""} on={(v) => setForm({ ...form, mobile: v })} />
                <Fld label="DOB" type="date" v={form.dob ?? ""} on={(v) => setForm({ ...form, dob: v })} />
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender ?? ""} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Branch</Label>
                  <Select value={form.branch_id ?? ""} onValueChange={(v) => setForm({ ...form, branch_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>{branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} — {b.city}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Fld label="Department" v={form.department ?? ""} on={(v) => setForm({ ...form, department: v })} />
                <Fld label="Salary band" v={form.salary_band ?? ""} on={(v) => setForm({ ...form, salary_band: v })} />
              </div>
              <DialogFooter><Button onClick={create}>Save</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search employees…" className="pl-9" />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-56"><SelectValue placeholder="All branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All branches</SelectItem>
            {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead>
              <TableHead>Branch</TableHead><TableHead>Department</TableHead><TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-muted-foreground">{e.employee_code ?? "—"}</TableCell>
                <TableCell className="font-medium">{e.first_name} {e.last_name ?? ""}</TableCell>
                <TableCell>{e.email ?? "—"}</TableCell>
                <TableCell>{e.branches ? `${e.branches.name} (${e.branches.city})` : "—"}</TableCell>
                <TableCell>{e.department ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No employees. Use bulk upload (columns: employee_id, first_name, last_name, email, mobile, dob, gender, department, salary_band, branch) or add manually.
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Fld(props: { label: string; type?: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <Label>{props.label}</Label>
      <Input type={props.type} value={props.v} onChange={(e) => props.on(e.target.value)} />
    </div>
  );
}