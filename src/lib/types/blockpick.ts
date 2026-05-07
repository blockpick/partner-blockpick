export type BlockpickStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "ENDED"
  | "CANCELLED";

export interface Blockpick {
  id: string;
  partnerId: string;
  title: string;
  description?: string;
  status: BlockpickStatus;
  thumbnailUrl?: string;
  startAt?: string;
  endAt?: string;
  gridSize: number;
  maxParticipants?: number;
  totalParticipants: number;
  totalVisits: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlockpickListItem
  extends Pick<
    Blockpick,
    | "id"
    | "title"
    | "status"
    | "thumbnailUrl"
    | "startAt"
    | "endAt"
    | "totalParticipants"
    | "totalVisits"
    | "createdAt"
  > {}

export interface BlockpickKpi {
  totalVisits: number;
  totalParticipants: number;
  conversionRate: number;
  referralCount: number;
  adWatchCount: number;
  activeBlockpickCount: number;
}

export interface BlockpickFilter {
  status?: BlockpickStatus;
  page?: number;
  pageSize?: number;
  search?: string;
}
