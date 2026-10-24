import { SMTP_APP_IDENTIFIER } from "@dashboard/notificationsSettings/constants";

interface ExploreExtensionVisibility {
  type?: string;
  id?: string;
  installed?: boolean;
}

/**
 * Hide the legacy SMTP app from Explore until a shop has it installed.
 * An installed copy stays listed so existing setups can still be opened.
 */
export const isHiddenFromExplore = (extension: ExploreExtensionVisibility): boolean =>
  extension.id === SMTP_APP_IDENTIFIER && !extension.installed;
