import { mapEdgesToItems } from "@dashboard/utils/maps";

export interface AssignedTypeItem {
  id: string;
  name: string;
}

export interface AssignedTypeList {
  hasMore: boolean;
  items: AssignedTypeItem[];
}

interface AssignedTypeConnection {
  edges?: Array<{ node: AssignedTypeItem }> | null;
  pageInfo?: {
    hasNextPage: boolean;
  } | null;
}

export const mapAssignedTypeConnection = (
  connection: AssignedTypeConnection | null | undefined,
): AssignedTypeList => ({
  items: connection?.edges ? (mapEdgesToItems({ edges: connection.edges }) ?? []) : [],
  hasMore: !!connection?.pageInfo?.hasNextPage,
});
