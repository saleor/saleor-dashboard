// @ts-strict-ignore
import {
  filterPageProps,
  filterPresetsProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { pageList } from "@dashboard/pages/fixtures";
import { PageListUrlSortField } from "@dashboard/pages/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import PageListPage, { PageListPageProps } from "./PageListPage";

const props: PageListPageProps = {
  ...filterPageProps,
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPresetsProps,
  settings: {
    ...pageListProps.default.settings,
    columns: ["title", "slug", "visible"],
  },
  pages: pageList,
  sort: {
    ...sortPageProps.sort,
    sort: PageListUrlSortField.title,
  },
  filterOpts: {
    pageType: {
      active: false,
      value: [],
      choices: [],
      displayValues: [],
    },
  },
  selectedPageIds: [],
  loading: false,
  hasPresetsChanged: () => false,
  onSelectPageIds: () => undefined,
  onPagesDelete: () => undefined,
  onPagesPublish: () => undefined,
  onPagesUnpublish: () => undefined,
  onPageCreate: () => undefined,
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
