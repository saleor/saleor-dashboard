// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { Savebar } from "@dashboard/components/Savebar";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import {
  FulfillOrderMutation,
  OrderErrorCode,
  OrderFulfillDataQuery,
  OrderFulfillLineFragment,
  OrderFulfillStockInput,
  ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useFormset, { FormsetData } from "@dashboard/hooks/useFormset";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { renderCollection } from "@dashboard/misc";
import OrderChangeWarehouseDialog from "@dashboard/orders/components/OrderChangeWarehouseDialog";
import {
  OrderFulfillUrlDialog,
  OrderFulfillUrlQueryParams,
  orderUrl,
} from "@dashboard/orders/urls";
import {
  getAttributesCaption,
  getLineAllocationWithHighestQuantity,
  getToFulfillOrderLines,
  OrderFulfillLineFormData,
} from "@dashboard/orders/utils/data";
import { Card, CardContent, TableBody, TableCell, TableHead } from "@material-ui/core";
import { Box, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
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
  openModal: (action: OrderFulfillUrlDialog, params?: OrderFulfillUrlQueryParams) => void;
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
  const { change: formsetChange, data: formsetData } = useFormset<null, OrderFulfillLineFormData[]>(
    (getToFulfillOrderLines(order?.lines) as OrderFulfillLineFragment[]).map(line => {
      const highestQuantityAllocation = getLineAllocationWithHighestQuantity(line);

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
    }),
  );
  const [displayStockExceededDialog, setDisplayStockExceededDialog] = React.useState(false);
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
    if (errors && errors.every(err => err.code === OrderErrorCode.INSUFFICIENT_STOCK)) {
      setDisplayStockExceededDialog(true);
    }
  }, [errors]);

  const notAllowedToFulfillUnpaid =
    shopSettings?.fulfillmentAutoApprove && !shopSettings?.fulfillmentAllowUnpaid && !order?.isPaid;
  const areWarehousesSet = formsetData
    .filter(item => !!item?.value) // preorder case
    .every(line => line.value.every(v => v.warehouse));
  const shouldEnableSave = () => {
    if (!order || loading) {
      return false;
    }

    if (notAllowedToFulfillUnpaid) {
      return false;
    }

    const isAtLeastOneFulfilled = formsetData?.some(el => el.value?.[0]?.quantity > 0);
    const overfulfill = formsetData
      .filter(item => !!item?.value) // this can be removed after preorder is dropped
      .some(item => {
        const formQuantityFulfilled = item?.value?.[0]?.quantity;
        const quantityToFulfill = order?.lines?.find(line => line.id === item.id).quantityToFulfill;

        return formQuantityFulfilled > quantityToFulfill;
      });

    return !overfulfill && isAtLeastOneFulfilled && areWarehousesSet;
  };

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav
        href={orderUrl(order?.id)}
        title={intl.formatMessage(messages.headerOrderNumberAddFulfillment, {
          orderNumber: order?.number,
        })}
      />
      <DetailPageLayout.Content>
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
                <CardTitle title={intl.formatMessage(messages.itemsReadyToShip)} />
                {order ? (
                  <ResponsiveTable className={classes.table}>
                    <TableHead>
                      <TableRowLink>
                        <TableCell className={classes.colName}>
                          <FormattedMessage {...messages.productName} />
                        </TableCell>
                        <TableCell className={classes.colSku}>
                          <FormattedMessage {...messages.sku} />
                        </TableCell>
                        <TableCell className={clsx(classes.colQuantity, classes.colQuantityHeader)}>
                          <FormattedMessage {...messages.quantity} />
                        </TableCell>
                        <TableCell className={classes.colStock}>
                          <FormattedMessage {...messages.stock} />
                        </TableCell>
                        <TableCell className={classes.colWarehouse}>
                          <FormattedMessage {...messages.warehouse} />
                        </TableCell>
                      </TableRowLink>
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
                                warehouseId: formsetData[lineIndex]?.value?.[0]?.warehouse?.id,
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
                  <CardTitle title={intl.formatMessage(messages.shipmentInformation)} />
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

              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(orderUrl(order?.id))} />
                <Tooltip>
                  <Tooltip.Trigger>
                    <Box>
                      <Savebar.ConfirmButton
                        transitionState={saveButtonBar}
                        onClick={submit}
                        disabled={!shouldEnableSave()}
                      >
                        {shopSettings?.fulfillmentAutoApprove
                          ? intl.formatMessage(messages.submitFulfillment)
                          : intl.formatMessage(messages.submitPrepareFulfillment)}
                      </Savebar.ConfirmButton>
                    </Box>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    {notAllowedToFulfillUnpaid &&
                      intl.formatMessage(commonMessages.cannotFullfillUnpaidOrder)}
                  </Tooltip.Content>
                </Tooltip>
              </Savebar>
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
        <OrderChangeWarehouseDialog
          open={params.action === "change-warehouse"}
          line={order?.lines.find(line => line.id === params.lineId)}
          currentWarehouseId={params.warehouseId}
          onConfirm={warehouse => {
            const lineFormQuantity = formsetData.find(item => item.id === params.lineId)?.value?.[0]
              ?.quantity;

            formsetChange(params.lineId, [
              {
                quantity: lineFormQuantity,
                warehouse,
              },
            ]);
          }}
          onClose={closeModal}
        />
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

OrderFulfillPage.displayName = "OrderFulfillPage";
export default OrderFulfillPage;
