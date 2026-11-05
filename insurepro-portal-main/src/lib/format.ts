export const inr = (n: number | string | null | undefined) => {
  const v = Number(n ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
};

export const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const statusColor = (s: string): string => {
  const map: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    payment_pending: "bg-orange-100 text-orange-800",
    payment_completed: "bg-teal-100 text-teal-800",
    policy_generated: "bg-indigo-100 text-indigo-800",
    closed: "bg-slate-200 text-slate-700",
    rejected: "bg-red-100 text-red-800",
  };
  return map[s] ?? "bg-muted text-muted-foreground";
};

export const statusLabel = (s: string) =>
  s.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");