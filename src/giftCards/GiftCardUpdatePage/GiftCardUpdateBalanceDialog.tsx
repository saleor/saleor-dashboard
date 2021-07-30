import { TextField, Typography } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../GiftCardsList/messages";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";
import { GiftCardDetailsContext } from "./providers/GiftCardDetailsProvider";
import { GiftCardUpdateFormContext } from "./providers/GiftCardUpdateFormProvider";
import { useUpdateBalanceDialogStyles as useStyles } from "./styles";
import { GiftCardUpdatePageActionParamsEnum } from "./types";

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

  const {
    giftCard: {
      currentBalance: { currency }
    }
  } = useContext(GiftCardDetailsContext);
  const {
    submitBalance,
    change,
    data: { balanceAmount },
    opts: { loading, status }
  } = useContext(GiftCardUpdateFormContext);

  const isOpen = action === GiftCardUpdatePageActionParamsEnum.SET_BALANCE;

  return (
    <ActionDialog
      maxWidth="sm"
      open={isOpen}
      onConfirm={submitBalance}
      confirmButtonLabel={intl.formatMessage(messages.changeButtonLabel)}
      onClose={onClose}
      title={intl.formatMessage(messages.setBalanceButtonLabel)}
      confirmButtonState={status}
      disabled={loading}
    >
      <Typography>
        {intl.formatMessage(messages.setBalanceDialogSubtitle)}
      </Typography>
      <CardSpacer />
      <TextField
        name="balanceAmount"
        value={balanceAmount}
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
  );
};

export default GiftCardUpdateBalanceDialog;
