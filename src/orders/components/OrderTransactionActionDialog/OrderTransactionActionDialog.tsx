import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { TransactionActionEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { mapActionToMessage } from "../OrderTransaction/utils";
import { messages } from "./messages";

export interface OrderTransactionActionDialogProps extends DialogProps {
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage
          {...messages.title}
          values={{
            actionType,
          }}
        />
      </DialogTitle>
      <DialogContent>
        <FormattedMessage {...messages.warningText} values={{ actionType }} />
      </DialogContent>
      <DialogActions>
        <Button data-test-id="back" variant="secondary" color="text" onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          onClick={onSubmit}
          labels={{ confirm: actionIntl }}
          transitionState={confirmButtonState}
          type="submit"
        />
      </DialogActions>
    </Dialog>
  );
};
