import { type TypeDeleteMessages } from "@dashboard/components/TypeDeleteWarningDialog";
import { type Ids } from "@dashboard/types";

export interface UseTypeDeleteData extends TypeDeleteMessages {
  isOpen: boolean;
  assignedItemsCount: number | undefined;
  viewAssignedItemsUrl: string | null;
  isLoading: boolean | undefined;
  typesToDelete: Ids;
}

export interface UseTypeDeleteProps<T> {
  params: T;
  selectedTypes?: Ids;
  singleId?: string;
}
