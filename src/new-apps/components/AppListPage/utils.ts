import { AppListPageSections } from "./types";

export const resolveSectionsAvailability = ({
  installedApps,
  installableMarketplaceApps,
  comingSoonMarketplaceApps,
}: AppListPageSections) => ({
  installed: !installedApps || !!installedApps.length,
  all: !installableMarketplaceApps || !!installableMarketplaceApps.length,
  comingSoon: !comingSoonMarketplaceApps || !!comingSoonMarketplaceApps.length,
});
