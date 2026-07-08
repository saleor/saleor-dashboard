// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { type FulfillmentFragment, type OrderFulfillLineFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import {
  getFulfillmentFormsetQuantity,
  getOrderFulfillStockFormsetLineId,
  getOrderLineAvailableQuantity,
  type OrderFulfillStockFormsetData,
} from "@dashboard/orders/utils/data";
import { TableBody, TableCell, TableHead } from "@material-ui/core";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderFulfillStockExceededDialogLine } from "../OrderFulfillStockExceededDialogLine/OrderFulfillStockExceededDialogLine";
import { stockExceededDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";

interface OrderFulfillStockExceededDialogProps {
  lines?: Array<FulfillmentFragment["lines"][0] | OrderFulfillLineFragment>;
  open: boolean;
  formsetData: OrderFulfillStockFormsetData;
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: () => void;
  onClose: () => void;
}

export const OrderFulfillStockExceededDialog = ({
  lines,
  open,
  formsetData,
  confirmButtonState,
  onClose,
  onSubmit,
}: OrderFulfillStockExceededDialogProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const exceededLines = useMemo(
    () =>
      (lines ?? []).filter(lineItem => {
        const line = "orderLine" in lineItem ? lineItem.orderLine : lineItem;
        const formsetLineId = getOrderFulfillStockFormsetLineId(lineItem);
        const lineFormWarehouse = formsetData?.find(item => item.id === formsetLineId)?.value?.[0]
          ?.warehouse;
        const stock = line.variant?.stocks.find(
          warehouseStock => warehouseStock.warehouse.id === lineFormWarehouse?.id,
        );

        return (
          getFulfillmentFormsetQuantity(formsetData, line) >
          getOrderLineAvailableQuantity(line, stock)
        );
      }),
    [formsetData, lines],
  );

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.Header
          subtitle={
            <FormattedMessage {...messages.infoLabel} values={{ count: exceededLines.length }} />
          }
        >
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <DashboardModal.Body fill>
          <ResponsiveTable bleed fillHeight className={classes.table}>
            {exceededLines.length > 0 && (
              <TableHead>
                <TableRowLink>
                  <TableCell className={classes.colName}>
                    {intl.formatMessage(messages.productLabel)}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {intl.formatMessage(messages.toFulfillLabel)}
                  </TableCell>
                  <TableCell className={classes.colWarehouseStock}>
                    {intl.formatMessage(messages.availableStockLabel)}
                  </TableCell>
                  <TableCell className={classes.colShort}>
                    {intl.formatMessage(messages.shortLabel)}
                  </TableCell>
                </TableRowLink>
              </TableHead>
            )}

            <TableBody>
              {renderCollection(exceededLines, line => {
                const formsetLineId = getOrderFulfillStockFormsetLineId(line);
                const lineFormWarehouse = formsetData?.find(item => item.id === formsetLineId)
                  ?.value?.[0]?.warehouse;

                return (
                  <OrderFulfillStockExceededDialogLine
                    key={line?.id}
                    line={line}
                    formsetData={formsetData}
                    warehouse={lineFormWarehouse}
                  />
                );
              })}
            </TableBody>
          </ResponsiveTable>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>
            <FormattedMessage {...messages.goBackButton} />
          </BackButton>
          <ConfirmButton
            data-test-id="submit"
            onClick={onSubmit}
            transitionState={confirmButtonState}
          >
            <FormattedMessage {...messages.fulfillButton} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderFulfillStockExceededDialog.displayName = "OrderFulfillStockExceededDialog";
