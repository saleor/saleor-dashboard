import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import CollectionListPage, {
  CollectionListPageProps,
} from "../../../collections/components/CollectionListPage";
import {
  collectionListFilterOpts,
  collections,
} from "../../../collections/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  sortPageProps,
  tabPageProps,
} from "../../../fixtures";

const props: CollectionListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...filterPageProps,
  ...sortPageProps,
  settings: {
    ...pageListProps.default.settings,
    columns: ["name", "productCount", "availability"],
  },
  sort: {
    ...sortPageProps.sort,
    sort: CollectionListUrlSortField.name,
  },
  ...tabPageProps,
  collections,
  selectedChannelId: "123",
  filterOpts: collectionListFilterOpts,
  selectedCollectionIds: [],
  hasPresetsChanged: () => false,
  onAll: () => undefined,
  onCollectionsDelete: () => undefined,
  onFilterChange: () => undefined,
  loading: false,
  onSort: () => undefined,
  onTabUpdate: () => undefined,
  onSelectCollectionIds: () => undefined,
};

const meta: Meta<typeof CollectionListPage> = {
  title: "Collections / Collection list",
  decorators: [PaginatorContextDecorator],
  component: CollectionListPage,
};

export default meta;
type Story = StoryObj<typeof CollectionListPage>;

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
    collections: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    collections: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
