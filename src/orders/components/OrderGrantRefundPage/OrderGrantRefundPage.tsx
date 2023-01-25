import { Backlink } from "@dashboard/components/Backlink";
import CardSpacer from "@dashboard/components/CardSpacer";
import Grid from "@dashboard/components/Grid";
import PageHeader from "@dashboard/components/PageHeader";
import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql/transactions";
import { buttonMessages } from "@dashboard/intl";
import { orderUrl } from "@dashboard/orders/urls";
import {
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductsCard, RefundCard } from "./components";
import { GrantRefundContext } from "./context";
import { OrderGrantRefundFormData, useGrantRefundForm } from "./form";
import { getTitle, grantRefundPageMessages } from "./messages";
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

  const { set, change, data, submit } = useGrantRefundForm({
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
    <Container>
      <Backlink href={orderUrl(order?.id)}>
        <FormattedMessage {...buttonMessages.back} />
      </Backlink>
      <PageHeader
        title={
          <FormattedMessage
            {...(isEdit
              ? grantRefundPageMessages.pageHeaderEdit
              : grantRefundPageMessages.pageHeader)}
          />
        }
      />
      <Typography variant="subtitle1">
        <FormattedMessage {...grantRefundPageMessages.pageSubtitle} />
      </Typography>
      <CardSpacer />
      <form onSubmit={handleSubmit}>
        <GrantRefundContext.Provider
          value={{
            dispatch,
            state,
            form: { change, data, set },
            totalSelectedPrice,
          }}
        >
          <Grid>
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
                  title={getTitle(fulfillment.status, intl)}
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
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <RefundCard
                order={order}
                loading={loading}
                submitState={submitState}
                isEdit={isEdit}
                submitDisabled={submitDisabled}
              />
            </div>
          </Grid>
        </GrantRefundContext.Provider>
      </form>
    </Container>
  );
};

export default OrderGrantRefundPage;
