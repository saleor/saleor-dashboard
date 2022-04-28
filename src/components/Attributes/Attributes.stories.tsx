import Attributes, { AttributesProps } from "@saleor/components/Attributes";
import { fetchMoreProps } from "@saleor/fixtures";
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
  fetchMoreAttributeValues: fetchMoreProps,
  onAttributeSelectBlur: () => undefined
};

export default {
  title: "Attributes / Attributes",
  decorators: [Decorator]
};

export const Default = () => <Attributes {...props} />;

Default.story = {
  name: "default"
};

export const Selected = () => (
  <Attributes {...props} attributes={ATTRIBUTES_SELECTED} />
);

Selected.story = {
  name: "selected"
};

export const Disabled = () => <Attributes {...props} disabled={true} />;

Disabled.story = {
  name: "disabled"
};
