import { storiesOf } from "@storybook/react";
import React from "react";

import { formError } from "@saleor/storybook/misc";
import MenuCreateDialog, {
  MenuCreateDialogProps
} from "../../../navigation/components/MenuCreateDialog";
import Decorator from "../../Decorator";

const props: MenuCreateDialogProps = {
  confirmButtonState: "default",
  disabled: false,
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Navigation / Menu create", module)
  .addDecorator(Decorator)
  .add("default", () => <MenuCreateDialog {...props} />)
  .add("loading", () => (
    <MenuCreateDialog {...props} disabled={true} confirmButtonState="loading" />
  ))
  .add("form errors", () => (
    <MenuCreateDialog {...props} errors={["name"].map(formError)} />
  ));
