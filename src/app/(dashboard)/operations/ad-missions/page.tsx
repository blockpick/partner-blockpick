"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useAdMissionSetting,
  useUpdateAdMissionSetting,
} from "@/lib/hooks/use-operations";
import type { MissionConfig, MissionType } from "@/lib/types/operations";

const MISSION_TYPE_LABEL: Record<MissionType, string> = {
  SIGNUP: "회원가입",
  APP_INSTALL: "앱 설치",
  CHANNEL_SUBSCRIBE: "채널 구독",
  PAGE_VISIT: "페이지 방문",
  QR_VERIFY: "QR 인증",
};

type MissionDraft = Omit<MissionConfig, "id"> & { _key: string };

export default function AdMissionsPage() {
  const [blockpickId, setBlockpickId] = useState("");
  const { data, isLoading } = useAdMissionSetting(blockpickId);
  const update = useUpdateAdMissionSetting();

  const [adEnabled, setAdEnabled] = useState(false);
  const [adDailyLimit, setAdDailyLimit] = useState(0);
  const [adRewardAmount, setAdRewardAmount] = useState(0);
  const [missionEnabled, setMissionEnabled] = useState(false);
  const [missions, setMissions] = useState<MissionDraft[]>([]);

  useEffect(() => {
    if (!data) return;
    setAdEnabled(data.adEnabled);
    setAdDailyLimit(data.adDailyLimit);
    setAdRewardAmount(data.adRewardAmount);
    setMissionEnabled(data.missionEnabled);
    setMissions(
      (data.missions ?? []).map((m) => ({
        _key: m.id,
        type: m.type,
        label: m.label,
        rewardAmount: m.rewardAmount,
        enabled: m.enabled,
        targetUrl: m.targetUrl,
      }))
    );
  }, [data]);

  const addMission = () => {
    setMissions((prev) => [
      ...prev,
      {
        _key: `new-${Date.now()}`,
        type: "SIGNUP",
        label: "",
        rewardAmount: 1,
        enabled: true,
        targetUrl: "",
      },
    ]);
  };

  const updateMission = (key: string, patch: Partial<MissionDraft>) => {
    setMissions((prev) =>
      prev.map((m) => (m._key === key ? { ...m, ...patch } : m))
    );
  };

  const removeMission = (key: string) => {
    setMissions((prev) => prev.filter((m) => m._key !== key));
  };

  async function handleSave() {
    if (!blockpickId) return;
    await update.mutateAsync({
      blockpickId,
      input: {
        adEnabled,
        adDailyLimit,
        adRewardAmount,
        missionEnabled,
        missions: missions.map(({ _key, ...rest }) => rest),
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="광고/미션 설정"
        description="블록픽별 추가 참여 정책을 설정합니다."
        actions={
          blockpickId && (
            <Button onClick={handleSave} disabled={update.isPending}>
              {update.isPending ? "저장 중..." : "설정 저장"}
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-1.5">
            <Label>블록픽 선택</Label>
            <BlockpickSelect
              value={blockpickId}
              onChange={setBlockpickId}
              includeAll={false}
            />
          </div>
        </CardContent>
      </Card>

      {!blockpickId ? (
        <Card>
          <CardContent className="px-4 py-10 text-center text-sm text-muted-foreground">
            설정할 블록픽을 먼저 선택하세요.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardDescription>광고 보상</CardDescription>
              <CardTitle>리워드 광고 시청</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">광고 시청 추가 참여</p>
                  <p className="text-xs text-muted-foreground">
                    사용자가 광고를 끝까지 시청하면 추가 참여권을 지급합니다.
                  </p>
                </div>
                <Switch checked={adEnabled} onCheckedChange={setAdEnabled} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ad-daily-limit">일일 시청 한도</Label>
                  <Input
                    id="ad-daily-limit"
                    type="number"
                    min={0}
                    value={adDailyLimit}
                    onChange={(e) => setAdDailyLimit(Number(e.target.value))}
                    disabled={!adEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ad-reward-amount">시청당 보상 수량</Label>
                  <Input
                    id="ad-reward-amount"
                    type="number"
                    min={0}
                    value={adRewardAmount}
                    onChange={(e) => setAdRewardAmount(Number(e.target.value))}
                    disabled={!adEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardDescription>미션</CardDescription>
                <CardTitle>참여 미션</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addMission}
                disabled={!missionEnabled}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />새 미션
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">미션 시스템 사용</p>
                  <p className="text-xs text-muted-foreground">
                    사용자가 지정된 미션을 완료하면 추가 참여권을 지급합니다.
                  </p>
                </div>
                <Switch
                  checked={missionEnabled}
                  onCheckedChange={setMissionEnabled}
                />
              </div>

              {missionEnabled && (
                <div className="space-y-2">
                  {!missions.length ? (
                    <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                      등록된 미션이 없습니다. 새 미션을 추가하세요.
                    </p>
                  ) : (
                    missions.map((mission) => (
                      <div
                        key={mission._key}
                        className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[160px_1fr_140px_auto_auto]"
                      >
                        <Select
                          value={mission.type}
                          onValueChange={(v) =>
                            updateMission(mission._key, {
                              type: v as MissionType,
                            })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MISSION_TYPE_LABEL).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        <Input
                          value={mission.label}
                          placeholder="미션 라벨 (예: 인스타그램 팔로우)"
                          onChange={(e) =>
                            updateMission(mission._key, {
                              label: e.target.value,
                            })
                          }
                        />

                        <Input
                          type="number"
                          min={0}
                          value={mission.rewardAmount}
                          placeholder="보상"
                          onChange={(e) =>
                            updateMission(mission._key, {
                              rewardAmount: Number(e.target.value),
                            })
                          }
                        />

                        <div className="flex items-center justify-center">
                          <Switch
                            checked={mission.enabled}
                            onCheckedChange={(checked) =>
                              updateMission(mission._key, { enabled: checked })
                            }
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMission(mission._key)}
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
