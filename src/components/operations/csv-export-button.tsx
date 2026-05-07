"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CsvExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  headers: { key: keyof T; label: string }[];
  disabled?: boolean;
}

export function CsvExportButton<T extends Record<string, unknown>>({
  data,
  filename,
  headers,
  disabled,
}: CsvExportButtonProps<T>) {
  function handleExport() {
    if (!data.length) return;

    const headerRow = headers.map((h) => h.label).join(",");
    const rows = data.map((row) =>
      headers
        .map((h) => {
          const val = row[h.key];
          const str = val == null ? "" : String(val);
          // 콤마/따옴표 포함 시 따옴표로 감싸기
          return str.includes(",") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(","),
    );

    const csvContent = [headerRow, ...rows].join("\n");
    const bom = "﻿"; // UTF-8 BOM (Excel 한글 깨짐 방지)
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || !data.length}
      className="gap-1.5"
    >
      <Download className="h-4 w-4" />
      CSV 내보내기
    </Button>
  );
}
