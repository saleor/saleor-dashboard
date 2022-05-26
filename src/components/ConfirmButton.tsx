import { buttonMessages, commonMessages } from "@saleor/intl";
import {
  ConfirmButton as MacawConfirmButton,
  ConfirmButtonLabels,
  ConfirmButtonProps as MacawConfirmButtonProps,
} from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export interface ConfirmButtonProps
  extends Omit<MacawConfirmButtonProps, "labels"> {
  labels?: Partial<ConfirmButtonLabels>;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  labels = {},
  ...rest
}) => {
  const intl = useIntl();

  const defaultLabels: ConfirmButtonLabels = {
    confirm: intl.formatMessage(buttonMessages.save),
    error: intl.formatMessage(commonMessages.error),
  };
  const componentLabels: ConfirmButtonLabels = {
    ...defaultLabels,
    ...labels,
  };

  return <MacawConfirmButton labels={componentLabels} {...rest} />;
};
ConfirmButton.displayName = "ConfirmButton";
export default ConfirmButton;
