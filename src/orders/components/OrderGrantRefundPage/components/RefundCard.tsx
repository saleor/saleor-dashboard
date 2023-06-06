import CardTitle from "@dashboard/components/CardTitle";
import Checkbox from "@dashboard/components/Checkbox";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { formatMoneyAmount } from "@dashboard/components/Money";
import PriceField from "@dashboard/components/PriceField";
import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { buttonMessages } from "@dashboard/intl";
import { Card, CardContent, Typography } from "@material-ui/core";
import { useId } from "@reach/auto-id";
import { Button } from "@saleor/macaw-ui/next";
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
              data-test-id="refundShippingCheckbox"
            />
            <label htmlFor={`checkbox-${id}`}>
              {!currency ? (
                <Skeleton />
              ) : (
                <FormattedMessage
                  {...grantRefundPageMessages.refundShipment}
                  values={{
                    currency,
                    amount: formatMoneyAmount(
                      order?.shippingPrice?.gross,
                      locale,
                    ),
                  }}
                />
              )}
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
            {currency}{" "}
            {formatMoneyAmount(
              {
                amount: totalSelectedPrice ?? 0,
                currency,
              },
              locale,
            )}
          </span>
          <Button
            disabled={loading}
            variant="secondary"
            size="small"
            onClick={() => form.set({ amount: totalSelectedPrice.toString() })}
            data-test-id="applySelectedRefundButton"
          >
            <FormattedMessage {...buttonMessages.apply} />
          </Button>
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
            InputProps={{
              inputProps: {
                "data-test-id": "amountInput",
              },
            }}
          />
        </div>
        <div className={classes.submitLine}>
          <ConfirmButton
            disabled={submitDisabled || loading}
            transitionState={submitState}
            variant="primary"
            type="submit"
            data-test-id="grantRefundButton"
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
