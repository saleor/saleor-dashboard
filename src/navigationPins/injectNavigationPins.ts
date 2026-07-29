import { type SidebarMenuItem } from "@dashboard/components/Sidebar/menu/types";
import { PermissionEnum } from "@dashboard/graphql";
import { pageListUrlWithPageType } from "@dashboard/modeling/urls";

import { FAVORITES_TARGET_ID } from "./constants";
import { type ResolvedNavigationPin } from "./types";

const toMenuItem = (pin: ResolvedNavigationPin): SidebarMenuItem => ({
  id: `navigation-pin-${pin.target}-${pin.id}`,
  label: pin.name,
  url: pageListUrlWithPageType({ id: pin.id }),
  // Without this a user who cannot open the model list would get a link that bounces them.
  permissions: [PermissionEnum.MANAGE_PAGES],
  type: "item",
});

interface InjectOptions {
  favoritesLabel: string;
  favoritesIcon: SidebarMenuItem["icon"];
}

/**
 * Adds pins to the menu structure *before* it is permission-filtered, so a pin whose host
 * section is hidden disappears along with it — that is the intended behaviour, not a bug.
 * Sections that normally render as a plain item are promoted to a group so children show up.
 */
export const injectNavigationPins = (
  menuItems: SidebarMenuItem[],
  pins: ResolvedNavigationPin[],
  { favoritesLabel, favoritesIcon }: InjectOptions,
): SidebarMenuItem[] => {
  if (pins.length === 0) {
    return menuItems;
  }

  const withSectionPins = menuItems.map(item => {
    const sectionPins = pins.filter(pin => pin.target === item.id);

    if (sectionPins.length === 0) {
      return item;
    }

    const children = item.children ?? [];
    // Settings sub-items ("Product types", "Model types") sit below a separator and must stay
    // last, so pins go above them rather than at the end of the list.
    const settingsIndex = children.findIndex(child => child.labelStyle === "settings");
    const insertAt = settingsIndex === -1 ? children.length : settingsIndex;

    return {
      ...item,
      type: "itemGroup" as const,
      children: [
        ...children.slice(0, insertAt),
        ...sectionPins.map(toMenuItem),
        ...children.slice(insertAt),
      ],
    };
  });

  const favoritePins = pins.filter(pin => pin.target === FAVORITES_TARGET_ID);

  if (favoritePins.length === 0) {
    return withSectionPins;
  }

  const favorites: SidebarMenuItem = {
    // Prefixed so active-matching compares the pageTypes filter instead of the bare path —
    // otherwise this header lights up on every model list page.
    id: `navigation-pin-${FAVORITES_TARGET_ID}-section`,
    label: favoritesLabel,
    icon: favoritesIcon,
    url: pageListUrlWithPageType({ id: favoritePins[0].id }),
    permissions: [PermissionEnum.MANAGE_PAGES],
    type: "itemGroup",
    // A favorites section that starts collapsed defeats the point of pinning.
    defaultExpanded: true,
    children: favoritePins.map(toMenuItem),
  };

  return [favorites, ...withSectionPins];
};
