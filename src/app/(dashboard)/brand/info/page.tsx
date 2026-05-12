"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrandInfo, useUpdateBrandInfo } from "@/lib/hooks/use-brand";
import { BRAND_CATEGORY_LABELS, type BrandCategory } from "@/lib/types/brand";

export default function BrandInfoPage() {
  const { data, isLoading } = useBrandInfo();
  const update = useUpdateBrandInfo();
  const [form, setForm] = useState({
    businessName: "",
    representative: "",
    businessNumber: "",
    category: "OTHER" as BrandCategory,
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      businessName: data.businessName,
      representative: data.representative,
      businessNumber: data.businessNumber,
      category: data.category,
      websiteUrl: data.websiteUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
    });
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="브랜드 기본정보"
        description="파트너 브랜드의 사업자 및 연락처 정보를 관리합니다."
        actions={
          <Button onClick={() => update.mutate(form)} disabled={update.isPending || isLoading}>
            저장
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <Field label="사업자명">
            <Input
              value={form.businessName}
              onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
            />
          </Field>
          <Field label="대표자명">
            <Input
              value={form.representative}
              onChange={(e) => setForm((prev) => ({ ...prev, representative: e.target.value }))}
            />
          </Field>
          <Field label="사업자등록번호">
            <Input
              value={form.businessNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, businessNumber: e.target.value }))}
            />
          </Field>
          <Field label="카테고리">
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, category: value as BrandCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BRAND_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="웹사이트 URL">
            <Input
              value={form.websiteUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
            />
          </Field>
          <Field label="대표 이메일">
            <Input
              value={form.contactEmail}
              onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
            />
          </Field>
          <Field label="대표 연락처">
            <Input
              value={form.contactPhone}
              onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
