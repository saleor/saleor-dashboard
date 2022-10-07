import { Card, CardContent, Typography } from "@material-ui/core";
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
import { FormattedMessage, useIntl } from "react-intl";

import { useGrantRefundContext } from "../context";
import { OrderGrantRefundFormData } from "../form";
import { grantRefundPageMessages } from "../messages";
import { useRefundCardStyles } from "../styles";

interface RefundCardProps {
  order: OrderDetailsGrantRefundFragment | null;
  loading: boolean;
  submitState: ConfirmButtonTransitionState;
  isEdit: boolean;
  submitDisabled: boolean;
}

export const RefundCard = ({
  order,
  loading,
  submitState,
  isEdit,
  submitDisabled,
}: RefundCardProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const classes = useRefundCardStyles();
  const id = useId();

  const { state, dispatch, form, totalSelectedPrice } = useGrantRefundContext();

  const currency = order?.total?.gross?.currency ?? "";

  return (
    <Card>
      <CardTitle
        className={classes.refundCardHeader}
        title={<FormattedMessage {...grantRefundPageMessages.refundTitle} />}
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="body2">
          <FormattedMessage {...grantRefundPageMessages.refundSubtitle} />
        </Typography>
        {order ? (
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
                  amount: getMoneyFormatted(
                    locale,
                    order?.shippingPrice?.gross,
                  ),
                }}
              />
            </label>
          </div>
        ) : (
          <div className={classes.shippingCostLineLoading}>
            <Skeleton />
          </div>
        )}

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
            state={!loading && "hover"}
            disabled={loading}
            className={classes.applyButton}
            onClick={() => form.set({ amount: totalSelectedPrice.toString() })}
          >
            <FormattedMessage {...buttonMessages.apply} />
          </LayoutButton>
        </div>
        <div>
          <PriceField
            label={intl.formatMessage(
              grantRefundPageMessages.refundAmountLabel,
            )}
            onChange={form.change}
            disabled={loading}
            name={"amount" as keyof OrderGrantRefundFormData}
            currencySymbol={currency}
            value={form.data.amount}
            inputProps={{ "data-test-id": "amountInput" }}
          />
        </div>
        <div className={classes.submitLine}>
          <ConfirmButton
            disabled={submitDisabled || loading}
            transitionState={submitState}
            variant="primary"
            type="submit"
          >
            {isEdit ? (
              <FormattedMessage {...grantRefundPageMessages.editRefundBtn} />
            ) : (
              <FormattedMessage {...grantRefundPageMessages.grantRefundBtn} />
            )}
          </ConfirmButton>
        </div>
      </CardContent>
    </Card>
  );
};
