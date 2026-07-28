import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

interface MembersErrorDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const MembersErrorDialog = ({ onClose, open }: MembersErrorDialogProps) => {
  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              id="H/o4Ex"
              defaultMessage="You are not able to modify this group members. Solve this problem to continue with request."
              description="dialog content"
            />
          }
        >
          <FormattedMessage
            id="lT5MYM"
            defaultMessage="Unassign users"
            description="dialog title"
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <Button variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.ok} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

MembersErrorDialog.displayName = "MembersErrorDialog";
