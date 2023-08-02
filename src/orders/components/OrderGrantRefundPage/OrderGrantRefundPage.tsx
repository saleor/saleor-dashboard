// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { orderUrl } from "@dashboard/orders/urls";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getOrderTitleMessage } from "../OrderCardTitle/utils";
import { ProductsCard, RefundCard } from "./components";
import { GrantRefundContext } from "./context";
import { OrderGrantRefundFormData, useGrantRefundForm } from "./form";
import { grantRefundPageMessages } from "./messages";
import {
  getGrantRefundReducerInitialState,
  grantRefundDefaultState,
  grantRefundReducer,
} from "./reducer";
import { useStyles } from "./styles";
import { calculateTotalPrice, getFulfilmentSubtitle } from "./utils";

export interface OrderGrantRefundPageProps {
  order: OrderDetailsGrantRefundFragment;
  loading: boolean;
  submitState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderGrantRefundFormData) => void;
  isEdit?: boolean;
  initialData?: OrderGrantRefundFormData;
}

const OrderGrantRefundPage: React.FC<OrderGrantRefundPageProps> = ({
  order,
  loading,
  submitState,
  onSubmit,
  isEdit,
  initialData,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const unfulfilledLines = (order?.lines ?? []).filter(
    line => line.quantityToFulfill > 0,
  );

  const [state, dispatch] = React.useReducer(
    grantRefundReducer,
    grantRefundDefaultState,
  );

  React.useEffect(() => {
    if (order?.id) {
      dispatch({
        type: "initState",
        state: getGrantRefundReducerInitialState(order),
      });
    }
  }, [order]);

  const { set, change, data, submit, setIsDirty } = useGrantRefundForm({
    onSubmit,
    initialData,
  });

  const amount = parseFloat(data.amount);
  const submitDisabled = Number.isNaN(amount) || amount <= 0;

  const totalSelectedPrice = calculateTotalPrice(state, order);

  const handleSubmit = (e: React.FormEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    submit();
  };

  return (
    <DetailPageLayout>
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
      <form onSubmit={handleSubmit} className={classes.form}>
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
            <Card>
              <CardContent>
                <Text variant="bodyEmp" as="p">
                  <FormattedMessage {...grantRefundPageMessages.pageSubtitle} />
                </Text>
              </CardContent>
            </Card>
            <CardSpacer />
            <div className={classes.cardsContainer}>
              {loading && <Skeleton className={classes.cardLoading} />}
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
                    <Typography
                      variant="body1"
                      className={classes.fulfilmentNumber}
                    >
                      {getFulfilmentSubtitle(order, fulfillment)}
                    </Typography>
                  }
                  lines={fulfillment.lines.map(
                    ({ orderLine, id, quantity }) => ({
                      ...orderLine,
                      id,
                      quantity,
                    }),
                  )}
                />
              ))}

              <Card>
                <CardContent>
                  <TextField
                    label={intl.formatMessage(
                      grantRefundPageMessages.reasonForRefund,
                    )}
                    disabled={loading}
                    value={data.reason}
                    fullWidth
                    name={"reason" as keyof OrderGrantRefundFormData}
                    onChange={change}
                    type="text"
                    InputProps={{
                      inputProps: {
                        "data-test-id": "refundReasonInput",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <RefundCard
              order={order}
              loading={loading}
              submitState={submitState}
              isEdit={isEdit}
              submitDisabled={submitDisabled}
            />
          </DetailPageLayout.RightSidebar>
        </GrantRefundContext.Provider>
      </form>
    </DetailPageLayout>
  );
};

export default OrderGrantRefundPage;
