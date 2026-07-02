import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Button, Modal, type PropsWithBox } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";

export const Close = (props: PropsWithBox<Record<string, never>>) => {
  return (
    <Modal.Close {...props}>
      <Button
        data-test-id="close-button"
        icon={<X size={iconSize.small} strokeWidth={iconStrokeWidth} />}
        size="small"
        type="button"
        variant="tertiary"
      />
    </Modal.Close>
  );
};
