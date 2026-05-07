import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlockpickDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/blockpicks">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">블록픽 상세</h1>
          <p className="text-sm text-muted-foreground">ID: {params.id}</p>
        </div>
      </div>

      {/* 탭: 개요 / 설정 / 참여자 / 당첨자 / 성과 / 공유 / 로그 — S08~S09 구현 예정 */}
      <div className="rounded-lg border border-dashed p-16 text-center">
        <p className="text-muted-foreground">블록픽 상세 화면 (S08~S09 세션에서 구현 예정)</p>
        <p className="text-sm text-muted-foreground mt-1">
          탭: 개요 / 설정 / 참여자 / 당첨자 / 성과 / 공유 / 로그
        </p>
      </div>
    </div>
  );
}
