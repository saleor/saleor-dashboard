import ActionDialogComponent from "@saleor/components/ActionDialog";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";
import { ComponentWithMockContext } from "../customers/ComponentWithMockContext";

const ActionDialog = props => (
  <ComponentWithMockContext>
    <ActionDialogComponent {...props} />
  </ComponentWithMockContext>
);

storiesOf("Generics / ActionDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ActionDialog
      title="Example title"
      open={true}
      onClose={undefined}
      onConfirm={undefined}
      confirmButtonState="default"
    >
      Example content
    </ActionDialog>
  ));
