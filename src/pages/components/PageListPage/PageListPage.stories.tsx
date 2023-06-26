// @ts-strict-ignore
import {
  listActionsProps,
  pageListProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { pageList } from "@dashboard/pages/fixtures";
import { PageListUrlSortField } from "@dashboard/pages/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import PageListPage, { PageListPageProps } from "./PageListPage";

const props: PageListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...sortPageProps,
  pages: pageList,
  sort: {
    ...sortPageProps.sort,
    sort: PageListUrlSortField.title,
  },
  actionDialogOpts: {
    open: () => undefined,
    close: () => undefined,
  },
  params: {
    ids: [],
  },
};

const meta: Meta<typeof PageListPage> = {
  title: "Pages / Page list",
  decorators: [PaginatorContextDecorator],
  component: PageListPage,
};
export default meta;
type Story = StoryObj<typeof PageListPage>;

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
    pages: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    pages: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
