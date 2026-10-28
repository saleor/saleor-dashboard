import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { navigationLucideIconProps } from "@dashboard/components/icons";
import { PermissionEnum } from "@dashboard/graphql";
import { ConfigurationIcon } from "@dashboard/icons/Configuration";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { GiftIcon } from "@dashboard/icons/GiftIcon";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { HomeIcon } from "@dashboard/icons/Home";
import { OrdersIcon } from "@dashboard/icons/Orders";
import { ProductsIcon } from "@dashboard/icons/Products";
import { TerminalIcon } from "@dashboard/icons/TerminalIcon";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { RippleAnimation } from "@dashboard/ripples/components/RippleAnimation";
import { SearchShortcut } from "@dashboard/search/SearchShortcut";
import { Avatar, Box, List, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { within } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import {
  DeprecationBannerContent,
  DeprecationBannerIcon,
} from "../DeprecationBanner/DeprecationBannerContent";
import headerStyles from "../MountingPoint.module.css";
import { type Shortcut } from "../shortcuts/useShortcuts";
import { ShortcutsItems } from "../ShotcutsItems";
import { SidebarCollapseButton, SidebarExpandButton } from "../SidebarCollapseToggle";
import { SidebarProvider } from "../SidebarContext";
import { SidebarIconSlot } from "../SidebarIconSlot";
import { MenuItem } from "./Item";
import { RailMenuItem } from "./RailMenuItem";
import { RailTooltipGroup } from "./RailTooltipGroup";
import { createSettingsSubmenuItem } from "./settingsSubmenuItem";
import { type SidebarMenuItem } from "./types";

const icon = (node: React.ReactNode): React.ReactNode => <SidebarIconSlot>{node}</SidebarIconSlot>;

const menuItems: SidebarMenuItem[] = [
  {
    id: "home",
    label: "Home",
    url: "/home",
    type: "item",
    icon: icon(<HomeIcon />),
    endAdornment: <RippleAnimation />,
  },
  {
    id: "search",
    label: (
      <Box display="flex" alignItems="center" gap={2}>
        <Text size={3} fontWeight="medium">
          Search
        </Text>
        <SearchShortcut />
      </Box>
    ),
    url: "/search",
    type: "item",
    icon: icon(<Search {...navigationLucideIconProps} />),
  },
  {
    id: "products",
    label: "Catalog",
    url: "/products/",
    type: "itemGroup",
    icon: icon(<ProductsIcon />),
    children: [
      { id: "products", label: "Products", url: "/products/", type: "item" },
      { id: "categories", label: "Categories", url: "/categories/", type: "item" },
      { id: "collections", label: "Collections", url: "/collections/", type: "item" },
      { id: "giftCards", label: "Gift Cards", url: "/gift-cards/", type: "item" },
      { id: "extensions", label: "App extensions", type: "divider", paddingY: 1.5 },
      { id: "extension-1", label: "Bulk editor", url: "/extensions/app/1", type: "item" },
      createSettingsSubmenuItem({
        id: "product-types",
        label: "Product Types",
        url: "/product-types/",
        permissions: [PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES],
      }),
    ],
  },
  {
    id: "orders",
    label: "Fulfillment",
    url: "/orders/",
    type: "itemGroup",
    icon: icon(<OrdersIcon />),
    children: [
      { id: "orders", label: "Orders", url: "/orders/", type: "item" },
      { id: "order-drafts", label: "Drafts", url: "/orders/drafts/", type: "item" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    url: "/customers/",
    type: "itemGroup",
    icon: icon(<CustomersIcon />),
    endAdornment: <RippleAnimation />,
    children: [
      { id: "customer-type-nav-all", label: "All", url: "/customers/", type: "item" },
      {
        id: "customer-type-nav-b2b",
        label: "B2B",
        url: "/customers/?customerTypes=b2b",
        type: "item",
      },
    ],
  },
  {
    id: "translations",
    label: "Translations",
    url: "/translations/",
    type: "itemGroup",
    icon: icon(<TranslationsIcon />),
    children: [
      { id: "extension-2", label: "AI translator", url: "/extensions/app/2", type: "item" },
    ],
  },
  {
    id: "configure",
    label: "Configuration",
    url: "/configuration/",
    type: "item",
    icon: icon(<ConfigurationIcon />),
  },
];

const shortcuts: Shortcut[] = [
  {
    id: "search",
    name: "Command menu",
    icon: <TerminalIcon />,
    shortcut: "⌘ + K",
    action: () => {},
  },
  {
    id: "playground",
    name: "Playground",
    icon: <GraphqlIcon />,
    shortcut: "⌘ + '",
    action: () => {},
  },
  { id: "recent-changes-ripples", name: "Recent changes", icon: <GiftIcon />, action: () => {} },
];

interface SidebarRailPreviewProps {
  collapsed: boolean;
  initialPath: string;
  /** Shows the deprecation banner under the header, as for an outdated Saleor version. */
  deprecationUpgradeDate?: Date;
}

const DeprecationPreview = ({
  collapsed,
  upgradeDate,
}: {
  collapsed: boolean;
  upgradeDate: Date;
}) =>
  collapsed ? (
    <DeprecationBannerIcon upgradeDate={upgradeDate} />
  ) : (
    <DeprecationBannerContent upgradeDate={upgradeDate} />
  );

/** The sidebar columns without data-bound header and footer, to compare both states. */
const SidebarRailPreview = ({
  collapsed,
  initialPath,
  deprecationUpgradeDate,
}: SidebarRailPreviewProps) => (
  <MemoryRouter initialEntries={[initialPath]}>
    <SidebarProvider>
      <Box
        __width={collapsed ? "60px" : "260px"}
        __height="100vh"
        backgroundColor="default2"
        borderRightWidth={1}
        borderRightStyle="solid"
        borderColor="default1"
        display="grid"
        __gridTemplateRows="auto 1fr"
      >
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? "center" : undefined}
            gap={3}
            className={
              collapsed
                ? headerStyles.header
                : `${headerStyles.header} ${headerStyles.expandedHeader}`
            }
          >
            {collapsed ? (
              <SidebarExpandButton logo={sideBarDefaultLogo} />
            ) : (
              <>
                <Avatar.Store src={sideBarDefaultLogo} scheme="accent1" size="small" />
                <Text size={3} fontWeight="bold" __flex="1">
                  Saleor Dashboard
                </Text>
                <SidebarCollapseButton />
              </>
            )}
          </Box>
          {deprecationUpgradeDate && (
            <DeprecationPreview collapsed={collapsed} upgradeDate={deprecationUpgradeDate} />
          )}
        </Box>
        <RailTooltipGroup>
          <Box padding={3} display="flex" flexDirection="column" justifyContent="space-between">
            <List as="ol" display="grid" gap={1}>
              {menuItems.map(menuItem =>
                collapsed ? (
                  <RailMenuItem key={menuItem.id} menuItem={menuItem} />
                ) : (
                  <MenuItem key={menuItem.id} menuItem={menuItem} />
                ),
              )}
            </List>
            <ShortcutsItems items={shortcuts} collapsed={collapsed} />
          </Box>
        </RailTooltipGroup>
      </Box>
    </SidebarProvider>
  </MemoryRouter>
);

const meta: Meta<typeof SidebarRailPreview> = {
  title: "Sidebar/CollapsedRail",
  component: SidebarRailPreview,
  parameters: STORYBOOK_CHROMATIC_PARAMS,
  args: {
    collapsed: true,
    initialPath: "/categories/",
  },
};

export default meta;
type Story = StoryObj<typeof SidebarRailPreview>;

export const Collapsed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Catalog is highlighted because Categories is open. Click a section to open its pages beside the rail.",
      },
    },
  },
};

export const GroupWithOwnPage: Story = {
  args: {
    initialPath: "/translations/",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Translations has its own page that no child links to, so the flyout heading becomes the link.",
      },
    },
  },
};

export const Expanded: Story = {
  args: {
    collapsed: false,
  },
};

export const ExpandedWithDeprecationBanner: Story = {
  args: {
    collapsed: false,
    deprecationUpgradeDate: new Date("2026-09-01"),
  },
  parameters: {
    docs: {
      description: {
        story: "Shown under the header while the connected Saleor version is deprecated.",
      },
    },
  },
};

export const CollapsedWithDeprecationBanner: Story = {
  args: {
    deprecationUpgradeDate: new Date("2026-09-01"),
  },
  // Focus opens the tooltip at once, so the full message is visible without hovering.
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    within(canvasElement).getByTestId("deprecation-banner").focus();
  },
  parameters: {
    docs: {
      description: {
        story: "In the rail the banner becomes a warning icon; its tooltip carries the message.",
      },
    },
  },
};
