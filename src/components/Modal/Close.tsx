import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { buttonMessages } from "@dashboard/intl";
import { Button, Modal, type PropsWithBox } from "@saleor/macaw-ui-next";
import { X } from "lucide-react";
import { useIntl } from "react-intl";

export const Close = (props: PropsWithBox<Record<string, never>>) => {
  const intl = useIntl();
  const closeLabel = intl.formatMessage(buttonMessages.close);

  return (
    <Modal.Close {...props}>
      <Button
        data-test-id="close-button"
        icon={<X size={iconSize.small} strokeWidth={iconStrokeWidth} />}
        size="small"
        type="button"
        variant="tertiary"
        aria-label={closeLabel}
        title={closeLabel}
      />
    </Modal.Close>
  );
};
