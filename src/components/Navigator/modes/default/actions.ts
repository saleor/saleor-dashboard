import { QuickSearchAction } from "../../types";

export function getActions(actions: QuickSearchAction[]): QuickSearchAction[] {
  return actions.filter(action => action.type === "action");
}
export function hasActions(actions: QuickSearchAction[]): boolean {
  return getActions(actions).length > 0;
}
