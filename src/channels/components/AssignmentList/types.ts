import { FetchMoreProps, ReorderAction } from "@saleor/types";

export interface AssignItem {
  id: string;
  name: string;
}

export interface AssignmentListProps {
  items: AssignItem[];
  itemsChoices: AssignItem[];
  itemsName: string;
  fetchMoreItems: FetchMoreProps;
  totalCount: number;
  inputName: string;
  dataTestId: string;
  loading: boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  reorderItem?: ReorderAction;
  searchItems: (searchPhrase: string) => void;
}
