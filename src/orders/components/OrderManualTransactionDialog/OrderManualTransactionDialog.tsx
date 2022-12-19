import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import PriceField from "@saleor/components/PriceField";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { DialogProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { manualTransactionMessages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    form: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  }),
  { name: "OrderManualTransactionDialog" },
);

interface CreateTransactionVariables {
  amount: number;
  description: string;
}

interface OrderManualTransactionDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  onCreateTransaction: (vars: CreateTransactionVariables) => void;
  currency: string;
}

export const OrderManualTransactionDialog: React.FC<OrderManualTransactionDialogProps> = ({
  currency,
  onClose,
  confirmButtonState,
  onCreateTransaction,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const [amount, setAmount] = React.useState<number | undefined>();
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (confirmButtonState === "success") {
      // reset state after submit
      setAmount(undefined);
      setDescription("");
    }
  }, [confirmButtonState]);

  const handleChangeDescription: React.ChangeEventHandler<HTMLInputElement> = e => {
    setDescription(e.target.value);
  };

  const handleChangeAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = parseFloat(e.target.value);
    if (!Number.isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(undefined);
    }
  };

  const handleSubmit = () => {
    onCreateTransaction({
      amount,
      description,
    });
  };

  return (
    <Dialog onClose={onClose} {...props} fullWidth maxWidth="xs">
      <DialogTitle>
        <FormattedMessage {...manualTransactionMessages.dialogTitle} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage {...manualTransactionMessages.dialogDescription} />
        </DialogContentText>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label={intl.formatMessage(commonMessages.description)}
            fullWidth
            disabled={confirmButtonState === "loading"}
            onChange={handleChangeDescription}
            value={description}
          />
          <PriceField
            label={intl.formatMessage(
              manualTransactionMessages.transactionAmount,
            )}
            currencySymbol={currency}
            disabled={confirmButtonState === "loading"}
            onChange={handleChangeAmount}
            value={amount?.toString() ?? ""}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          onClick={handleSubmit}
        >
          <FormattedMessage {...manualTransactionMessages.submitButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
