import { storiesOf } from "@storybook/react";
import React from "react";

import { ConfigurationTypeFieldEnum } from "@saleor/types/globalTypes";
import Decorator from "../../../storybook/Decorator";
import PluginSecretFieldDialog, {
  PluginSecretFieldDialogProps
} from "./PluginSecretFieldDialog";

const props: PluginSecretFieldDialogProps = {
  confirmButtonState: "default",
  field: {
    __typename: "ConfigurationItem",
    helpText: "",
    label: "Generic Secret Field",
    name: "secret",
    type: ConfigurationTypeFieldEnum.SECRET,
    value: "value"
  },
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true
};

storiesOf("Views / Plugins / Edit secret field", module)
  .addDecorator(Decorator)
  .add("secret key", () => <PluginSecretFieldDialog {...props} />)
  .add("password", () => (
    <PluginSecretFieldDialog
      {...props}
      field={{
        ...props.field,
        type: ConfigurationTypeFieldEnum.PASSWORD
      }}
    />
  ));
