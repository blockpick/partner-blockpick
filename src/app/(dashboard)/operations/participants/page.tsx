"use client";

import { useState } from "react";
import { useParticipants } from "@/lib/hooks/use-operations";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type { EntryType } from "@/lib/types/operations";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const ENTRY_TYPE_LABEL: Record<EntryType, string> = {
  FREE: "무료",
  REFERRAL: "친구초대",
  AD: "광고",
  MISSION: "미션",
};

export default function OperationsParticipantsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const [entryType, setEntryType] = useState<EntryType | "">("");
  const [abuseOnly, setAbuseOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filter = {
    blockpickId: blockpickId === "all" ? undefined : blockpickId,
    entryType: entryType || undefined,
    abuseOnly: abuseOnly || undefined,
    search: search || undefined,
  };

  const { data, isLoading } = useParticipants(filter);
  const items = data?.items ?? [];

  const csvHeaders = [
    { key: "nickname" as const, label: "닉네임" },
    { key: "emailMasked" as const, label: "이메일" },
    { key: "entryCount" as const, label: "참여 횟수" },
    { key: "firstJoinedAt" as const, label: "첫 참여 일시" },
    { key: "device" as const, label: "디바이스" },
    { key: "ipMasked" as const, label: "IP" },
    { key: "abuseFlag" as const, label: "어뷰징 의심" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">참여자 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            블록픽별 참여자 현황을 확인하고 관리합니다
          </p>
        </div>
        <CsvExportButton
          data={items.map((p) => ({
            ...p,
            entryTypes: p.entryTypes.map((t) => ENTRY_TYPE_LABEL[t]).join("/"),
            firstJoinedAt: format(new Date(p.firstJoinedAt), "yyyy-MM-dd HH:mm", { locale: ko }),
            abuseFlag: p.abuseFlag ? "의심" : "",
          }))}
          filename="참여자목록"
          headers={csvHeaders}
        />
      </div>

      {/* 필터 영역 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />

            <Select
              value={entryType || "all"}
              onValueChange={(v) => setEntryType(v === "all" ? "" : (v as EntryType))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="참여권 종류" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 참여권</SelectItem>
                <SelectItem value="FREE">무료</SelectItem>
                <SelectItem value="REFERRAL">친구초대</SelectItem>
                <SelectItem value="AD">광고</SelectItem>
                <SelectItem value="MISSION">미션</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="닉네임 / 이메일 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id="abuse-only"
                checked={abuseOnly}
                onCheckedChange={(v) => setAbuseOnly(!!v)}
              />
              <Label htmlFor="abuse-only" className="text-sm cursor-pointer">
                어뷰징 의심만
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            참여자 목록
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                총 {data.total.toLocaleString()}명
              </span>
            )}
          </CardTitle>
          <CardDescription>IP·이메일은 개인정보 보호를 위해 마스킹 처리됩니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>닉네임</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead className="text-right">참여 횟수</TableHead>
                  <TableHead>참여권 종류</TableHead>
                  <TableHead>첫 참여 일시</TableHead>
                  <TableHead>디바이스</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>어뷰징</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      참여자가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((p) => (
                    <TableRow
                      key={p.id}
                      className={p.abuseFlag ? "bg-destructive/5" : undefined}
                    >
                      <TableCell className="font-medium">{p.nickname}</TableCell>
                      <TableCell className="text-muted-foreground">{p.emailMasked}</TableCell>
                      <TableCell className="text-right">{p.entryCount}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {p.entryTypes.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {ENTRY_TYPE_LABEL[t]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(p.firstJoinedAt), "MM/dd HH:mm", { locale: ko })}
                      </TableCell>
                      <TableCell>{p.device}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.ipMasked}</TableCell>
                      <TableCell>
                        {p.abuseFlag && (
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
