"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";

export default function BlockpickSettingsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useBlockpickDetail(id);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardDescription>설정</CardDescription>
            <CardTitle>블록픽 설정값</CardTitle>
          </div>
          <Link href={`/blockpicks/${id}/edit`}>
            <Button size="sm" className="gap-1.5">
              <Pencil className="h-4 w-4" />
              설정 수정
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <Row label="제목" value={data?.title ?? "-"} />
              <Row label="그리드" value={data ? `${data.gridSize} × ${data.gridSize}` : "-"} />
              <Row
                label="무료 참여"
                value={data ? `${data.freeEntryCount}회` : "-"}
              />
              <Row
                label="최대 참여"
                value={data ? `${data.maxEntryPerUser}회` : "-"}
              />
              <Row
                label="추가 참여"
                value={
                  data?.extraEntryTypes?.length
                    ? data.extraEntryTypes
                        .map((t) =>
                          t === "REFERRAL"
                            ? "친구초대"
                            : t === "AD"
                            ? "광고"
                            : "미션"
                        )
                        .join(", ")
                    : "없음"
                }
              />
              <Row
                label="중복 당첨"
                value={data?.allowDuplicateWin ? "허용" : "불허"}
              />
              <Row label="경품" value={data?.rewardName ?? "-"} />
              <Row
                label="수량"
                value={
                  data?.rewardQuantity
                    ? `${data.rewardQuantity.toLocaleString()}개`
                    : "-"
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        발행 후 변경 제한 항목(그리드 크기, 보상 구조 등)은 수정 페이지에서 안내됩니다.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
