// @ts-strict-ignore
import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchMode } from "../types";

export function getActions(actions: QuickSearchAction[]): QuickSearchAction[] {
  return actions.filter(action => action.type === "action");
}
export function hasActions(actions: QuickSearchAction[]): boolean {
  return getActions(actions).length > 0;
}

export function getViews(actions: QuickSearchAction[]): QuickSearchAction[] {
  return actions.filter(action => action.type === "view");
}
export function hasViews(actions: QuickSearchAction[]): boolean {
  return getViews(actions).length > 0;
}

export function getCustomers(actions: QuickSearchAction[]): QuickSearchAction[] {
  return actions.filter(action => action.type === "customer");
}
export function hasCustomers(actions: QuickSearchAction[]): boolean {
  return getCustomers(actions).length > 0;
}

export function getCatalog(actions: QuickSearchAction[]): QuickSearchAction[] {
  return actions.filter(action => action.type === "catalog");
}
export function hasCatalog(actions: QuickSearchAction[]): boolean {
  return getCatalog(actions).length > 0;
}

export function getMode(command: string): QuickSearchMode {
  switch (command) {
    case ">":
      return "commands";
    case "@":
      return "customers";
    case "#":
      return "orders";
    case "$":
      return "catalog";
    case "?":
      return "help";

    default:
      return null;
  }
}

export const getModePlaceholder = (mode: QuickSearchMode, intl: IntlShape) => {
  return mode === "orders"
    ? intl.formatMessage({
        id: "8B8E+3",
        defaultMessage: "Order Number",
        description: "navigator placeholder",
      })
    : mode === "commands"
      ? intl.formatMessage({
          id: "NqxvFh",
          defaultMessage: "Type Command",
          description: "navigator placeholder",
        })
      : mode === "catalog"
        ? intl.formatMessage({
            id: "AOI4LW",
            defaultMessage: "Search in Catalog",
            description: "navigator placeholder",
          })
        : mode === "customers"
          ? intl.formatMessage({
              id: "TpPx7V",
              defaultMessage: "Search Customer",
              description: "navigator placeholder",
            })
          : mode === "default"
            ? intl.formatMessage(
                {
                  id: "BooQvo",
                  defaultMessage: "Type {key} to see available actions",
                  description: "navigator placeholder",
                },
                {
                  key: "'?'",
                },
              )
            : null;
};

export const getModeSymbol = (mode: QuickSearchMode) => {
  return mode === "orders"
    ? "#"
    : mode === "customers"
      ? "@"
      : mode === "catalog"
        ? "$"
        : mode === "help"
          ? "?"
          : ">";
};
