import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBlockpickPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/blockpicks">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">새 블록픽 만들기</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            새로운 캠페인을 설정하고 발행하세요
          </p>
        </div>
      </div>

      {/* 기본 정보 — S08에서 Wizard 형태로 완성 예정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
          <CardDescription>블록픽의 기본 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">캠페인 제목 *</Label>
            <Input id="title" placeholder="예: 여름 특별 이벤트" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">캠페인 설명</Label>
            <Input id="description" placeholder="간단한 캠페인 설명을 입력하세요" />
          </div>

          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              블록픽 생성 Wizard (S08 세션에서 구현 예정)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              그리드 설정 / 참여 조건 / 보상 설정 / 발행 옵션
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">임시저장</Button>
            <Button className="flex-1" disabled>발행하기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
