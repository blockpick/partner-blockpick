"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyBlockpicks } from "@/lib/hooks/use-my-blockpicks";

interface BlockpickSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;
}

export function BlockpickSelect({
  value,
  onChange,
  placeholder = "블록픽 선택",
  includeAll = true,
}: BlockpickSelectProps) {
  const { data, isLoading } = useMyBlockpicks();

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={isLoading ? "불러오는 중..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">전체 블록픽</SelectItem>}
        {data?.items.map((bp) => (
          <SelectItem key={bp.id} value={bp.id}>
            {bp.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
