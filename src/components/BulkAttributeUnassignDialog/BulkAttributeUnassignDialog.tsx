import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

interface BulkAttributeUnassignDialogProps {
  title: string;
  attributeQuantity: number;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  itemTypeName: string;
  description?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export const BulkAttributeUnassignDialog = ({
  title,
  attributeQuantity,
  confirmButtonState,
  open,
  itemTypeName,
  description,
  onClose,
  onConfirm,
}: BulkAttributeUnassignDialogProps) => {
  const intl = useIntl();
  const isSubmitting = confirmButtonState === "loading";

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <>
              <FormattedMessage
                {...messages.content}
                values={{
                  attributeQuantity: <strong>{attributeQuantity}</strong>,
                  counter: attributeQuantity,
                  itemTypeName: <strong>{itemTypeName}</strong>,
                }}
              />
              {description ? (
                <Text fontSize={3} color="default2" marginTop={4} display="block">
                  {description}
                </Text>
              ) : null}
            </>
          }
        >
          {title}
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
          >
            {intl.formatMessage(messages.confirmBtn)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

BulkAttributeUnassignDialog.displayName = "BulkAttributeUnassignDialog";
