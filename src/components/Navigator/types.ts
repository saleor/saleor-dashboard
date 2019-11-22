export type QuickSearchActionType = "action" | "view";

export interface QuickSearchAction {
  label: string;
  score: number;
  type: QuickSearchActionType;
  onClick: () => void;
}

export type QuickSearchMode = "default" | "commands" | "orders" | "customers";
