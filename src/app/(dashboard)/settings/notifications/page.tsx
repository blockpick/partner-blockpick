"use client";

import { useEffect, useState } from "react";
import { Bell, Slack, Mail, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotificationPrefs,
  useUpdateNotificationPrefs,
} from "@/lib/hooks/use-settings";
import type { NotificationPrefs, NotificationChannel } from "@/lib/types/settings";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface NotifToggleItem {
  key: keyof Pick<
    NotificationPrefs,
    "paymentFailure" | "campaignEnd" | "reportReceived" | "securityAlert" | "marketing"
  >;
  label: string;
  description: string;
}

const NOTIFICATION_ITEMS: NotifToggleItem[] = [
  {
    key: "paymentFailure",
    label: "결제 실패",
    description: "구독 결제가 실패했을 때 알림을 받습니다.",
  },
  {
    key: "campaignEnd",
    label: "캠페인 종료",
    description: "블록픽 캠페인이 종료될 때 알림을 받습니다.",
  },
  {
    key: "reportReceived",
    label: "신고 접수",
    description: "사용자 신고가 접수되었을 때 알림을 받습니다.",
  },
  {
    key: "securityAlert",
    label: "보안 경보",
    description: "비정상 로그인 등 보안 이벤트 발생 시 알림을 받습니다.",
  },
  {
    key: "marketing",
    label: "마케팅",
    description: "신기능, 이벤트 등 마케팅 알림을 받습니다.",
  },
];

const CHANNEL_OPTIONS: { value: NotificationChannel; label: string; icon: React.ReactNode }[] = [
  { value: "EMAIL", label: "이메일", icon: <Mail className="h-4 w-4" /> },
  { value: "SMS", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "SLACK", label: "Slack", icon: <Slack className="h-4 w-4" /> },
];

export default function SettingsNotificationsPage() {
  const { data, isLoading } = useNotificationPrefs();
  const updateMutation = useUpdateNotificationPrefs();

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setPrefs(data);
      setIsDirty(false);
    }
  }, [data]);

  function toggleNotif(
    key: keyof Pick<
      NotificationPrefs,
      "paymentFailure" | "campaignEnd" | "reportReceived" | "securityAlert" | "marketing"
    >,
  ) {
    setPrefs((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: !prev[key] };
    });
    setIsDirty(true);
  }

  function toggleChannel(channel: NotificationChannel) {
    setPrefs((prev) => {
      if (!prev) return prev;
      const channels = prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
    setIsDirty(true);
  }

  function handleSlackWebhookChange(url: string) {
    setPrefs((prev) => {
      if (!prev) return prev;
      return { ...prev, slackWebhookUrl: url };
    });
    setIsDirty(true);
  }

  async function handleSave() {
    if (!prefs) return;
    await updateMutation.mutateAsync(prefs);
    setIsDirty(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="알림 설정"
        description="수신할 알림 종류와 채널을 설정합니다."
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          {/* 알림 종류 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                알림 종류
              </CardTitle>
              <CardDescription>
                받고 싶은 알림을 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {NOTIFICATION_ITEMS.map((item, idx) => (
                <div key={item.key}>
                  {idx > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={prefs?.[item.key] ?? false}
                      onCheckedChange={() => toggleNotif(item.key)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 알림 채널 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">알림 채널</CardTitle>
              <CardDescription>
                알림을 받을 채널을 선택해주세요. 복수 선택 가능합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {CHANNEL_OPTIONS.map((ch) => {
                  const active = prefs?.channels.includes(ch.value) ?? false;
                  return (
                    <button
                      key={ch.value}
                      type="button"
                      onClick={() => toggleChannel(ch.value)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {ch.icon}
                      {ch.label}
                    </button>
                  );
                })}
              </div>

              {prefs?.channels.includes("SLACK") && (
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="slackWebhook">Slack 웹훅 URL</Label>
                  <Input
                    id="slackWebhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={prefs?.slackWebhookUrl ?? ""}
                    onChange={(e) =>
                      handleSlackWebhookChange(e.target.value)
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {data?.updatedAt && (
            <p className="text-xs text-muted-foreground">
              마지막 업데이트:{" "}
              {format(new Date(data.updatedAt), "yyyy.MM.dd HH:mm", {
                locale: ko,
              })}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
