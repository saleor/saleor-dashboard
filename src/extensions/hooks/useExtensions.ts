import { isUrlAbsolute } from "@dashboard/apps/isUrlAbsolute";
import { newTabActions } from "@dashboard/extensions/new-tab-actions";
import {
  AppExtensionMountEnum,
  ExtensionListQuery,
  useExtensionListQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useExternalApp } from "../components/ExternalAppContext";
import { AppData } from "../components/ExternalAppContext/context";
import { Extension, ExtensionWithParams } from "../types";
import { AppDetailsUrlMountQueryParams } from "../urls";

const prepareExtensionsWithActions = ({
  extensions,
  openAppInContext,
}: {
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>;
  openAppInContext: (appData: AppData) => void;
}): ExtensionWithParams[] =>
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app, options }) => {
    const isNewTab = target === "NEW_TAB";
    const isWidget = target === "WIDGET";
    const appUrl = app.appUrl;

    /**
     * Options are not required so fall back to safe GET
     */
    const newTabMethod =
      (options?.__typename === "AppExtensionOptionsNewTab" && options?.newTabTarget?.method) ||
      "GET";

    return {
      id,
      app,
      accessToken: accessToken || "",
      permissions: permissions.map(({ code }) => code),
      url,
      label,
      mount,
      target,
      options,
      /**
       * Only available for NEW_TAB, POPUP, APP_PAGE
       * TODO: Change interface to *not* contain this method if type is WIDGET
       */
      open: (params: AppDetailsUrlMountQueryParams) => {
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
          target,
          params,
        });
      },
    };
  });

export const useExtensions = <T extends AppExtensionMountEnum>(
  mountList: T[],
): Record<T, Extension[]> => {
  const { openApp } = useExternalApp();
  const { data } = useExtensionListQuery({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount: mountList,
      },
    },
  });
  const extensions = prepareExtensionsWithActions({
    extensions: mapEdgesToItems(data?.appExtensions ?? undefined) || [],
    openAppInContext: openApp,
  });
  const extensionsMap = mountList.reduce(
    (extensionsMap, mount) => ({ ...extensionsMap, [mount]: [] }),
    {} as Record<AppExtensionMountEnum, Extension[]>,
  );

  return extensions.reduce(
    (prevExtensionsMap, extension) => ({
      ...prevExtensionsMap,
      [extension.mount]: [...(prevExtensionsMap[extension.mount] || []), extension],
    }),
    extensionsMap,
  );
};
