import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { maybe } from "../../../misc";
import { OrderDetails_order } from "../../types/OrderDetails";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.body1,
      lineHeight: 1.9,
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "OrderDraftDetailsSummary" }
);

interface OrderDraftDetailsSummaryProps {
  order: OrderDetails_order;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetailsSummary: React.FC<
  OrderDraftDetailsSummaryProps
> = props => {
  const { order, onShippingMethodEdit } = props;

  const classes = useStyles(props);

  return (
    <table className={classes.root}>
      <tbody>
        <tr>
          {maybe(() => order.subtotal) ? (
            <>
              <td>
                <FormattedMessage
                  defaultMessage="Subtotal"
                  description="subtotal price or an order"
                />
              </td>
              <td className={classes.textRight}>
                <Money money={order.subtotal.gross} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {order &&
          order.shippingMethod !== undefined &&
          order.shippingMethodName !== undefined ? (
            order.shippingMethod === null ? (
              order.availableShippingMethods &&
              order.availableShippingMethods.length > 0 ? (
                <td>
                  <Link onClick={onShippingMethodEdit}>
                    <FormattedMessage
                      defaultMessage="Add shipping carrier"
                      description="button"
                    />
                  </Link>
                </td>
              ) : (
                <td>
                  <FormattedMessage defaultMessage="No applicable shipping carriers" />
                </td>
              )
            ) : (
              <>
                <td>
                  <Link onClick={onShippingMethodEdit}>
                    {order.shippingMethodName}
                  </Link>
                </td>
                <td className={classes.textRight}>
                  {maybe(() => order.shippingPrice) ? (
                    <Money money={order.shippingPrice.gross} />
                  ) : (
                    "---"
                  )}
                </td>
              </>
            )
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {maybe(() => order.total.tax) !== undefined ? (
            <>
              <td>
                <FormattedMessage defaultMessage="Taxes (VAT included)" />
              </td>
              <td className={classes.textRight}>
                <Money money={order.total.tax} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
        <tr>
          {maybe(() => order.total.gross) !== undefined ? (
            <>
              <td>
                <FormattedMessage
                  defaultMessage="Total"
                  description="total price of an order"
                />
              </td>
              <td className={classes.textRight}>
                <Money money={order.total.gross} />
              </td>
            </>
          ) : (
            <td colSpan={2}>
              <Skeleton />
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};
OrderDraftDetailsSummary.displayName = "OrderDraftDetailsSummary";
export default OrderDraftDetailsSummary;
