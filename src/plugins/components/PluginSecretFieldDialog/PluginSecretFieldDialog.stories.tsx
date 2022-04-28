import { ConfigurationTypeFieldEnum } from "@saleor/graphql";
import React from "react";

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

export default {
  title: "Views / Plugins / Edit secret field",
  decorators: [Decorator]
};

export const SecretKey = () => <PluginSecretFieldDialog {...props} />;

SecretKey.story = {
  name: "secret key"
};

export const Password = () => (
  <PluginSecretFieldDialog
    {...props}
    field={{
      ...props.field,
      type: ConfigurationTypeFieldEnum.PASSWORD
    }}
  />
);

Password.story = {
  name: "password"
};
