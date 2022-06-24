import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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
import Decorator from "../../Decorator";

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

storiesOf("Views / Collections / Collection list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <CollectionListPage {...props} />)
  .add("loading", () => (
    <CollectionListPage {...props} collections={undefined} disabled={true} />
  ))
  .add("no data", () => <CollectionListPage {...props} collections={[]} />);
