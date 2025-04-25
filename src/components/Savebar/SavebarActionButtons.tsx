import { buttonMessages } from "@dashboard/intl";
import { Button, ButtonProps } from "@saleor/macaw-ui-next";
import React from "react";
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
  ...props
}: {
  children?: React.ReactNode;
  transitionState: ConfirmButtonProps["transitionState"];
} & ButtonProps) => (
  <ConfirmButtonComponent
    size="large"
    transitionState={transitionState}
    data-test-id="button-bar-confirm"
    {...props}
  >
    {children || <FormattedMessage {...buttonMessages.save} />}
  </ConfirmButtonComponent>
);

export const CancelButton = ({
  children,
  ...props
}: { children?: React.ReactNode } & ButtonProps) => (
  <Button variant="secondary" size="large" data-test-id="button-bar-cancel" {...props}>
    {children || <FormattedMessage {...buttonMessages.back} />}
  </Button>
);
