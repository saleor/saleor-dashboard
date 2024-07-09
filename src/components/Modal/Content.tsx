import { Box, Modal, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

type ContentProps = PropsWithBox<{
  children: ReactNode;
  disableAutofocus?: boolean;
}>;

export const Content = ({ children, disableAutofocus, ...rest }: ContentProps) => {
  return (
    <Modal.Content disableAutofocus={disableAutofocus}>
      <Box
        backgroundColor="default1"
        boxShadow="defaultModal"
        borderRadius={4}
        position="fixed"
        __left="50%"
        __top="50%"
        __transform="translate(-50%, -50%)"
        borderStyle="solid"
        borderWidth={1}
        borderColor="default1"
        padding={6}
        display="grid"
        gap={6}
        __maxHeight="calc(100vh - 100px)"
        overflowY="auto"
        {...rest}
      >
        {children}
      </Box>
    </Modal.Content>
  );
};
