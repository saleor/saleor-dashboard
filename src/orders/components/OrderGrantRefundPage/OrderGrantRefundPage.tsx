import {
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { OrderDetailsGrantRefundFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getTitle } from "../OrderRefundFulfilledProducts/messages";
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
import { calculateTotalPrice } from "./utils";

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
              {loading && <Skeleton />}
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
                      {`#${order.number}-${fulfillment.fulfillmentOrder}`}
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
                    value={data.reason}
                    fullWidth
                    name={"reason" as keyof OrderGrantRefundFormData}
                    onChange={change}
                    type="text"
                    placeholder={intl.formatMessage(
                      grantRefundPageMessages.reasonForRefund,
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div>
              <RefundCard
                order={order}
                loading={loading}
                submitState={submitState}
              />
            </div>
          </Grid>
        </GrantRefundContext.Provider>
      </form>
    </Container>
  );
};

export default OrderGrantRefundPage;
