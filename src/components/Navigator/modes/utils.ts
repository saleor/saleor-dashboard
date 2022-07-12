import {
  QuickSearchAction,
  QuickSearchActionInput,
  QuickSearchMode,
} from "../types";

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

export function getCustomers(
  actions: QuickSearchAction[],
): QuickSearchAction[] {
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

export function sortScores(
  a: QuickSearchActionInput,
  b: QuickSearchActionInput,
) {
  return a.score <= b.score ? 1 : -1;
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
