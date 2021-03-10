import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { OrderLineDiscountContextConsumerProps } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import React, { useRef } from "react";

import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";
import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";
import TableLineForm, { FormData } from "./TableLineForm";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 76 + theme.spacing(0.5)
    },
    colName: {
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colPrice: {
      textAlign: "right",
      width: 150
    },
    colQuantity: {
      textAlign: "right",
      width: 80
    },
    colTotal: {
      textAlign: "right",
      width: 150
    },
    strike: {
      textDecoration: "line-through",
      color: theme.palette.grey[400]
    },
    errorInfo: {
      color: theme.palette.error.main
    },
    quantityField: {
      "& input": {
        padding: "12px 12px 10px",
        textAlign: "right"
      },
      width: 60
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderDraftDetailsProducts" }
);

interface TableLineProps extends OrderLineDiscountContextConsumerProps {
  line: OrderDetails_order_lines;
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

const TableLine: React.FC<TableLineProps> = ({
  line,
  onOrderLineChange,
  onOrderLineRemove,
  orderLineDiscount,
  addOrderLineDiscount,
  removeOrderLineDiscount,
  openDialog,
  closeDialog,
  orderLineDiscountRemoveStatus,
  isDialogOpen,
  undiscountedPrice,
  discountedPrice,
  orderLineDiscountUpdateStatus
}) => {
  const classes = useStyles({});
  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);
  const { id, thumbnail, productName, productSku, quantity } = line;

  const getUnitPriceLabel = () => {
    const money = <Money money={undiscountedPrice} />;

    if (!!orderLineDiscount) {
      return (
        <>
          <Typography className={classes.strike}>{money}</Typography>
          <Link onClick={openDialog}>
            <Money money={discountedPrice} />
          </Link>
        </>
      );
    }

    return <Link onClick={openDialog}>{money}</Link>;
  };

  return (
    <TableRow key={id}>
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
          maxPrice={undiscountedPrice}
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
            amount: discountedPrice.amount * quantity,
            currency: discountedPrice.currency
          }}
        />
      </TableCell>
      <TableCell className={classes.colAction}>
        <IconButton onClick={() => onOrderLineRemove(id)}>
          <DeleteIcon color="primary" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default TableLine;
