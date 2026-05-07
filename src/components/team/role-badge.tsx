import { Badge } from "@/components/ui/badge";
import type { TeamRole } from "@/lib/types/team";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<TeamRole, string> = {
  OWNER: "오너",
  MANAGER: "매니저",
  VIEWER: "뷰어",
};

const ROLE_CLASSES: Record<TeamRole, string> = {
  OWNER:
    "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  MANAGER:
    "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  VIEWER:
    "border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

interface RoleBadgeProps {
  role: TeamRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge className={cn(ROLE_CLASSES[role], className)}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}

export { ROLE_LABELS };
