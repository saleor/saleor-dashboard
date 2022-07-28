import { FetchMoreProps } from "@saleor/types";

export interface AssignItem {
  id: string;
  name: string;
}

export interface AssignmentListProps {
  items: AssignItem[];
  itemsChoices: AssignItem[];
  itemsName: string;
  fetchMoreItems: FetchMoreProps;
  inputName: string;
  dataTestId: string;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  searchItems: (searchPhrase: string) => void;
}
