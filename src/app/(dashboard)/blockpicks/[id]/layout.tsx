"use client";

import { useParams } from "next/navigation";
import { DetailHeader } from "@/components/blockpicks/detail/detail-header";
import { DetailNav } from "@/components/blockpicks/detail/detail-nav";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";

export default function BlockpickDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useBlockpickDetail(id);

  return (
    <div className="space-y-5">
      <DetailHeader blockpickId={id} blockpick={data} isLoading={isLoading} />
      <DetailNav blockpickId={id} />
      <div>{children}</div>
    </div>
  );
}
