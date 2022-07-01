import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { Grid } from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import {
  FulfillOrderMutation,
  OrderErrorCode,
  OrderFulfillDataQuery,
  OrderFulfillLineFragment,
  OrderFulfillStockInput,
  ShopOrderSettingsFragment,
  WarehouseFragment,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import useNavigator from "@saleor/hooks/useNavigator";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { orderUrl } from "@saleor/orders/urls";
import {
  getAttributesCaption,
  getToFulfillOrderLines,
} from "@saleor/orders/utils/data";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderFulfillLine from "../OrderFulfillLine/OrderFulfillLine";
import OrderFulfillStockExceededDialog from "../OrderFulfillStockExceededDialog";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface OrderFulfillFormData {
  sendInfo: boolean;
  trackingNumber: string;
  allowStockToBeExceeded: boolean;
}
export interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  loading: boolean;
  errors: FulfillOrderMutation["orderFulfill"]["errors"];
  order: OrderFulfillDataQuery["order"];
  saveButtonBar: ConfirmButtonTransitionState;
  warehouse: WarehouseFragment;
  shopSettings?: ShopOrderSettingsFragment;
  onSubmit: (data: OrderFulfillSubmitData) => SubmitPromise;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true,
  trackingNumber: "",
  allowStockToBeExceeded: false,
};

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    loading,
    errors,
    order,
    saveButtonBar,
    warehouse,
    shopSettings,
    onSubmit,
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);
  const navigate = useNavigator();

  const { change: formsetChange, data: formsetData } = useFormset<
    null,
    OrderFulfillStockInput[]
  >(
    (getToFulfillOrderLines(order?.lines) as OrderFulfillLineFragment[]).map(
      line => ({
        data: null,
        id: line.id,
        label: getAttributesCaption(line?.variant?.attributes),
        value: line?.variant?.preorder
          ? null
          : [
              {
                quantity: line.quantityToFulfill,
                warehouse: warehouse?.id,
              },
            ],
      }),
    ),
  );

  const [
    displayStockExceededDialog,
    setDisplayStockExceededDialog,
  ] = React.useState(false);

  const handleSubmit = ({
    formData,
    allowStockToBeExceeded,
  }: {
    formData: OrderFulfillFormData;
    allowStockToBeExceeded: boolean;
  }) => {
    setDisplayStockExceededDialog(false);
    return onSubmit({
      ...formData,
      allowStockToBeExceeded,
      items: formsetData.filter(item => !!item.value),
    });
  };
  React.useEffect(() => {
    if (
      errors &&
      errors.every(err => err.code === OrderErrorCode.INSUFFICIENT_STOCK)
    ) {
      setDisplayStockExceededDialog(true);
    }
  }, [errors]);

  const notAllowedToFulfillUnpaid =
    shopSettings?.fulfillmentAutoApprove &&
    !shopSettings?.fulfillmentAllowUnpaid &&
    !order?.isPaid;

  const shouldEnableSave = () => {
    if (!order || loading) {
      return false;
    }

    if (notAllowedToFulfillUnpaid) {
      return false;
    }

    const isAtLeastOneFulfilled = formsetData?.some(
      el => el.value?.[0]?.quantity > 0,
    );

    const overfulfill = formsetData
      .filter(item => !!item?.value) // this can be removed after preorder is dropped
      .some(item => {
        const formQuantityFulfilled = item?.value?.[0]?.quantity;
        const quantityToFulfill = order?.lines?.find(
          line => line.id === item.id,
        ).quantityToFulfill;
        return formQuantityFulfilled > quantityToFulfill;
      });

    return !overfulfill && isAtLeastOneFulfilled;
  };

  return (
    <Container>
      <Backlink href={orderUrl(order?.id)}>
        {order?.number
          ? intl.formatMessage(messages.headerOrderNumber, {
              orderNumber: order.number,
            })
          : intl.formatMessage(messages.headerOrder)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(messages.headerOrderNumberAddFulfillment, {
          orderNumber: order?.number,
        })}
      />
      <Typography className={classes.warehouseLabel}>
        <FormattedMessage
          {...messages.fulfillingFrom}
          values={{ warehouseName: warehouse?.name }}
        />
      </Typography>
      <Form
        confirmLeave
        initial={initialFormData}
        onSubmit={formData =>
          handleSubmit({
            formData,
            allowStockToBeExceeded: displayStockExceededDialog,
          })
        }
      >
        {({ change, data, submit }) => (
          <>
            <Grid>
              <Card>
                <CardTitle
                  title={intl.formatMessage(messages.itemsReadyToShip)}
                />
                {warehouse ? (
                  <ResponsiveTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.colName}>
                          <FormattedMessage {...messages.productName} />
                        </TableCell>
                        <TableCell className={classes.colSku}>
                          <FormattedMessage {...messages.sku} />
                        </TableCell>
                        <TableCell
                          className={classNames(
                            classes.colQuantity,
                            classes.colQuantityHeader,
                          )}
                        >
                          <FormattedMessage {...messages.quantity} />
                        </TableCell>
                        <TableCell className={classes.colStock}>
                          <FormattedMessage {...messages.stock} />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderCollection(
                        getToFulfillOrderLines(order?.lines),
                        (line: OrderFulfillLineFragment, lineIndex) => (
                          <OrderFulfillLine
                            line={line}
                            lineIndex={lineIndex}
                            warehouseId={warehouse?.id}
                            formsetData={formsetData}
                            formsetChange={formsetChange}
                          />
                        ),
                      )}
                    </TableBody>
                  </ResponsiveTable>
                ) : (
                  <Skeleton />
                )}
              </Card>

              <Card className={classes.shipmentInformationCard}>
                <Typography className={classes.supportHeader}>
                  <FormattedMessage {...messages.shipmentInformation} />
                </Typography>
                <TextField
                  value={data.trackingNumber}
                  name="trackingNumber"
                  label={intl.formatMessage(messages.trackingNumber)}
                  fullWidth
                  onChange={change}
                />
                {shopSettings?.fulfillmentAutoApprove && (
                  <ControlledCheckbox
                    checked={data.sendInfo}
                    label={intl.formatMessage(messages.sentShipmentDetails)}
                    name="sendInfo"
                    onChange={change}
                  />
                )}
              </Card>
            </Grid>

            <Savebar
              disabled={!shouldEnableSave()}
              labels={{
                confirm: shopSettings?.fulfillmentAutoApprove
                  ? intl.formatMessage(messages.submitFulfillment)
                  : intl.formatMessage(messages.submitPrepareFulfillment),
              }}
              state={saveButtonBar}
              tooltips={{
                confirm:
                  notAllowedToFulfillUnpaid &&
                  intl.formatMessage(commonMessages.cannotFullfillUnpaidOrder),
              }}
              onSubmit={submit}
              onCancel={() => navigate(orderUrl(order?.id))}
            />
            <OrderFulfillStockExceededDialog
              open={displayStockExceededDialog}
              lines={order?.lines}
              formsetData={formsetData}
              warehouseId={warehouse?.id}
              confirmButtonState={saveButtonBar}
              onSubmit={submit}
              onClose={() => setDisplayStockExceededDialog(false)}
            />
          </>
        )}
      </Form>
    </Container>
  );
};

OrderFulfillPage.displayName = "OrderFulfillPage";
export default OrderFulfillPage;
