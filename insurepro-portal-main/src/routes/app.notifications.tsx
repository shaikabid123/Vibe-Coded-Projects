import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { fmtDate } from "@/lib/format";
import { Bell } from "lucide-react";

type N = { id: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string };

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — InsureHub" }] }),
  component: Notifications,
});

function Notifications() {
  const [items, setItems] = useState<N[]>([]);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setItems((data ?? []) as N[]);
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    })();
  }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <Card className="divide-y">
        {items.map((n) => (
          <Link to={n.link ?? "/app"} key={n.id} className="flex items-start gap-3 p-4 hover:bg-muted/40">
            <Bell className="mt-0.5 h-4 w-4 text-accent" />
            <div className="flex-1">
              <div className="font-medium">{n.title}</div>
              {n.body && <div className="text-sm text-muted-foreground">{n.body}</div>}
              <div className="mt-1 text-xs text-muted-foreground">{fmtDate(n.created_at)}</div>
            </div>
          </Link>
        ))}
        {items.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No notifications yet.</div>}
      </Card>
    </div>
  );
}