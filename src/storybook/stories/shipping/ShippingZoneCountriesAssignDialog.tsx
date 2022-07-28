import { mapCountriesToCountriesCodes } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneCountriesAssignDialog, {
  ShippingZoneCountriesAssignDialogProps,
} from "../../../shipping/components/ShippingZoneCountriesAssignDialog";
import Decorator from "../../Decorator";
import { countries } from "../taxes/fixtures";

const initialCountries = ["PL", "GB", "DE"];

const props: ShippingZoneCountriesAssignDialogProps = {
  confirmButtonState: "default",
  countries,
  restWorldCountries: mapCountriesToCountriesCodes(countries).filter(
    countryCode => !initialCountries.includes(countryCode),
  ),
  initial: initialCountries,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Shipping / Assign countries", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingZoneCountriesAssignDialog {...props} />)
  .add("all countries in shipping zones", () => (
    <ShippingZoneCountriesAssignDialog {...props} restWorldCountries={[]} />
  ));
