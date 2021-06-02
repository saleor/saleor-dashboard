import { buttonMessages, commonMessages } from "@saleor/intl";
import { Savebar, SavebarLabels, SavebarProps } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export interface SaveButtonBarProps extends Omit<SavebarProps, "labels"> {
  labels?: SavebarLabels;
}

export const SaveButtonBar: React.FC<SaveButtonBarProps> = ({
  labels = {},
  ...rest
}) => {
  const intl = useIntl();

  const defaultLabels: SavebarLabels = {
    cancel: intl.formatMessage(buttonMessages.back),
    confirm: intl.formatMessage(buttonMessages.save),
    delete: intl.formatMessage(buttonMessages.delete),
    error: intl.formatMessage(commonMessages.error)
  };
  const componentLabels: SavebarLabels = {
    ...defaultLabels,
    ...labels
  };

  return <Savebar labels={componentLabels} {...rest} />;
};
SaveButtonBar.displayName = "SaveButtonBar";
export default SaveButtonBar;
