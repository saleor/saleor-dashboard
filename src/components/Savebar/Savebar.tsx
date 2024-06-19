import { buttonMessages } from "@dashboard/intl";
import { Root as Portal } from "@radix-ui/react-portal";
import { Box, Button, ButtonProps } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { savebarHeight } from "../AppLayout/consts";
import { ConfirmButton as ConfirmButtonComponent, ConfirmButtonProps } from "../ConfirmButton";
import { useSavebarRef } from "./SavebarRefContext";

interface SavebarProps {
  children: React.ReactNode;
}

const SavebarComponent = ({ children }: SavebarProps) => {
  const { anchor } = useSavebarRef();

  if (!anchor.current) {
    return null;
  }

  return (
    <Portal container={anchor.current} asChild>
      <Box __height={savebarHeight} backgroundColor="default1">
        <Box display="flex" alignItems="center" gap={3} paddingX={6} height="100%">
          {children}
        </Box>
      </Box>
    </Portal>
  );
};

const Spacer = () => <Box __flex={1} />;

const DeleteButton = ({ children, ...props }: { children?: React.ReactNode } & ButtonProps) => (
  <Button variant="error" size="large" data-test-id="button-bar-delete" {...props}>
    {children || <FormattedMessage {...buttonMessages.delete} />}
  </Button>
);

const ConfirmButton = ({
  children,
  transitionState,
  ...props
}: {
  children?: React.ReactNode;
  transitionState?: ConfirmButtonProps["transitionState"];
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

const CancelButton = ({ children, ...props }: { children?: React.ReactNode } & ButtonProps) => (
  <Button variant="secondary" size="large" data-test-id="button-bar-cancel" {...props}>
    {children || <FormattedMessage {...buttonMessages.back} />}
  </Button>
);

export const Savebar = Object.assign(SavebarComponent, {
  Spacer,
  DeleteButton,
  ConfirmButton,
  CancelButton,
});
