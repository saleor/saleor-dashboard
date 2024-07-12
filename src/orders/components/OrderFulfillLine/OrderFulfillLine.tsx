// @ts-strict-ignore
import Skeleton from "@dashboard/components/Skeleton";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderFulfillLineFragment } from "@dashboard/graphql";
import { FormsetChange, FormsetData } from "@dashboard/hooks/useFormset";
import {
  getAttributesCaption,
  getOrderLineAvailableQuantity,
  getWarehouseStock,
  OrderFulfillLineFormData,
} from "@dashboard/orders/utils/data";
import { TableCell, TextField } from "@material-ui/core";
import { ChevronIcon, IconButton, WarningIcon } from "@saleor/macaw-ui";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

interface OrderFulfillLineProps {
  line: OrderFulfillLineFragment;
  lineIndex: number;
  formsetData: FormsetData<null, OrderFulfillLineFormData[]>;
  formsetChange: FormsetChange<OrderFulfillLineFormData[]>;
  onWarehouseChange: () => void;
}

export const OrderFulfillLine: React.FC<OrderFulfillLineProps> = props => {
  const { line, lineIndex, formsetData, formsetChange, onWarehouseChange } = props;
  const classes = useStyles();
  const intl = useIntl();
  const isDeletedVariant = !line?.variant;
  const isPreorder = !!line.variant?.preorder;
  const lineFormQuantity = isPreorder ? 0 : formsetData[lineIndex]?.value?.[0]?.quantity;
  const lineFormWarehouse = formsetData[lineIndex]?.value?.[0]?.warehouse;
  const overfulfill = lineFormQuantity > line.quantityToFulfill;
  const warehouseStock = getWarehouseStock(line?.variant?.stocks, lineFormWarehouse?.id);
  const availableQuantity = getOrderLineAvailableQuantity(line, warehouseStock);
  const isStockExceeded = lineFormQuantity > availableQuantity;

  if (!line) {
    return (
      <TableRowLink key={lineIndex}>
        <TableCellAvatar className={classes.colName}>
          <Skeleton />
        </TableCellAvatar>
        <TableCell className={classes.colSku}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colQuantity}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colStock}>
          <Skeleton />
        </TableCell>
        <TableCell className={classes.colWarehouse}>
          <Skeleton />
        </TableCell>
      </TableRowLink>
    );
  }

  return (
    <TableRowLink key={line.id}>
      <TableCellAvatar
        className={classes.colName}
        thumbnail={line?.thumbnail?.url}
        badge={
          isPreorder || !line?.variant ? (
            <Tooltip>
              <Tooltip.Trigger>
                <div className={classes.warningIcon}>
                  <WarningIcon />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow />
                <Box __maxWidth={350}>
                  {intl.formatMessage(
                    isPreorder ? messages.preorderWarning : messages.deletedVariantWarning,
                  )}
                </Box>
              </Tooltip.Content>
            </Tooltip>
          ) : undefined
        }
      >
        {line.productName}
        <Text color="default2" size={2} fontWeight="light">
          {getAttributesCaption(line.variant?.attributes)}
        </Text>
      </TableCellAvatar>
      <TableCell className={classes.colSku}>{line.variant?.sku}</TableCell>
      {isPreorder ? (
        <TableCell className={classes.colQuantity} />
      ) : (
        <TableCell
          className={classes.colQuantity}
          key={warehouseStock?.id ?? "deletedVariant" + lineIndex}
        >
          <TextField
            type="number"
            inputProps={{
              className: clsx(classes.quantityInnerInput, {
                [classes.quantityInnerInputNoRemaining]: !line.variant?.trackInventory,
              }),
              min: 0,
              style: { textAlign: "right" },
            }}
            fullWidth
            value={lineFormQuantity}
            onChange={event =>
              formsetChange(line.id, [
                {
                  quantity: parseInt(event.target.value, 10),
                  warehouse: lineFormWarehouse,
                },
              ])
            }
            error={overfulfill}
            variant="outlined"
            InputProps={{
              classes: {
                ...(isStockExceeded &&
                  !overfulfill && {
                    notchedOutline: classes.warning,
                  }),
              },
              endAdornment: (
                <div className={classes.remainingQuantity}>/ {line.quantityToFulfill}</div>
              ),
            }}
          />
        </TableCell>
      )}
      <TableCell className={classes.colStock} key="total">
        {lineFormWarehouse ? (isPreorder || isDeletedVariant ? undefined : availableQuantity) : "-"}
      </TableCell>
      <TableCell className={classes.colWarehouse}>
        {isPreorder ? (
          "-"
        ) : (
          <IconButton
            onClick={onWarehouseChange}
            className={clsx(
              classes.warehouseButton,
              "MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiOutlinedInput-adornedEnd",
            )}
            data-test-id="select-warehouse-button"
          >
            <div className={classes.warehouseButtonContent}>
              <Text className={classes.warehouseButtonContentText}>
                {lineFormWarehouse?.name ?? intl.formatMessage(messages.selectWarehouse)}
              </Text>
              <ChevronIcon />
            </div>
          </IconButton>
        )}
      </TableCell>
    </TableRowLink>
  );
};
OrderFulfillLine.displayName = "OrderFulfillLine";
export default OrderFulfillLine;
