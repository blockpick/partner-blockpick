"use client";

import { useState, useEffect } from "react";
import {
  useAdMissionSetting,
  useUpdateAdMissionSetting,
} from "@/lib/hooks/use-operations";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import type { AdMissionSetting, MissionType } from "@/lib/types/operations";

const MISSION_TYPE_LABEL: Record<MissionType, string> = {
  SIGNUP: "회원가입",
  APP_INSTALL: "앱 설치",
  CHANNEL_SUBSCRIBE: "채널 구독",
  PAGE_VISIT: "페이지 방문",
  QR_VERIFY: "QR 인증",
};

export default function OperationsAdMissionsPage() {
  const [blockpickId, setBlockpickId] = useState("mock-1");
  const { data, isLoading } = useAdMissionSetting(blockpickId);
  const updateSetting = useUpdateAdMissionSetting();

  // 로컬 편집 상태
  const [form, setForm] = useState<AdMissionSetting | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  function handleSave() {
    if (!form) return;
    updateSetting.mutate({
      blockpickId,
      input: {
        adEnabled: form.adEnabled,
        adDailyLimit: form.adDailyLimit,
        adRewardAmount: form.adRewardAmount,
        missionEnabled: form.missionEnabled,
        missions: form.missions.map(({ id: _id, ...rest }) => rest),
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">광고/미션 설정</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            블록픽별 광고 시청 및 미션 보상 설정을 관리합니다
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!form || updateSetting.isPending}
          className="gap-1.5"
        >
          <Save className="h-4 w-4" />
          {updateSetting.isPending ? "저장 중..." : "저장"}
        </Button>
      </div>

      {/* 블록픽 선택 */}
      <div>
        <BlockpickSelect
          value={blockpickId}
          onChange={(v) => setBlockpickId(v)}
          includeAll={false}
        />
      </div>

      {isLoading || !form ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 광고 설정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">광고 시청 설정</CardTitle>
                  <CardDescription>
                    광고 시청으로 추가 참여권을 지급합니다
                  </CardDescription>
                </div>
                <Switch
                  checked={form.adEnabled}
                  onCheckedChange={(v) =>
                    setForm((prev) => prev && { ...prev, adEnabled: v })
                  }
                />
              </div>
            </CardHeader>
            {form.adEnabled && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>일일 광고 시청 한도 (회/인)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={form.adDailyLimit}
                      onChange={(e) =>
                        setForm(
                          (prev) =>
                            prev && {
                              ...prev,
                              adDailyLimit: Number(e.target.value),
                            },
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>광고 시청 보상 (참여권 개수)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.adRewardAmount}
                      onChange={(e) =>
                        setForm(
                          (prev) =>
                            prev && {
                              ...prev,
                              adRewardAmount: Number(e.target.value),
                            },
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* 미션 설정 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">미션 설정</CardTitle>
                  <CardDescription>
                    미션 완료 시 추가 참여권을 지급합니다
                  </CardDescription>
                </div>
                <Switch
                  checked={form.missionEnabled}
                  onCheckedChange={(v) =>
                    setForm((prev) => prev && { ...prev, missionEnabled: v })
                  }
                />
              </div>
            </CardHeader>
            {form.missionEnabled && (
              <CardContent className="space-y-4">
                {form.missions.map((mission, idx) => (
                  <div key={mission.id}>
                    {idx > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start gap-4">
                      <Switch
                        checked={mission.enabled}
                        onCheckedChange={(v) =>
                          setForm(
                            (prev) =>
                              prev && {
                                ...prev,
                                missions: prev.missions.map((m, i) =>
                                  i === idx ? { ...m, enabled: v } : m,
                                ),
                              },
                          )
                        }
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {MISSION_TYPE_LABEL[mission.type]}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {mission.type}
                          </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">미션 라벨</Label>
                            <Input
                              value={mission.label}
                              onChange={(e) =>
                                setForm(
                                  (prev) =>
                                    prev && {
                                      ...prev,
                                      missions: prev.missions.map((m, i) =>
                                        i === idx
                                          ? { ...m, label: e.target.value }
                                          : m,
                                      ),
                                    },
                                )
                              }
                              disabled={!mission.enabled}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">
                              보상 단가 (참여권 개수)
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              value={mission.rewardAmount}
                              onChange={(e) =>
                                setForm(
                                  (prev) =>
                                    prev && {
                                      ...prev,
                                      missions: prev.missions.map((m, i) =>
                                        i === idx
                                          ? {
                                              ...m,
                                              rewardAmount: Number(
                                                e.target.value,
                                              ),
                                            }
                                          : m,
                                      ),
                                    },
                                )
                              }
                              disabled={!mission.enabled}
                            />
                          </div>
                          {mission.targetUrl !== undefined && (
                            <div className="space-y-1 sm:col-span-2">
                              <Label className="text-xs">목표 URL</Label>
                              <Input
                                value={mission.targetUrl ?? ""}
                                onChange={(e) =>
                                  setForm(
                                    (prev) =>
                                      prev && {
                                        ...prev,
                                        missions: prev.missions.map((m, i) =>
                                          i === idx
                                            ? {
                                                ...m,
                                                targetUrl: e.target.value,
                                              }
                                            : m,
                                        ),
                                      },
                                  )
                                }
                                disabled={!mission.enabled}
                                placeholder="https://"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
