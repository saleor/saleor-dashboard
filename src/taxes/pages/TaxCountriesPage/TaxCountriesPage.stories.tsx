// @ts-strict-ignore
import { taxCountryConfigurations } from "@dashboard/taxes/fixtures";
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

export default {
  title: "Taxes / Countries view",
};

export const Loading = () => (
  <TaxCountriesPage {...props} countryTaxesData={undefined} />
);
