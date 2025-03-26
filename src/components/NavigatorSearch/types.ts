import { ReactNode } from "react";

export type QuickSearchActionType = "action" | "catalog" | "customer" | "view";

export interface QuickSearchAction {
  caption?: string;
  extraInfo?: string;
  label: string | ReactNode;
  searchValue: string;
  price?: number;
  symbol?: string;
  thumbnail?: {
    alt: string;
    url: string;
  };
  type: QuickSearchActionType;
  onClick: () => boolean;
}

export interface QuickSearchActionInput extends QuickSearchAction {
  text: string;
}

export type QuickSearchMode = "default" | "catalog" | "commands" | "customers" | "help" | "orders";
