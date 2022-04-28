import Decorator from "@saleor/storybook//Decorator";
import React from "react";

import DeleteShippingRateDialog, {
  DeleteShippingRateDialogProps
} from "./DeleteShippingRateDialog";

const props: DeleteShippingRateDialogProps = {
  confirmButtonState: "default",
  handleConfirm: () => undefined,
  name: "Shipping",
  onClose: () => undefined,
  open: true
};

export default {
  title: "Shipping / DeleteShippingRateDialog",
  decorators: [Decorator]
};

export const Default = () => <DeleteShippingRateDialog {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <DeleteShippingRateDialog {...props} confirmButtonState="loading" />
);

Loading.story = {
  name: "loading"
};
