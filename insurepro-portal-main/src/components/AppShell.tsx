import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  FileText,
  PlusCircle,
  LogOut,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/requests/new", label: "New Request", icon: PlusCircle },
  { to: "/app/requests", label: "Requests", icon: FileText },
  { to: "/app/employees", label: "Employees", icon: Users },
  { to: "/app/branches", label: "Branches", icon: Building2 },
  { to: "/app/plans", label: "Plans", icon: Shield },
  { to: "/app/ai-recommend", label: "AI Advisor", icon: Sparkles },
];

const adminNav: NavItem[] = [{ to: "/app/admin", label: "Admin Panel", icon: Settings }];

export function AppShell() {
  const { user, roles, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("companies")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .then(({ count }) => setHasCompany((count ?? 0) > 0));
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false)
      .then(({ count }) => setUnread(count ?? 0));
  }, [user, pathname]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.navigate({ to: "/auth" });
      return;
    }
    if (hasCompany === false && pathname !== "/app/onboarding") {
      router.navigate({ to: "/app/onboarding" });
    }
  }, [user, loading, hasCompany, pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const items = roles.includes("admin") ? [...nav, ...adminNav] : nav;
  const isAdmin = roles.includes("admin");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="px-6 py-5">
          <Link to="/app" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Shield className="h-4 w-4" />
            </span>
            InsureHub
          </Link>
          {isAdmin && (
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-sidebar-primary">
              Admin
            </div>
          )}
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {items.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 text-xs text-sidebar-foreground/70">{user.email}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card px-6 py-3">
          <div className="md:hidden font-semibold">InsureHub</div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <Link to="/app/notifications" className="relative inline-flex">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}