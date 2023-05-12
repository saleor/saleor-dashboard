import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import React from "react";

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
  sort: {
    ...sortPageProps.sort,
    sort: CollectionListUrlSortField.name,
  },
  ...tabPageProps,
  collections,
  selectedChannelId: "123",
  filterOpts: collectionListFilterOpts,
};

export default {
  title: "Collections / Collection list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <CollectionListPage {...props} />;

export const Loading = () => (
  <CollectionListPage {...props} collections={undefined} disabled={true} />
);

export const NoData = () => <CollectionListPage {...props} collections={[]} />;
