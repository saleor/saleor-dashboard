import {
  Card,
  CardActions,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import { CSSProperties } from "@material-ui/styles";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { ShopOrderSettingsFragment } from "@saleor/fragments/types/ShopOrderSettingsFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Backlink } from "@saleor/macaw-ui";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { FulfillOrder_orderFulfill_errors } from "@saleor/orders/types/FulfillOrder";
import {
  OrderFulfillData_order,
  OrderFulfillData_order_lines
} from "@saleor/orders/types/OrderFulfillData";
import { getToFulfillOrderLines } from "@saleor/orders/utils/data";
import { isStockError } from "@saleor/orders/utils/data";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import { update } from "@saleor/utils/lists";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      actionBar: {
        flexDirection: "row",
        padding: theme.spacing(1, 4)
      },
      colName: {
        width: 250,
        [theme.breakpoints.up("lg")]: {
          width: ({ warehouses }: OrderFulfillPageProps) =>
            warehouses?.length > 3 ? 250 : "auto"
        },
        [theme.breakpoints.only("md")]: {
          width: ({ warehouses }: OrderFulfillPageProps) =>
            warehouses?.length > 2 ? 250 : "auto"
        }
      },
      colQuantity: {
        textAlign: "right",
        width: 210
      },
      colQuantityHeader: {
        textAlign: "right"
      },
      colQuantityTotal: {
        textAlign: "right",
        width: 180
      },
      colSku: {
        textAlign: "right",
        textOverflow: "ellipsis",
        width: 150
      },
      error: {
        color: theme.palette.error.main
      },
      full: {
        fontWeight: 600
      },
      quantityInnerInput: {
        ...inputPadding
      },
      quantityInnerInputNoRemaining: {
        paddingRight: 0
      },
      remainingQuantity: {
        ...inputPadding,
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap"
      },
      table: {
        "&&": {
          tableLayout: "fixed"
        }
      }
    };
  },
  { name: "OrderFulfillPage" }
);

