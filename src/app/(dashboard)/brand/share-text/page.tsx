"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBrandShareText, useUpdateShareText } from "@/lib/hooks/use-brand";

export default function ShareTextPage() {
  const { data } = useBrandShareText();
  const update = useUpdateShareText();
  const [kakao, setKakao] = useState("");
  const [sms, setSms] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!data) return;
    setKakao(data.kakao);
    setSms(data.sms);
    setLink(data.link);
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="공유 문구"
        description="카카오, SMS, 링크 공유에 사용할 기본 텍스트를 관리합니다."
        actions={
          <Button onClick={() => update.mutate({ kakao, sms, link })} disabled={update.isPending}>
            저장
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6">
          <TextField label="카카오 공유 문구" value={kakao} onChange={setKakao} />
          <TextField label="SMS 문구" value={sms} onChange={setSms} />
          <TextField label="링크 복사 문구" value={link} onChange={setLink} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">치환 변수 예시</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>{"{{캠페인명}} -> 여름 특별 이벤트"}</p>
          <p>{"{{혜택}} -> 스타벅스 쿠폰"}</p>
          <p>{"{{기간}} -> 2026.05.01 ~ 2026.05.31"}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
    </div>
  );
}
