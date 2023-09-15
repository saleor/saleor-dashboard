import { Box, Modal, PropsWithBox } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

type ContentProps = PropsWithBox<{
  children: ReactNode;
}>;

export const Content = ({ children, ...rest }: ContentProps) => {
  return (
    <Modal.Content>
      <Box
        backgroundColor="surfaceNeutralPlain"
        boxShadow="modal"
        borderRadius={4}
        position="fixed"
        __left="50%"
        __top="50%"
        __transform="translate(-50%, -50%)"
        borderStyle="solid"
        borderWidth={1}
        borderColor="neutralPlain"
        padding={6}
        display="grid"
        gap={6}
        {...rest}
      >
        {children}
      </Box>
    </Modal.Content>
  );
};
