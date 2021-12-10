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
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Backlink } from "@saleor/macaw-ui";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  OrderFulfillData_order,
  OrderFulfillData_order_lines
} from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import { update } from "@saleor/utils/lists";
import classNames from "classnames";
import React, { Dispatch, SetStateAction } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getAllocatedQuantityForLine } from "../OrderFulfillStockExceededDialog/utils";

type ClassKey =
  | "actionBar"
  | "table"
  | "colName"
  | "colQuantity"
  | "colQuantityHeader"
  | "colQuantityTotal"
  | "colSku"
  | "error"
  | "warning"
  | "full"
  | "quantityInnerInput"
  | "quantityInnerInputNoRemaining"
  | "remainingQuantity";

const useStyles = makeStyles<OrderFulfillPageProps, ClassKey>(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      [theme.breakpoints.up("lg")]: {
        colName: {
          width: ({ warehouses }) => (warehouses?.length > 3 ? 250 : "auto")
        }
      },
      [theme.breakpoints.only("md")]: {
        colName: {
          width: ({ warehouses }) => (warehouses?.length > 2 ? 250 : "auto")
        }
      },
      actionBar: {
        flexDirection: "row",
        padding: theme.spacing(1, 4)
      },
      colName: {
        width: 250
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
      warning: {
        color: theme.palette.warning.main,
        borderColor: theme.palette.warning.main + " !important"
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
  allowStockToBeExceeded: boolean;
}
interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  loading: boolean;
  formsetChange: FormsetChange<OrderFulfillStockInput[]>;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  sendInfo: boolean;
  setSendInfo: Dispatch<SetStateAction<boolean>>;
  order: OrderFulfillData_order;
  saveButtonBar: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  onBack: () => void;
  onSubmit: (data: OrderFulfillSubmitData) => void;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true,
  allowStockToBeExceeded: false
};

function getRemainingQuantity(line: OrderFulfillData_order_lines): number {
  return line.quantity - line.quantityFulfilled;
}

function isFulfillable(line: OrderFulfillData_order_lines): boolean {
  return getRemainingQuantity(line) > 0 && line.variant !== null;
}

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    loading,
    order,
    saveButtonBar,
    warehouses,
    formsetData,
    formsetChange,
    sendInfo,
    setSendInfo,
    onBack,
    onSubmit
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const handleSubmit = (formData: OrderFulfillFormData) =>
    onSubmit({
      ...formData,
      items: formsetData
    });

  const shouldEnableSave = () => {
    if (!order || loading) {
      return false;
    }

    const isAtLeastOneFulfilled = formsetData.some(({ value }) =>
      value.some(({ quantity }) => quantity > 0)
    );

    const areProperlyFulfilled = formsetData.every(({ id, value }) => {
      const { lines } = order;

      const { quantity, quantityFulfilled } = lines.find(
        ({ id: lineId }) => lineId === id
      );

      const remainingQuantity = quantity - quantityFulfilled;

      const formQuantityFulfilled = value.reduce(
        (result, { quantity }) => result + quantity,
        0
      );

      return formQuantityFulfilled <= remainingQuantity;
    });

    return isAtLeastOneFulfilled && areProperlyFulfilled;
  };

  const filteredWarehouses = warehouses?.filter(warehouse =>
    order?.lines.some(line =>
      line.variant?.stocks.some(stock => stock.warehouse.id === warehouse.id)
    )
  );

  return (
    <Container>
      <Backlink onClick={onBack}>
        {order?.number
          ? intl.formatMessage(
              {
                defaultMessage: "Order #{orderNumber}",
                description: "page header with order number"
              },
              {
                orderNumber: order.number
              }
            )
          : intl.formatMessage({
              defaultMessage: "Order",
              description: "page header"
            })}
      </Backlink>
      <PageHeader
        title={intl.formatMessage(
          {
            defaultMessage: "Order no. {orderNumber} - Add Fulfillment",
            description: "page header"
          },
          {
            orderNumber: order?.number
          }
        )}
      />
      <Form initial={initialFormData} onSubmit={handleSubmit}>
        {({ submit }) => (
          <>
            <Card>
              <CardTitle
                title={intl.formatMessage({
                  defaultMessage: "Items ready to ship",
                  description: "header"
                })}
              />
              <ResponsiveTable className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.colName}>
                      <FormattedMessage defaultMessage="Product name" />
                    </TableCell>
                    <TableCell className={classes.colSku}>
                      <FormattedMessage
                        defaultMessage="SKU"
                        description="product's sku"
                      />
                    </TableCell>
                    <TableCell className={classes.colQuantityTotal}>
                      <FormattedMessage
                        defaultMessage="Quantity to fulfill"
                        description="quantity of fulfilled products"
                      />
                    </TableCell>
                    {filteredWarehouses?.map(warehouse => (
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderCollection(
                    order?.lines.filter(line => isFulfillable(line)),
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
                            <TableCell className={classes.colQuantityTotal}>
                              {" "}
                              <Skeleton />
                            </TableCell>
                            {filteredWarehouses?.map(warehouse => (
                              <TableCell
                                className={classes.colQuantity}
                                key={warehouse.id}
                              >
                                <Skeleton />
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      }

                      const remainingQuantity = getRemainingQuantity(line);
                      const quantityToFulfill = formsetData[
                        lineIndex
                      ]?.value.reduce(
                        (quantityToFulfill, lineInput) =>
                          quantityToFulfill + (lineInput.quantity || 0),
                        0
                      );
                      const overfulfill =
                        typeof quantityToFulfill === "number" &&
                        remainingQuantity < quantityToFulfill;

                      return (
                        <TableRow key={line.id}>
                          <TableCellAvatar
                            className={classes.colName}
                            thumbnail={line?.thumbnail?.url}
                          >
                            {line.productName}
                            <Typography color="textSecondary" variant="caption">
                              {line.variant.attributes
                                .map(attribute =>
                                  attribute.values
                                    .map(attributeValue => attributeValue.name)
                                    .join(", ")
                                )
                                .join(" / ")}
                            </Typography>
                          </TableCellAvatar>
                          <TableCell className={classes.colSku}>
                            {line.variant.sku}
                          </TableCell>
                          <TableCell
                            className={classes.colQuantityTotal}
                            key="total"
                          >
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
                          </TableCell>
                          {filteredWarehouses?.map(warehouse => {
                            const warehouseStock = line.variant.stocks.find(
                              stock => stock.warehouse.id === warehouse.id
                            );
                            const formsetStock = formsetData[
                              lineIndex
                            ]?.value.find(
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
                                  <FormattedMessage
                                    defaultMessage="No Stock"
                                    description="no variant stock in warehouse"
                                  />
                                </TableCell>
                              );
                            }

                            const allocatedQuantityForLine = getAllocatedQuantityForLine(
                              line,
                              warehouse
                            );

                            const availableQuantity =
                              warehouseStock.quantity -
                              warehouseStock.quantityAllocated +
                              allocatedQuantityForLine;

                            const isStockExceeded =
                              formsetData[lineIndex]?.value.find(
                                el => el.warehouse === warehouse.id
                              ).quantity > availableQuantity;

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
                                          .variant.trackInventory,
                                        [classes.warning]: isStockExceeded
                                      }
                                    ),
                                    min: 0,
                                    style: { textAlign: "right" }
                                  }}
                                  fullWidth
                                  value={formsetStock?.quantity}
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
                                        formsetData[lineIndex]?.value,
                                        (a, b) => a.warehouse === b.warehouse
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
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </ResponsiveTable>
              <CardActions className={classes.actionBar}>
                <ControlledCheckbox
                  checked={sendInfo}
                  label={intl.formatMessage({
                    defaultMessage: "Send shipment details to customer",
                    description: "checkbox"
                  })}
                  name="sendInfo"
                  onChange={() => {
                    setSendInfo(!sendInfo);
                  }}
                />
              </CardActions>
            </Card>
            <Savebar
              disabled={!shouldEnableSave()}
              labels={{
                confirm: intl.formatMessage({
                  defaultMessage: "Fulfill",
                  description: "fulfill order, button"
                })
              }}
              state={saveButtonBar}
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
