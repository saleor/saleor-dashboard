import { storiesOf } from "@storybook/react";
import React from "react";

import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps
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
