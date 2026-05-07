"use client";

import { Bell, HelpCircle, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMe } from "@/lib/hooks/use-me";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const { data: me } = useMe();

  const initials = me?.name
    ? me.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "BP";

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0">
      {/* 모바일 사이드바 토글 */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar inSheet />
        </SheetContent>
      </Sheet>

      {/* 테넌트(파트너) 브랜드명 */}
      <div className="hidden md:block">
        <span className="text-sm font-semibold text-muted-foreground">
          {me?.partner?.displayName ?? me?.partner?.name ?? "파트너 대시보드"}
        </span>
      </div>

      {/* 검색 */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="블록픽, 참여자 검색..."
            className="pl-8 bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* 도움말 */}
        <Button variant="ghost" size="icon" aria-label="도움말">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* 알림 */}
        <Button variant="ghost" size="icon" aria-label="알림" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {/* 읽지 않은 알림 뱃지 — 실제 카운트는 추후 연동 */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* 프로필 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={me?.avatarUrl} alt={me?.name ?? "프로필"} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {me?.name ?? "사용자"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {me?.email ?? ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings/account">계정 설정</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/billing/plan">구독/결제</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem(
                    process.env.NEXT_PUBLIC_TOKEN_KEY ?? "partner_access_token"
                  );
                  window.location.href = "/login";
                }
              }}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
