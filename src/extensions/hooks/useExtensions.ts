import { AppExtensionActiveParams } from "@dashboard/extensions/app-extension-popup-state";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import {
  ALL_APP_EXTENSION_MOUNTS,
  AllAppExtensionMounts,
} from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { appExtensionManifestOptionsSchemaWithDefault } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { newTabActions } from "@dashboard/extensions/new-tab-actions";
import { ExtensionListQuery, useExtensionListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { Extension, ExtensionWithParams } from "../types";
import { AppDetailsUrlMountQueryParams } from "../urls";

const prepareExtensionsWithActions = ({
  extensions,
  openAppInContext,
}: {
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>;
  openAppInContext: (appData: AppExtensionActiveParams) => void;
}): ExtensionWithParams[] =>
  extensions.map(
    ({ id, accessToken, permissions, url, label, mountName, targetName, app, settings }) => {
      const isNewTab = targetName === "NEW_TAB";
      const isWidget = targetName === "WIDGET";
      const appUrl = app.appUrl;

      const settingsValidation = appExtensionManifestOptionsSchemaWithDefault.safeParse(settings);

      /**
       * Options are not required so fall back to safe GET
       */
      const newTabMethod = settingsValidation.data?.newTabTarget?.method ?? "GET";

      return {
        id,
        app,
        accessToken: accessToken || "",
        permissions: permissions.map(({ code }) => code),
        url,
        label,
        mountName: ALL_APP_EXTENSION_MOUNTS.parse(mountName),
        targetName: AppExtensionManifestTarget.parse(targetName),
        settings,
        /**
         * Only available for NEW_TAB, POPUP, APP_PAGE
         * TODO: Change interface to *not* contain this method if type is WIDGET
         */
        open: (params: AppDetailsUrlMountQueryParams) => {
          if (!settingsValidation.success) {
            console.error("Invalid extension configuration", settingsValidation.error);

            return;
          }

          if (isWidget) {
            console.error("Widget-type app should not execute 'open' method");

            return;
          }

          const isAbsolute = isUrlAbsolute(url);
          const absoluteUrl = isAbsolute ? url : `${appUrl}${url}`;

          if (!["http:", "https:"].includes(new URL(absoluteUrl).protocol)) {
            console.error("Invalid url");

            return;
          }

          if (isNewTab && newTabMethod === "GET") {
            const redirectUrl = new URL(absoluteUrl);

            Object.entries(params ?? {}).forEach(([key, value]) => {
              redirectUrl.searchParams.append(key, value);
            });

            return newTabActions.openGETinNewTab(redirectUrl.toString());
          }

          if (isNewTab && newTabMethod === "POST") {
            return newTabActions.openPOSTinNewTab({
              appParams: params,
              accessToken,
              appId: app.id,
              extensionUrl: absoluteUrl,
            });
          }

          openAppInContext({
            id: app.id,
            appToken: accessToken || "",
            src: url,
            label,
            targetName: AppExtensionManifestTarget.parse(targetName),
            params,
            formState: {},
          });
        },
      };
    },
  );

export const useExtensions = <T extends AllAppExtensionMounts>(
  mountList: readonly T[],
): Record<T, Extension[]> => {
  const { activate } = useActiveAppExtension();
  const { data } = useExtensionListQuery({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        // @ts-expect-error - type is fine, but generated type is mutable instead of readonly. We must fix codegen
        mountName: mountList,
      },
    },
  });
  const extensions = prepareExtensionsWithActions({
    extensions: mapEdgesToItems(data?.appExtensions ?? undefined) || [],
    openAppInContext: activate,
  });
  const extensionsMap: Record<AllAppExtensionMounts, Extension[]> = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<AllAppExtensionMounts, Extension[]>,
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mountName]: [...(prevExtensionsMap[extension.mountName] || []), extension],
    }),
    extensionsMap,
  );
};
