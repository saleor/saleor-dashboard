import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";

import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import {
  OrderFulfillStockInput,
  OrderErrorCode
} from "@saleor/types/globalTypes";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import {
  OrderFulfillData_order,
  OrderFulfillData_order_lines
} from "@saleor/orders/types/OrderFulfillData";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { Theme, makeStyles } from "@material-ui/core/styles";
import { update } from "@saleor/utils/lists";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { renderCollection } from "@saleor/misc";
import Skeleton from "@saleor/components/Skeleton";
import AppHeader from "@saleor/components/AppHeader";
import { FulfillOrder_orderFulfill_errors } from "@saleor/orders/types/FulfillOrder";
import { CSSProperties } from "@material-ui/styles";

type ClassKey =
  | "actionBar"
  | "table"
  | "colName"
  | "colQuantity"
  | "colQuantityHeader"
  | "colQuantityTotal"
  | "colSku"
  | "error"
  | "full"
  | "quantityInnerInput"
  | "quantityInnerInputNoRemaining"
  | "remainingQuantity";
const useStyles = makeStyles<Theme, OrderFulfillPageProps, ClassKey>(
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
        paddingLeft: theme.spacing(2) + 2
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
interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, OrderFulfillStockInput[]>;
}
export interface OrderFulfillPageProps {
  disabled: boolean;
  errors: FulfillOrder_orderFulfill_errors[];
  order: OrderFulfillData_order;
  saveButtonBar: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  onBack: () => void;
  onSubmit: (data: OrderFulfillSubmitData) => void;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true
};

function getRemainingQuantity(line: OrderFulfillData_order_lines): number {
  return line.quantity - line.quantityFulfilled;
}

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = props => {
  const {
    disabled,
    errors,
    order,
    saveButtonBar,
    warehouses,
    onBack,
    onSubmit
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const { change: formsetChange, data: formsetData } = useFormset<
    null,
    OrderFulfillStockInput[]
  >(
    order?.lines
      .filter(line => getRemainingQuantity(line) > 0)
      .map(line => ({
        data: null,
        id: line.id,
        label: line.variant.attributes
          .map(attribute =>
            attribute.values
              .map(attributeValue => attributeValue.name)
              .join(" , ")
          )
          .join(" / "),
        value: line.variant.stocks.map(stock => ({
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

  return (
    <Container>
      <AppHeader onBack={onBack}>
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
      </AppHeader>
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
        {({ change, data, submit }) => (
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
                      <FormattedMessage
                        defaultMessage="Quantity to fulfill"
                        description="quantity of fulfilled products"
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderCollection(
                    order?.lines.filter(line => getRemainingQuantity(line) > 0),
                    (line, lineIndex) => {
                      if (!line) {
                        return (
                          <TableRow>
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

                      const remainingQuantity = getRemainingQuantity(line);
                      const quantityToFulfill = formsetData[
                        lineIndex
                      ].value.reduce(
                        (quantityToFulfill, lineInput) =>
                          quantityToFulfill + (lineInput.quantity || 0),
                        0
                      );
                      const overfulfill = remainingQuantity < quantityToFulfill;

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
                          {warehouses?.map(warehouse => {
                            const warehouseStock = line.variant.stocks.find(
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

                            const availableQuantity =
                              warehouseStock.quantity -
                              warehouseStock.quantityAllocated;

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
                                    max:
                                      line.variant.trackInventory &&
                                      warehouseStock.quantity,
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
                                  error={
                                    overfulfill ||
                                    (line.variant.trackInventory &&
                                      formsetStock.quantity >
                                        availableQuantity) ||
                                    !!errors?.find(
                                      err =>
                                        err.warehouse === warehouse.id &&
                                        err.orderLine === line.id &&
                                        err.code ===
                                          OrderErrorCode.INSUFFICIENT_STOCK
                                    )
                                  }
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
                          <TableCell className={classes.colQuantityTotal}>
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
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </ResponsiveTable>
              <CardActions className={classes.actionBar}>
                <ControlledCheckbox
                  checked={data.sendInfo}
                  label={intl.formatMessage({
                    defaultMessage: "Send shipment details to customer",
                    description: "checkbox"
                  })}
                  name="sendInfo"
                  onChange={change}
                />
              </CardActions>
            </Card>
            <SaveButtonBar
              disabled={disabled}
              labels={{
                save: intl.formatMessage({
                  defaultMessage: "Fulfill",
                  description: "fulfill order, button"
                })
              }}
              state={saveButtonBar}
              onSave={submit}
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
