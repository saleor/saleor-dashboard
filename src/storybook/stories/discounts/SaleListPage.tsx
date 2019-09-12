import { storiesOf } from "@storybook/react";
import React from "react";

import SaleListPage, {
  SaleListPageProps
} from "../../../discounts/components/SaleListPage";
import { saleList } from "../../../discounts/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

const props: SaleListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...tabPageProps,
  defaultCurrency: "USD",
  sales: saleList
};

storiesOf("Views / Discounts / Sale list", module)
  .addDecorator(Decorator)
  .add("default", () => <SaleListPage {...props} />)
  .add("loading", () => <SaleListPage {...props} sales={undefined} />)
  .add("no data", () => <SaleListPage {...props} sales={[]} />);
