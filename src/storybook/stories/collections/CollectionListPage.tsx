import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { storiesOf } from "@storybook/react";
import React from "react";

import CollectionListPage, {
  CollectionListPageProps
} from "../../../collections/components/CollectionListPage";
import { collections } from "../../../collections/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

const props: CollectionListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  channelsCount: 2,
  sort: {
    ...sortPageProps.sort,
    sort: CollectionListUrlSortField.name
  },
  ...tabPageProps,
  collections,
  selectedChannelId: "123"
};

storiesOf("Views / Collections / Collection list", module)
  .addDecorator(Decorator)
  .add("default", () => <CollectionListPage {...props} />)
  .add("loading", () => (
    <CollectionListPage {...props} collections={undefined} disabled={true} />
  ))
  .add("no data", () => <CollectionListPage {...props} collections={[]} />);
