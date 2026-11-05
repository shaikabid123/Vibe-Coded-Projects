import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl gradient-vibrant text-electric-foreground shadow-glow">
        <Hexagon className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          SNN<span className="text-gradient"> Technologies</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Talent &amp; Technology
        </span>
      </span>
    </Link>
  );
}
