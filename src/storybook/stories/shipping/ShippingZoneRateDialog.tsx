import { storiesOf } from "@storybook/react";
import React from "react";

import ShippingZoneRateDialog, {
  ShippingZoneRateDialogProps
} from "../../../shipping/components/ShippingZoneRateDialog";
import { shippingZone } from "../../../shipping/fixtures";
import {
  ShippingErrorCode,
  ShippingMethodTypeEnum
} from "../../../types/globalTypes";
import Decorator from "../../Decorator";

const props: ShippingZoneRateDialogProps = {
  action: "edit",
  confirmButtonState: "default",
  defaultCurrency: "USD",
  disabled: false,
  errors: [],
  onClose: () => undefined,
  onSubmit: () => undefined,
  open: true,
  rate: shippingZone.shippingMethods[0],
  variant: ShippingMethodTypeEnum.PRICE
};

storiesOf("Shipping / Rate details", module)
  .addDecorator(Decorator)
  .add("default", () => <ShippingZoneRateDialog {...props} />)
  .add("loading", () => (
    <ShippingZoneRateDialog {...props} disabled={true} rate={undefined} />
  ))
  .add("new", () => (
    <ShippingZoneRateDialog {...props} rate={undefined} action="create" />
  ))
  .add("weight", () => (
    <ShippingZoneRateDialog
      {...props}
      variant={ShippingMethodTypeEnum.WEIGHT}
    />
  ))
  .add("form errors", () => (
    <ShippingZoneRateDialog
      {...props}
      errors={[
        "minimumOrderPrice",
        "minimumOrderWeight",
        "maximumOrderPrice",
        "maximumOrderWeight",
        "price",
        "name"
      ].map(field => ({
        __typename: "ShippingError",
        code: ShippingErrorCode.INVALID,
        field
      }))}
    />
  ));
