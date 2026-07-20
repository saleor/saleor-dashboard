import { useUser } from "@dashboard/auth/useUser";
import { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { useLocation } from "react-router";

import { appExtensionManifestOptionsSchema } from "../domain/app-extension-manifest-options";
import { type AppExtensionView } from "../domain/app-extension-manifest-views";
import { extensionMountPoints } from "../extensionMountPoints";
import { useExtensions } from "../hooks/useExtensions";
import { type ExtensionWithParams } from "../types";
import { filterSearchActions } from "./filterSearchActions";
import { resolveSearchActionContext } from "./resolveSearchActionContext";
import { type ContextualSearchAction } from "./types";
import { useNativeSearchActions } from "./useNativeSearchActions";

const messages = defineMessages({
  appActionsSection: {
    id: "yOcWZe",
    defaultMessage: "App actions",
    description: "command palette section grouping app-provided actions",
  },
});

const parseExtensionViews = (
  settings: ExtensionWithParams["settings"],
): AppExtensionView[] | undefined => {
  const result = appExtensionManifestOptionsSchema.safeParse(settings);

  return result.success ? (result.data.views ?? undefined) : undefined;
};

/**
 * Collects the command-palette actions available on the current page: native
 * dashboard actions plus installed apps' SEARCH_ACTION extensions, filtered by the
 * current view and the user's permissions. Returns the resolved context so callers
 * can invoke `action.onSelect(context)`.
 */
export const useSearchActions = () => {
  const intl = useIntl();
  const location = useLocation();
  const { user } = useUser();
  const nativeActions = useNativeSearchActions();
  const { SEARCH_ACTION } = useExtensions(extensionMountPoints.GLOBAL_SEARCH);

  const context = useMemo(() => resolveSearchActionContext(location.pathname), [location.pathname]);

  const actions = useMemo(() => {
    // Extension.open loses its params in the map's type; the runtime objects accept them.
    const extensions: ExtensionWithParams[] = SEARCH_ACTION;

    const extensionActions: ContextualSearchAction[] = extensions.map(extension => ({
      id: `extension-${extension.id}`,
      label: extension.label,
      section: intl.formatMessage(messages.appActionsSection),
      views: parseExtensionViews(extension.settings),
      permissions: extension.permissions,
      avatar: extension.app.brand?.logo.default,
      onSelect: context => extension.open(context.params),
    }));

    return filterSearchActions([...nativeActions, ...extensionActions], context, user);
  }, [SEARCH_ACTION, nativeActions, context, user, intl]);

  return { actions, context };
};
