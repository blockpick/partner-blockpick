"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlockpickStatusBadge } from "@/components/blockpicks/blockpick-status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EndBlockpickDialog } from "../dialogs/end-blockpick-dialog";
import { DuplicateBlockpickDialog } from "../dialogs/duplicate-blockpick-dialog";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  StopCircle,
  Copy,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { computeBlockpickProgress, formatDday } from "@/lib/format";
import type { BlockpickListItem } from "@/lib/types/blockpick";

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MM.dd HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
}

interface BlockpicksTableProps {
  items: BlockpickListItem[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export function BlockpicksTable({
  items,
  total,
  isLoading,
  page,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
}: BlockpicksTableProps) {
  const router = useRouter();
  const [endTarget, setEndTarget] = useState<string | null>(null);
  const [dupTarget, setDupTarget] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="블록픽 검색..."
          className="pl-9"
        />
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">블록픽</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>진행</TableHead>
              <TableHead className="text-right">참여자</TableHead>
              <TableHead className="text-right">방문</TableHead>
              <TableHead>종료</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-2 w-24" /></TableCell>
                  <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="ml-auto h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">블록픽이 없습니다</p>
                    <Link href="/blockpicks/new">
                      <Button size="sm" className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        첫 번째 블록픽 만들기
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((bp) => {
                const progress = computeBlockpickProgress(bp.startAt, bp.endAt);
                const dday = formatDday(bp.endAt);
                const isActive = bp.status === "ACTIVE";
                return (
                <TableRow
                  key={bp.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => router.push(`/blockpicks/${bp.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {bp.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={bp.thumbnailUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-md bg-muted" />
                      )}
                      <span className="max-w-[220px] truncate text-sm font-medium">
                        {bp.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <BlockpickStatusBadge status={bp.status} />
                  </TableCell>
                  <TableCell>
                    {isActive ? (
                      <div className="w-28 space-y-1">
                        <div className="h-1 overflow-hidden rounded-sm bg-muted">
                          <div
                            className="h-full rounded-sm bg-brand"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] tabular-nums text-muted-foreground">
                          {dday}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {bp.totalParticipants.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    {bp.totalVisits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {fmt(bp.endAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/blockpicks/${bp.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> 보기
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/blockpicks/${bp.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4 mr-2" /> 수정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDupTarget(bp.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" /> 복제
                        </DropdownMenuItem>
                        {bp.status === "ACTIVE" && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setEndTarget(bp.id)}
                          >
                            <StopCircle className="h-4 w-4 mr-2" /> 종료
                          </DropdownMenuItem>
                        )}
                        {(bp.status === "DRAFT" || bp.status === "CANCELLED") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> 삭제
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 {total}개 중 {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, total)}개
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              이전
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 다이얼로그 */}
      {endTarget && (
        <EndBlockpickDialog
          id={endTarget}
          open
          onClose={() => setEndTarget(null)}
        />
      )}
      {dupTarget && (
        <DuplicateBlockpickDialog
          id={dupTarget}
          open
          onClose={() => setDupTarget(null)}
        />
      )}
    </div>
  );
}
