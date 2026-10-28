import sideBarDefaultLogo from "@assets/images/sidebar-default-logo.png";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { HomeIcon } from "@dashboard/icons/Home";
import { OrdersIcon } from "@dashboard/icons/Orders";
import { ProductsIcon } from "@dashboard/icons/Products";
import { Box, Drawer, List, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import { MenuItem } from "./menu/Item";
import { type SidebarMenuItem } from "./menu/types";
import { SidebarAppBar } from "./SidebarAppBar";
import { SidebarDrawerContent, useDrawerRemount } from "./SidebarDrawer";
import { SidebarIconSlot } from "./SidebarIconSlot";

const menuItems: SidebarMenuItem[] = [
  {
    id: "home",
    label: "Home",
    url: "/home",
    type: "item",
    icon: (
      <SidebarIconSlot>
        <HomeIcon />
      </SidebarIconSlot>
    ),
  },
  {
    id: "products",
    label: "Catalog",
    url: "/products/",
    type: "itemGroup",
    icon: (
      <SidebarIconSlot>
        <ProductsIcon />
      </SidebarIconSlot>
    ),
    children: [
      { id: "products-list", label: "Products", url: "/products/", type: "item" },
      { id: "categories", label: "Categories", url: "/categories/", type: "item" },
      { id: "collections", label: "Collections", url: "/collections/", type: "item" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    url: "/orders/",
    type: "itemGroup",
    icon: (
      <SidebarIconSlot>
        <OrdersIcon />
      </SidebarIconSlot>
    ),
    children: [
      { id: "orders-list", label: "Orders", url: "/orders/", type: "item" },
      { id: "drafts", label: "Drafts", url: "/orders/drafts/", type: "item" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    url: "/customers/",
    type: "item",
    icon: (
      <SidebarIconSlot>
        <CustomersIcon />
      </SidebarIconSlot>
    ),
  },
];

interface PhoneNavigationPreviewProps {
  canSearch: boolean;
}

/** The phone app bar and drawer over a placeholder page; the drawer holds a static menu. */
const PhoneNavigationPreview = ({ canSearch }: PhoneNavigationPreviewProps) => {
  const drawer = useDrawerRemount();

  return (
    <MemoryRouter initialEntries={["/categories/"]}>
      <Drawer key={drawer.key}>
        <SidebarAppBar logo={sideBarDefaultLogo} canSearch={canSearch} />
        <SidebarDrawerContent onClose={drawer.close}>
          <Box padding={3}>
            <List as="ol" display="grid" gap={1}>
              {menuItems.map(menuItem => (
                <MenuItem key={menuItem.id} menuItem={menuItem} />
              ))}
            </List>
          </Box>
        </SidebarDrawerContent>
      </Drawer>
      <Box
        paddingX={3}
        paddingY={5}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
      >
        <Text size={6}>Categories</Text>
      </Box>
    </MemoryRouter>
  );
};

const meta: Meta<typeof PhoneNavigationPreview> = {
  title: "Sidebar/PhoneAppBar",
  component: PhoneNavigationPreview,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    canSearch: true,
  },
};

export default meta;
type Story = StoryObj<typeof PhoneNavigationPreview>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Open the menu, then swipe the drawer left (touch) or follow a link to see it slide away.",
      },
    },
  },
};

export const WithoutSearchPermission: Story = {
  args: {
    canSearch: false,
  },
};
