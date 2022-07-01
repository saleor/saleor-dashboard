import { ShippingErrorCode } from "@saleor/graphql";
import { mapCountriesToCountriesCodes } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneCreatePage, {
  ShippingZoneCreatePageProps,
} from "../../../shipping/components/ShippingZoneCreatePage";
import Decorator from "../../Decorator";

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

storiesOf("Views / Shipping / Create shipping zone", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingZoneCreatePage {...props} />)
  .add("loading", () => <ShippingZoneCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
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
  ));
