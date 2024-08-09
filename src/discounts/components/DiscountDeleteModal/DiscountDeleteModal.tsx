import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface DiscountDeleteModalProps {
  open: boolean;
  confirmButtonTransitionState: ConfirmButtonTransitionState;
  onChange: () => void;
  onConfirm: () => void;
}

export const DiscountDeleteModal = ({
  onChange,
  onConfirm,
  confirmButtonTransitionState,
  open,
}: DiscountDeleteModalProps) => {
  return (
    <DashboardModal open={open} onChange={onChange}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Title>
          <FormattedMessage defaultMessage="Delete discount" id="ZrIt1W" />
        </DashboardModal.Title>

        <Text>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete this discount?"
            id="6FLezz"
          />
        </Text>

        <DashboardModal.Actions>
          <Button variant="secondary" onClick={onChange}>
            <FormattedMessage {...buttonMessages.cancel} />
          </Button>
          <ConfirmButton
            data-test-id="delete-confirmation-button"
            transitionState={confirmButtonTransitionState}
            onClick={onConfirm}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
