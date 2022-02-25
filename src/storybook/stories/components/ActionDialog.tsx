import ActionDialogComponent from "@saleor/components/ActionDialog";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";
import { MockedUserProvider } from "../customers/MockedUserProvider";

const ActionDialog = props => (
  <MockedUserProvider>
    <ActionDialogComponent {...props} />
  </MockedUserProvider>
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
