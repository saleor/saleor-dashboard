import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import FormSpacer from "@saleor/components/FormSpacer";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CustomerChangeActionEnum } from "./form";
import messages from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerChangeDialogProps {
  open: boolean;
  onChoiceClick: (choice: CustomerChangeActionEnum) => void;
  onClose();
}

const OrderCustomerChangeDialog: React.FC<OrderCustomerChangeDialogProps> = props => {
  const { open, onClose, onChoiceClick } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent className={classes.overflow}>
        <Typography variant="subtitle1">
          <FormattedMessage {...messages.description} />
        </Typography>
        <FormSpacer />
        <div className={classes.buttonsContainer}>
          <Button
            onClick={() => onChoiceClick(CustomerChangeActionEnum.KEEP_ADDRESS)}
          >
            {intl.formatMessage(messages.keepAddress)}
          </Button>
          <HorizontalSpacer />
          <Button
            onClick={() =>
              onChoiceClick(CustomerChangeActionEnum.CHANGE_ADDRESS)
            }
            color="primary"
            variant="contained"
          >
            {intl.formatMessage(messages.changeAddress)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

OrderCustomerChangeDialog.displayName = "OrderCustomerChangeDialog";
export default OrderCustomerChangeDialog;
