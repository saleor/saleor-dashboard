import { type SidebarMenuItem } from "@dashboard/components/Sidebar/menu/types";
import {
  type PreferenceKeyInput,
  type ResolvedPreferenceState,
} from "@dashboard/extensions/preferences/types";
import { type Extension } from "@dashboard/extensions/types";
import { type UserPermissionFragment } from "@dashboard/graphql";

import { filterHomeExtensions } from "./filterHomeExtensions";
import { homeWidgetUrl } from "./urls";

/**
 * Pinned fullscreen home extensions get their own sidebar row under Home, so they are
 * reachable without first landing on Home and picking a tab. Non-fullscreen widgets have
 * no route of their own (they all share the widgets tab), so they are never listed.
 */
export const getPinnedHomeWidgetMenuItems = (
  extensions: Extension[],
  userPermissions: UserPermissionFragment[],
  getState: (extension: PreferenceKeyInput) => ResolvedPreferenceState,
): SidebarMenuItem[] =>
  filterHomeExtensions(extensions, userPermissions)
    .fullscreen.filter(extension => getState(extension) === "pinned")
    .map(extension => ({
      // Not the `extension-` prefix: these are dashboard routes, and that prefix opts an
      // item out of active-URL matching.
      id: `home-widget-${extension.id}`,
      label: extension.label,
      url: homeWidgetUrl(extension.id),
      permissions: extension.permissions,
      type: "item",
    }));
