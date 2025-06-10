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
  extensions.map(({ id, accessToken, permissions, url, label, mount, target, app }) => ({
    id,
    app,
    accessToken: accessToken || "",
    permissions: permissions.map(({ code }) => code),
    url,
    label,
    mount,
    open: (params: AppDetailsUrlMountQueryParams) =>
      openApp({
        id: app.id,
        appToken: accessToken || "",
        src: url,
        label,
        target,
        params,
      }),
  }));

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
