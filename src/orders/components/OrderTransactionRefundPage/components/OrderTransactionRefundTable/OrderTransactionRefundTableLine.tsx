import { GridTable } from "@dashboard/components/GridTable";
import { formatMoney } from "@dashboard/components/Money";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, Controller, FieldArrayWithId, UseFieldArrayUpdate } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { LineToRefund, OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { RefundQuantityChange, validateQty } from "../../utils";
import { AlreadyRefundedHelper } from "./AlreadyRefundedHelper";
import { refundTableMessages } from "./messages";

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
  const locale = useLocale();

  return (
    <GridTable.Row key={field.id}>
      <GridTable.Cell>
        <Box display="grid" __gridTemplateColumns="min-content auto" gap={2} alignItems="start">
          <Box width={8} height={8}>
            <img src={line.thumbnail?.url} alt="product thumbnail" />
          </Box>
          <Box overflow="hidden" minWidth={0}>
            <Text size={2} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {line.productName}
            </Text>
            <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              <Text size={2} color="default2" textOverflow="ellipsis" overflow="hidden">
                {line.variantName}
              </Text>
            </Box>
          </Box>
        </Box>
      </GridTable.Cell>
      <GridTable.Cell>
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          flexShrink="1"
          __minWidth="0px"
        >
          {`${line.quantity} ⨉ `}
          {formatMoney(line.unitPrice.gross, locale.locale)}
          <AlreadyRefundedHelper qtyToRefund={line.quantity} maxQtyToRefund={maxQtyToRefund} />
        </Box>
      </GridTable.Cell>
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
                onChange={event =>
                  onChange(
                    {
                      value: event.target.value,
                      row: index,
                    },
                    index,
                  )
                }
                onBlur={event =>
                  refundFieldsUpdate(index, {
                    reason: field.reason,
                    quantity: validateQty({
                      order,
                      draftRefund,
                      update: { row: index, value: event.target.value },
                    }),
                  })
                }
              />
            )}
          />

          <Button
            variant="secondary"
            size="medium"
            onClick={() =>
              refundFieldsUpdate(index, { reason: field.reason, quantity: maxQtyToRefund })
            }
            disabled={maxQtyToRefund === 0}
          >
            <FormattedMessage {...refundTableMessages.all} />
          </Button>
        </Box>
      </GridTable.Cell>
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
    </GridTable.Row>
  );
};
