import { stringifyQs } from "@dashboard/utils/urls";

import { Dialog } from "../types";

const siteSettingsSection = "/site-settings";

export const siteSettingsPath = siteSettingsSection;
type SiteSettingsUrlDialog = "add-key";
export type SiteSettingsUrlQueryParams = Dialog<SiteSettingsUrlDialog>;
export const siteSettingsUrl = (params?: SiteSettingsUrlQueryParams) =>
  `${siteSettingsPath}?${stringifyQs(params)}`;
