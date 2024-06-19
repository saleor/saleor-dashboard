import { Box, Button, ButtonProps } from "@saleor/macaw-ui-next";
import React from "react";

import { savebarHeight } from "../AppLayout/consts";

interface SavebarProps {
  children: React.ReactNode;
}

const SavebarComponent = ({ children }: SavebarProps) => {
  return (
    <Box
      position="fixed"
      width="100%"
      bottom={0}
      left={0}
      zIndex="2"
      __height={savebarHeight}
      backgroundColor="default1"
      borderTopWidth={1}
      borderTopStyle="solid"
      borderColor="default1"
    >
      <Box display="flex" alignItems="center" gap={3} paddingX={6} height="100%">
        {children}
      </Box>
    </Box>
  );
};

const Spacer = () => <Box __flex={1} />;

const DeleteButton = ({ children, ...props }: { children: React.ReactNode } & ButtonProps) => (
  <Button variant="error" data-test-id="button-bar-delete" {...props}>
    {children}
  </Button>
);

const ConfirmButton = ({ children, ...props }: { children: React.ReactNode } & ButtonProps) => (
  <Button variant="primary" data-test-id="button-bar-confirm" {...props}>
    {children}
  </Button>
);

const CancelButton = ({ children, ...props }: { children: React.ReactNode } & ButtonProps) => (
  <Button variant="secondary" data-test-id="button-bar-cancel" {...props}>
    {children}
  </Button>
);

export const Savebar = Object.assign(SavebarComponent, {
  Spacer,
  DeleteButton,
  ConfirmButton,
  CancelButton,
});
