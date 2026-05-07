"use client";

import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/team/role-badge";
import type { TeamRole, PermissionKey, RolePermissionMatrix } from "@/lib/types/team";

interface PermissionDef {
  key: PermissionKey;
  label: string;
  description: string;
  category: string;
}

const PERMISSIONS: PermissionDef[] = [
  {
    key: "blockpick_create",
    label: "블록픽 생성",
    description: "새 블록픽 캠페인을 생성합니다.",
    category: "블록픽",
  },
  {
    key: "blockpick_edit",
    label: "블록픽 수정",
    description: "기존 블록픽 캠페인을 수정합니다.",
    category: "블록픽",
  },
  {
    key: "blockpick_end",
    label: "블록픽 종료",
    description: "진행 중인 블록픽 캠페인을 종료합니다.",
    category: "블록픽",
  },
  {
    key: "participant_view",
    label: "참여자 조회",
    description: "캠페인 참여자 목록과 당첨자를 조회합니다.",
    category: "운영",
  },
  {
    key: "analytics_view",
    label: "분석 조회",
    description: "캠페인 성과 분석 데이터를 조회합니다.",
    category: "운영",
  },
  {
    key: "billing_manage",
    label: "결제 관리",
    description: "구독 결제 및 청구서를 관리합니다.",
    category: "결제",
  },
  {
    key: "team_manage",
    label: "팀 관리",
    description: "팀원 초대, 역할 변경, 제거를 수행합니다.",
    category: "팀",
  },
  {
    key: "brand_manage",
    label: "브랜드 설정",
    description: "브랜드 정보와 노출 설정을 변경합니다.",
    category: "설정",
  },
];

const ROLE_MATRIX: RolePermissionMatrix = {
  OWNER: {
    blockpick_create: true,
    blockpick_edit: true,
    blockpick_end: true,
    participant_view: true,
    analytics_view: true,
    billing_manage: true,
    team_manage: true,
    brand_manage: true,
  },
  MANAGER: {
    blockpick_create: true,
    blockpick_edit: true,
    blockpick_end: true,
    participant_view: true,
    analytics_view: true,
    billing_manage: false,
    team_manage: false,
    brand_manage: true,
  },
  VIEWER: {
    blockpick_create: false,
    blockpick_edit: false,
    blockpick_end: false,
    participant_view: true,
    analytics_view: true,
    billing_manage: false,
    team_manage: false,
    brand_manage: false,
  },
};

const ROLES: TeamRole[] = ["OWNER", "MANAGER", "VIEWER"];

const CATEGORIES = ["블록픽", "운영", "결제", "팀", "설정"];

function PermIcon({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check className="h-4 w-4 text-green-600 mx-auto" />
  ) : (
    <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );
}

export default function TeamRolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">권한 관리</h1>
        <p className="text-sm text-muted-foreground mt-1">
          역할별 권한 매트릭스를 확인합니다. 권한 변경은 OWNER만 가능합니다.
        </p>
      </div>

      {/* 역할 설명 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        {ROLES.map((role) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <RoleBadge role={role} />
              </CardTitle>
              <CardDescription>
                {role === "OWNER" && "모든 권한을 가집니다. 팀당 1명만 존재합니다."}
                {role === "MANAGER" && "결제·팀 관리를 제외한 모든 운영 권한을 가집니다."}
                {role === "VIEWER" && "캠페인 및 분석 데이터를 조회만 할 수 있습니다."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-muted-foreground">
                {Object.values(ROLE_MATRIX[role]).filter(Boolean).length} /{" "}
                {PERMISSIONS.length} 권한 허용
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 권한 매트릭스 테이블 */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-56">권한</TableHead>
              <TableHead className="text-center">설명</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center w-24">
                  <RoleBadge role={role} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((category) => {
              const perms = PERMISSIONS.filter((p) => p.category === category);
              return perms.map((perm, idx) => (
                <TableRow key={perm.key}>
                  {idx === 0 && (
                    <TableCell
                      rowSpan={perms.length}
                      className="border-r font-medium text-sm align-top pt-4 text-muted-foreground"
                    >
                      {category}
                    </TableCell>
                  )}
                  {/* category가 첫 번째가 아닌 경우 빈 셀 없음 - rowSpan으로 처리 */}
                  <TableCell className="text-sm">
                    <p className="font-medium">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {perm.description}
                    </p>
                  </TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role} className="text-center">
                      <PermIcon allowed={ROLE_MATRIX[role][perm.key]} />
                    </TableCell>
                  ))}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        * 커스텀 역할 기능은 추후 지원 예정입니다.
      </p>
    </div>
  );
}
