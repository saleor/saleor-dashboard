export type QuickSearchActionType = "action" | "view";

export interface QuickSearchAction {
  label: string;
  score: number;
  type: QuickSearchActionType;
  url: string;
}

export type QuickSearchMode = "default" | "orders" | "customers";
