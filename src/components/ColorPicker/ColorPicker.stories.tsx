import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { ColorPicker, ColorPickerProps } from "./ColorPicker";

const props: ColorPickerProps = {
  data: {},
  setError: () => null,
  errors: {},
  clearErrors: () => null,
  onColorChange: () => null
};

export default {
  title: "Generics / ColorPicker",
  decorators: [Decorator, CentralPlacementDecorator]
};

export const Default = () => <ColorPicker {...props} />;

Default.story = {
  name: "default"
};
