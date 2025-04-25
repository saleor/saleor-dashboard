import { Button, CloseIcon, Modal, PropsWithBox } from "@saleor/macaw-ui-next";
import React from "react";

export const Close = ({ onClose, ...rest }: PropsWithBox<{ onClose: () => void }>) => {
  return (
    <Modal.Close {...rest}>
      <Button
        data-test-id="close-button"
        icon={<CloseIcon />}
        size="small"
        variant="tertiary"
        onClick={onClose}
      />
    </Modal.Close>
  );
};
