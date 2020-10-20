import { ShippingErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneCreatePage, {
  ShippingZoneCreatePageProps
} from "../../../shipping/components/ShippingZoneCreatePage";
import Decorator from "../../Decorator";

const props: ShippingZoneCreatePageProps = {
  countries: [
    {
      __typename: "CountryDisplay",
      code: "DE",
      country: "Germany"
    },
    {
      __typename: "CountryDisplay",
      code: "GB",
      country: "Great Britain"
    },
    {
      __typename: "CountryDisplay",
      code: "PL",
      country: "Poland"
    },
    {
      __typename: "CountryDisplay",
      code: "CZ",
      country: "Czech Republic"
    },
    {
      __typename: "CountryDisplay",
      code: "FR",
      country: "France"
    }
  ],
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
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
        field
      }))}
    />
  ));
