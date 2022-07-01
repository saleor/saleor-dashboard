import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { ColorPicker, ColorPickerProps } from "./ColorPicker";

const props: ColorPickerProps = {
  data: {},
  setError: () => null,
  errors: {},
  clearErrors: () => null,
  onColorChange: () => null,
};

storiesOf("Generics / ColorPicker", module)
  .addDecorator(Decorator)
  .addDecorator(CentralPlacementDecorator)
  .add("default", () => <ColorPicker {...props} />);
