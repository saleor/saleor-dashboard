import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface ChangeCustomerTypeDialogProps {
  open: boolean;
  typeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ChangeCustomerTypeDialog = ({
  open,
  typeName,
  onClose,
  onConfirm,
}: ChangeCustomerTypeDialogProps): JSX.Element => (
  <DashboardModal onChange={onClose} open={open}>
    {open ? (
      <DashboardModal.Content size="xs" data-test-id="change-customer-type-dialog">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage {...messages.changeDialogDescription} values={{ typeName }} />
          }
        >
          <FormattedMessage {...messages.changeDialogTitle} />
        </DashboardModal.Header>
        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton data-test-id="submit" onClick={onConfirm} transitionState="default">
            <FormattedMessage {...messages.changeDialogConfirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    ) : null}
  </DashboardModal>
);

ChangeCustomerTypeDialog.displayName = "ChangeCustomerTypeDialog";
