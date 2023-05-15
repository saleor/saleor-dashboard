import { countries } from "@dashboard/fixtures";
import { CountryFragment } from "@dashboard/graphql";
import { taxConfigurations } from "@dashboard/taxes/fixtures";
import React from "react";

import TaxChannelsPage from "./TaxChannelsPage";

export const castedCountries = countries.map(
  ({ code, name }): CountryFragment => ({
    code,
    country: name,
    __typename: "CountryDisplay",
  }),
);

const props = {
  taxConfigurations,
  selectedConfigurationId: taxConfigurations[0].id,
  handleTabChange: () => undefined,
  allCountries: castedCountries,
  isDialogOpen: false,
  openDialog: () => undefined,
  closeDialog: () => undefined,
  onSubmit: () => undefined,
  savebarState: "default" as const,
  disabled: false,
};

export default {
  title: "Taxes / Channels view",
  excludeStories: ["castedCountries"],
};

export const Loading = () => (
  <TaxChannelsPage {...props} taxConfigurations={undefined} />
);

export const AddCountry = () => (
  <TaxChannelsPage {...props} isDialogOpen={true} />
);
