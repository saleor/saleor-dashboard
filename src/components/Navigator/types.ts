export type QuickSearchActionType = "view";

export interface QuickSearchAction {
  label: string;
  score: number;
  type: QuickSearchActionType;
  url: string;
}
