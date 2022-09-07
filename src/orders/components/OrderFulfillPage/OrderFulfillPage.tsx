import {
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
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
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import useNavigator from "@saleor/hooks/useNavigator";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import OrderChangeWarehouseDialog from "@saleor/orders/components/OrderChangeWarehouseDialog";
import {
  OrderFulfillUrlDialog,
  OrderFulfillUrlQueryParams,
  orderUrl,
} from "@saleor/orders/urls";
import {
  getAttributesCaption,
  getLineAllocationWithHighestQuantity,
  getToFulfillOrderLines,
  OrderFulfillLineFormData,
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
  allowStockToBeExceeded: boolean;
}
export interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  params: OrderFulfillUrlQueryParams;
  loading: boolean;
  errors: FulfillOrderMutation["orderFulfill"]["errors"];
  order: OrderFulfillDataQuery["order"];
  saveButtonBar: ConfirmButtonTransitionState;
  shopSettings?: ShopOrderSettingsFragment;
  onSubmit: (data: OrderFulfillSubmitData) => SubmitPromise;
  openModal: (
    action: OrderFulfillUrlDialog,
    params?: OrderFulfillUrlQueryParams,
  ) => void;
  closeModal: () => void;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true,
  allowStockToBeExceeded: false,
};

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    params,
    loading,
    errors,
    order,
    saveButtonBar,
    shopSettings,
    onSubmit,
    openModal,
    closeModal,
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);
  const navigate = useNavigator();

  const { change: formsetChange, data: formsetData } = useFormset<
    null,
    OrderFulfillLineFormData[]
  >(
    (getToFulfillOrderLines(order?.lines) as OrderFulfillLineFragment[]).map(
      line => {
        const highestQuantityAllocation = getLineAllocationWithHighestQuantity(
          line,
        );

        return {
          data: null,
          id: line.id,
          label: getAttributesCaption(line?.variant?.attributes),
          value: line?.variant?.preorder
            ? null
            : [
                {
                  quantity: line.quantityToFulfill,
                  warehouse: highestQuantityAllocation?.warehouse,
                },
              ],
        };
      },
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
      items: formsetData
        .filter(item => !!item.value)
        .map(item => ({
          ...item,
          value: item.value.map(value => ({
            quantity: value.quantity,
            warehouse: value.warehouse.id,
          })),
        })),
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

  const areWarehousesSet = formsetData.every(line =>
    line.value.every(v => v.warehouse),
  );

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

    return !overfulfill && isAtLeastOneFulfilled && areWarehousesSet;
  };

  return (
    <>
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
              <Card>
                <CardTitle
                  title={intl.formatMessage(messages.itemsReadyToShip)}
                />
                {order ? (
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
                        <TableCell className={classes.colWarehouse}>
                          <FormattedMessage {...messages.warehouse} />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderCollection(
                        getToFulfillOrderLines(order.lines),
                        (line: OrderFulfillLineFragment, lineIndex) => (
                          <OrderFulfillLine
                            key={line.id}
                            line={line}
                            lineIndex={lineIndex}
                            formsetData={formsetData}
                            formsetChange={formsetChange}
                            onWarehouseChange={() =>
                              openModal("change-warehouse", {
                                lineId: line.id,
                                warehouseId:
                                  formsetData[lineIndex]?.value?.[0]?.warehouse
                                    ?.id,
                              })
                            }
                          />
                        ),
                      )}
                    </TableBody>
                  </ResponsiveTable>
                ) : (
                  <CardContent>
                    <Skeleton />
                  </CardContent>
                )}
              </Card>

              <CardSpacer />

              {shopSettings?.fulfillmentAutoApprove && (
                <Card>
                  <CardTitle
                    title={intl.formatMessage(messages.shipmentInformation)}
                  />
                  <CardContent>
                    <ControlledCheckbox
                      checked={data.sendInfo}
                      label={intl.formatMessage(messages.sentShipmentDetails)}
                      name="sendInfo"
                      onChange={change}
                    />
                  </CardContent>
                </Card>
              )}

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
                    intl.formatMessage(
                      commonMessages.cannotFullfillUnpaidOrder,
                    ),
                }}
                onSubmit={submit}
                onCancel={() => navigate(orderUrl(order?.id))}
              />
              <OrderFulfillStockExceededDialog
                open={displayStockExceededDialog}
                lines={order?.lines}
                formsetData={formsetData}
                confirmButtonState={saveButtonBar}
                onSubmit={submit}
                onClose={() => setDisplayStockExceededDialog(false)}
              />
            </>
          )}
        </Form>
      </Container>
      <OrderChangeWarehouseDialog
        open={params.action === "change-warehouse"}
        line={order?.lines.find(line => line.id === params.lineId)}
        currentWarehouseId={params.warehouseId}
        onConfirm={warehouse => {
          const lineFormQuantity = formsetData.find(
            item => item.id === params.lineId,
          )?.value?.[0]?.quantity;

          formsetChange(params.lineId, [
            {
              quantity: lineFormQuantity,
              warehouse,
            },
          ]);
        }}
        onClose={closeModal}
      />
    </>
  );
};

OrderFulfillPage.displayName = "OrderFulfillPage";
export default OrderFulfillPage;
