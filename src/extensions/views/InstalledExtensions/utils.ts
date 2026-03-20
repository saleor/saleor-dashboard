import { type InstalledExtension } from "@dashboard/extensions/types";
import { type PluginBaseFragment } from "@dashboard/graphql";

const HIDDEN_PLUGIN_IDS = new Set(["mirumee.webhooks"]);

export const filterOutHiddenPlugins = (plugin: PluginBaseFragment) =>
  !HIDDEN_PLUGIN_IDS.has(plugin.id);

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
