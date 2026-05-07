"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useMyBlockpicks } from "@/lib/hooks/use-my-blockpicks";
import { BlockpicksTable } from "@/components/blockpicks/list/blockpicks-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
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
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">블록픽</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            캠페인을 생성하고 관리하세요
          </p>
        </div>
        <Link href="/blockpicks/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            새 블록픽 만들기
          </Button>
        </Link>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-0 border-b">
        {TAB_FILTERS.map((tab) => {
          const isActive =
            (tab.value === undefined && !statusParam) ||
            statusParam === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setPage(1);
                if (tab.value) {
                  router.push(`/blockpicks?status=${tab.value}`);
                } else {
                  router.push("/blockpicks");
                }
              }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 테이블 */}
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
