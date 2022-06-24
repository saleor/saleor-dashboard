import AttributeListPage, {
  AttributeListPageProps,
} from "@saleor/attributes/components/AttributeListPage";
import { attributes } from "@saleor/attributes/fixtures";
import { AttributeListUrlSortField } from "@saleor/attributes/urls";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: AttributeListPageProps = {
  ...pageListProps.default,
  ...listActionsProps,
  ...tabPageProps,
  ...searchPageProps,
  ...filterPageProps,
  attributes,
  filterOpts: {
    filterableInStorefront: {
      active: false,
      value: false,
    },
    isVariantOnly: {
      active: false,
      value: false,
    },
    valueRequired: {
      active: false,
      value: false,
    },
    visibleInStorefront: {
      active: false,
      value: false,
    },
  },
  onSort: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: AttributeListUrlSortField.name,
  },
};

storiesOf("Views / Attributes / Attribute list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <AttributeListPage {...props} />)
  .add("loading", () => (
    <AttributeListPage {...props} attributes={undefined} disabled={true} />
  ))
  .add("no data", () => <AttributeListPage {...props} attributes={[]} />);
