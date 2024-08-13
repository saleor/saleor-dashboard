import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { TransactionActionEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { mapActionToMessage } from "../OrderTransaction/utils";
import { messages } from "./messages";

export interface OrderTransactionActionDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  onClose: () => void;
  onSubmit: () => void;
  action: TransactionActionEnum;
}

export const OrderTransactionActionDialog: React.FC<OrderTransactionActionDialogProps> = ({
  confirmButtonState,
  open,
  onClose,
  onSubmit,
  action,
}) => {
  const intl = useIntl();
  const actionIntl = action ? intl.formatMessage(mapActionToMessage[action]) : "";
  const actionType = actionIntl.toLowerCase();

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Title>
          <FormattedMessage
            {...messages.title}
            values={{
              actionType,
            }}
          />
        </DashboardModal.Title>

        <Text>
          <FormattedMessage {...messages.warningText} values={{ actionType }} />
        </Text>

        <DashboardModal.Actions>
          <Button data-test-id="back" variant="secondary" onClick={onClose}>
            <FormattedMessage {...buttonMessages.back} />
          </Button>

          <ButtonWithLoader onClick={onSubmit} transitionState={confirmButtonState} type="submit">
            {actionIntl}
          </ButtonWithLoader>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
