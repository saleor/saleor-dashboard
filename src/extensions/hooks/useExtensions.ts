import { type AppExtensionActiveParams } from "@dashboard/extensions/app-extension-popup-state";
import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import {
  ALL_APP_EXTENSION_MOUNTS,
  type AllAppExtensionMounts,
} from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { appExtensionManifestOptionsSchemaWithDefault } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { isSaleorOfficialAppUrl } from "@dashboard/extensions/isSaleorOfficialAppUrl";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { newTabActions } from "@dashboard/extensions/new-tab-actions";
import { type ExtensionListQuery, useExtensionListQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect, useRef, useState } from "react";

import { type Extension, type ExtensionWithParams } from "../types";
import { type AppDetailsUrlMountQueryParams } from "../urls";
import {
  getExtensionsSnapshotKey,
  readExtensionsSnapshot,
  writeExtensionsSnapshot,
} from "./extensionsSnapshotStorage";

const prepareExtensionsWithActions = ({
  extensions,
  openAppInContext,
  fromCache,
}: {
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>;
  openAppInContext: (appData: AppExtensionActiveParams) => void;
  fromCache: boolean;
}): ExtensionWithParams[] =>
  extensions
    .filter(({ id, url, label, mountName, app }) => {
      if (!isUrlAbsolute(url) && !app.appUrl) {
        console.warn(
          "Extension uses a relative URL but its app has no appUrl — dropping from list.",
          { appId: app.id, extensionId: id, label, mountName },
        );

        return false;
      }

      return true;
    })
    .map(({ id, accessToken, permissions, url, label, mountName, targetName, app, settings }) => {
      const isNewTab = targetName === "NEW_TAB";
      const isWidget = targetName === "WIDGET";
      const appUrl = app.appUrl;

      const settingsValidation = appExtensionManifestOptionsSchemaWithDefault.safeParse(settings);

      /**
       * Options are not required so fall back to safe GET
       */
      const newTabMethod = settingsValidation.data?.newTabTarget?.method ?? "GET";

      const resolvedUrl = isUrlAbsolute(url) ? url : `${appUrl ?? ""}${url}`;

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
        isSaleorOfficial: isSaleorOfficialAppUrl(resolvedUrl),
        fromCache,
        /**
         * Only available for NEW_TAB, POPUP, APP_PAGE
         * TODO: Change interface to *not* contain this method if type is WIDGET
         */
        open: (params: AppDetailsUrlMountQueryParams) => {
          if (fromCache) {
            // No real access token yet — do not POST/redirect with an empty token.
            return;
          }

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
    });

const buildExtensionsMap = <T extends AllAppExtensionMounts>(
  extensions: ExtensionWithParams[],
  mountList: readonly T[],
): Record<T, Extension[]> => {
  const extensionsMap: Record<AllAppExtensionMounts, Extension[]> = mountList.reduce(
    (acc, mount) => ({ ...acc, [mount]: [] }),
    {} as Record<AllAppExtensionMounts, Extension[]>,
  );

  return extensions.reduce(
    (acc, extension) => ({
      ...acc,
      [extension.mountName]: [...(acc[extension.mountName] || []), extension],
    }),
    extensionsMap,
  );
};

const useExtensionsCore = <T extends AllAppExtensionMounts>(
  mountList: readonly T[],
): { extensions: Record<T, Extension[]>; loading: boolean } => {
  const { activate } = useActiveAppExtension();

  const snapshotKey = getExtensionsSnapshotKey(mountList);
  // Read once, synchronously, so cached structure paints on the first frame.
  const snapshotRef = useRef<ReturnType<typeof readExtensionsSnapshot>>(null);

  const [snapshot] = useState(() => {
    snapshotRef.current = readExtensionsSnapshot(snapshotKey);

    return snapshotRef.current;
  });

  const { data, error } = useExtensionListQuery({
    fetchPolicy: "cache-and-network",
    variables: {
      filter: {
        // @ts-expect-error - type is fine, but generated type is mutable instead of readonly. We must fix codegen
        mountName: mountList,
      },
    },
  });

  const hasLiveData = Boolean(data);
  const liveNodes = mapEdgesToItems(data?.appExtensions ?? undefined) || [];
  const fromCache = !hasLiveData && Boolean(snapshot);
  const sourceNodes = hasLiveData ? liveNodes : (snapshot ?? []);
  const loading = !hasLiveData && !snapshot && !error;

  // Persist a fresh, token-free snapshot whenever live data arrives.
  useEffect(() => {
    if (hasLiveData) {
      writeExtensionsSnapshot(snapshotKey, liveNodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const extensions = prepareExtensionsWithActions({
    extensions: sourceNodes,
    openAppInContext: activate,
    fromCache,
  });

  return { extensions: buildExtensionsMap(extensions, mountList), loading };
};

export const useExtensions = <T extends AllAppExtensionMounts>(
  mountList: readonly T[],
): Record<T, Extension[]> => useExtensionsCore(mountList).extensions;

export const useExtensionsWithLoadingState = <T extends AllAppExtensionMounts>(
  mountList: readonly T[],
): { extensions: Record<T, Extension[]>; loading: boolean } => useExtensionsCore(mountList);
