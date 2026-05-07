"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Layers,
  Settings2,
  BarChart3,
  Palette,
  CreditCard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Plus,
} from "lucide-react";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: "홈",
    href: "/",
    icon: Home,
  },
  {
    name: "블록픽",
    icon: Layers,
    children: [
      { name: "전체 블록픽", href: "/blockpicks" },
      { name: "새 블록픽 만들기", href: "/blockpicks/new" },
      { name: "진행중", href: "/blockpicks?status=ACTIVE" },
      { name: "예약됨", href: "/blockpicks?status=SCHEDULED" },
      { name: "종료됨", href: "/blockpicks?status=ENDED" },
      { name: "임시저장", href: "/blockpicks?status=DRAFT" },
    ],
  },
  {
    name: "운영",
    icon: Settings2,
    children: [
      { name: "참여자 관리", href: "/operations/participants" },
      { name: "당첨자 관리", href: "/operations/winners" },
      { name: "공유/리퍼럴 관리", href: "/operations/referrals" },
      { name: "광고/미션 설정", href: "/operations/ad-missions" },
    ],
  },
  {
    name: "분석",
    icon: BarChart3,
    children: [
      { name: "전체 성과", href: "/analytics/overview" },
      { name: "블록픽별 성과", href: "/analytics/by-blockpick" },
      { name: "친구 초대 성과", href: "/analytics/referral" },
      { name: "광고 성과", href: "/analytics/ad" },
      { name: "유입 채널 분석", href: "/analytics/channels" },
    ],
  },
  {
    name: "브랜드",
    icon: Palette,
    children: [
      { name: "브랜드 기본정보", href: "/brand/info" },
      { name: "로고/컬러", href: "/brand/logo-color" },
      { name: "공유 문구", href: "/brand/share-text" },
      { name: "기본 유의사항", href: "/brand/disclaimer" },
    ],
  },
  {
    name: "구독/결제",
    icon: CreditCard,
    children: [
      { name: "현재 플랜", href: "/billing/plan" },
      { name: "사용량", href: "/billing/usage" },
      { name: "결제수단", href: "/billing/payment" },
      { name: "청구 내역", href: "/billing/history" },
      { name: "플랜 변경", href: "/billing/upgrade" },
    ],
  },
  {
    name: "팀",
    icon: Users,
    children: [
      { name: "멤버 관리", href: "/team/members" },
      { name: "권한 관리", href: "/team/roles" },
      { name: "활동 로그", href: "/team/activity" },
    ],
  },
  {
    name: "설정",
    icon: Settings,
    children: [
      { name: "사업자 정보", href: "/settings/business" },
      { name: "CS 정보", href: "/settings/cs" },
      { name: "알림 설정", href: "/settings/notifications" },
      { name: "계정 설정", href: "/settings/account" },
    ],
  },
];

interface SidebarProps {
  inSheet?: boolean;
  onClose?: () => void;
}

export function Sidebar({ inSheet = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("partner-sidebar-collapsed") === "true";
    }
    return false;
  });

  // 각 그룹의 펼침/접힘 상태
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // 현재 경로와 매칭되는 그룹을 기본 오픈
    const initial: Record<string, boolean> = {};
    navigation.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((child) =>
          pathname === child.href || pathname.startsWith(child.href.split("?")[0] + "/")
        );
        initial[item.name] = isActive;
      }
    });
    return initial;
  });

  useEffect(() => {
    if (!inSheet) {
      localStorage.setItem("partner-sidebar-collapsed", String(collapsed));
    }
  }, [collapsed, inSheet]);

  const isCollapsed = inSheet ? false : collapsed;

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isChildActive = (children: { name: string; href: string }[]) =>
    children.some(
      (child) =>
        pathname === child.href ||
        pathname.startsWith(child.href.split("?")[0] + "/")
    );

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* 로고 + 토글 */}
      <div
        className={cn(
          "flex h-16 items-center border-b shrink-0",
          isCollapsed ? "justify-center px-0" : "justify-between px-4"
        )}
      >
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={onClose}
        >
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">BP</span>
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold whitespace-nowrap">
              파트너 대시보드
            </span>
          )}
        </Link>

        {!inSheet && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* 새 블록픽 빠른 버튼 */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-b">
          <Link href="/blockpicks/new" onClick={onClose}>
            <Button size="sm" className="w-full gap-1.5">
              <Plus className="h-4 w-4" />
              새 블록픽 만들기
            </Button>
          </Link>
        </div>
      )}

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navigation.map((item) => {
          // 단일 링크 메뉴 (홈)
          if (!item.children) {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center" : "space-x-3",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {item.name}
                  </div>
                )}
              </div>
            );
          }

          // 그룹 메뉴
          const groupActive = isChildActive(item.children);
          const isOpen = openGroups[item.name] ?? groupActive;

          return (
            <div key={item.name}>
              {/* 그룹 헤더 */}
              <div className="relative group">
                <button
                  onClick={() => !isCollapsed && toggleGroup(item.name)}
                  className={cn(
                    "w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center" : "justify-between",
                    groupActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center",
                      isCollapsed ? "" : "space-x-3"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </span>
                  {!isCollapsed && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {item.name}
                  </div>
                )}
              </div>

              {/* 자식 메뉴 */}
              {!isCollapsed && isOpen && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l pl-3">
                  {item.children.map((child) => {
                    const childActive =
                      pathname === child.href ||
                      (child.href !== "/" &&
                        !child.href.includes("?") &&
                        pathname.startsWith(child.href));
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm transition-colors",
                          childActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="border-t p-2 shrink-0">
        <div className="relative group">
          <button
            className={cn(
              "w-full flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
            onClick={() => {
              // 로그아웃 로직은 별도 구현
              if (typeof window !== "undefined") {
                localStorage.removeItem(
                  process.env.NEXT_PUBLIC_TOKEN_KEY ?? "partner_access_token"
                );
                window.location.href = "/login";
              }
              onClose?.();
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>로그아웃</span>}
          </button>
          {isCollapsed && (
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              로그아웃
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
