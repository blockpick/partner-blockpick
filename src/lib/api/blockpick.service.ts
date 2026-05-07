import { gqlRequest } from "./client";
import type {
  Blockpick,
  BlockpickListItem,
  BlockpickFilter,
  BlockpickKpi,
  BlockpickInput,
  BlockpickPreviewResult,
  PaginatedBlockpicks,
} from "@/lib/types/blockpick";

// ---------------------------------------------------------------------------
// Mock fallback (백엔드 미머지 시 사용)
// ---------------------------------------------------------------------------
const MOCK_ITEMS: BlockpickListItem[] = [
  {
    id: "mock-1",
    title: "여름 특별 이벤트 블록픽",
    status: "ACTIVE",
    thumbnailUrl: undefined,
    startAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    totalParticipants: 1280,
    totalVisits: 4320,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "mock-2",
    title: "신제품 출시 기념 블록픽",
    status: "SCHEDULED",
    thumbnailUrl: undefined,
    startAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    endAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    totalParticipants: 0,
    totalVisits: 0,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "mock-3",
    title: "봄 할인 프로모션",
    status: "ENDED",
    thumbnailUrl: undefined,
    startAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    endAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalParticipants: 3450,
    totalVisits: 12800,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "mock-4",
    title: "임시저장된 캠페인",
    status: "DRAFT",
    thumbnailUrl: undefined,
    startAt: undefined,
    endAt: undefined,
    totalParticipants: 0,
    totalVisits: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_DETAIL: Blockpick = {
  id: "mock-1",
  partnerId: "partner-1",
  title: "여름 특별 이벤트 블록픽",
  description: "여름을 맞아 특별한 이벤트를 진행합니다. 블록을 선택하고 경품을 받아보세요!",
  status: "ACTIVE",
  thumbnailUrl: undefined,
  partnerName: "테스트 파트너",
  landingUrl: "https://example.com",
  startAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  endAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  gridSize: 10,
  freeEntryCount: 3,
  maxEntryPerUser: 10,
  extraEntryTypes: ["REFERRAL", "AD"],
  allowDuplicateWin: false,
  rewardName: "스타벅스 아메리카노",
  rewardType: "COUPON",
  rewardQuantity: 100,
  rewardExpireAt: new Date(Date.now() + 86400000 * 30).toISOString(),
  rewardDeliveryMethod: "이메일 발송",
  requireDelivery: false,
  publishType: "PUBLIC",
  authType: "PHONE",
  collectWinnerInfo: true,
  notice: "본 이벤트는 1인 1계정만 참여 가능합니다.",
  csGuide: "문의사항은 이메일로 연락주세요: cs@example.com",
  maxParticipants: 5000,
  totalParticipants: 1280,
  totalVisits: 4320,
  createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
};

// ---------------------------------------------------------------------------
// GraphQL Queries / Mutations
// ---------------------------------------------------------------------------
const LIST_QUERY = `
  query PartnerBlockpicks($filter: BlockpickFilterInput) {
    partnerBlockpicks(filter: $filter) {
      items {
        id title status thumbnailUrl startAt endAt
        totalParticipants totalVisits createdAt
      }
      total page pageSize
    }
  }
`;

const DETAIL_QUERY = `
  query PartnerBlockpick($id: ID!) {
    partnerBlockpick(id: $id) {
      id partnerId title description status thumbnailUrl
      partnerName landingUrl startAt endAt gridSize
      freeEntryCount maxEntryPerUser extraEntryTypes allowDuplicateWin
      rewardName rewardType rewardQuantity rewardExpireAt rewardDeliveryMethod
      requireDelivery deliveryAvailableCountries deliveryUnavailableCountries deliveryPayer
      publishType authType collectWinnerInfo notice csGuide
      maxParticipants totalParticipants totalVisits createdAt updatedAt
    }
  }
`;

const KPI_QUERY = `
  query PartnerBlockpickKpi {
    partnerBlockpickKpi {
      totalVisits totalParticipants conversionRate
      referralCount adWatchCount activeBlockpickCount
    }
  }
`;

const CREATE_MUTATION = `
  mutation CreateBlockpick($input: BlockpickInput!, $status: BlockpickStatus!) {
    createBlockpick(input: $input, status: $status) {
      id title status
    }
  }
`;

const UPDATE_MUTATION = `
  mutation UpdateBlockpick($id: ID!, $input: BlockpickInput!) {
    updateBlockpick(id: $id, input: $input) {
      id title status updatedAt
    }
  }
`;

const PUBLISH_MUTATION = `
  mutation PublishBlockpick($id: ID!) {
    publishBlockpick(id: $id) {
      id status
    }
  }
`;

const END_MUTATION = `
  mutation EndBlockpick($id: ID!) {
    endBlockpick(id: $id) {
      id status
    }
  }
`;

const DUPLICATE_MUTATION = `
  mutation DuplicateBlockpick($id: ID!) {
    duplicateBlockpick(id: $id) {
      id title status createdAt
    }
  }
`;

const PREVIEW_MUTATION = `
  mutation PreviewBlockpick($input: BlockpickInput!) {
    previewBlockpick(input: $input) {
      id title thumbnailUrl gridSize startAt endAt
      rewardName rewardType rewardQuantity
    }
  }
`;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function safeGql<T>(
  query: string,
  variables?: Record<string, unknown>,
  mockData?: T,
): Promise<T> {
  if (USE_MOCK && mockData !== undefined) return mockData;
  try {
    return await gqlRequest<T>(query, variables);
  } catch {
    if (mockData !== undefined) return mockData;
    throw new Error("API 요청에 실패했습니다.");
  }
}

export const blockpickService = {
  async list(filter?: BlockpickFilter): Promise<PaginatedBlockpicks> {
    const mockFiltered = filter?.status
      ? MOCK_ITEMS.filter((i) => i.status === filter.status)
      : MOCK_ITEMS;
    const mockResult: PaginatedBlockpicks = {
      items: mockFiltered,
      total: mockFiltered.length,
      page: 1,
      pageSize: 20,
    };
    const data = await safeGql<{ partnerBlockpicks: PaginatedBlockpicks }>(
      LIST_QUERY,
      { filter },
      { partnerBlockpicks: mockResult },
    );
    return data.partnerBlockpicks;
  },

  async detail(id: string): Promise<Blockpick> {
    const data = await safeGql<{ partnerBlockpick: Blockpick }>(
      DETAIL_QUERY,
      { id },
      { partnerBlockpick: { ...MOCK_DETAIL, id } },
    );
    return data.partnerBlockpick;
  },

  async kpi(): Promise<BlockpickKpi> {
    const mockKpi: BlockpickKpi = {
      totalVisits: 21440,
      totalParticipants: 4730,
      conversionRate: 22.1,
      referralCount: 890,
      adWatchCount: 1230,
      activeBlockpickCount: 1,
    };
    const data = await safeGql<{ partnerBlockpickKpi: BlockpickKpi }>(
      KPI_QUERY,
      undefined,
      { partnerBlockpickKpi: mockKpi },
    );
    return data.partnerBlockpickKpi;
  },

  async create(
    input: Omit<BlockpickInput, "status">,
    status: BlockpickInput["status"],
  ): Promise<Pick<Blockpick, "id" | "title" | "status">> {
    const mock = { id: `new-${Date.now()}`, title: input.title, status };
    const data = await safeGql<{
      createBlockpick: Pick<Blockpick, "id" | "title" | "status">;
    }>(CREATE_MUTATION, { input, status }, { createBlockpick: mock });
    return data.createBlockpick;
  },

  async update(
    id: string,
    input: Omit<BlockpickInput, "status">,
  ): Promise<Pick<Blockpick, "id" | "title" | "status" | "updatedAt">> {
    const mock = {
      id,
      title: input.title,
      status: "DRAFT" as const,
      updatedAt: new Date().toISOString(),
    };
    const data = await safeGql<{
      updateBlockpick: Pick<Blockpick, "id" | "title" | "status" | "updatedAt">;
    }>(UPDATE_MUTATION, { id, input }, { updateBlockpick: mock });
    return data.updateBlockpick;
  },

  async publish(id: string): Promise<Pick<Blockpick, "id" | "status">> {
    const data = await safeGql<{
      publishBlockpick: Pick<Blockpick, "id" | "status">;
    }>(PUBLISH_MUTATION, { id }, { publishBlockpick: { id, status: "ACTIVE" } });
    return data.publishBlockpick;
  },

  async end(id: string): Promise<Pick<Blockpick, "id" | "status">> {
    const data = await safeGql<{
      endBlockpick: Pick<Blockpick, "id" | "status">;
    }>(END_MUTATION, { id }, { endBlockpick: { id, status: "ENDED" } });
    return data.endBlockpick;
  },

  async duplicate(
    id: string,
  ): Promise<Pick<Blockpick, "id" | "title" | "status" | "createdAt">> {
    const mock = {
      id: `dup-${Date.now()}`,
      title: "(복사본)",
      status: "DRAFT" as const,
      createdAt: new Date().toISOString(),
    };
    const data = await safeGql<{
      duplicateBlockpick: Pick<Blockpick, "id" | "title" | "status" | "createdAt">;
    }>(DUPLICATE_MUTATION, { id }, { duplicateBlockpick: mock });
    return data.duplicateBlockpick;
  },

  async preview(
    input: Omit<BlockpickInput, "status">,
  ): Promise<BlockpickPreviewResult> {
    const mock: BlockpickPreviewResult = {
      id: "preview",
      title: input.title,
      thumbnailUrl: input.thumbnailUrl,
      gridSize: input.gridSize,
      startAt: input.startAt,
      endAt: input.endAt,
      rewardName: input.rewardName,
      rewardType: input.rewardType,
      rewardQuantity: input.rewardQuantity,
    };
    const data = await safeGql<{ previewBlockpick: BlockpickPreviewResult }>(
      PREVIEW_MUTATION,
      { input },
      { previewBlockpick: mock },
    );
    return data.previewBlockpick;
  },
};
