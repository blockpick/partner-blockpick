"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandLogoColor, useUpdateLogoColor, useUploadLogo } from "@/lib/hooks/use-brand";

export default function BrandLogoColorPage() {
  const { data } = useBrandLogoColor();
  const update = useUpdateLogoColor();
  const uploadLogo = useUploadLogo();
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [logoBase64, setLogoBase64] = useState<string | undefined>();

  useEffect(() => {
    if (!data) return;
    setPrimaryColor(data.primaryColor);
    setSecondaryColor(data.secondaryColor);
    setLogoBase64(data.logoUrl ?? undefined);
  }, [data]);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    const encoded = await uploadLogo.mutateAsync(file);
    setLogoBase64(encoded);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="로고/컬러"
        description="브랜드 노출에 사용할 로고와 대표 색상을 설정합니다."
        actions={
          <Button
            onClick={() => update.mutate({ primaryColor, secondaryColor, logoBase64 })}
            disabled={update.isPending}
          >
            저장
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label>로고 업로드</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-16 p-1"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-16 p-1"
                  />
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-medium">미리보기</p>
            <div
              className="rounded-2xl p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              {logoBase64 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoBase64} alt="Logo preview" className="mb-4 h-12 w-12 rounded-lg bg-white object-cover p-1" />
              ) : (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-sm font-bold">
                  BP
                </div>
              )}
              <p className="text-lg font-semibold">Blockpick Partner</p>
              <p className="text-sm text-white/80">브랜드 스타일 미리보기</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
