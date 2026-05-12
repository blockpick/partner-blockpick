"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBrandDisclaimer, useUpdateDisclaimer } from "@/lib/hooks/use-brand";

export default function DisclaimerPage() {
  const { data } = useBrandDisclaimer();
  const update = useUpdateDisclaimer();
  const [ko, setKo] = useState("");
  const [en, setEn] = useState("");

  useEffect(() => {
    if (!data) return;
    setKo(data.ko);
    setEn(data.en);
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="기본 유의사항"
        description="다국어 기본 유의사항 문구를 설정합니다."
        actions={
          <Button onClick={() => update.mutate({ ko, en })} disabled={update.isPending}>
            저장
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>국문</Label>
            <Textarea value={ko} onChange={(e) => setKo(e.target.value)} rows={12} />
          </div>
          <div className="space-y-2">
            <Label>영문</Label>
            <Textarea value={en} onChange={(e) => setEn(e.target.value)} rows={12} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
