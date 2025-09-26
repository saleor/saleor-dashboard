// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { QuantityInput } from "@dashboard/components/QuantityInput";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderRefundDataQuery } from "@dashboard/graphql";
import { FormsetChange } from "@dashboard/hooks/useFormset";
import { renderCollection } from "@dashboard/misc";
import { Table, TableBody, TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderRefundFormData } from "../OrderRefundPage/form";

const useStyles = makeStyles(
  () => ({
    colQuantity: {
      textAlign: "right",
      width: 210,
    },
    colProduct: {
      width: 400,
    },
    colTotal: {
      textAlign: "right",
      width: 210,
    },
  }),
  { name: "OrderRefundUnfulfilledProducts" },
);

interface OrderRefundUnfulfilledProductsProps {
  unfulfilledLines: OrderRefundDataQuery["order"]["lines"];
  data: OrderRefundFormData;
  disabled: boolean;
  onRefundedProductQuantityChange: FormsetChange<string>;
  onSetMaximalQuantities: () => void;
}

const OrderRefundUnfulfilledProducts = (props: OrderRefundUnfulfilledProductsProps) => {
  const {
    unfulfilledLines,
    data,
    disabled,
    onRefundedProductQuantityChange,
    onSetMaximalQuantities,
  } = props;
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "B/y6LC",
            defaultMessage: "Unfulfilled Products",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content paddingY={0}>
        <Text fontWeight="medium" fontSize={3} color="default2" display="block">
          <FormattedMessage
            id="iUIn50"
            defaultMessage="Unfulfilled products will be restocked"
            description="section notice"
          />
        </Text>
        <Button
          onClick={onSetMaximalQuantities}
          data-test-id="set-maximal-quantity-unfulfilled-button"
          variant="secondary"
          marginTop={2}
          size="small"
        >
          <FormattedMessage
            id="2W4EBM"
            defaultMessage="Set maximal quantities"
            description="button"
          />
        </Button>
      </DashboardCard.Content>
      <Table>
        <TableHead>
          <TableRowLink>
            <TableCell>
              <FormattedMessage
                id="FNT4b+"
                defaultMessage="Product"
                description="tabel column header"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="5aiFbL"
                defaultMessage="Price"
                description="tabel column header"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                id="Tl+7X4"
                defaultMessage="Refunded Qty"
                description="tabel column header"
              />
            </TableCell>
            <TableCell className={classes.colTotal}>
              <FormattedMessage
                id="+PclgM"
                defaultMessage="Total"
                description="tabel column header"
              />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            unfulfilledLines,
            line => {
              const selectedLineQuantity = data.refundedProductQuantities.find(
                refundedLine => refundedLine.id === line.id,
              );
              const lineQuantity = line?.quantityToFulfill;
              const isError =
                Number(selectedLineQuantity?.value) > lineQuantity ||
                Number(selectedLineQuantity?.value) < 0;

              return (
                <TableRowLink key={line?.id}>
                  <TableCellAvatar thumbnail={line?.thumbnail?.url} className={classes.colProduct}>
                    {line?.productName ? line?.productName : <Skeleton />}
                  </TableCellAvatar>
                  <TableCell>
                    {line?.unitPrice ? <Money money={line?.unitPrice.gross} /> : <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {lineQuantity || lineQuantity === 0 ? (
                      <QuantityInput
                        data-test-id="product-quantity-input"
                        size="small"
                        value={Number(selectedLineQuantity?.value)}
                        min={0}
                        max={lineQuantity}
                        disabled={lineQuantity === 0 || disabled}
                        onChange={event =>
                          onRefundedProductQuantityChange(line.id, event.target.value)
                        }
                        error={isError}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colTotal}>
                    {(line?.unitPrice.gross && (
                      <Money
                        money={{
                          ...line.unitPrice.gross,
                          amount:
                            (line.unitPrice.gross.amount ?? 0) *
                            Number(selectedLineQuantity?.value),
                        }}
                      />
                    )) || <Skeleton />}
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={4}>
                  <FormattedMessage id="Q1Uzbb" defaultMessage="No products found" />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </Table>
    </DashboardCard>
  );
};

OrderRefundUnfulfilledProducts.displayName = "OrderRefundUnfulfilledProducts";
export default OrderRefundUnfulfilledProducts;
