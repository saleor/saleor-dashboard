import { InstalledExtension } from "@dashboard/extensions/types";
import { PluginBaseFragment } from "@dashboard/graphql";

export const byActivePlugin = (plugin: PluginBaseFragment) => {
  return (
    plugin?.globalConfiguration?.active === true ||
    plugin?.channelConfigurations?.some(config => config.active)
  );
};

export const sortByName = (a: InstalledExtension, b: InstalledExtension) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }

  return 0;
};
