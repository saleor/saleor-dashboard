import { customerListUrl } from "@dashboard/customers/urls";
import { customerTypeListUrl } from "@dashboard/customerTypes/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { CustomersIcon } from "@dashboard/icons/Customers";
import { Box, List } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { SidebarIconSlot } from "../SidebarIconSlot";
import { createCustomerTypeMenuItems } from "./createCustomerTypeMenuItems";
import { ItemGroup } from "./ItemGroup";
import { createSettingsSubmenuItem } from "./settingsSubmenuItem";

interface CustomersSidebarMenuProps {
  customerTypes: Array<{ id: string; name: string }>;
  pinnedIds?: string[];
  selectedTypeIds?: string[];
}

const CustomersSidebarMenu = ({
  customerTypes,
  pinnedIds,
  selectedTypeIds,
}: CustomersSidebarMenuProps): React.ReactNode => {
  const children = [
    ...createCustomerTypeMenuItems({
      customerTypes,
      allLabel: "All",
      pinnedIds,
      selectedTypeIds,
    }),
    createSettingsSubmenuItem({
      id: "customer-types",
      label: "Customer Types",
      url: customerTypeListUrl(),
      permissions: [PermissionEnum.MANAGE_CUSTOMER_TYPES_AND_ATTRIBUTES],
    }),
  ];

  return (
    <Box __width={256} padding={3}>
      <List as="ol" display="grid" gap={1} data-test-id="menu-list">
        <ItemGroup
          menuItem={{
            id: "customers",
            label: "Customers",
            url: customerListUrl(),
            type: "itemGroup",
            defaultExpanded: true,
            icon: (
              <SidebarIconSlot>
                <CustomersIcon />
              </SidebarIconSlot>
            ),
            children,
          }}
        />
      </List>
    </Box>
  );
};

const fewTypes = [
  { id: "type-b2b", name: "B2B" },
  { id: "type-default", name: "Default" },
  { id: "type-vip", name: "VIP" },
];

const manyTypes = Array.from({ length: 12 }, (_, index) => ({
  id: `type-${index + 1}`,
  name: `Type ${String(index + 1).padStart(2, "0")}`,
}));

const meta: Meta<typeof CustomersSidebarMenu> = {
  title: "Sidebar/CustomersMenu",
  component: CustomersSidebarMenu,
  parameters: STORYBOOK_CHROMATIC_PARAMS,
};

export default meta;
type Story = StoryObj<typeof CustomersSidebarMenu>;

export const SingleType: Story = {
  args: {
    customerTypes: [{ id: "type-default", name: "Default" }],
  },
  parameters: {
    docs: {
      description: {
        story:
          "One type is the same list as All, so the type row is omitted. Customer Types stays for settings.",
      },
    },
  },
};

export const AFewTypes: Story = {
  args: {
    customerTypes: fewTypes,
  },
};

export const PinnedTypesFirst: Story = {
  args: {
    customerTypes: fewTypes,
    pinnedIds: ["type-vip"],
  },
};

export const TooManyTypes: Story = {
  args: {
    customerTypes: manyTypes,
  },
  parameters: {
    docs: {
      description: {
        story: "At most eight type shortcuts. The rest stay on the customer list tabs.",
      },
    },
  },
};

export const SelectedTypeBeyondTheCap: Story = {
  args: {
    customerTypes: manyTypes,
    selectedTypeIds: [manyTypes[manyTypes.length - 1]?.id ?? ""],
  },
};

export const NoTypes: Story = {
  args: {
    customerTypes: [],
  },
};
