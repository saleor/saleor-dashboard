import { storiesOf } from "@storybook/react";
import React from "react";

import { pageListProps } from "../../../fixtures";
import CountryListPage, {
  CountryListPageProps,
} from "../../../taxes/components/CountryListPage";
import Decorator from "../../Decorator";
import { countries } from "./fixtures";

const props: CountryListPageProps = {
  ...pageListProps.default,
  onSubmit: () => undefined,
  onTaxFetch: () => undefined,
  saveButtonBarState: "default",
  shop: {
    __typename: "Shop",
    chargeTaxesOnShipping: false,
    countries,
    displayGrossPrices: true,
    includeTaxesInPrices: false,
  },
};

storiesOf("Views / Taxes / Country List", module)
  .addDecorator(Decorator)
  .add("default", () => <CountryListPage {...props} />)
  .add("loading", () => (
    <CountryListPage {...props} shop={undefined} disabled={true} />
  ));
