export type QuickSearchActionType = "action" | "catalog" | "customer" | "view";

export interface QuickSearchAction {
  caption?: string;
  extraInfo?: string;
  label: string;
  price?: number;
  type: QuickSearchActionType;
  onClick: () => void;
}

export interface QuickSearchActionInput extends QuickSearchAction {
  score: number;
  text: string;
}

export type QuickSearchMode =
  | "default"
  | "catalog"
  | "commands"
  | "orders"
  | "customers";
