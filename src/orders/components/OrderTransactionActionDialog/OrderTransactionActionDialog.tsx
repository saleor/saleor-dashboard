import BackButton from "@dashboard/components/BackButton";
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { TransactionActionEnum } from "@dashboard/graphql";
import { FormattedMessage, useIntl } from "react-intl";

import { mapActionToMessage } from "../OrderTransaction/utils";
import { messages } from "./messages";

interface OrderTransactionActionDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onSubmit: () => void;
  action: TransactionActionEnum;
}

export const OrderTransactionActionDialog = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit,
  action,
}: OrderTransactionActionDialogProps) => {
  const intl = useIntl();
  const actionMessage = action ? mapActionToMessage[action] : null;
  const actionIntl = actionMessage ? intl.formatMessage(actionMessage) : "";
  const isVoidAction = action === TransactionActionEnum.CANCEL;

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage
              {...(isVoidAction ? messages.voidDescription : messages.warningText)}
              values={isVoidAction ? undefined : { actionType: actionIntl.toLowerCase() }}
            />
          }
        >
          <FormattedMessage
            {...(isVoidAction ? messages.voidTitle : messages.title)}
            values={isVoidAction ? undefined : { actionType: actionIntl.toLowerCase() }}
          />
        </DashboardModal.Header>

        <DashboardModal.Actions>
          <BackButton data-test-id="back" onClick={onClose} />
          <ButtonWithLoader
            onClick={onSubmit}
            transitionState={confirmButtonState}
            type="submit"
            variant={isVoidAction ? "error" : undefined}
          >
            {actionIntl}
          </ButtonWithLoader>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
