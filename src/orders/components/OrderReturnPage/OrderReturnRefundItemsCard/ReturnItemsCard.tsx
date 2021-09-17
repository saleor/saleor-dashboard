import {
  Card,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import Money from "@saleor/components/Money";
import QuantityField from "@saleor/components/QuantityField";
import Skeleton from "@saleor/components/Skeleton";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormsetChange } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  OrderDetails_order,
  OrderDetails_order_lines
} from "@saleor/orders/types/OrderDetails";
import { isGiftCardProduct } from "@saleor/orders/utils/data";
import React, { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductImageCell from "../../ProductImageCell";
import { FormsetQuantityData, FormsetReplacementData } from "../form";
import { messages as refundMessages } from "../messages";
import { getById } from "../utils";
import CardTitle from "./CardTitle";
import MaximalButton from "./MaximalButton";
import ProductErrorCell from "./ProductErrorCell";

const useStyles = makeStyles(
  theme => {
    const inputPadding: CSSProperties = {
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2)
    };

    return {
      cartContent: {
        paddingBottom: 0,
        paddingTop: 0
      },

      notice: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2)
      },

      colQuantity: {
        width: 210
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
      quantityInnerInputDisabled: {
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[500]
      },
      setMaximalQuantityButton: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        padding: 0
      }
    };
  },
  { name: "ItemsCard" }
);

interface OrderReturnRefundLinesCardProps {
  onChangeQuantity: FormsetChange<number>;
  fulfilmentId?: string;
  canReplace?: boolean;
  errors: OrderErrorFragment[];
  lines: OrderDetails_order_lines[];
  order: OrderDetails_order;
  itemsSelections: FormsetReplacementData;
  itemsQuantities: FormsetQuantityData;
  onChangeSelected: FormsetChange<boolean>;
  onSetMaxQuantity();
}

const ItemsCard: React.FC<OrderReturnRefundLinesCardProps> = ({
  lines,
  onSetMaxQuantity,
  onChangeQuantity,
  onChangeSelected,
  itemsSelections,
  itemsQuantities,
  fulfilmentId,
  order
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const handleChangeQuantity = (id: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => onChangeQuantity(id, parseInt(event.target.value, 10));

  const fulfillment = order?.fulfillments.find(getById(fulfilmentId));

  return (
    <Card>
      <CardTitle
        orderNumber={order?.number}
        lines={lines}
        fulfillmentOrder={fulfillment?.fulfillmentOrder}
        status={fulfillment?.status}
      />
      <CardContent className={classes.cartContent}>
        <MaximalButton onClick={onSetMaxQuantity} />
      </CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage
                defaultMessage="Product"
                description="table column header"
              />
            </TableCell>
            <TableCell />
            <TableCell align="right">
              <FormattedMessage
                defaultMessage="Price"
                description="table column header"
              />
            </TableCell>
            <TableCell align="right">
              <FormattedMessage
                defaultMessage="Return"
                description="table column header"
              />
            </TableCell>
            <TableCell align="center">
              <FormattedMessage
                defaultMessage="Replace"
                description="table column header"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            lines,
            line => {
              const {
                quantity,
                quantityToFulfill,
                id,
                thumbnail,
                unitPrice,
                productName,
                variant
              } = line;
              const isValueError = false;
              const isRefunded = itemsQuantities.find(getById(id)).data
                .isRefunded;
              const isReplacable = !!variant && !isRefunded;
              const isReturnable = !!variant;
              const lineQuantity = fulfilmentId ? quantity : quantityToFulfill;
              const isSelected = itemsSelections.find(getById(id))?.value;
              const currentQuantity = itemsQuantities.find(getById(id))?.value;
              const isNotAllowed = isGiftCardProduct(variant);

              return (
                <TableRow key={id}>
                  <ProductImageCell
                    productName={productName}
                    productThumbnail={thumbnail?.url}
                    notAllowed={isNotAllowed}
                    notAllowedAlert={intl.formatMessage(
                      refundMessages.giftCardReturnOrReplaceNotAllowed
                    )}
                  />
                  <ProductErrorCell hasVariant={isReturnable} />
                  <TableCell align="right">
                    <Money
                      money={{
                        amount: unitPrice.gross.amount,
                        currency: unitPrice.gross.currency
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" className={classes.colQuantity}>
                    {isReturnable && (
                      <QuantityField
                        disabled={isNotAllowed}
                        onChange={handleChangeQuantity(id)}
                        value={currentQuantity}
                        error={isValueError}
                        max={lineQuantity}
                        inputProps={{
                          "data-test": "quantityInput",
                          "data-test-id": id
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isReplacable && (
                      <Checkbox
                        checked={isSelected}
                        disabled={isNotAllowed}
                        onChange={() => onChangeSelected(id, !isSelected)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ItemsCard;
