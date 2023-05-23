import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { PageTypeListUrlSortField } from "@dashboard/pageTypes/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { pageTypes } from "../../fixtures";
import PageTypeListPage, { PageTypeListPageProps } from "./PageTypeListPage";

const props: PageTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: PageTypeListUrlSortField.name,
  },
  ...tabPageProps,
  pageTypes,
};

const meta: Meta<typeof PageTypeListPage> = {
  title: "Page types / Page types list",
  decorators: [PaginatorContextDecorator],
  component: PageTypeListPage,
};
export default meta;
type Story = StoryObj<typeof PageTypeListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    pageTypes: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    pageTypes: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
