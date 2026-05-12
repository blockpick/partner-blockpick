"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SimplePagination } from "@/components/dashboard/simple-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { useParticipants } from "@/lib/hooks/use-operations";
import { formatDateTime } from "@/lib/format";

const ENTRY_LABELS: Record<string, string> = {
  FREE: "무료",
  REFERRAL: "친구초대",
  AD: "광고",
  MISSION: "미션",
};

export default function BlockpickParticipantsPage() {
  const params = useParams<{ id: string }>();
  const blockpickId = params.id;
  const [search, setSearch] = useState("");
  const [abuseOnly, setAbuseOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useParticipants({
    blockpickId,
    search: search || undefined,
    abuseOnly,
    page,
    pageSize,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="participant-search">검색</Label>
            <Input
              id="participant-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="닉네임 또는 이메일"
              className="h-9 w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
            <Checkbox
              id="abuse-only"
              checked={abuseOnly}
              onCheckedChange={(checked) => {
                setAbuseOnly(Boolean(checked));
                setPage(1);
              }}
            />
            <Label htmlFor="abuse-only" className="cursor-pointer text-sm">
              이상 징후만
            </Label>
          </div>
        </div>
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
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : !items.length ? (
            <div className="px-4 py-6">
              <EmptyState
                title="아직 참여자가 없어요"
                description="링크를 공유해서 유입을 시작해보세요."
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
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {participant.nickname}
                          </span>
                          {participant.abuseFlag && (
                            <Badge variant="destructive">
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
                    <TableCell className="tabular-nums">
                      {participant.entryCount.toLocaleString()}회
                    </TableCell>
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
                      <div className="space-y-0.5 text-sm">
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
