import { TextField, Typography } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import { IMessage } from "@saleor/components/messages";
import useForm from "@saleor/hooks/useForm";
import useNotifier from "@saleor/hooks/useNotifier";
import commonErrorMessages from "@saleor/utils/errors/common";
import { DialogActionHandlersProps } from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import { useDialogFormReset } from "../GiftCardResendCodeDialog/utils";
import { getGiftCardErrorMessage } from "../messages";
import { useGiftCardUpdateMutation } from "../mutations";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { GiftCardUpdate } from "../types/GiftCardUpdate";
import { giftCardUpdateBalanceDialogMessages as messages } from "./messages";
import { useUpdateBalanceDialogStyles as useStyles } from "./styles";

export interface GiftCardBalanceUpdateFormData {
  balanceAmount: number;
}

const GiftCardUpdateBalanceDialog: React.FC<DialogActionHandlersProps> = ({
  open,
  closeDialog
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const notify = useNotifier();

  const {
    giftCard: {
      id,
      currentBalance: { amount, currency }
    }
  } = useGiftCardDetails();

  const initialFormData: GiftCardBalanceUpdateFormData = {
    balanceAmount: amount
  };

  const onCompleted = (data: GiftCardUpdate) => {
    const errors = data?.giftCardUpdate?.errors;

    const notifierData: IMessage = !!errors?.length
      ? {
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError)
        }
      : {
          status: "success",
          text: intl.formatMessage(messages.updatedSuccessAlertTitle)
        };

    notify(notifierData);

    if (!errors.length) {
      closeDialog();
    }
  };

  const [
    updateGiftCardBalance,
    updateGiftCardBalanceOpts
  ] = useGiftCardUpdateMutation({
    onCompleted
  });

  const handleSubmit = async ({
    balanceAmount
  }: GiftCardBalanceUpdateFormData) => {
    const result = await updateGiftCardBalance({
      variables: {
        id,
        input: {
          balanceAmount
        }
      }
    });

    return result?.data?.giftCardUpdate?.errors;
  };

  const { data, change, submit, reset, hasChanged } = useForm(
    initialFormData,
    handleSubmit
  );

  const { loading, status, data: submitData } = updateGiftCardBalanceOpts;

  const { formErrors } = useDialogFormReset({
    open,
    reset,
    keys: ["initialBalanceAmount"],
    apiErrors: submitData?.giftCardUpdate?.errors
  });

  return (
    <ActionDialog
      maxWidth="sm"
      open={open}
      onConfirm={submit}
      confirmButtonLabel={intl.formatMessage(messages.changeButtonLabel)}
      onClose={closeDialog}
      title={intl.formatMessage(messages.title)}
      confirmButtonState={status}
      disabled={loading || !hasChanged}
    >
      <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      <CardSpacer />
      <TextField
        inputProps={{ min: 0 }}
        error={!!formErrors?.initialBalanceAmount}
        helperText={getGiftCardErrorMessage(
          formErrors?.initialBalanceAmount,
          intl
        )}
        name="balanceAmount"
        value={data.balanceAmount}
        onChange={change}
        className={classes.inputContainer}
        label={intl.formatMessage(
          tableMessages.giftCardsTableColumnBalanceTitle
        )}
        type="float"
        InputProps={{
          startAdornment: (
            <div className={classes.currencyCodeContainer}>
              <Typography variant="caption">{currency}</Typography>
            </div>
          )
        }}
      />
    </ActionDialog>
  );
};

export default GiftCardUpdateBalanceDialog;
