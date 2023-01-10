import { TableCell, Typography } from "@material-ui/core";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableRowLink from "@saleor/components/TableRowLink";
import {
  OrderErrorFragment,
  OrderLineFragment,
  OrderLineInput,
} from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { OrderLineDiscountContextConsumerProps } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import clsx from "clsx";
import React, { useRef } from "react";

import { maybe } from "../../../misc";
import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";
import TableLineAlert from "./TableLineAlert";
import TableLineForm from "./TableLineForm";
import useLineAlerts from "./useLineAlerts";

const useStyles = makeStyles(
  theme => ({
    colStatusEmpty: {
      "&:first-child:not(.MuiTableCell-paddingCheckbox)": {
        paddingRight: 0,
      },
    },
    colAction: {
      width: `calc(76px + ${theme.spacing(0.5)})`,
    },
    colName: {
      width: "auto",
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN,
    },
    colPrice: {
      textAlign: "right",
    },
    colQuantity: {
      textAlign: "right",
    },
    colTotal: {
      textAlign: "right",
    },
    strike: {
      textDecoration: "line-through",
      color: theme.palette.grey[400],
    },
  }),
  { name: "OrderDraftDetailsProducts" },
);

interface TableLineProps extends OrderLineDiscountContextConsumerProps {
  line: OrderLineFragment;
  error?: OrderErrorFragment;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
}

const TableLine: React.FC<TableLineProps> = ({
  line,
  error,
  onOrderLineChange,
  onOrderLineRemove,
  orderLineDiscount,
  addOrderLineDiscount,
  removeOrderLineDiscount,
  openDialog,
  closeDialog,
  orderLineDiscountRemoveStatus,
  isDialogOpen,
  totalDiscountedPrice,
  unitUndiscountedPrice,
  unitDiscountedPrice,
  orderLineDiscountUpdateStatus,
}) => {
  const classes = useStyles();
  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);
  const { id, thumbnail, productName, productSku } = line;

  const alerts = useLineAlerts({
    line,
    error,
  });

  const getUnitPriceLabel = () => {
    const money = <Money money={unitUndiscountedPrice} />;

    if (!!orderLineDiscount) {
      return (
        <>
          <Typography className={classes.strike}>{money}</Typography>
          <Link onClick={openDialog}>
            <Money money={unitDiscountedPrice} />
          </Link>
        </>
      );
    }

    return <Link onClick={openDialog}>{money}</Link>;
  };

  return (
    <TableRowLink key={id}>
      <TableCell
        className={clsx({
          [classes.colStatusEmpty]: !alerts.length,
        })}
      >
        {!!alerts.length && (
          <TableLineAlert
            alerts={alerts}
            variant={!!error ? "error" : "warning"}
          />
        )}
      </TableCell>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={maybe(() => thumbnail.url)}
      >
        <Typography variant="body2">{productName}</Typography>
        <Typography variant="caption">{productSku}</Typography>
      </TableCellAvatar>
      <TableCell className={classes.colQuantity}>
        <TableLineForm line={line} onOrderLineChange={onOrderLineChange} />
      </TableCell>
      <TableCell className={classes.colPrice} ref={popperAnchorRef}>
        {getUnitPriceLabel()}
        <OrderDiscountCommonModal
          isOpen={isDialogOpen}
          anchorRef={popperAnchorRef}
          onClose={closeDialog}
          modalType={ORDER_LINE_DISCOUNT}
          maxPrice={unitUndiscountedPrice}
          onConfirm={addOrderLineDiscount}
          onRemove={removeOrderLineDiscount}
          existingDiscount={orderLineDiscount}
          confirmStatus={orderLineDiscountUpdateStatus}
          removeStatus={orderLineDiscountRemoveStatus}
          dialogPlacement="bottom-end"
        />
      </TableCell>
      <TableCell className={classes.colTotal}>
        <Money
          money={{
            amount: totalDiscountedPrice.amount,
            currency: totalDiscountedPrice.currency,
          }}
          data-test-id={`table-line-total-${line.id}`}
        />
      </TableCell>
      <TableCell className={classes.colAction}>
        <IconButton variant="secondary" onClick={() => onOrderLineRemove(id)}>
          <DeleteIcon color="primary" />
        </IconButton>
      </TableCell>
    </TableRowLink>
  );
};

export default TableLine;
