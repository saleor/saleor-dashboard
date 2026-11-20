import { useCloudExtensionsAvailable } from "@dashboard/auth/hooks/useCloudExtensionsAvailable";
import { useUser } from "@dashboard/auth/useUser";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { settingsCatalogEntries } from "./catalog";
import { resolveSettingsCatalog } from "./resolve";
import { searchSettingsCatalog } from "./search";
import { type ResolvedSettingsCatalogEntry } from "./types";

const useResolvedSettingsCatalog = (): ResolvedSettingsCatalogEntry[] => {
  const intl = useIntl();
  const { user } = useUser();
  const cloudExtensionsAvailable = useCloudExtensionsAvailable();

  return useMemo(
    () => resolveSettingsCatalog(settingsCatalogEntries, intl, user, { cloudExtensionsAvailable }),
    [intl, user, cloudExtensionsAvailable],
  );
};

export const useSettingsCatalogSearch = (query: string): ResolvedSettingsCatalogEntry[] => {
  const catalog = useResolvedSettingsCatalog();

  return useMemo(() => searchSettingsCatalog(catalog, query), [catalog, query]);
};
