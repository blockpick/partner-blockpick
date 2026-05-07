"use client";

import { useState } from "react";
import { useReferralKpi, useReferrals } from "@/lib/hooks/use-operations";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Share2, MousePointerClick, UserCheck, Trophy, Gift } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function OperationsReferralsPage() {
  const [blockpickId, setBlockpickId] = useState("mock-1");
  const [abuseOnly, setAbuseOnly] = useState(false);

  const { data: kpi, isLoading: kpiLoading } = useReferralKpi(blockpickId);
  const { data, isLoading } = useReferrals({
    blockpickId,
    abuseOnly: abuseOnly || undefined,
  });
  const items = data?.items ?? [];

  const kpiCards = kpi
    ? [
        { label: "발급 수", value: kpi.issuedCount, icon: Share2 },
        { label: "클릭 수", value: kpi.clickCount, icon: MousePointerClick },
        { label: "가입 전환", value: kpi.signupConversionCount, icon: UserCheck },
        { label: "첫 참여 전환", value: kpi.firstEntryConversionCount, icon: Trophy },
        { label: "보상 지급", value: kpi.rewardIssuedCount, icon: Gift },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">공유/리퍼럴 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            친구초대 현황과 어뷰징 의심 건을 확인합니다
          </p>
        </div>
        <CsvExportButton
          data={items.map((r) => ({
            inviterNickname: r.inviterNickname,
            inviteeMasked: r.inviteeMasked,
            inviteeJoined: r.inviteeJoined ? "가입완료" : "미가입",
            inviteeParticipated: r.inviteeParticipated ? "참여완료" : "미참여",
            rewardIssued: r.rewardIssued ? "지급완료" : "미지급",
            abuseFlag: r.abuseFlag ? "의심" : "",
            createdAt: format(new Date(r.createdAt), "yyyy-MM-dd HH:mm", { locale: ko }),
          }))}
          filename="리퍼럴목록"
          headers={[
            { key: "inviterNickname", label: "초대자" },
            { key: "inviteeMasked", label: "친구" },
            { key: "inviteeJoined", label: "가입 여부" },
            { key: "inviteeParticipated", label: "참여 여부" },
            { key: "rewardIssued", label: "보상 지급" },
            { key: "abuseFlag", label: "어뷰징 의심" },
            { key: "createdAt", label: "초대 일시" },
          ]}
        />
      </div>

      {/* 블록픽 선택 */}
      <div className="flex items-center gap-3">
        <BlockpickSelect
          value={blockpickId}
          onChange={setBlockpickId}
          includeAll={false}
          placeholder="블록픽 선택"
        />
      </div>

      {/* KPI 카드 */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpiLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          : kpiCards.map((card) => (
              <Card key={card.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {card.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* 리퍼럴 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                리퍼럴 목록
                {data && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    총 {data.total.toLocaleString()}건
                  </span>
                )}
              </CardTitle>
              <CardDescription>어뷰징 의심 행은 붉은 배경으로 강조됩니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="abuse-only-ref"
                checked={abuseOnly}
                onCheckedChange={(v) => setAbuseOnly(!!v)}
              />
              <Label htmlFor="abuse-only-ref" className="text-sm cursor-pointer">
                어뷰징 의심만
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>초대자</TableHead>
                  <TableHead>친구</TableHead>
                  <TableHead>가입 여부</TableHead>
                  <TableHead>참여 여부</TableHead>
                  <TableHead>보상 지급</TableHead>
                  <TableHead>초대 일시</TableHead>
                  <TableHead>어뷰징</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      리퍼럴 데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((r) => (
                    <TableRow
                      key={r.id}
                      className={r.abuseFlag ? "bg-destructive/5" : undefined}
                    >
                      <TableCell className="font-medium">{r.inviterNickname}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {r.inviteeMasked}
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.inviteeJoined ? "default" : "outline"}>
                          {r.inviteeJoined ? "가입완료" : "미가입"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.inviteeParticipated ? "default" : "outline"}>
                          {r.inviteeParticipated ? "참여완료" : "미참여"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.rewardIssued ? "default" : "secondary"}>
                          {r.rewardIssued ? "지급완료" : "미지급"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(r.createdAt), "MM/dd HH:mm", { locale: ko })}
                      </TableCell>
                      <TableCell>
                        {r.abuseFlag && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
