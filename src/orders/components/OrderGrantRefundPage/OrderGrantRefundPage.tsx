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
import Money from "@saleor/components/Money";
import PageHeader from "@saleor/components/PageHeader";
import PriceField from "@saleor/components/PriceField";
import Skeleton from "@saleor/components/Skeleton";
import { OrderDetailsFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { grantRefundPageMessages } from "./messages";
import {
  getGrantRefundReducerInitialState,
  grantRefundDefaultState,
  grantRefundReducer,
} from "./reducer";
import { calculateTotalPrice } from "./utils";

export interface OrderGrantRefundPageProps {
  order: OrderDetailsFragment;
  loading: boolean;
  onSubmit: (data: OrderGrantRefundFormData) => void;
}

interface OrderGrantRefundFormData {
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
  const intl = useIntl();

  const currency = order?.total?.gross?.currency ?? "USD";

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

  const totalSelectedPrice = calculateTotalPrice([...state.lines.values()]);

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
              <Card>
                <CardTitle
                  title={
                    <FormattedMessage
                      {...grantRefundPageMessages.refundTitle}
                    />
                  }
                />
                <CardContent>
                  <p>
                    <FormattedMessage
                      {...grantRefundPageMessages.refundSubtitle}
                    />
                  </p>
                  {/* toggle */}
                  <p>
                    <FormattedMessage
                      {...grantRefundPageMessages.refundShipment}
                    />
                  </p>

                  <div>
                    <span>
                      <FormattedMessage
                        {...grantRefundPageMessages.refundSelectedValue}
                      />
                    </span>
                    <Money
                      money={{
                        amount: totalSelectedPrice,
                        currency,
                      }}
                    />
                    {/* calculated value */}
                    <Button
                      onClick={() =>
                        set({ amount: totalSelectedPrice.toString() })
                      }
                    >
                      <FormattedMessage {...buttonMessages.apply} />
                    </Button>
                  </div>
                  <div>
                    <PriceField
                      onChange={change}
                      name={"amount" as keyof OrderGrantRefundFormData}
                      currencySymbol={currency}
                      value={data.amount}
                      inputProps={{ "data-test-id": "amountInput" }}
                    />
                  </div>
                  <div>
                    <p>
                      <FormattedMessage
                        {...grantRefundPageMessages.refundStepExplanation}
                      />
                    </p>
                    <Button type="submit">Grant refund</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        )}
      </Form>
    </Container>
  );
};

export default OrderGrantRefundPage;
