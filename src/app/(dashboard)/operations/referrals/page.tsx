"use client";

import { useState } from "react";
import { Share2, ShieldAlert, UserPlus, Users, Gift } from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SimplePagination } from "@/components/dashboard/simple-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReferralKpi, useReferrals } from "@/lib/hooks/use-operations";
import { formatDateTime } from "@/lib/format";

export default function ReferralOperationsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const [abuseOnly, setAbuseOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const selectedBlockpickId = blockpickId === "all" ? undefined : blockpickId;
  const { data: kpi, isLoading: kpiLoading } = useReferralKpi(
    selectedBlockpickId ?? ""
  );
  const { data, isLoading } = useReferrals({
    blockpickId: selectedBlockpickId,
    abuseOnly,
    page,
    pageSize,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="공유/리퍼럴 관리"
        description="친구 초대 전환과 이상 초대 패턴을 추적합니다."
        actions={
          <CsvExportButton
            data={items}
            filename="referrals"
            headers={[
              { key: "inviterNickname", label: "초대한 사람" },
              { key: "inviteeMasked", label: "초대 받은 사람" },
              { key: "createdAt", label: "생성 일시" },
            ]}
            disabled={isLoading}
          />
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 pt-4 md:flex-row md:items-end">
          <div className="space-y-1.5">
            <Label>블록픽</Label>
            <BlockpickSelect
              value={blockpickId}
              onChange={(value) => {
                setBlockpickId(value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
            <Checkbox
              id="referral-abuse-only"
              checked={abuseOnly}
              onCheckedChange={(checked) => {
                setAbuseOnly(Boolean(checked));
                setPage(1);
              }}
            />
            <Label htmlFor="referral-abuse-only" className="cursor-pointer text-sm">
              이상 케이스만
            </Label>
          </div>
        </CardContent>
      </Card>

      {selectedBlockpickId && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="초대 발급"
            value={kpi?.issuedCount.toLocaleString()}
            icon={Share2}
            loading={kpiLoading}
            description="발급된 링크 수"
          />
          <KpiCard
            title="클릭 수"
            value={kpi?.clickCount.toLocaleString()}
            icon={Users}
            loading={kpiLoading}
            description="링크 진입 수"
          />
          <KpiCard
            title="가입 전환"
            value={kpi?.signupConversionCount.toLocaleString()}
            icon={UserPlus}
            loading={kpiLoading}
            description="신규 가입자"
          />
          <KpiCard
            title="첫 참여 전환"
            value={kpi?.firstEntryConversionCount.toLocaleString()}
            icon={Users}
            loading={kpiLoading}
            description="블록픽 첫 참여"
          />
          <KpiCard
            title="보상 지급"
            value={kpi?.rewardIssuedCount.toLocaleString()}
            icon={Gift}
            loading={kpiLoading}
            description="초대자 보상"
          />
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : !items.length ? (
            <div className="px-4 py-6">
              <EmptyState
                title="리퍼럴 기록이 없어요"
                description="아직 친구 초대로 유입된 참여자가 없습니다."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>초대한 사람</TableHead>
                  <TableHead>초대 받은 사람</TableHead>
                  <TableHead>전환 상태</TableHead>
                  <TableHead>이상 여부</TableHead>
                  <TableHead>생성 일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.inviterNickname}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.inviteeMasked}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant={record.inviteeJoined ? "default" : "outline"}
                        >
                          가입
                        </Badge>
                        <Badge
                          variant={
                            record.inviteeParticipated ? "default" : "outline"
                          }
                        >
                          참여
                        </Badge>
                        <Badge
                          variant={
                            record.rewardIssued ? "success" : "outline"
                          }
                        >
                          보상
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.abuseFlag ? (
                        <Badge variant="destructive">
                          <ShieldAlert className="h-3 w-3" />
                          주의
                        </Badge>
                      ) : (
                        <Badge variant="outline">정상</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(record.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!!data && data.total > 0 && (
        <SimplePagination
          page={page}
          pageSize={pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
