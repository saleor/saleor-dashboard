import { TextField, Typography } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import Form from "@saleor/components/Form";
import { IMessage } from "@saleor/components/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import { getFormErrors } from "@saleor/utils/errors";
import commonErrorMessages from "@saleor/utils/errors/common";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import { useGiftCardUpdateMutation } from "../mutations";
import { GiftCardDetailsContext } from "../providers/GiftCardDetailsProvider";
import { GiftCardUpdatePageActionParamsEnum } from "../types";
import { GiftCardUpdate } from "../types/GiftCardUpdate";
import { giftCardUpdateBalanceDialogMessages as messages } from "./messages";
import { useUpdateBalanceDialogStyles as useStyles } from "./styles";
import { GiftCardBalanceUpdateFormData } from "./types";

interface GiftCardUpdateBalanceDialogProps {
  action: string;
  onClose: () => void;
}

const GiftCardUpdateBalanceDialog: React.FC<GiftCardUpdateBalanceDialogProps> = ({
  action,
  onClose
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const notify = useNotifier();

  const isOpen = action === GiftCardUpdatePageActionParamsEnum.SET_BALANCE;

  const {
    giftCard: {
      id,
      currentBalance: { amount, currency }
    }
  } = useContext(GiftCardDetailsContext);

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
      onClose();
    }
  };

  const [
    updateGiftCardBalance,
    updateGiftCardBalanceOpts
  ] = useGiftCardUpdateMutation({
    onCompleted
  });

  const handleSubmit = ({ balanceAmount }: GiftCardBalanceUpdateFormData) => {
    updateGiftCardBalance({
      variables: {
        id,
        input: {
          balanceAmount
        }
      }
    });
  };

  const { loading, status, data } = updateGiftCardBalanceOpts;

  const formErrors = getFormErrors(
    ["balanceAmount"],
    data?.giftCardUpdate?.errors
  );

  return (
    <Form initial={initialFormData} onSubmit={handleSubmit}>
      {({ data, change, submit, hasChanged }) => (
        <ActionDialog
          maxWidth="sm"
          open={isOpen}
          onConfirm={submit}
          confirmButtonLabel={intl.formatMessage(messages.changeButtonLabel)}
          onClose={onClose}
          title={intl.formatMessage(messages.title)}
          confirmButtonState={status}
          disabled={loading || !hasChanged}
        >
          <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
          <CardSpacer />
          <TextField
            error={!!formErrors?.balanceAmount}
            helperText={formErrors?.balanceAmount}
            name="balanceAmount"
            value={data.balanceAmount}
            onChange={change}
            className={classes.inputContainer}
            label={intl.formatMessage(
              tableMessages.giftCardsTableColumnBalanceTitle
            )}
            type="number"
            InputProps={{
              startAdornment: (
                <div className={classes.currencyCodeContainer}>
                  <Typography variant="caption">{currency}</Typography>
                </div>
              )
            }}
          />
        </ActionDialog>
      )}
    </Form>
  );
};

export default GiftCardUpdateBalanceDialog;
