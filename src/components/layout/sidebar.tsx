"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Layers,
  Settings2,
  BarChart3,
  Palette,
  CreditCard,
  Users,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { WorkspaceCard } from "@/components/layout/workspace-card";

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

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigation.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some(
          (child) =>
            pathname === child.href ||
            pathname.startsWith(child.href.split("?")[0] + "/")
        );
        initial[item.name] = isActive;
      }
    });
    return initial;
  });

  // 경로 변경 시 그룹 자동 오픈 동기화
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      navigation.forEach((item) => {
        if (item.children) {
          const isActive = item.children.some(
            (child) =>
              pathname === child.href ||
              pathname.startsWith(child.href.split("?")[0] + "/")
          );
          if (isActive) next[item.name] = true;
        }
      });
      return next;
    });
  }, [pathname]);

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
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-border p-2">
        <WorkspaceCard onClick={onClose} />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            if (!item.children) {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href!}
                    onClick={onClose}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-r-sm bg-brand" />
                    )}
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            }

            const groupActive = isChildActive(item.children);
            const isOpen = openGroups[item.name] ?? groupActive;

            return (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    groupActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className={cn(groupActive && "font-medium")}>
                      {item.name}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <ul className="ml-[1.0625rem] mt-0.5 space-y-0.5 border-l border-border pl-2">
                    {item.children.map((child) => {
                      const childActive =
                        pathname === child.href ||
                        (!child.href.includes("?") &&
                          child.href !== "/" &&
                          pathname.startsWith(child.href));
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "relative block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                              childActive
                                ? "bg-secondary font-medium text-foreground"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                          >
                            {childActive && (
                              <span className="absolute inset-y-1.5 -left-2 w-0.5 rounded-r-sm bg-brand" />
                            )}
                            {child.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-2">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem(
                process.env.NEXT_PUBLIC_TOKEN_KEY ?? "partner_access_token"
              );
              window.location.href = "/login";
            }
            onClose?.();
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
