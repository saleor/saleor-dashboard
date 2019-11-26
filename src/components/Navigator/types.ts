export type QuickSearchActionType = "action" | "catalog" | "customer" | "view";

export interface QuickSearchAction {
  caption?: string;
  extraInfo?: string;
  label: string;
  price?: number;
  symbol?: string;
  type: QuickSearchActionType;
  onClick: () => boolean;
}

export interface QuickSearchActionInput extends QuickSearchAction {
  score: number;
  text: string;
}

export type QuickSearchMode =
  | "default"
  | "catalog"
  | "commands"
  | "customers"
  | "help"
  | "orders";
