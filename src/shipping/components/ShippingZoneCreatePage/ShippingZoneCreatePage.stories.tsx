// @ts-strict-ignore
import { ShippingErrorCode } from "@dashboard/graphql";
import { mapCountriesToCountriesCodes } from "@dashboard/utils/maps";
import React from "react";

import ShippingZoneCreatePage, {
  ShippingZoneCreatePageProps,
} from "./ShippingZoneCreatePage";

const countries = [
  {
    __typename: "CountryDisplay" as "CountryDisplay",
    code: "DE",
    country: "Germany",
  },
  {
    __typename: "CountryDisplay" as "CountryDisplay",
    code: "GB",
    country: "Great Britain",
  },
  {
    __typename: "CountryDisplay" as "CountryDisplay",
    code: "PL",
    country: "Poland",
  },
  {
    __typename: "CountryDisplay" as "CountryDisplay",
    code: "CZ",
    country: "Czech Republic",
  },
  {
    __typename: "CountryDisplay" as "CountryDisplay",
    code: "FR",
    country: "France",
  },
];

const props: ShippingZoneCreatePageProps = {
  countries,
  restWorldCountries: mapCountriesToCountriesCodes(countries),
  disabled: false,
  errors: [],
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

export default {
  title: "Shipping / Create shipping zone",
};

export const Default = () => <ShippingZoneCreatePage {...props} />;

export const Loading = () => (
  <ShippingZoneCreatePage {...props} disabled={true} />
);

export const FormErrors = () => (
  <ShippingZoneCreatePage
    {...props}
    errors={["name"].map(field => ({
      __typename: "ShippingError",
      channels: [],
      code: ShippingErrorCode.INVALID,
      field,
      message: "Name field invalid",
    }))}
  />
);
