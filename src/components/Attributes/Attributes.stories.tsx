import Attributes, { AttributesProps } from "@saleor/components/Attributes";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../storybook/Decorator";
import { ATTRIBUTES, ATTRIBUTES_SELECTED } from "./fixtures";

const props: AttributesProps = {
  attributes: ATTRIBUTES,
  disabled: false,
  errors: [],
  loading: false,
  onChange: () => undefined,
  onFileChange: () => undefined,
  onMultiChange: () => undefined
};

storiesOf("Attributes / Attributes", module)
  .addDecorator(Decorator)
  .add("default", () => <Attributes {...props} />)
  .add("selected", () => (
    <Attributes {...props} attributes={ATTRIBUTES_SELECTED} />
  ))
  .add("disabled", () => <Attributes {...props} disabled={true} />);
