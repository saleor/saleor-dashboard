import { hasAllPermissions } from "@dashboard/auth/misc";
import { type UserFragment } from "@dashboard/graphql";

import { type SearchActionContext } from "./resolveSearchActionContext";
import { type ContextualSearchAction } from "./types";

/**
 * Keeps only the actions visible for the current view and the current user's
 * permissions. An action with no `views` shows everywhere; an action with no
 * `permissions` is ungated.
 */
export const filterSearchActions = (
  actions: ContextualSearchAction[],
  context: SearchActionContext,
  user: UserFragment | null | undefined,
): ContextualSearchAction[] =>
  actions.filter(action => {
    const matchesView =
      !action.views || (context.view !== null && action.views.includes(context.view));

    if (!matchesView) {
      return false;
    }

    const hasRequiredPermissions =
      !action.permissions?.length || (!!user && hasAllPermissions(action.permissions, user));

    return hasRequiredPermissions;
  });
