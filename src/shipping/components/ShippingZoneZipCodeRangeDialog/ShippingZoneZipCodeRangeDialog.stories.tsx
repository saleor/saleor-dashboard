import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneZipCodeRangeDialog from "./ShippingZoneZipCodeRangeDialog";

storiesOf("Shipping / Add zip code range", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ShippingZoneZipCodeRangeDialog
      confirmButtonState="default"
      open={true}
      onClose={() => undefined}
      onSubmit={() => undefined}
    />
  ));
