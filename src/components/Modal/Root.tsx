import { Modal, ModalRootProps } from "@saleor/macaw-ui-next";
import React from "react";

export const Root = ({ children, ...rest }: ModalRootProps) => {
  return <Modal {...rest}>{children}</Modal>;
};
