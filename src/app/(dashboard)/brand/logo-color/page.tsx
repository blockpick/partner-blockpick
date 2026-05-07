"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandLogoColor, useUpdateLogoColor, useUploadLogo } from "@/lib/hooks/use-brand";
import { Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function BrandLogoColorPage() {
  const { data, isLoading } = useBrandLogoColor();
  const updateLogoColor = useUpdateLogoColor();
  const uploadLogo = useUploadLogo();

  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#8B5CF6");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setPrimaryColor(data.primaryColor);
      setSecondaryColor(data.secondaryColor);
      setLogoPreview(data.logoUrl);
    }
  }, [data]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await uploadLogo.mutateAsync(file);
    setLogoPreview(dataUrl);
    setIsDirty(true);
  };

  const handleSave = () => {
    updateLogoColor.mutate({
      primaryColor,
      secondaryColor,
      logoBase64: logoPreview?.startsWith("data:") ? logoPreview : undefined,
    });
    setIsDirty(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">로고 &amp; 컬러</h1>
        <p className="text-sm text-muted-foreground">
          블록픽에 노출될 브랜드 로고와 대표 색상을 설정합니다
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 로고 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle>브랜드 로고</CardTitle>
            <CardDescription>PNG, JPG, SVG — 최대 2MB, 권장 200×200px</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="브랜드 로고"
                  width={120}
                  height={120}
                  className="max-h-32 w-auto object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm">클릭하여 로고 업로드</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogo.isPending}
              >
                <Upload className="mr-1.5 h-4 w-4" />
                {uploadLogo.isPending ? "업로드 중..." : "로고 선택"}
              </Button>
              {logoPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLogoPreview(null);
                    setIsDirty(true);
                  }}
                >
                  삭제
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 브랜드 컬러 */}
        <Card>
          <CardHeader>
            <CardTitle>브랜드 컬러</CardTitle>
            <CardDescription>블록픽 UI에 적용될 주요 색상을 선택합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">주 색상 (Primary)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => {
                    setPrimaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 w-14 cursor-pointer rounded-md border border-input p-0.5"
                />
                <span className="font-mono text-sm text-muted-foreground">{primaryColor.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">보조 색상 (Secondary)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    setIsDirty(true);
                  }}
                  className="h-10 w-14 cursor-pointer rounded-md border border-input p-0.5"
                />
                <span className="font-mono text-sm text-muted-foreground">{secondaryColor.toUpperCase()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 미리보기 카드 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>블록픽 카드 미리보기</CardTitle>
            <CardDescription>실제 사용자에게 보이는 블록픽 카드 예시입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                className="relative w-72 overflow-hidden rounded-2xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="로고"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover bg-white"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/30" />
                    )}
                    <span className="text-sm font-semibold text-white/90">브랜드명</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white">여름 시즌 이벤트</h3>
                  <p className="text-sm text-white/70">블록을 픽하고 경품을 받아가세요!</p>
                  <div className="mt-4 grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex h-16 items-center justify-center rounded-lg bg-white/20 text-xs font-bold text-white"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-4 w-full rounded-lg py-2.5 text-center text-sm font-semibold"
                    style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "white" }}
                  >
                    지금 참여하기
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty || updateLogoColor.isPending}>
          {updateLogoColor.isPending ? "저장 중..." : "변경사항 저장"}
        </Button>
      </div>
    </div>
  );
}
