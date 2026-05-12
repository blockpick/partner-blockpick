"use client";

import Link from "next/link";
import { useMe } from "@/lib/hooks/use-me";
import { useMyPlan } from "@/lib/hooks/use-subscription";
import { Badge } from "@/components/ui/badge";

export function WorkspaceCard({ onClick }: { onClick?: () => void }) {
  const { data: me } = useMe();
  const { data: plan } = useMyPlan();

  const brandName =
    me?.partner?.displayName ?? me?.partner?.name ?? "Partner";
  const initials =
    brandName
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "BP";

  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md p-2 transition-colors hover:bg-muted/60"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[linear-gradient(135deg,hsl(var(--brand)),hsl(14_82%_46%))] text-sm font-semibold text-brand-foreground">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">
          {brandName}
        </p>
        <div className="mt-0.5 flex items-center gap-1">
          {plan?.plan.name ? (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              {plan.plan.name}
            </Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground">파트너 스튜디오</span>
          )}
        </div>
      </div>
    </Link>
  );
}
