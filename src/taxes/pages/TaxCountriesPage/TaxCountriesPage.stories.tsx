import Decorator from "@saleor/storybook/Decorator";
import { taxCountryConfigurations } from "@saleor/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import TaxCountriesPage, { TaxCountriesPageProps } from "./TaxCountriesPage";

const props: TaxCountriesPageProps = {
  countryTaxesData: taxCountryConfigurations,
  selectedCountryId: taxCountryConfigurations[0].country.code,
  handleTabChange: () => undefined,
  openDialog: () => null,
  onSubmit: () => null,
  onDeleteConfiguration: () => null,
  savebarState: "default" as const,
  disabled: false,
};

storiesOf("Taxes / Countries view", module)
  .addDecorator(Decorator)
  .add("loading", () => (
    <TaxCountriesPage {...props} countryTaxesData={undefined} />
  ))
  .add("default", () => <TaxCountriesPage {...props} />);
