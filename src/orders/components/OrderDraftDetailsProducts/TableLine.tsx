import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { DebounceForm } from "@saleor/components/DebounceForm";
import Form from "@saleor/components/Form";
import Link from "@saleor/components/Link";
import Money from "@saleor/components/Money";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { OrderLineDiscountProviderValues } from "@saleor/products/components/OrderLineDiscountProvider/OrderLineDiscountProvider";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React, { useRef } from "react";

import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";
import OrderDiscountCommonModal from "../OrderDiscountCommonModal";
import { ORDER_LINE_DISCOUNT } from "../OrderDiscountCommonModal/types";

export interface FormData {
  quantity: number;
}

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

interface TableLineProps extends OrderLineDiscountProviderValues {
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
  shouldUseGross,
  openDialog,
  closeDialog,
  orderLineDiscountRemoveStatus,
  isDialogOpen,
  orderLineDiscountUpdateStatus
}) => {
  const classes = useStyles({});
  const popperAnchorRef = useRef<HTMLTableRowElement | null>(null);
  const {
    id,
    thumbnail,
    productName,
    productSku,
    quantity,
    unitPrice,
    undiscountedUnitPrice
  } = line;

  const discountMaxAmount = shouldUseGross
    ? undiscountedUnitPrice.gross
    : undiscountedUnitPrice.net;

  const getUnitPriceLabel = () => {
    const money = <Money money={discountMaxAmount} />;

    if (!!orderLineDiscount) {
      return (
        <>
          <Typography className={classes.strike}>{money}</Typography>
          <Link onClick={openDialog}>
            <Money money={orderLineDiscount.moneyValue} />
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
        <Form
          initial={{ quantity }}
          onSubmit={data => onOrderLineChange(id, data)}
        >
          {({ change, data, hasChanged, submit }) => {
            const handleQuantityChange = createNonNegativeValueChangeHandler(
              change
            );

            return (
              <DebounceForm
                change={handleQuantityChange}
                submit={hasChanged ? submit : undefined}
                time={200}
              >
                {debounce => (
                  <TextField
                    className={classes.quantityField}
                    fullWidth
                    name="quantity"
                    type="number"
                    value={data.quantity}
                    onChange={debounce}
                    onBlur={submit}
                    inputProps={{
                      min: 1
                    }}
                  />
                )}
              </DebounceForm>
            );
          }}
        </Form>
      </TableCell>
      <TableCell className={classes.colPrice} ref={popperAnchorRef}>
        {getUnitPriceLabel()}
        <OrderDiscountCommonModal
          isOpen={isDialogOpen}
          anchorRef={popperAnchorRef}
          onClose={closeDialog}
          currency={unitPrice.currency}
          modalType={ORDER_LINE_DISCOUNT}
          maxAmount={discountMaxAmount.amount}
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
            amount: unitPrice.net.amount * quantity,
            currency: unitPrice.net.currency
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
