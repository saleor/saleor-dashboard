import { customerTypes } from "@dashboard/customerTypes/fixtures";
import { CustomerTypeListUrlSortField } from "@dashboard/customerTypes/urls";
import { pageListProps, sortPageProps } from "@dashboard/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CustomerTypeList } from "./CustomerTypeList";

const meta: Meta<typeof CustomerTypeList> = {
  title: "Customer types/CustomerTypeList",
  component: CustomerTypeList,
  args: {
    ...pageListProps.default,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: CustomerTypeListUrlSortField.name },
    customerTypes,
  },
};

export default meta;
type Story = StoryObj<typeof CustomerTypeList>;

export const Default: Story = {};

/** No data yet — skeleton rows keep the column widths. */
export const Loading: Story = {
  args: { ...pageListProps.loading, customerTypes: undefined },
};

export const Empty: Story = {
  args: { customerTypes: [] },
};

export const WithSearch: Story = {
  args: {
    search: { placeholder: "Search customer types", onSearchChange: fn() },
  },
};
