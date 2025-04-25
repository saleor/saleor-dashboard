import { GridTable } from "@dashboard/components/GridTable";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import React from "react";
import { Control, FieldArrayWithId, UseFieldArrayUpdate } from "react-hook-form";

import { LineToRefund, OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { RefundQuantityChange, validateQty } from "../../utils";
import { RefundTableInputCell } from "./RefundTableInputCell";
import { RefundTablePriceCell } from "./RefundTablePriceCell";
import { RefundTableProductCell } from "./RefundTableProductCell";
import { RefundTableReasonCell } from "./RefundTableReasonCell";

interface OrderTransactionRefundTableLineProps {
  control: Control<OrderTransactionRefundPageFormData, any>;
  field: FieldArrayWithId<OrderTransactionRefundPageFormData, "linesToRefund", "id">;
  index: number;
  line: OrderDetailsGrantRefundFragment["lines"][number];
  order: OrderDetailsGrantRefundFragment | undefined | null;
  draftRefund?: OrderDetailsGrantRefundFragment["grantedRefunds"][0];
  qtyToRefund: LineToRefund["quantity"];
  maxQtyToRefund: number;
  onEditReasonModal: React.Dispatch<React.SetStateAction<number | null>>;
  refundFieldsUpdate: UseFieldArrayUpdate<OrderTransactionRefundPageFormData, "linesToRefund">;
  onChange: (data: RefundQuantityChange, index: number) => void;
}

export const OrderTransactionRefundTableLine: React.FC<OrderTransactionRefundTableLineProps> = ({
  control,
  field,
  index,
  line,
  order,
  draftRefund,
  qtyToRefund,
  maxQtyToRefund,
  onEditReasonModal,
  refundFieldsUpdate,
  onChange,
}) => {
  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      {
        value: event.target.value,
        row: index,
      },
      index,
    );
  };
  const handleInputOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) =>
    refundFieldsUpdate(index, {
      reason: field.reason,
      quantity: validateQty({
        order,
        draftRefund,
        update: { row: index, value: event.target.value },
      }),
    });

  const handleMaxRefund = () =>
    refundFieldsUpdate(index, {
      reason: field.reason,
      quantity: maxQtyToRefund,
    });

  return (
    <GridTable.Row key={field.id}>
      <RefundTableProductCell line={line} />
      <RefundTablePriceCell line={line} maxQtyToRefund={maxQtyToRefund} />
      <RefundTableInputCell
        control={control}
        index={index}
        qtyToRefund={qtyToRefund}
        maxQtyToRefund={maxQtyToRefund}
        handleInputOnBlur={handleInputOnBlur}
        handleInputOnChange={handleInputOnChange}
        handleMaxRefund={handleMaxRefund}
      />
      <RefundTableReasonCell field={field} index={index} onEditReasonModal={onEditReasonModal} />
    </GridTable.Row>
  );
};
