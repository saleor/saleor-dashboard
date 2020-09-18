import { ProductTypeListUrlSortField } from "@saleor/productTypes/urls";
import {
  ProductTypeConfigurable,
  ProductTypeEnum
} from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
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
  ...sortPageProps,
  ...filterPageProps,
  filterOpts: {
    configurable: {
      active: false,
      value: ProductTypeConfigurable.CONFIGURABLE
    },
    type: {
      active: false,
      value: ProductTypeEnum.SHIPPABLE
    }
  },
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
