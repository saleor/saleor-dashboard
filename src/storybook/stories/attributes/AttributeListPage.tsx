import { storiesOf } from "@storybook/react";
import React from "react";

import AttributeListPage, {
  AttributeListPageProps
} from "@saleor/attributes/components/AttributeListPage";
import { attributes } from "@saleor/attributes/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps,
  sortPageProps,
  filterPageProps
} from "@saleor/fixtures";
import { AttributeListUrlSortField } from "@saleor/attributes/urls";
import Decorator from "../../Decorator";

const props: AttributeListPageProps = {
  ...pageListProps.default,
  ...listActionsProps,
  ...tabPageProps,
  ...searchPageProps,
  ...filterPageProps,
  attributes,
  filterOpts: {
    availableInGrid: {
      active: false,
      value: false
    },
    filterableInDashboard: {
      active: false,
      value: false
    },
    filterableInStorefront: {
      active: false,
      value: false
    },
    isVariantOnly: {
      active: false,
      value: false
    },
    valueRequired: {
      active: false,
      value: false
    },
    visibleInStorefront: {
      active: false,
      value: false
    }
  },
  onBack: () => undefined,
  onSort: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: AttributeListUrlSortField.name
  }
};

storiesOf("Views / Attributes / Attribute list", module)
  .addDecorator(Decorator)
  .add("default", () => <AttributeListPage {...props} />)
  .add("loading", () => (
    <AttributeListPage {...props} attributes={undefined} disabled={true} />
  ))
  .add("no data", () => <AttributeListPage {...props} attributes={[]} />);
