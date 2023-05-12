import { buttonMessages, commonMessages } from "@dashboard/intl";
import { Button, ButtonProps } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

export type ConfirmButtonTransitionState =
  | "default"
  | "loading"
  | "success"
  | "error";

export type ConfirmButtonLabels = Record<"confirm" | "error", string>;

interface ConfirmButtonProps extends ButtonProps {
  labels: ConfirmButtonLabels;
  noTransition?: boolean;
  transitionState: ConfirmButtonTransitionState;
  onTransitionToDefault?: () => void;
}

export const ConfirmButton = ({
  labels,
  //   noTransition,
  transitionState,
  //   onTransitionToDefault,
  ...props
}: ConfirmButtonProps) => {
  const intl = useIntl();

  const defaultLabels: ConfirmButtonLabels = {
    confirm: intl.formatMessage(buttonMessages.save),
    error: intl.formatMessage(commonMessages.error),
  };
  const componentLabels: ConfirmButtonLabels = {
    ...defaultLabels,
    ...labels,
  };

  return <Button {...props}>{componentLabels[transitionState]}</Button>;
};