interface OrderFulfillFormData {
  sendInfo: boolean;
}
export interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  loading: boolean;
  errors: FulfillOrder_orderFulfill_errors[];
  order: OrderFulfillData_order;
  saveButtonBar: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  shopSettings?: ShopOrderSettingsFragment;
  onBack: () => void;
  onSubmit: (data: OrderFulfillSubmitData) => SubmitPromise;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true
};

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    loading,
    errors,
    order,
    saveButtonBar,
    warehouses,
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
      value: line.variant?.stocks?.map(stock => ({
        quantity: 0,
        warehouse: stock.warehouse.id
      }))
    }))
  );

  const handleSubmit = (formData: OrderFulfillFormData) =>
    onSubmit({
      ...formData,
      items: formsetData
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

    const isAtLeastOneFulfilled = formsetData?.some(({ value }) =>
      value?.some(({ quantity }) => quantity > 0)
    );

    const areProperlyFulfilled = formsetData?.every(({ id, value }) => {
      const { lines } = order;

      const { quantityToFulfill } = lines.find(
        ({ id: lineId }) => lineId === id
      );

      const formQuantityFulfilled = value?.reduce(
        (result, { quantity }) => result + quantity,
        0
      );

      return formQuantityFulfilled <= quantityToFulfill;
    });

    return isAtLeastOneFulfilled && areProperlyFulfilled;
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
      <Form confirmLeave initial={initialFormData} onSubmit={handleSubmit}>
        {({ change, data, submit }) => (
          <>
            <Card>
              <CardTitle
                title={intl.formatMessage(messages.itemsReadyToShip)}
              />
              <ResponsiveTable className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.colName}>
                      <FormattedMessage {...messages.productName} />
                    </TableCell>
                    <TableCell className={classes.colSku}>
                      <FormattedMessage {...messages.sku} />
                    </TableCell>
                    {warehouses?.map(warehouse => (
                      <TableCell
                        key={warehouse.id}
                        className={classNames(
                          classes.colQuantity,
                          classes.colQuantityHeader
                        )}
                      >
                        {warehouse.name}
                      </TableCell>
                    ))}
                    <TableCell className={classes.colQuantityTotal}>
                      <FormattedMessage {...messages.quantityToFulfill} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderCollection(
                    getToFulfillOrderLines(order?.lines),
                    (line: OrderFulfillData_order_lines, lineIndex) => {
                      if (!line) {
                        return (
                          <TableRow key={lineIndex}>
                            <TableCellAvatar className={classes.colName}>
                              <Skeleton />
                            </TableCellAvatar>
                            <TableCell className={classes.colSku}>
                              <Skeleton />
                            </TableCell>
                            {warehouses?.map(warehouse => (
                              <TableCell
                                className={classes.colQuantity}
                                key={warehouse.id}
                              >
                                <Skeleton />
                              </TableCell>
                            ))}
                            <TableCell className={classes.colQuantityTotal}>
                              {" "}
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        );
                      }

                      const remainingQuantity = line.quantityToFulfill;
                      const quantityToFulfill = formsetData[
                        lineIndex
                      ].value?.reduce(
                        (quantityToFulfill, lineInput) =>
                          quantityToFulfill + (lineInput.quantity || 0),
                        0
                      );
                      const overfulfill = remainingQuantity < quantityToFulfill;
                      const isPreorder = !!line.variant?.preorder;

                      return (
                        <TableRow key={line.id}>
                          <TableCellAvatar
                            className={classes.colName}
                            thumbnail={line?.thumbnail?.url}
                          >
                            {line.productName}
                            <Typography color="textSecondary" variant="caption">
                              {line.variant?.attributes
                                ?.map(attribute =>
                                  attribute.values
                                    .map(attributeValue => attributeValue.name)
                                    .join(", ")
                                )
                                ?.join(" / ")}
                            </Typography>
                          </TableCellAvatar>
                          <TableCell className={classes.colSku}>
                            {line.variant?.sku}
                          </TableCell>
                          {warehouses?.map(warehouse => {
                            if (isPreorder) {
                              return (
                                <TableCell
                                  key="skeleton"
                                  className={classNames(
                                    classes.colQuantity,
                                    classes.error
                                  )}
                                />
                              );
                            }

                            const warehouseStock = line.variant?.stocks?.find(
                              stock => stock.warehouse.id === warehouse.id
                            );
                            const formsetStock = formsetData[
                              lineIndex
                            ].value.find(
                              line => line.warehouse === warehouse.id
                            );

                            if (!warehouseStock) {
                              return (
                                <TableCell
                                  key="skeleton"
                                  className={classNames(
                                    classes.colQuantity,
                                    classes.error
                                  )}
                                >
                                  <FormattedMessage {...messages.noStock} />
                                </TableCell>
                              );
                            }

                            const warehouseAllocation = line.allocations.find(
                              allocation =>
                                allocation.warehouse.id === warehouse.id
                            );
                            const allocatedQuantityForLine =
                              warehouseAllocation?.quantity || 0;
                            const availableQuantity =
                              warehouseStock.quantity -
                              warehouseStock.quantityAllocated +
                              allocatedQuantityForLine;

                            return (
                              <TableCell
                                className={classes.colQuantity}
                                key={warehouseStock.id}
                              >
                                <TextField
                                  type="number"
                                  inputProps={{
                                    className: classNames(
                                      classes.quantityInnerInput,
                                      {
                                        [classes.quantityInnerInputNoRemaining]: !line
                                          .variant.trackInventory
                                      }
                                    ),
                                    max: (
                                      line.variant.trackInventory &&
                                      availableQuantity
                                    ).toString(),
                                    min: 0,
                                    style: { textAlign: "right" }
                                  }}
                                  fullWidth
                                  value={formsetStock.quantity}
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
                                        (a, b) => a.warehouse === b.warehouse
                                      )
                                    )
                                  }
                                  error={isStockError(
                                    overfulfill,
                                    formsetStock,
                                    availableQuantity,
                                    warehouse,
                                    line,
                                    errors
                                  )}
                                  InputProps={{
                                    endAdornment: line.variant
                                      .trackInventory && (
                                      <div
                                        className={classes.remainingQuantity}
                                      >
                                        / {availableQuantity}
                                      </div>
                                    )
                                  }}
                                />
                              </TableCell>
                            );
                          })}

                          <TableCell
                            className={classes.colQuantityTotal}
                            key="total"
                          >
                            {!isPreorder && (
                              <>
                                <span
                                  className={classNames({
                                    [classes.error]: overfulfill,
                                    [classes.full]:
                                      remainingQuantity <= quantityToFulfill
                                  })}
                                >
                                  {quantityToFulfill}
                                </span>{" "}
                                / {remainingQuantity}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </ResponsiveTable>
              {shopSettings?.fulfillmentAutoApprove && (
                <CardActions className={classes.actionBar}>
                  <ControlledCheckbox
                    checked={data.sendInfo}
                    label={intl.formatMessage(messages.sentShipmentDetails)}
                    name="sendInfo"
                    onChange={change}
                  />
                </CardActions>
              )}
            </Card>
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
