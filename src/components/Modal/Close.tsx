import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Button, Modal, PropsWithBox } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";

export const Close = ({ onClose, ...rest }: PropsWithBox<{ onClose: () => void }>) => {
  return (
    <Modal.Close {...rest}>
      <Button
        data-test-id="close-button"
        icon={<X size={iconSize.small} strokeWidth={iconStrokeWidth} />}
        size="small"
        variant="tertiary"
        onClick={onClose}
      />
    </Modal.Close>
  );
};
