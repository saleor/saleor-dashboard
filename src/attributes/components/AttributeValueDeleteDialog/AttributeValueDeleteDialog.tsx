import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

interface AttributeValueDeleteDialogProps {
  attributeName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name: string;
  quantity?: number;
  useName?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const getDeleteDialogSubtitle = ({
  attributeName,
  isBulk,
  name,
  quantity,
  useName,
}: {
  attributeName: string;
  isBulk: boolean;
  name: string;
  quantity: number | undefined;
  useName: boolean | undefined;
}): ReactNode => {
  if (isBulk && useName) {
    return (
      <FormattedMessage
        data-test-id="delete-attribute-value-dialog-text"
        defaultMessage='Are you sure you want to delete {counter, plural, one {this value} other {{displayQuantity} values}}? If you delete them you won’t be able to assign them to any of the products with "{attributeName}" attribute.'
        id="BNK0E1"
        values={{
          attributeName,
          counter: quantity,
          displayQuantity: <strong>{quantity}</strong>,
        }}
      />
    );
  }

  if (isBulk) {
    return (
      <FormattedMessage
        data-test-id="delete-attribute-value-dialog-text"
        defaultMessage="Are you sure you want to delete {counter, plural, one {this value} other {{displayQuantity} values}}?"
        id="C3t3e7"
        values={{
          counter: quantity,
          displayQuantity: <strong>{quantity}</strong>,
        }}
      />
    );
  }

  if (useName) {
    return (
      <FormattedMessage
        data-test-id="delete-attribute-value-dialog-text"
        defaultMessage='Are you sure you want to delete "{name}" value? If you delete it you won’t be able to assign it to any of the products with "{attributeName}" attribute.'
        id="no3Ygn"
        values={{
          attributeName,
          name,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="JyQoES"
      defaultMessage='Are you sure you want to delete "{name}" value?'
      description="delete attribute value"
      values={{
        name,
      }}
    />
  );
};

export const AttributeValueDeleteDialog = ({
  attributeName,
  name,
  quantity,
  confirmButtonState,
  useName,
  onClose,
  onConfirm,
  open,
}: AttributeValueDeleteDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";
  const isBulk = quantity != null;

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
          subtitle={getDeleteDialogSubtitle({
            attributeName,
            isBulk,
            name,
            quantity,
            useName,
          })}
        >
          {isBulk ? (
            <FormattedMessage
              id="WyWh/E"
              defaultMessage="Delete attribute values"
              description="dialog title"
            />
          ) : (
            <FormattedMessage
              id="WWV8aZ"
              defaultMessage="Delete attribute value"
              description="dialog title"
            />
          )}
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting}
            onClick={onConfirm}
            transitionState={confirmButtonState}
            variant="error"
          >
            <FormattedMessage {...buttonMessages.delete} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AttributeValueDeleteDialog.displayName = "AttributeValueDeleteDialog";
