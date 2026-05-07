"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewCard } from "@/components/blockpicks/detail/overview-card";
import { EndBlockpickDialog } from "@/components/blockpicks/dialogs/end-blockpick-dialog";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";
import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  StopCircle,
  Copy,
  Users,
  Trophy,
  Share2,
  Megaphone,
} from "lucide-react";

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
  DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
  ENDED: "bg-orange-100 text-orange-700 border-orange-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-muted-foreground">{label} 데이터</p>
      <p className="text-xs text-muted-foreground mt-1">S09 세션에서 구현 예정</p>
    </div>
  );
}

export default function BlockpickDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const { data: blockpick, isLoading } = useBlockpickDetail(id);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/blockpicks">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            {isLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold truncate">{blockpick?.title}</h1>
                {blockpick?.status && (
                  <Badge className={STATUS_CLASS[blockpick.status]}>
                    {STATUS_LABEL[blockpick.status]}
                  </Badge>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">ID: {id}</p>
          </div>
        </div>

        {/* 액션 버튼 */}
        {!isLoading && blockpick && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/blockpicks/${id}/edit`)}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/blockpicks/new?duplicateFrom=${id}`)}
            >
              <Copy className="h-4 w-4 mr-1.5" />
              복제
            </Button>
            {blockpick.status === "ACTIVE" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setEndOpen(true)}
              >
                <StopCircle className="h-4 w-4 mr-1.5" />
                종료
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 탭 */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none gap-0">
          {[
            { value: "overview", label: "개요", icon: null },
            { value: "participants", label: "참여자", icon: <Users className="h-3.5 w-3.5" /> },
            { value: "winners", label: "당첨자", icon: <Trophy className="h-3.5 w-3.5" /> },
            { value: "referral", label: "리퍼럴", icon: <Share2 className="h-3.5 w-3.5" /> },
            { value: "ads", label: "광고·미션", icon: <Megaphone className="h-3.5 w-3.5" /> },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 gap-1.5"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewCard blockpick={blockpick} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <PlaceholderTab label="참여자" />
        </TabsContent>

        <TabsContent value="winners" className="mt-6">
          <PlaceholderTab label="당첨자" />
        </TabsContent>

        <TabsContent value="referral" className="mt-6">
          <PlaceholderTab label="리퍼럴" />
        </TabsContent>

        <TabsContent value="ads" className="mt-6">
          <PlaceholderTab label="광고·미션 성과" />
        </TabsContent>
      </Tabs>

      {/* 종료 다이얼로그 */}
      {endOpen && (
        <EndBlockpickDialog
          id={id}
          open={endOpen}
          onClose={() => setEndOpen(false)}
        />
      )}
    </div>
  );
}
