"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { name: "개요", suffix: "" },
  { name: "설정", suffix: "/settings" },
  { name: "참여자", suffix: "/participants" },
  { name: "당첨자", suffix: "/winners" },
  { name: "성과", suffix: "/performance" },
  { name: "공유", suffix: "/share" },
  { name: "로그", suffix: "/logs" },
];

export function DetailNav({ blockpickId }: { blockpickId: string }) {
  const pathname = usePathname();
  const base = `/blockpicks/${blockpickId}`;

  return (
    <nav className="border-b border-border">
      <div className="-mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const href = `${base}${tab.suffix}`;
          const isActive =
            tab.suffix === ""
              ? pathname === base || pathname === `${base}/`
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={tab.suffix || "overview"}
              href={href}
              className={cn(
                "relative px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
