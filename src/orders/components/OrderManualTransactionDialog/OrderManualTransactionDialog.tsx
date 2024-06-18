// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { commonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  OrderManualTransactionForm,
  OrderManualTransactionFormProps,
} from "../OrderManualTransactionForm";
import { manualTransactionMessages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    form: {
      display: "contents",
    },
    formWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  }),
  { name: "OrderManualTransactionDialog" },
);

type OrderManualTransactionDialogProps = {
  dialogProps: DialogProps;
} & OrderManualTransactionFormProps;

export const OrderManualTransactionDialog: React.FC<OrderManualTransactionDialogProps> = ({
  dialogProps,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const { onClose } = dialogProps;

  return (
    <OrderManualTransactionForm {...props}>
      <Dialog onClose={onClose} {...dialogProps} fullWidth maxWidth="xs">
        <DialogTitle>
          <Text size={5} fontWeight="bold">
            <FormattedMessage {...manualTransactionMessages.dialogTitle} />
          </Text>
        </DialogTitle>
        <OrderManualTransactionForm.Form className={classes.form}>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage {...manualTransactionMessages.dialogDescription} />
            </DialogContentText>
            <div className={classes.formWrapper}>
              <OrderManualTransactionForm.DescriptionField
                label={intl.formatMessage(commonMessages.description)}
                fullWidth
              />
              <OrderManualTransactionForm.PspReferenceField
                label={intl.formatMessage(commonMessages.pspReferenceOptional)}
                fullWidth
              />
              <OrderManualTransactionForm.PriceInputField
                label={intl.formatMessage(manualTransactionMessages.transactionAmount)}
              />
              <OrderManualTransactionForm.ErrorText />
            </div>
          </DialogContent>
          <DialogActions>
            <BackButton onClick={onClose} />

            <OrderManualTransactionForm.SubmitButton size="medium">
              <Text fontWeight="medium" color="buttonDefaultPrimary">
                <FormattedMessage {...manualTransactionMessages.submitButton} />
              </Text>
            </OrderManualTransactionForm.SubmitButton>
          </DialogActions>
        </OrderManualTransactionForm.Form>
      </Dialog>
    </OrderManualTransactionForm>
  );
};
