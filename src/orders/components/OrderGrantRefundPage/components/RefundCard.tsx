import { Card, CardContent } from "@material-ui/core";
import { useId } from "@reach/auto-id";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import PriceField from "@saleor/components/PriceField";
import Skeleton from "@saleor/components/Skeleton";
import { OrderDetailsGrantRefundFragment } from "@saleor/graphql";
import useLocale from "@saleor/hooks/useLocale";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, LayoutButton } from "@saleor/macaw-ui";
import { getMoneyFormatted } from "@saleor/utils/intl";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useGrantRefundContext } from "../context";
import { OrderGrantRefundFormData } from "../form";
import { grantRefundPageMessages } from "../messages";
import { useRefundCardStyles } from "../styles";

interface RefundCardProps {
  order: OrderDetailsGrantRefundFragment | null;
  loading: boolean;
  submitState: ConfirmButtonTransitionState;
}

export const RefundCard = ({
  order,
  loading,
  submitState,
}: RefundCardProps) => {
  const classes = useRefundCardStyles();
  const { state, dispatch, form, totalSelectedPrice } = useGrantRefundContext();
  const { locale } = useLocale();

  const id = useId();

  const currency = order?.total?.gross?.currency ?? "USD";

  if (loading || !order) {
    return (
      <Card>
        <CardTitle
          className={classes.refundCardHeader}
          title={<FormattedMessage {...grantRefundPageMessages.refundTitle} />}
        />
        <CardContent>
          <Skeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle
        className={classes.refundCardHeader}
        title={<FormattedMessage {...grantRefundPageMessages.refundTitle} />}
      />
      <CardContent>
        <p>
          <FormattedMessage {...grantRefundPageMessages.refundSubtitle} />
        </p>
        <div className={classes.shippingCostLine}>
          <Checkbox
            id={`checkbox-${id}`}
            value={state.refundShipping}
            onChange={() => dispatch({ type: "toggleRefundShipping" })}
          />
          <label htmlFor={`checkbox-${id}`}>
            <FormattedMessage
              {...grantRefundPageMessages.refundShipment}
              values={{
                currency,
                amount: getMoneyFormatted(locale, order?.shippingPrice?.gross),
              }}
            />
          </label>
        </div>

        <div className={classes.suggestedValue}>
          <span>
            <FormattedMessage
              {...grantRefundPageMessages.refundSelectedValue}
            />
          </span>
          <span className={classes.totalMoney}>
            {currency}&nbsp;
            {getMoneyFormatted(locale, {
              amount: totalSelectedPrice,
              currency,
            })}
          </span>
          <LayoutButton
            state="hover"
            className={classes.applyButton}
            onClick={() => form.set({ amount: totalSelectedPrice.toString() })}
          >
            <FormattedMessage {...buttonMessages.apply} />
          </LayoutButton>
        </div>
        <div>
          <PriceField
            onChange={form.change}
            name={"amount" as keyof OrderGrantRefundFormData}
            currencySymbol={currency}
            value={form.data.amount}
            inputProps={{ "data-test-id": "amountInput" }}
          />
        </div>
        <div className={classes.submitLine}>
          <span>
            <FormattedMessage
              {...grantRefundPageMessages.refundStepExplanation}
            />
          </span>
          <ConfirmButton
            transitionState={submitState}
            variant="primary"
            type="submit"
          >
            Grant refund
          </ConfirmButton>
        </div>
      </CardContent>
    </Card>
  );
};
