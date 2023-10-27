// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { formatMoneyAmount } from "@dashboard/components/Money";
import PriceField from "@dashboard/components/PriceField";
import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
} from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Input, Skeleton, Text } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getOrderTitleMessage } from "../OrderCardTitle/utils";
import { ProductsCard } from "./components/ProductCard";
import { ShippingIncluded } from "./components/ShippingInluded";
import { GrantRefundContext } from "./context";
import { OrderGrantRefundFormData, useGrantRefundForm } from "./form";
import { grantRefundPageMessages } from "./messages";
import {
  getGrantRefundReducerInitialState,
  grantRefundDefaultState,
  grantRefundReducer,
} from "./reducer";
import {
  calculateCanRefundShipping,
  calculateRefundAmountValue,
  calculateTotalPrice,
  getFulfilmentSubtitle,
  getGrantedRefundData,
  isSubmitButtonDisabled,
  prepareLineData,
} from "./utils";

export interface OrderGrantRefundPageProps {
  order: OrderDetailsGrantRefundFragment;
  loading: boolean;
  submitState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderGrantRefundFormData) => void;
  isEdit?: boolean;
  initialData?: OrderDetailsGrantedRefundFragment;
}

const OrderGrantRefundPage: React.FC<OrderGrantRefundPageProps> = ({
  order,
  loading,
  submitState,
  onSubmit,
  isEdit,
  initialData,
}) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const grantedRefund = useMemo(
    () => getGrantedRefundData(initialData),
    [initialData],
  );

  const unfulfilledLines = (order?.lines ?? []).filter(
    line => line.quantityToFulfill > 0,
  );
  const [state, dispatch] = React.useReducer(
    grantRefundReducer,
    grantRefundDefaultState,
  );

  useEffect(() => {
    if (grantedRefund) {
      dispatch({
        type: "setRefundShipping",
        refundShipping: grantedRefund.grantRefundForShipping,
      });
    }
  }, [grantedRefund]);

  useEffect(() => {
    if (order?.id) {
      dispatch({
        type: "initState",
        state: getGrantRefundReducerInitialState(order, initialData),
      });
    }
  }, [order, initialData]);

  const lines = prepareLineData(state.lines);
  const { set, change, data, submit, setIsDirty, isAmountDirty } =
    useGrantRefundForm({
      onSubmit,
      grantedRefund,
      lines,
      // Send grantRefundForShipping only when it's different than the one
      grantRefundForShipping:
        grantedRefund?.grantRefundForShipping === state.refundShipping
          ? undefined
          : state.refundShipping,
    });

  const canRefundShipping = calculateCanRefundShipping(
    grantedRefund,
    order?.grantedRefunds,
  );
  const totalSelectedPrice = calculateTotalPrice(state, order);
  const amountValue = calculateRefundAmountValue({
    linesOrShippingDirty:
      lines.length > 0 ||
      grantedRefund?.grantRefundForShipping !== state.refundShipping,
    isAmountInputDirty: isAmountDirty,
    refundAmount: Number(data.amount),
    totalCalulatedPrice: totalSelectedPrice,
  });

  const amount = parseFloat(data.amount);
  const isAmountEmptyOrNaN = Number.isNaN(amount) || amount <= 0;
  const submitDisabled = isSubmitButtonDisabled({
    linesLength: lines.length,
    canShippingBeRefunded: canRefundShipping,
    isAmountDirty,
    isAmountValueValid: !isAmountEmptyOrNaN,
    shippingRefundValueDifferent:
      state.refundShipping !== grantedRefund?.grantRefundForShipping,
  });

  const currency = order?.total?.gross?.currency ?? "";

  const handleSubmit = (e: React.FormEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    submit();
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={orderUrl(order?.id)}
        title={
          <FormattedMessage
            {...(isEdit
              ? grantRefundPageMessages.pageHeaderEdit
              : grantRefundPageMessages.pageHeader)}
          />
        }
      ></TopNav>
      <form onSubmit={handleSubmit} style={{ display: "contents" }}>
        <GrantRefundContext.Provider
          value={{
            dispatch: (...args) => {
              setIsDirty(true);
              dispatch(...args);
            },
            state,
            form: { change, data, set },
            totalSelectedPrice,
          }}
        >
          <DetailPageLayout.Content>
            <DashboardCard>
              <DashboardCard.Content
                display="flex"
                flexDirection="column"
                gap={5}
              >
                <Text variant="bodyEmp" as="p" marginTop={5}>
                  <FormattedMessage {...grantRefundPageMessages.pageSubtitle} />
                </Text>

                {loading ? (
                  <Skeleton />
                ) : (
                  <>
                    <ProductsCard
                      title={
                        <FormattedMessage
                          {...grantRefundPageMessages.unfulfilledProducts}
                        />
                      }
                      lines={unfulfilledLines}
                    />

                    {order?.fulfillments?.map?.(fulfillment => (
                      <ProductsCard
                        key={fulfillment.id}
                        title={intl.formatMessage(
                          getOrderTitleMessage(fulfillment.status),
                        )}
                        subtitle={
                          <Text
                            variant="body"
                            display="inline-block"
                            marginLeft={1}
                          >
                            {getFulfilmentSubtitle(order, fulfillment)}
                          </Text>
                        }
                        lines={fulfillment.lines.map(
                          ({ orderLine, id, quantity }) => {
                            return {
                              ...orderLine,
                              id,
                              quantity,
                            };
                          },
                        )}
                      />
                    ))}
                  </>
                )}

                <ShippingIncluded
                  currency={currency}
                  amount={order?.shippingPrice?.gross}
                  canRefundShipping={canRefundShipping}
                />

                <Box display="flex" gap={3}>
                  <Box __flexGrow={2} flexBasis="0">
                    <Input
                      label={intl.formatMessage(
                        grantRefundPageMessages.reasonForRefund,
                      )}
                      disabled={loading}
                      value={data.reason}
                      name={"reason" as keyof OrderGrantRefundFormData}
                      onChange={change}
                      type="text"
                      data-test-id="refundReasonInput"
                    />
                  </Box>
                  <PriceField
                    flexGrow="1"
                    flexBasis="0"
                    label={intl.formatMessage(
                      grantRefundPageMessages.refundAmountLabel,
                    )}
                    onChange={change}
                    disabled={loading}
                    name={"amount" as keyof OrderGrantRefundFormData}
                    currencySymbol={currency}
                    value={
                      isAmountDirty
                        ? amountValue.toString()
                        : formatMoneyAmount(
                            {
                              amount: amountValue,
                              currency,
                            },
                            locale,
                          )
                    }
                    data-test-id="amountInput"
                  />
                </Box>

                <ConfirmButton
                  marginLeft="auto"
                  disabled={submitDisabled || loading}
                  transitionState={submitState}
                  variant="primary"
                  type="submit"
                  data-test-id="grantRefundButton"
                >
                  {isEdit ? (
                    <FormattedMessage
                      {...grantRefundPageMessages.editRefundBtn}
                    />
                  ) : (
                    <FormattedMessage
                      {...grantRefundPageMessages.grantRefundBtn}
                    />
                  )}
                </ConfirmButton>
              </DashboardCard.Content>
            </DashboardCard>
          </DetailPageLayout.Content>
        </GrantRefundContext.Provider>
      </form>
    </DetailPageLayout>
  );
};

export default OrderGrantRefundPage;
