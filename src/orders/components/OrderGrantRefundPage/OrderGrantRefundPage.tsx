import {
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardTitle from "@saleor/components/CardTitle";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { OrderDetailsFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GrantRefundContext } from "./context";
import { grantRefundPageMessages } from "./messages";
import {
  getGrantRefundReducerInitialState,
  grantRefundDefaultState,
  grantRefundReducer,
} from "./reducer";
import { RefundCard } from "./RefundCard";
// import { useStyles } from "./styles";
import { calculateTotalPrice } from "./utils";

export interface OrderGrantRefundPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
  onSubmit: (data: OrderGrantRefundFormData) => void;
}

export interface OrderGrantRefundFormData {
  amount: string;
  reason: string;
}

const initialFormData: OrderGrantRefundFormData = {
  amount: "0",
  reason: "",
};

const OrderGrantRefundPage: React.FC<OrderGrantRefundPageProps> = ({
  order,
  loading,
  onSubmit,
}) => {
  // const classes = useStyles();
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

  const totalSelectedPrice = calculateTotalPrice(state, order);

  return (
    <Container>
      <Backlink href={orderUrl(order?.id)}>
        <FormattedMessage {...buttonMessages.back} />
      </Backlink>
      <PageHeader
        title={<FormattedMessage {...grantRefundPageMessages.pageHeader} />}
      />
      <Typography variant="subtitle1">
        <FormattedMessage {...grantRefundPageMessages.pageSubtitle} />
      </Typography>
      <Form<OrderGrantRefundFormData, {}>
        confirmLeave
        initial={initialFormData}
        onSubmit={onSubmit}
      >
        {({ change, data, set }) => (
          <GrantRefundContext.Provider
            value={{
              dispatch,
              state,
              form: { change, data, set },
              totalSelectedPrice,
            }}
          >
            <Grid>
              <div>
                {loading && <Skeleton />}
                {unfulfilledLines.length > 0 && (
                  <Card>
                    <CardTitle title="Unfulfilled products" />
                    <CardContent>
                      {unfulfilledLines.map(line => (
                        <div>
                          <p>{line.id}</p>
                          <input
                            type="number"
                            value={state.lines.get(line.id)?.selectedQuantity}
                            onChange={e => {
                              const value = parseInt(e.target.value, 10);
                              dispatch({
                                type: "setQuantity",
                                lineId: line.id,
                                amount: value,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {order?.fulfillments?.map?.(fulfillment => (
                  <Card>
                    <CardTitle title={"Fulfilment"}></CardTitle>
                    <CardContent>
                      <p>{fulfillment.id}</p>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardContent>
                    <TextField
                      value={data.reason}
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
                <RefundCard order={order} />
              </div>
            </Grid>
          </GrantRefundContext.Provider>
        )}
      </Form>
    </Container>
  );
};

export default OrderGrantRefundPage;
