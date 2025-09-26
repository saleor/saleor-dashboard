import { GridTable } from "@dashboard/components/GridTable";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import * as React from "react";
import { Control, FieldArrayWithId, UseFieldArrayUpdate } from "react-hook-form";

import { LineToRefund, OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { getMaxQtyToRefund, RefundQuantityChange } from "../../utils";
import { OrderTransactionRefundTableLine } from "./OrderTransactionRefundTableLine";

interface OrderTransactionRefundTableProps {
  errors?: OrderRefundTransactionDatagridError[];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund?: OrderDetailsGrantRefundFragment["grantedRefunds"][0];
  control: Control<OrderTransactionRefundPageFormData, any>;
  onChange: (data: RefundQuantityChange, index: number) => void;
  onEditReasonModal: React.Dispatch<React.SetStateAction<number | null>>;
  linesToRefund: LineToRefund[];
  refundFields: FieldArrayWithId<OrderTransactionRefundPageFormData, "linesToRefund", "id">[];
  refundFieldsUpdate: UseFieldArrayUpdate<OrderTransactionRefundPageFormData, "linesToRefund">;
}

export interface OrderRefundTransactionDatagridError {
  field: string;
  lineId: string;
}

export const OrderTransactionRefundTable = ({
  order,
  draftRefund,
  control,
  onChange,
  onEditReasonModal,
  linesToRefund,
  refundFields,
  refundFieldsUpdate,
}: OrderTransactionRefundTableProps) => {
  return (
    <GridTable height="100%" paddingX={6}>
      <GridTable.Colgroup>
        <GridTable.Col __width="45%" />
        <GridTable.Col __width="20%" />
        <GridTable.Col __width="25%" />
        <GridTable.Col __width="10%" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {refundFields?.map((field, index) => {
          const line = order?.lines[index];

          if (!line) {
            return;
          }

          const maxQtyToRefund = getMaxQtyToRefund({
            rowData: { id: line.id, quantity: line.quantity },
            order,
            draftRefund,
          });

          return (
            <OrderTransactionRefundTableLine
              key={field.id}
              control={control}
              field={field}
              index={index}
              line={line}
              order={order}
              draftRefund={draftRefund}
              qtyToRefund={linesToRefund[index].quantity}
              maxQtyToRefund={maxQtyToRefund}
              onChange={onChange}
              refundFieldsUpdate={refundFieldsUpdate}
              onEditReasonModal={onEditReasonModal}
            />
          );
        })}
      </GridTable.Body>
    </GridTable>
  );
};
