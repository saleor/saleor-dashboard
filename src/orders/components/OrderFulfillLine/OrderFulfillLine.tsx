// @ts-strict-ignore
import { QuantityInput } from "@dashboard/components/QuantityInput";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type OrderFulfillLineFragment } from "@dashboard/graphql";
import { type FormsetChange, type FormsetData } from "@dashboard/hooks/useFormset";
import {
  getAttributesCaption,
  getOrderLineAvailableQuantity,
  getWarehouseStock,
  type OrderFulfillLineFormData,
} from "@dashboard/orders/utils/data";
import { TableCell } from "@material-ui/core";
import { WarningIcon } from "@saleor/macaw-ui";
import { Box, Input, Skeleton, Tooltip } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import styles from "./OrderFulfillLine.module.css";
import { OrderFulfillProductCellContent } from "./OrderFulfillProductCellContent";
import { useStyles } from "./styles";

interface OrderFulfillLineProps {
  line: OrderFulfillLineFragment;
  lineIndex: number;
  formsetData: FormsetData<null, OrderFulfillLineFormData[]>;
  formsetChange: FormsetChange<OrderFulfillLineFormData[]>;
  onWarehouseChange: () => void;
}

const OrderFulfillLine = (props: OrderFulfillLineProps) => {
  const { line, lineIndex, formsetData, formsetChange, onWarehouseChange } = props;
  const classes = useStyles();
  const intl = useIntl();
  const isDeletedVariant = !line?.variant;
  const isPreorder = !!line.variant?.preorder;
  const lineFormQuantity = isPreorder ? 0 : formsetData[lineIndex]?.value?.[0]?.quantity;
  const lineFormWarehouse = formsetData[lineIndex]?.value?.[0]?.warehouse;
  const isFulfillingLine = (lineFormQuantity ?? 0) > 0;
  const overfulfill = lineFormQuantity > line.quantityToFulfill;
  const warehouseStock = getWarehouseStock(line?.variant?.stocks, lineFormWarehouse?.id);
  const availableQuantity = getOrderLineAvailableQuantity(line, warehouseStock);

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
        <TableCell className={clsx(classes.colWarehouse, styles.warehouseCell)}>
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
        <OrderFulfillProductCellContent
          productName={line.productName}
          attributesCaption={getAttributesCaption(line.variant?.attributes)}
        />
      </TableCellAvatar>
      <TableCell className={classes.colSku}>{line.variant?.sku}</TableCell>
      {isPreorder ? (
        <TableCell className={classes.colQuantity} />
      ) : (
        <TableCell
          className={classes.colQuantity}
          key={warehouseStock?.id ?? "deletedVariant" + lineIndex}
        >
          <QuantityInput
            value={lineFormQuantity ?? 0}
            max={line.quantityToFulfill}
            isError={overfulfill}
            onChange={event => {
              const quantity = parseInt(event.target.value, 10);

              formsetChange(line.id, [
                {
                  quantity: Number.isNaN(quantity) ? 0 : quantity,
                  warehouse: lineFormWarehouse,
                },
              ]);
            }}
          />
        </TableCell>
      )}
      <TableCell className={classes.colStock} key="total">
        {lineFormWarehouse ? (isPreorder || isDeletedVariant ? undefined : availableQuantity) : "-"}
      </TableCell>
      <TableCell className={clsx(classes.colWarehouse, styles.warehouseCell)}>
        {isPreorder ? (
          "-"
        ) : (
          <Box
            role="button"
            tabIndex={isFulfillingLine ? 0 : -1}
            aria-disabled={!isFulfillingLine}
            onClick={isFulfillingLine ? onWarehouseChange : undefined}
            onKeyDown={event => {
              if (!isFulfillingLine) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onWarehouseChange();
              }
            }}
            className={isFulfillingLine ? styles.warehouseInput : styles.warehouseInputDisabled}
            padding={2}
            width="100%"
          >
            <Input
              readOnly
              disabled={!isFulfillingLine}
              size="small"
              width="100%"
              aria-label={intl.formatMessage(messages.warehouse)}
              placeholder={intl.formatMessage(messages.selectWarehouse)}
              value={lineFormWarehouse?.name}
              endAdornment={<ChevronDown size={16} />}
              data-test-id="select-warehouse-button"
            />
          </Box>
        )}
      </TableCell>
    </TableRowLink>
  );
};

OrderFulfillLine.displayName = "OrderFulfillLine";
export default OrderFulfillLine;
