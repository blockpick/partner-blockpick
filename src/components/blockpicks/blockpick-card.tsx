"use client";

import Link from "next/link";
import { Calendar, Grid3X3 } from "lucide-react";
import { BlockpickStatusBadge } from "@/components/blockpicks/blockpick-status-badge";
import { cn } from "@/lib/utils";
import {
  computeBlockpickProgress,
  formatDday,
  formatNumber,
} from "@/lib/format";
import type { BlockpickListItem } from "@/lib/types/blockpick";

interface BlockpickCardProps {
  blockpick: BlockpickListItem;
  className?: string;
}

export function BlockpickCard({ blockpick, className }: BlockpickCardProps) {
  const progress = computeBlockpickProgress(blockpick.startAt, blockpick.endAt);
  const dday = formatDday(blockpick.endAt);
  const isActive = blockpick.status === "ACTIVE";

  return (
    <Link
      href={`/blockpicks/${blockpick.id}`}
      className={cn(
        "group block overflow-hidden rounded-md border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-sm",
        className
      )}
    >
      <div className="flex gap-3 p-3">
        {blockpick.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blockpick.thumbnailUrl}
            alt=""
            className="h-16 w-16 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted/60">
            <Grid3X3 className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-medium leading-tight">
              {blockpick.title}
            </p>
            <BlockpickStatusBadge status={blockpick.status} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="tabular-nums">
              참여 {formatNumber(blockpick.totalParticipants)}
            </span>
            <span className="text-border">·</span>
            <span className="tabular-nums">
              방문 {formatNumber(blockpick.totalVisits)}
            </span>
            {isActive && dday && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-0.5 font-medium text-[hsl(var(--brand))]">
                  <Calendar className="h-3 w-3" />
                  {dday}
                </span>
              </>
            )}
          </div>

          {isActive && (
            <div className="space-y-0.5">
              <div className="h-1 overflow-hidden rounded-sm bg-muted">
                <div
                  className="h-full rounded-sm bg-brand transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] tabular-nums text-muted-foreground">
                기간 진행 {progress.toFixed(0)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
