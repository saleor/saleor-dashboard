import { storiesOf } from "@storybook/react";
import React from "react";

import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { CollectionPublished } from "@saleor/types/globalTypes";
import CollectionListPage, {
  CollectionListPageProps
} from "../../../collections/components/CollectionListPage";
import { collections } from "../../../collections/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps,
  sortPageProps,
  filterPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

const props: CollectionListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    status: {
      active: false,
      value: CollectionPublished.PUBLISHED
    }
  },
  sort: {
    ...sortPageProps.sort,
    sort: CollectionListUrlSortField.name
  },
  ...tabPageProps,
  collections
};

storiesOf("Views / Collections / Collection list", module)
  .addDecorator(Decorator)
  .add("default", () => <CollectionListPage {...props} />)
  .add("loading", () => (
    <CollectionListPage {...props} collections={undefined} disabled={true} />
  ))
  .add("no data", () => <CollectionListPage {...props} collections={[]} />);
