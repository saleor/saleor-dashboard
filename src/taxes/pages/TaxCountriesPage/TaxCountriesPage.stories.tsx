import Decorator from "@saleor/storybook/Decorator";
import { taxCountryConfigurations } from "@saleor/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import TaxCountriesPage from "./TaxCountriesPage";

const props = {
  countryTaxesData: taxCountryConfigurations,
  selectedCountryId: taxCountryConfigurations[0].country.code,
  handleTabChange: () => undefined,
};

storiesOf("Views / Taxes / Countries view", module)
  .addDecorator(Decorator)
  .add("loading", () => (
    <TaxCountriesPage {...props} countryTaxesData={undefined} />
  ))
  .add("default", () => <TaxCountriesPage {...props} />);
// .add("add country", () => <TaxCountriesPage {...props} />); // TODO: add country modal
