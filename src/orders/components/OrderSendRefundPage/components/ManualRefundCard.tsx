import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ConfirmButton from "@saleor/components/ConfirmButton";
import PriceField from "@saleor/components/PriceField";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { manualRefundMessages, refundPageMessages } from "../messages";
import { useManualRefundCardStyles } from "../styles";

export interface ManualRefundCardProps {
  onAddRefund: (amount: number, description: string) => void;
  currency: string;
  submitState: ConfirmButtonTransitionState;
  error: string | undefined;
}

export const ManualRefundCard: React.FC<ManualRefundCardProps> = ({
  onAddRefund,
  currency,
  submitState,
  error,
}) => {
  const classes = useManualRefundCardStyles();
  const intl = useIntl();

  const [amount, setAmount] = React.useState<number | undefined>();
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (submitState === "success") {
      // reset state after submit
      setAmount(undefined);
      setDescription("");
    }
  }, [submitState]);

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

  return (
    <Card>
      <CardTitle
        title={<FormattedMessage {...manualRefundMessages.refundManual} />}
      ></CardTitle>
      <CardContent>
        <Typography>
          <FormattedMessage {...manualRefundMessages.refundManualDescription} />
        </Typography>
      </CardContent>
      <div className={classes.wrapper}>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
            if (amount) {
              onAddRefund(amount, description);
            }
          }}
        >
          <TextField
            className={classes.descriptionInput}
            label={intl.formatMessage(commonMessages.description)}
            disabled={submitState === "loading"}
            onChange={handleChangeDescription}
            value={description}
          />
          <PriceField
            className={classes.priceInput}
            label={intl.formatMessage(refundPageMessages.refundAmount)}
            currencySymbol={currency}
            disabled={submitState === "loading"}
            onChange={handleChangeAmount}
            value={amount?.toString() ?? ""}
          />
          <ConfirmButton
            type="submit"
            transitionState={submitState}
            disabled={!amount}
            className={classes.submitButton}
          >
            <FormattedMessage {...manualRefundMessages.refund} />
          </ConfirmButton>
        </form>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </div>
    </Card>
  );
};
