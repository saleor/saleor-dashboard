import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZonePostalCodeRangeDialog from "./ShippingZonePostalCodeRangeDialog";

storiesOf("Shipping / Add postal code range", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ShippingZonePostalCodeRangeDialog
      confirmButtonState="default"
      open={true}
      onClose={() => undefined}
      onSubmit={() => undefined}
    />
  ));
