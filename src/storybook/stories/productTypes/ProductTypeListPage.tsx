import { storiesOf } from "@storybook/react";
import React from "react";

import { ProductTypeListUrlSortField } from "@saleor/productTypes/urls";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps,
  sortPageProps
} from "../../../fixtures";
import ProductTypeListPage, {
  ProductTypeListPageProps
} from "../../../productTypes/components/ProductTypeListPage";
import { productTypes } from "../../../productTypes/fixtures";
import Decorator from "../../Decorator";

const props: ProductTypeListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  sort: {
    ...sortPageProps.sort,
    sort: ProductTypeListUrlSortField.name
  },
  ...tabPageProps,
  onBack: () => undefined,
  productTypes
};

storiesOf("Views / Product types / Product types list", module)
  .addDecorator(Decorator)
  .add("default", () => <ProductTypeListPage {...props} />)
  .add("loading", () => (
    <ProductTypeListPage {...props} disabled={true} productTypes={undefined} />
  ))
  .add("no data", () => <ProductTypeListPage {...props} productTypes={[]} />);
