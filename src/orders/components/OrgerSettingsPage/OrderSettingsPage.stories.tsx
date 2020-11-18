import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import OrderSettings, { OrderSettingsPageProps } from "./";

const props: OrderSettingsPageProps = {
  data: { autoConfirmOrders: false },
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Orders / Order settings", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderSettings {...props} />);
