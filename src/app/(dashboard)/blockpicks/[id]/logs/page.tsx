"use client";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";

export default function BlockpickLogsPage() {
  return (
    <Card>
      <CardContent className="px-4 py-6">
        <EmptyState
          title="활동 로그는 곧 제공됩니다"
          description="설정 변경, 발행, 상태 전이 등의 운영 기록을 이곳에서 확인할 수 있게 됩니다."
        />
      </CardContent>
    </Card>
  );
}
