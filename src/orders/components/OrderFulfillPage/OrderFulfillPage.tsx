import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import { Grid } from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import {
  FulfillOrderMutation,
  OrderFulfillDataQuery,
  OrderFulfillStockInput,
  ShopOrderSettingsFragment
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import { commonMessages } from "@saleor/intl";
import {
  Backlink,
  ConfirmButtonTransitionState,
  Tooltip,
  WarningIcon
} from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { getToFulfillOrderLines } from "@saleor/orders/utils/data";
import { update } from "@saleor/utils/lists";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Warehouse } from "../OrderChangeWarehouseDialog/types";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { getDefaultFulfillmentValue } from "./utils";

interface OrderFulfillFormData {
  sendInfo: boolean;
  trackingNumber: string;
}
export interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  loading: boolean;
  errors: FulfillOrderMutation["orderFulfill"]["errors"];
  order: OrderFulfillDataQuery["order"];
  saveButtonBar: ConfirmButtonTransitionState;
  warehouse: Warehouse;
  shopSettings?: ShopOrderSettingsFragment;
  onBack: () => void;
  onSubmit: (data: OrderFulfillSubmitData) => SubmitPromise;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true,
  trackingNumber: ""
};

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    loading,
    order,
    saveButtonBar,
    warehouse,
    shopSettings,
    onBack,
    onSubmit
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const { change: formsetChange, data: formsetData } = useFormset<
    null,
    OrderFulfillStockInput[]
  >(
    getToFulfillOrderLines(order?.lines).map(line => ({
      data: null,
      id: line.id,
      label: line.variant?.attributes
        .map(attribute =>
          attribute.values
            .map(attributeValue => attributeValue.name)
            .join(" , ")
        )
        .join(" / "),
      value: getDefaultFulfillmentValue(line, warehouse?.id)
    }))
  );

  const handleSubmit = (formData: OrderFulfillFormData) =>
    onSubmit({
      ...formData,
      items: formsetData.filter(item => !!item.value)
    });

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
      el => el.value?.[0]?.quantity > 0
    );

    const areProperlyFulfilled = formsetData
      .filter(item => !!item?.value)
      .some(item => {
        const formQuantityFulfilled = item?.value?.[0]?.quantity;
        const quantityToFulfill = order?.lines?.find(
          line => line.id === item.id
        ).quantityToFulfill;
        return formQuantityFulfilled <= quantityToFulfill;
      });

    return areProperlyFulfilled && isAtLeastOneFulfilled;
  };

  return (
    <Container>
      <Backlink onClick={onBack}>
        {order?.number
          ? intl.formatMessage(messages.headerOrderNumber, {
              orderNumber: order.number
            })
          : intl.formatMessage(messages.headerOrder)}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(messages.headerOrderNumberAddFulfillment, {
          orderNumber: order?.number
        })}
      />
      <Typography className={classes.warehouseLabel}>
        <FormattedMessage
          {...messages.fulfillingFrom}
          values={{ warehouseName: warehouse?.name }}
        />
      </Typography>
      <Form confirmLeave initial={initialFormData} onSubmit={handleSubmit}>
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
                            classes.colQuantityHeader
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
                        (
                          line: OrderFulfillDataQuery["order"]["lines"][0],
                          lineIndex
                        ) => {
                          if (!line) {
                            return (
                              <TableRow key={lineIndex}>
                                <TableCellAvatar className={classes.colName}>
                                  <Skeleton />
                                </TableCellAvatar>
                                <TableCell className={classes.colSku}>
                                  <Skeleton />
                                </TableCell>
                                <TableCell className={classes.colQuantity}>
                                  <Skeleton />
                                </TableCell>
                                <TableCell className={classes.colStock}>
                                  {" "}
                                  <Skeleton />
                                </TableCell>
                              </TableRow>
                            );
                          }

                          const isDeletedVariant = !line?.variant;
                          const isPreorder = !!line.variant?.preorder;
                          const lineFormQuantity = isPreorder
                            ? 0
                            : formsetData[lineIndex].value?.[0]?.quantity;

                          const overfulfill =
                            lineFormQuantity > line.quantityToFulfill;

                          const warehouseStock = line.variant?.stocks?.find(
                            stock => stock.warehouse.id === warehouse.id
                          );

                          const warehouseAllocation = line.allocations.find(
                            allocation =>
                              allocation.warehouse.id === warehouse.id
                          );
                          const allocatedQuantityForLine =
                            warehouseAllocation?.quantity || 0;

                          const availableQuantity =
                            warehouseStock?.quantity ??
                            0 - warehouseStock?.quantityAllocated ??
                            0 + allocatedQuantityForLine;

                          const isStockExceeded =
                            lineFormQuantity > availableQuantity;

                          return (
                            <TableRow key={line.id}>
                              <TableCellAvatar
                                className={classes.colName}
                                thumbnail={line?.thumbnail?.url}
                                badge={
                                  isPreorder || !line?.variant ? (
                                    <Tooltip
                                      variant="warning"
                                      title={intl.formatMessage(
                                        isPreorder
                                          ? messages.preorderWarning
                                          : messages.deletedVariantWarning
                                      )}
                                    >
                                      <div className={classes.warningIcon}>
                                        <WarningIcon />
                                      </div>
                                    </Tooltip>
                                  ) : (
                                    undefined
                                  )
                                }
                              >
                                {line.productName}
                                <Typography
                                  color="textSecondary"
                                  variant="caption"
                                >
                                  {line.variant?.attributes
                                    ?.map(attribute =>
                                      attribute.values
                                        .map(
                                          attributeValue => attributeValue.name
                                        )
                                        .join(", ")
                                    )
                                    ?.join(" / ")}
                                </Typography>
                              </TableCellAvatar>
                              <TableCell className={classes.colSku}>
                                {line.variant?.sku}
                              </TableCell>
                              {(() => {
                                if (isPreorder) {
                                  return (
                                    <TableCell
                                      className={classNames(
                                        classes.colQuantity,
                                        classes.error
                                      )}
                                    />
                                  );
                                }

                                return (
                                  <TableCell
                                    className={classes.colQuantity}
                                    key={
                                      warehouseStock?.id ??
                                      "deletedVariant" + lineIndex
                                    }
                                  >
                                    <TextField
                                      type="number"
                                      inputProps={{
                                        className: classNames(
                                          classes.quantityInnerInput,
                                          {
                                            [classes.quantityInnerInputNoRemaining]: !line
                                              .variant?.trackInventory
                                          }
                                        ),
                                        min: 0,
                                        style: { textAlign: "right" }
                                      }}
                                      fullWidth
                                      value={lineFormQuantity}
                                      onChange={event =>
                                        formsetChange(
                                          line.id,
                                          update(
                                            {
                                              quantity: parseInt(
                                                event.target.value,
                                                10
                                              ),
                                              warehouse: warehouse.id
                                            },
                                            formsetData[lineIndex].value,
                                            (a, b) =>
                                              a.warehouse === b.warehouse
                                          )
                                        )
                                      }
                                      error={overfulfill}
                                      variant="outlined"
                                      InputProps={{
                                        classes: {
                                          ...(isStockExceeded &&
                                            !overfulfill && {
                                              notchedOutline: classes.warning
                                            })
                                        },
                                        endAdornment: line.variant
                                          ?.trackInventory && (
                                          <div
                                            className={
                                              classes.remainingQuantity
                                            }
                                          >
                                            / {line.quantityToFulfill}
                                          </div>
                                        )
                                      }}
                                    />
                                  </TableCell>
                                );
                              })()}
                              <TableCell
                                className={classes.colStock}
                                key="total"
                              >
                                {isPreorder || isDeletedVariant
                                  ? undefined
                                  : availableQuantity}
                              </TableCell>
                            </TableRow>
                          );
                        }
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
                  : intl.formatMessage(messages.submitPrepareFulfillment)
              }}
              state={saveButtonBar}
              tooltips={{
                confirm:
                  notAllowedToFulfillUnpaid &&
                  intl.formatMessage(commonMessages.cannotFullfillUnpaidOrder)
              }}
              onSubmit={submit}
              onCancel={onBack}
            />
          </>
        )}
      </Form>
    </Container>
  );
};

OrderFulfillPage.displayName = "OrderFulfillPage";
export default OrderFulfillPage;
