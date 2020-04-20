import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import classNames from "classnames";

import useFormset, { FormsetData } from "@saleor/hooks/useFormset";
import { StockInput } from "@saleor/types/globalTypes";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { OrderFulfillData_order } from "@saleor/orders/types/OrderFulfillData";
import CardTitle from "@saleor/components/CardTitle";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    colName: {
      width: 300
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colQuantity: {
      textAlign: "right",
      width: 200
    },
    colQuantityContent: {
      alignItems: "center",
      display: "inline-flex"
    },
    colQuantityTotal: {
      textAlign: "right",
      width: 180
    },
    colSku: {
      textAlign: "right",
      width: 120
    },
    error: {
      color: theme.palette.error.main
    },
    quantityInput: {
      width: "4rem"
    },
    remainingQuantity: {
      marginLeft: theme.spacing(),
      paddingTop: 14
    },
    table: {
      "&&": {
        tableLayout: "fixed"
      }
    }
  }),
  { name: "OrderFulfillPage" }
);

interface OrderFulfillFormData {
  sendInfo: boolean;
}
interface OrderFulfillSubmitData extends OrderFulfillFormData {
  items: FormsetData<null, StockInput[]>;
}
export interface OrderFulfillPageProps {
  disabled: boolean;
  order: OrderFulfillData_order;
  saveButtonBar: ConfirmButtonTransitionState;
  warehouses: WarehouseFragment[];
  onBack: () => undefined;
  onSubmit: (data: OrderFulfillSubmitData) => void;
}

const initialFormData: OrderFulfillFormData = {
  sendInfo: true
};

const OrderFulfillPage: React.FC<OrderFulfillPageProps> = ({
  disabled,
  order,
  saveButtonBar,
  warehouses,
  onBack,
  onSubmit
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const { change, data: formsetData } = useFormset<null, StockInput[]>(
    order?.lines.map(line => ({
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
                      <span className={classes.colNameLabel}>
                        <FormattedMessage defaultMessage="Product name" />
                      </span>
                    </TableCell>
                    <TableCell className={classes.colSku}>
                      <FormattedMessage
                        defaultMessage="SKU"
                        description="product's sku"
                      />
                    </TableCell>
                    {warehouses.map(warehouse => (
                      <TableCell
                        key={warehouse.id}
                        className={classes.colQuantity}
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
                  {order?.lines.map((line, lineIndex) => {
                    const remainingQuantity =
                      line.quantity - line.quantityFulfilled;

                    return (
                      <TableRow key={line.id}>
                        <TableCellAvatar
                          className={classes.colName}
                          thumbnail={line?.thumbnail?.url}
                        >
                          {line.productName}
                        </TableCellAvatar>
                        <TableCell className={classes.colSku}>
                          {line.variant.sku}
                        </TableCell>
                        {warehouses.map(warehouse => {
                          const warehouseStock = line.variant.stocks.find(
                            stock => stock.warehouse.id === warehouse.id
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

                          return (
                            <TableCell className={classes.colQuantity}>
                              <div className={classes.colQuantityContent}>
                                <TextField
                                  type="number"
                                  inputProps={{
                                    max: warehouseStock.quantity,
                                    style: { textAlign: "right" }
                                  }}
                                  className={classes.quantityInput}
                                  value={
                                    formsetData[lineIndex].value[0].quantity
                                  }
                                  onChange={event => undefined}
                                  error={
                                    remainingQuantity <
                                      formsetData[lineIndex].value[0]
                                        .quantity ||
                                    formsetData[lineIndex].value[0].quantity >
                                      warehouseStock.quantity
                                  }
                                />
                                <div className={classes.remainingQuantity}>
                                  / {warehouseStock.quantity}
                                </div>
                              </div>
                            </TableCell>
                          );
                        })}
                        <TableCell className={classes.colQuantityTotal}>
                          {formsetData[lineIndex].value.reduce(
                            (acc, stock) => acc + stock.quantity,
                            0
                          )}{" "}
                          / {remainingQuantity}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </ResponsiveTable>
            </Card>
            <SaveButtonBar
              disabled={disabled}
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
