import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import ConfirmButton from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { buttonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderCustomerChangeForm, {
  CustomerChangeActionEnum,
  OrderCustomerChangeData
} from "./form";
import messages from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerChangeDialogProps {
  open: boolean;
  onClose();
  onConfirm(data: OrderCustomerChangeData): void;
}

const OrderCustomerChangeDialog: React.FC<OrderCustomerChangeDialogProps> = props => {
  const { open, onClose, onConfirm } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Dialog onClose={onClose} open={open}>
      <OrderCustomerChangeForm onSubmit={onConfirm}>
        {({ change, data }) => (
          <>
            <DialogTitle>
              <FormattedMessage {...messages.title} />
            </DialogTitle>
            <DialogContent className={classes.overflow}>
              <Typography>
                <FormattedMessage {...messages.description} />
              </Typography>
              <FormSpacer />
              <RadioGroup
                className={classes.container}
                value={data.changeActionOption}
                name="changeActionOption"
                onChange={event => change(event)}
              >
                <FormControlLabel
                  value={CustomerChangeActionEnum.KEEP_ADDRESS}
                  control={<Radio color="primary" />}
                  label={intl.formatMessage(messages.keepAddress)}
                  className={classes.optionLabel}
                />
                <FormControlLabel
                  value={CustomerChangeActionEnum.CHANGE_ADDRESS}
                  control={<Radio color="primary" />}
                  label={intl.formatMessage(messages.changeAddress)}
                  className={classes.optionLabel}
                />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <ConfirmButton
                transitionState="default"
                color="primary"
                variant="contained"
                type="submit"
              >
                <FormattedMessage {...buttonMessages.continue} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </OrderCustomerChangeForm>
    </Dialog>
  );
};

OrderCustomerChangeDialog.displayName = "OrderCustomerChangeDialog";
export default OrderCustomerChangeDialog;
