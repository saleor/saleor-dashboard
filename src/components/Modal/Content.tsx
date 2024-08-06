import { Box, Modal, PropsWithBox } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

export type ContentSize = "sm" | "md" | "lg" | "xlg";

type ContentProps = PropsWithBox<{
  children: ReactNode;
  disableAutofocus?: boolean;
  size: ContentSize;
}>;

const sizes: Record<ContentSize, number> = {
  sm: 444,
  md: 600,
  lg: 1280,
  xlg: 1920,
};

export const Content = ({ children, disableAutofocus, size, ...rest }: ContentProps) => {
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
        __maxHeight="calc(100vh - 100px)"
        __width="calc(100% - 64px)"
        display="grid"
        gap={6}
        __maxWidth={sizes[size]}
        overflowX="hidden"
        overflowY="auto"
        {...rest}
      >
        {children}
      </Box>
    </Modal.Content>
  );
};
