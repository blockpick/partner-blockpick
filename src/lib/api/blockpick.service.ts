import { gqlRequest } from "./client";
import type {
  Blockpick,
  BlockpickListItem,
  BlockpickFilter,
  BlockpickKpi,
} from "@/lib/types/blockpick";

interface PaginatedBlockpicks {
  items: BlockpickListItem[];
  total: number;
  page: number;
  pageSize: number;
}

const LIST_QUERY = `
  query PartnerBlockpicks($filter: BlockpickFilterInput) {
    partnerBlockpicks(filter: $filter) {
      items {
        id
        title
        status
        thumbnailUrl
        startAt
        endAt
        totalParticipants
        totalVisits
        createdAt
      }
      total
      page
      pageSize
    }
  }
`;

const DETAIL_QUERY = `
  query PartnerBlockpick($id: ID!) {
    partnerBlockpick(id: $id) {
      id
      partnerId
      title
      description
      status
      thumbnailUrl
      startAt
      endAt
      gridSize
      maxParticipants
      totalParticipants
      totalVisits
      createdAt
      updatedAt
    }
  }
`;

const KPI_QUERY = `
  query PartnerBlockpickKpi {
    partnerBlockpickKpi {
      totalVisits
      totalParticipants
      conversionRate
      referralCount
      adWatchCount
      activeBlockpickCount
    }
  }
`;

const CREATE_MUTATION = `
  mutation CreateBlockpick($input: CreateBlockpickInput!) {
    createBlockpick(input: $input) {
      id
      title
      status
    }
  }
`;

export const blockpickService = {
  async list(filter?: BlockpickFilter): Promise<PaginatedBlockpicks> {
    const data = await gqlRequest<{ partnerBlockpicks: PaginatedBlockpicks }>(
      LIST_QUERY,
      { filter },
    );
    return data.partnerBlockpicks;
  },

  async detail(id: string): Promise<Blockpick> {
    const data = await gqlRequest<{ partnerBlockpick: Blockpick }>(
      DETAIL_QUERY,
      { id },
    );
    return data.partnerBlockpick;
  },

  async kpi(): Promise<BlockpickKpi> {
    const data = await gqlRequest<{ partnerBlockpickKpi: BlockpickKpi }>(
      KPI_QUERY,
    );
    return data.partnerBlockpickKpi;
  },

  async create(input: Partial<Blockpick>): Promise<Pick<Blockpick, "id" | "title" | "status">> {
    const data = await gqlRequest<{
      createBlockpick: Pick<Blockpick, "id" | "title" | "status">;
    }>(CREATE_MUTATION, { input });
    return data.createBlockpick;
  },
};
