import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import ShippingZonePostalCodeRangeDialog from "./ShippingZonePostalCodeRangeDialog";

export default {
  title: "Shipping / Add postal code range",
  decorators: [Decorator]
};

export const Default = () => (
  <ShippingZonePostalCodeRangeDialog
    confirmButtonState="default"
    open={true}
    onClose={() => undefined}
    onSubmit={() => undefined}
  />
);

Default.story = {
  name: "default"
};
