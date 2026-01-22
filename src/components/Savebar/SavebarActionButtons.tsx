import { buttonMessages } from "@dashboard/intl";
import { Box, Button, ButtonProps, Tooltip } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ConfirmButton as ConfirmButtonComponent, ConfirmButtonProps } from "../ConfirmButton";

export const DeleteButton = ({
  children,
  ...props
}: { children?: React.ReactNode } & ButtonProps) => (
  <Button variant="error" size="large" data-test-id="button-bar-delete" {...props}>
    {children || <FormattedMessage {...buttonMessages.delete} />}
  </Button>
);

export const ConfirmButton = ({
  children,
  transitionState,
  tooltip,
  disabled,
  ...props
}: {
  children?: React.ReactNode;
  transitionState: ConfirmButtonProps["transitionState"];
  tooltip?: React.ReactNode;
} & ButtonProps) => {
  const button = (
    <ConfirmButtonComponent
      size="large"
      transitionState={transitionState}
      data-test-id="button-bar-confirm"
      disabled={disabled}
      {...props}
    >
      {children || <FormattedMessage {...buttonMessages.save} />}
    </ConfirmButtonComponent>
  );

  if (tooltip && disabled) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          {/* Box wrapper needed to capture hover events on disabled button */}
          <Box display="inline-block">{button}</Box>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">
          <Tooltip.Arrow />
          {tooltip}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return button;
};

export const CancelButton = ({
  children,
  ...props
}: { children?: React.ReactNode } & ButtonProps) => (
  <Button variant="secondary" size="large" data-test-id="button-bar-cancel" {...props}>
    {children || <FormattedMessage {...buttonMessages.back} />}
  </Button>
);
