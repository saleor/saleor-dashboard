import { GridTable } from "@dashboard/components/GridTable";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FieldArrayWithId } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { refundTableMessages } from "./messages";

interface RefundTableReasonCellProps {
  index: number;
  onEditReasonModal: (index: number) => void;
  field: FieldArrayWithId<OrderTransactionRefundPageFormData, "linesToRefund", "id">;
}

export const RefundTableReasonCell: React.FC<RefundTableReasonCellProps> = ({
  index,
  field,
  onEditReasonModal,
}) => {
  return (
    <GridTable.Cell>
      <Button
        variant="secondary"
        whiteSpace="nowrap"
        onClick={() => onEditReasonModal(index)}
        disabled={!field.quantity}
      >
        {!field.reason ? (
          <FormattedMessage {...refundTableMessages.addReason} />
        ) : (
          <FormattedMessage {...refundTableMessages.editReason} />
        )}
      </Button>
    </GridTable.Cell>
  );
};
