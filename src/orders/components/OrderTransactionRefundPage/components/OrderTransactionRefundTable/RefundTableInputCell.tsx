import { GridTable } from "@dashboard/components/GridTable";
import { Box, Button, Input } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { refundTableMessages } from "./messages";

interface RefundTableInputCellProps {
  index: number;
  control: Control<OrderTransactionRefundPageFormData, any>;
  qtyToRefund: string | number;
  maxQtyToRefund: number;
  handleInputOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputOnBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  handleMaxRefund: () => void;
}

export const RefundTableInputCell: React.FC<RefundTableInputCellProps> = ({
  index,
  control,
  qtyToRefund,
  maxQtyToRefund,
  handleInputOnBlur,
  handleInputOnChange,
  handleMaxRefund,
}) => {
  return (
    <GridTable.Cell>
      <Box backgroundColor="default1" display="flex" gap={2}>
        <Controller
          control={control}
          name={`linesToRefund.${index}`}
          render={({ field: inputField }) => (
            <Input
              {...inputField}
              __minWidth="40px"
              width="100%"
              placeholder="0"
              endAdornment={
                <Box whiteSpace="nowrap">
                  <FormattedMessage
                    {...refundTableMessages.maxToRefund}
                    values={{ value: maxQtyToRefund.toString() }}
                  />
                </Box>
              }
              backgroundColor="default1"
              size="small"
              value={qtyToRefund}
              type="number"
              min={0}
              max={maxQtyToRefund}
              disabled={maxQtyToRefund === 0}
              onChange={handleInputOnChange}
              onBlur={handleInputOnBlur}
            />
          )}
        />

        <Button
          variant="secondary"
          size="medium"
          onClick={handleMaxRefund}
          disabled={maxQtyToRefund === 0}
        >
          <FormattedMessage {...refundTableMessages.all} />
        </Button>
      </Box>
    </GridTable.Cell>
  );
};
