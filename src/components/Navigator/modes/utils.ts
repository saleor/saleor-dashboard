import { QuickSearchAction } from "../types";

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
  actions: QuickSearchAction[]
): QuickSearchAction[] {
  return actions.filter(action => action.type === "customer");
}
export function hasCustomers(actions: QuickSearchAction[]): boolean {
  return getCustomers(actions).length > 0;
}
