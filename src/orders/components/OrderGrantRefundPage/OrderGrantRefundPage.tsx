// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import PriceField from "@dashboard/components/PriceField";
import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
} from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getOrderTitleMessage } from "../OrderCardTitle/utils";
import { ProductsCard } from "./components/ProductCard";
import { ShippingIncluded } from "./components/ShippingInluded";
import { GrantRefundContext } from "./context";
import { OrderGrantRefundFormData, useGrantRefundForm } from "./form";
import { grantRefundPageMessages } from "./messages";
import { grantRefundDefaultState, grantRefundReducer } from "./reducer";
import {
  calculateTotalPrice,
  getFulfilmentSubtitle,
  getGrantedRefundData,
  getLineAvailableQuantity,
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
  const grantedRefund = getGrantedRefundData(initialData);

  const unfulfilledLines = (order?.lines ?? [])
    .filter(line => line.quantityToFulfill > 0)
    .map(line => ({
      ...line,
      availableQuantity: getLineAvailableQuantity(
        line.id,
        line.quantity,
        order?.grantedRefunds,
        grantedRefund?.grantRefundId,
      ),
      selectedQuantity:
        initialData?.lines?.find(
          initLine => (initLine as any).orderLine.id === line.id,
        )?.quantity ?? 0,
    }));

  const [state, dispatch] = React.useReducer(
    grantRefundReducer,
    grantRefundDefaultState,
  );

  React.useEffect(() => {
    if (initialData) {
      dispatch({
        type: "setRefundShipping",
        refundShipping: grantedRefund.grantRefundForShipping,
      });
    }
  }, []);

  const lines = prepareLineData(state.lines);
  const { set, change, data, submit, setIsDirty } = useGrantRefundForm({
    onSubmit,
    grantedRefund,
    lines,
    grantRefundForShipping: state.refundShipping,
  });

  const amount = parseFloat(data.amount);
  const isAmount = Number.isNaN(amount) || amount <= 0;
  const hasSelectedLines = lines.length > 0;
  const submitDisabled = hasSelectedLines ? false : isAmount;

  const currency = order?.total?.gross?.currency ?? "";

  const totalSelectedPrice = calculateTotalPrice(state, order);

  const hasShipingRefunded = () => {
    if (grantedRefund?.grantRefundId) {
      return order?.grantedRefunds?.some(
        refund =>
          refund.shippingCostsIncluded &&
          refund.id !== grantedRefund.grantRefundId,
      );
    }

    return order?.grantedRefunds?.some(refund => refund.shippingCostsIncluded);
  };
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

                <ProductsCard
                  loading={loading}
                  title={
                    <FormattedMessage
                      {...grantRefundPageMessages.unfulfilledProducts}
                    />
                  }
                  lines={unfulfilledLines}
                />

                {order?.fulfillments?.map?.(fulfillment => (
                  <ProductsCard
                    loading={loading}
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
                          availableQuantity: getLineAvailableQuantity(
                            id,
                            quantity,
                            order?.grantedRefunds,
                          ),
                          selectedQuantity:
                            grantedRefund.lines.find(line => line.id === id)
                              ?.quantity ?? 0,
                        };
                      },
                    )}
                  />
                ))}

                <ShippingIncluded
                  currency={currency}
                  amount={order?.shippingPrice?.gross}
                  hasShipingRefunded={hasShipingRefunded()}
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
                    value={data.amount}
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
