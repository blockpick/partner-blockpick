"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Copy, Pencil, StopCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DuplicateBlockpickDialog } from "@/components/blockpicks/dialogs/duplicate-blockpick-dialog";
import { EndBlockpickDialog } from "@/components/blockpicks/dialogs/end-blockpick-dialog";
import type { Blockpick, BlockpickStatus } from "@/lib/types/blockpick";

const STATUS_LABEL: Record<BlockpickStatus, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

const STATUS_VARIANT: Record<
  BlockpickStatus,
  "success" | "info" | "outline" | "secondary" | "destructive"
> = {
  ACTIVE: "success",
  SCHEDULED: "info" as never,
  DRAFT: "outline",
  ENDED: "secondary",
  CANCELLED: "destructive",
};

interface DetailHeaderProps {
  blockpickId: string;
  blockpick?: Blockpick;
  isLoading?: boolean;
}

export function DetailHeader({
  blockpickId,
  blockpick,
  isLoading,
}: DetailHeaderProps) {
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const landingUrl = blockpick?.landingUrl;

  const copyLink = () => {
    if (!landingUrl) return;
    navigator.clipboard.writeText(landingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <Link
            href="/blockpicks"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            전체 블록픽
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-7 w-48" />
              ) : (
                <h1 className="truncate text-2xl font-semibold tracking-tight">
                  {blockpick?.title ?? "블록픽"}
                </h1>
              )}
              {blockpick && (
                <Badge variant={STATUS_VARIANT[blockpick.status]}>
                  {STATUS_LABEL[blockpick.status]}
                </Badge>
              )}
            </div>
            {landingUrl && (
              <p className="truncate text-xs text-muted-foreground">
                {landingUrl}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {landingUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={copyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "복사됨" : "링크 복사"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setDuplicateOpen(true)}
              disabled={!blockpick}
            >
              <Copy className="h-4 w-4" />
              복제
            </Button>
            <Link href={`/blockpicks/${blockpickId}/edit`}>
              <Button size="sm" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                수정
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setEndOpen(true)}
              disabled={!blockpick}
            >
              <StopCircle className="h-4 w-4" />
              종료
            </Button>
          </div>
        </div>
      </div>

      <DuplicateBlockpickDialog
        id={blockpickId}
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
      />
      <EndBlockpickDialog
        id={blockpickId}
        open={endOpen}
        onClose={() => setEndOpen(false)}
      />
    </>
  );
}
