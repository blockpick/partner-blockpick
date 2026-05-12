"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useMyBlockpicks } from "@/lib/hooks/use-my-blockpicks";
import { BlockpicksTable } from "@/components/blockpicks/list/blockpicks-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlockpickStatus } from "@/lib/types/blockpick";

const TAB_FILTERS: { label: string; value?: BlockpickStatus }[] = [
  { label: "전체", value: undefined },
  { label: "진행중", value: "ACTIVE" },
  { label: "예약됨", value: "SCHEDULED" },
  { label: "종료됨", value: "ENDED" },
  { label: "임시저장", value: "DRAFT" },
];

function BlockpickListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get("status") as BlockpickStatus | null;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data, isLoading } = useMyBlockpicks({
    status: statusParam ?? undefined,
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="블록픽"
        description="캠페인을 생성하고 관리합니다."
        actions={
          <Link href="/blockpicks/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />새 블록픽 만들기
            </Button>
          </Link>
        }
      />

      <nav className="border-b border-border">
        <div className="-mb-px flex gap-1 overflow-x-auto">
          {TAB_FILTERS.map((tab) => {
            const isActive =
              (tab.value === undefined && !statusParam) ||
              statusParam === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setPage(1);
                  if (tab.value) {
                    router.push(`/blockpicks?status=${tab.value}`);
                  } else {
                    router.push("/blockpicks");
                  }
                }}
                className={cn(
                  "relative px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <BlockpicksTable
        items={data?.items ?? []}
        total={data?.total ?? 0}
        isLoading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />
    </div>
  );
}

export default function BlockpicksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <BlockpickListContent />
    </Suspense>
  );
}
