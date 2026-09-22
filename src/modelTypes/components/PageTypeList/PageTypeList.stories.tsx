import { listActionsProps, pageListProps, sortPageProps } from "@dashboard/fixtures";
import { pageTypes } from "@dashboard/modelTypes/fixtures";
import { PageTypeListUrlSortField } from "@dashboard/modelTypes/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import PageTypeList from "./PageTypeList";

const meta: Meta<typeof PageTypeList> = {
  title: "Model types/PageTypeList",
  component: PageTypeList,
  args: {
    ...listActionsProps,
    ...pageListProps.default,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: PageTypeListUrlSortField.name },
    pageTypes,
  },
};

export default meta;
type Story = StoryObj<typeof PageTypeList>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selected: 2, isChecked: () => true },
};

export const Loading: Story = {
  args: { ...pageListProps.loading, pageTypes: undefined },
};

export const Empty: Story = {
  args: { pageTypes: [] },
};

export const WithSearch: Story = {
  args: { search: { placeholder: "Search model types", onSearchChange: fn() } },
};
