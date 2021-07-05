import Attributes, { AttributesProps } from "@saleor/components/Attributes";
import { fetchMoreProps } from "@saleor/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../storybook/Decorator";
import { ATTRIBUTES, ATTRIBUTES_SELECTED } from "./fixtures";

const props: AttributesProps = {
  attributes: ATTRIBUTES,
  attributeValues: [],
  disabled: false,
  errors: [],
  loading: false,
  onChange: () => undefined,
  onFileChange: () => undefined,
  onMultiChange: () => undefined,
  onReferencesAddClick: () => undefined,
  onReferencesRemove: () => undefined,
  onReferencesReorder: () => undefined,
  fetchAttributeValues: () => undefined,
  fetchMoreAttributeValues: fetchMoreProps
};

storiesOf("Attributes / Attributes", module)
  .addDecorator(Decorator)
  .add("default", () => <Attributes {...props} />)
  .add("selected", () => (
    <Attributes {...props} attributes={ATTRIBUTES_SELECTED} />
  ))
  .add("disabled", () => <Attributes {...props} disabled={true} />);
