"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { OverviewCard } from "@/components/blockpicks/detail/overview-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";

export default function BlockpickOverviewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useBlockpickDetail(id);

  if (!isLoading && !data) {
    return (
      <EmptyState
        title="블록픽을 찾을 수 없습니다."
        description="존재하지 않거나 조회 권한이 없는 블록픽입니다."
        action={
          <Link href="/blockpicks">
            <Button variant="outline" size="sm">
              목록으로 돌아가기
            </Button>
          </Link>
        }
      />
    );
  }

  return <OverviewCard blockpick={data} isLoading={isLoading} />;
}
