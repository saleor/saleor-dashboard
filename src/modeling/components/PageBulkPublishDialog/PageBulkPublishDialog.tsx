import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormattedMessage } from "react-intl";

interface PageBulkPublishDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  count: number;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  variant: "publish" | "unpublish";
}

export const PageBulkPublishDialog = ({
  confirmButtonState,
  count,
  onClose,
  onConfirm,
  open,
  variant,
}: PageBulkPublishDialogProps) => {
  const isSubmitting = confirmButtonState === "loading";
  const isPublish = variant === "publish";

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
            isPublish ? (
              <FormattedMessage
                description="dialog content"
                id="8y4+0a"
                defaultMessage="{counter,plural,one{Are you sure you want to publish this model?} other{Are you sure you want to publish {displayQuantity} models?}}"
                values={{
                  counter: count,
                  displayQuantity: <strong>{count}</strong>,
                }}
              />
            ) : (
              <FormattedMessage
                description="dialog content"
                id="8LWaFr"
                defaultMessage="{counter,plural,one{Are you sure you want to unpublish this model?} other{Are you sure you want to unpublish {displayQuantity} models?}}"
                values={{
                  counter: count,
                  displayQuantity: <strong>{count}</strong>,
                }}
              />
            )
          }
        >
          {isPublish ? (
            <FormattedMessage
              description="dialog header"
              id="q/FMPM"
              defaultMessage="Publish models"
            />
          ) : (
            <FormattedMessage
              description="dialog header"
              id="kG44rx"
              defaultMessage="Unpublish models"
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
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

PageBulkPublishDialog.displayName = "PageBulkPublishDialog";
