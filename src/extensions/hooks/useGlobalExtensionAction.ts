import { hasAllPermissions } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { useMemo } from "react";

/**
 * Resolves a globally-mounted app action (SEARCH_ACTION) by its app-declared
 * `identifier`, so dashboard code can trigger it from its own UI instead of
 * waiting for the user to find it in the command palette.
 *
 * Behaves exactly like the palette: the returned `open` respects whatever target
 * the app declared (POPUP opens the dialog, NEW_TAB opens a tab, APP_PAGE
 * navigates). Callers needing a specific target check `targetName` themselves.
 *
 * Returns `undefined` when no such extension is installed or the user lacks the
 * permissions it declares - render nothing in that case.
 *
 * ponytail: matches on `identifier` alone, so the first match wins if two apps
 * declare the same one. Add app scoping if that collision ever shows up.
 */
export const useGlobalExtensionAction = (
  extensionIdentifier: string,
): ExtensionWithParams | undefined => {
  const { user } = useUser();
  const { SEARCH_ACTION } = useExtensions(extensionMountPoints.GLOBAL_SEARCH);

  return useMemo(() => {
    // Extension.open loses its params in the map's type; the runtime objects accept them.
    const extensions: ExtensionWithParams[] = SEARCH_ACTION;

    return extensions.find(
      extension =>
        extension.identifier === extensionIdentifier &&
        (!extension.permissions.length ||
          (!!user && hasAllPermissions(extension.permissions, user))),
    );
  }, [SEARCH_ACTION, extensionIdentifier, user]);
};
