import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import {
  AppExtensionMountEnum,
  ExtensionListQuery,
  PermissionEnum,
  useExtensionListQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useExternalApp } from "../components/ExternalAppContext";
import { AppData } from "../components/ExternalAppContext/context";
import { Extension, ExtensionWithParams } from "../types";
import { AppDetailsUrlMountQueryParams } from "../urls";

const filterAndMapToTarget = (
  extensions: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>,
  openApp: (appData: AppData) => void,
): ExtensionWithParams[] =>
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app, options }) => {
    const isNewTab = target === "NEW_TAB";

    const openGETinNewTab = (extensionUrl: string) => {
      window.open(extensionUrl, "_blank");
    };

    const openPOSTinNewTab = (params: AppDetailsUrlMountQueryParams) => {
      const formParams = {
        ...params,
        accessToken: accessToken,
        appId: app.id,
        saleorApiUrl: process.env.API_URL,
      };

      const form = document.createElement("form");

      form.method = "POST";
      form.action = url;
      form.target = "_blank";
      form.style.display = "none";

      for (const [key, value] of Object.entries(formParams)) {
        if (value === undefined || value === null || typeof value !== "string") {
          continue;
        }

        const elInput = document.createElement("input");

        elInput.type = "hidden";
        elInput.name = key;
        elInput.value = value;
        form.appendChild(elInput);
      }

      document.body.append(form);

      form.submit();

      document.body.removeChild(form);
    };

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
      open: (params: AppDetailsUrlMountQueryParams) => {
        if (isNewTab && newTabMethod === "GET") {
          // todo apply search params
          return openGETinNewTab(url);
        }

        if (isNewTab && newTabMethod === "POST") {
          return openPOSTinNewTab(params);
        }

        openApp({
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
  const permissions = useUserPermissions();
  const extensionsPermissions = permissions?.find(perm => perm.code === PermissionEnum.MANAGE_APPS);
  const { data } = useExtensionListQuery({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        mount: mountList,
      },
    },
    skip: !extensionsPermissions,
  });
  const extensions = filterAndMapToTarget(
    mapEdgesToItems(data?.appExtensions ?? undefined) || [],
    openApp,
  );
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
