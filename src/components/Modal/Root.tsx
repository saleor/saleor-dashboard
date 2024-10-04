import { ModalContextProvider } from "@dashboard/components/Modal/context";
import { Modal, ModalRootProps } from "@saleor/macaw-ui-next";
import React from "react";

type RootProps = ModalRootProps;

export const Root = ({ children, onChange, open, ...rest }: RootProps) => {
  return (
    <ModalContextProvider onChange={onChange} open={open}>
      <Modal onChange={onChange} {...rest}>
        {children}
      </Modal>
    </ModalContextProvider>
  );
};
