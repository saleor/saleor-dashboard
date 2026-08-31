import { pageListUrlWithPageType } from "@dashboard/modeling/urls";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { getPinTarget } from "../constants";
import { navigationPinMessages as messages } from "../messages";
import { getNavigationPinItemId } from "../pinListItem";
import { type NavigationPin } from "../types";
import { usePinnedModelTypeNames } from "./usePinnedModelTypeNames";

interface NavigationPinListItem {
  id: string;
  name: string;
  href?: string;
  description: string;
}

interface NavigationPinListItemsResult {
  items: NavigationPinListItem[];
  /** Live names have settled (or there is nothing to fetch). */
  hasResolved: boolean;
}

/**
 * Rows for the account-settings / org-pin management lists. Unlike the sidebar, deleted
 * types stay visible so the merchant can free the slot.
 */
export const useNavigationPinListItems = (
  pins: readonly NavigationPin[],
): NavigationPinListItemsResult => {
  const intl = useIntl();
  const { names, hasResolved } = usePinnedModelTypeNames(pins.map(pin => pin.id));

  const items = useMemo(
    () =>
      pins.map(pin => {
        const target = getPinTarget(pin.target);
        const section = target ? intl.formatMessage(target.label) : pin.target;
        const resolvedName = names[pin.id];
        const isMissing = hasResolved && !resolvedName;

        return {
          id: getNavigationPinItemId(pin),
          name: resolvedName ?? (isMissing ? intl.formatMessage(messages.missingTypeName) : ""),
          href: resolvedName ? pageListUrlWithPageType({ id: pin.id }) : undefined,
          description: isMissing
            ? intl.formatMessage(messages.missingTypeDescription, { section })
            : section,
        };
      }),
    [hasResolved, intl, names, pins],
  );

  return { items, hasResolved };
};
