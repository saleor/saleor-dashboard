import { iconSize } from "@dashboard/components/icons";
import { type ExtensionMenuItem } from "@dashboard/extensions/getExtensionsItems";

import { type TopNavMenuItem } from "./Menu";

export const mapExtensionMenuItemsToTopNavItems = (items: ExtensionMenuItem[]): TopNavMenuItem[] =>
  items.map(item => ({
    label: item.label,
    onSelect: item.onSelect,
    testId: item.testId,
    icon: item.avatar ? (
      <img
        src={item.avatar}
        alt=""
        width={iconSize.small}
        height={iconSize.small}
        style={{ borderRadius: 4, display: "block" }}
      />
    ) : undefined,
  }));
