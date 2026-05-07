export type BlockpickStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "ENDED"
  | "CANCELLED";

export type RewardType = "COUPON" | "VOUCHER" | "PHYSICAL" | "POINT";
export type PublishType = "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
export type AuthType = "NONE" | "PHONE" | "EMAIL" | "SNS";
export type ExtraEntryType = "REFERRAL" | "AD" | "MISSION";
export type DeliveryPayer = "PARTNER" | "WINNER";

export interface Blockpick {
  id: string;
  partnerId: string;
  title: string;
  description?: string;
  status: BlockpickStatus;
  thumbnailUrl?: string;
  partnerName?: string;
  landingUrl?: string;
  startAt?: string;
  endAt?: string;
  gridSize: number;
  freeEntryCount: number;
  maxEntryPerUser: number;
  extraEntryTypes: ExtraEntryType[];
  allowDuplicateWin: boolean;
  rewardName?: string;
  rewardType?: RewardType;
  rewardQuantity?: number;
  rewardExpireAt?: string;
  rewardDeliveryMethod?: string;
  requireDelivery: boolean;
  deliveryAvailableCountries?: string[];
  deliveryUnavailableCountries?: string[];
  deliveryPayer?: DeliveryPayer;
  publishType?: PublishType;
  authType?: AuthType;
  collectWinnerInfo?: boolean;
  notice?: string;
  csGuide?: string;
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

export interface BlockpickInput {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  partnerName?: string;
  landingUrl?: string;
  startAt?: string;
  endAt?: string;
  gridSize: number;
  freeEntryCount: number;
  maxEntryPerUser: number;
  extraEntryTypes: ExtraEntryType[];
  allowDuplicateWin: boolean;
  rewardName?: string;
  rewardType?: RewardType;
  rewardQuantity?: number;
  rewardExpireAt?: string;
  rewardDeliveryMethod?: string;
  requireDelivery: boolean;
  deliveryAvailableCountries?: string[];
  deliveryUnavailableCountries?: string[];
  deliveryPayer?: DeliveryPayer;
  publishType?: PublishType;
  authType?: AuthType;
  collectWinnerInfo?: boolean;
  notice?: string;
  csGuide?: string;
  status: BlockpickStatus;
}

export interface BlockpickPreviewResult {
  id: string;
  title: string;
  thumbnailUrl?: string;
  gridSize: number;
  startAt?: string;
  endAt?: string;
  rewardName?: string;
  rewardType?: RewardType;
  rewardQuantity?: number;
}

export interface PaginatedBlockpicks {
  items: BlockpickListItem[];
  total: number;
  page: number;
  pageSize: number;
}
