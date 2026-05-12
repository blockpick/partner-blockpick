"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SimplePagination } from "@/components/dashboard/simple-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParticipants } from "@/lib/hooks/use-operations";
import { formatDateTime } from "@/lib/format";

const ENTRY_LABELS: Record<string, string> = {
  FREE: "무료",
  REFERRAL: "친구초대",
  AD: "광고",
  MISSION: "미션",
};

export default function ParticipantsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const [search, setSearch] = useState("");
  const [abuseOnly, setAbuseOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useParticipants({
    blockpickId: blockpickId === "all" ? undefined : blockpickId,
    search: search || undefined,
    abuseOnly,
    page,
    pageSize,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="참여자 관리"
        description="블록픽 참여자의 진입 방식과 이상 징후를 관리합니다."
        actions={
          <CsvExportButton
            data={items}
            filename="participants"
            headers={[
              { key: "nickname", label: "닉네임" },
              { key: "emailMasked", label: "이메일" },
              { key: "entryCount", label: "참여 수" },
              { key: "device", label: "디바이스" },
              { key: "ipMasked", label: "IP" },
            ]}
            disabled={isLoading}
          />
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <Label>블록픽</Label>
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="participant-search">검색</Label>
            <Input
              id="participant-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="닉네임 또는 이메일 검색"
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            <Checkbox
              id="abuse-only"
              checked={abuseOnly}
              onCheckedChange={(checked) => {
                setAbuseOnly(Boolean(checked));
                setPage(1);
              }}
            />
            <Label htmlFor="abuse-only" className="cursor-pointer">
              이상 징후만 보기
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : !items.length ? (
            <div className="p-4">
              <EmptyState
                title="참여자가 없습니다."
                description="선택한 조건에 맞는 참여자가 아직 없습니다."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>참여자</TableHead>
                  <TableHead>참여 수</TableHead>
                  <TableHead>참여 방식</TableHead>
                  <TableHead>환경</TableHead>
                  <TableHead>최초 참여</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{participant.nickname}</span>
                          {participant.abuseFlag && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              주의
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {participant.emailMasked}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{participant.entryCount.toLocaleString()}회</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {participant.entryTypes.map((entryType) => (
                          <Badge key={entryType} variant="outline">
                            {ENTRY_LABELS[entryType] ?? entryType}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p>{participant.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {participant.ipMasked}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(participant.firstJoinedAt)}
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
