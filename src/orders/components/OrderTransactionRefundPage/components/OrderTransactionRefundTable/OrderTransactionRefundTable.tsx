import { GridTable } from "@dashboard/components/GridTable";
import { formatMoney } from "@dashboard/components/Money";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, Controller, FieldArrayWithId, UseFieldArrayUpdate } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { LineToRefund, OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { getMaxQtyToRefund, RefundQuantityChange, validateQty } from "../../utils";
import { refundTableMessages } from "./messages";

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

export const OrderTransactionRefundTable: React.FC<OrderTransactionRefundTableProps> = ({
  order,
  draftRefund,
  control,
  onChange,
  onEditReasonModal,
  linesToRefund,
  refundFields,
  refundFieldsUpdate,
}) => {
  const locale = useLocale();

  return (
    <GridTable height="100%" paddingX={6}>
      <GridTable.Colgroup>
        <GridTable.Col __width="45%" />
        <GridTable.Col __width="20%" />
        <GridTable.Col __width="25%" />
        <GridTable.Col __width="10%" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {refundFields?.map((field, ix) => {
          const line = order?.lines[ix];

          if (!line) {
            return;
          }

          const maxQtyToRefund = getMaxQtyToRefund({
            rowData: { id: line.id, quantity: line.quantity },
            order,
            draftRefund,
          });

          return (
            <GridTable.Row key={field.id}>
              <GridTable.Cell>
                <Box
                  display="grid"
                  __gridTemplateColumns="min-content auto"
                  gap={2}
                  alignItems="start"
                >
                  <Box width={8} height={8}>
                    <img src={line.thumbnail?.url} />
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
                  {maxQtyToRefund !== line.quantity && (
                    <Text size={2} whiteSpace="nowrap" color="default2">
                      {maxQtyToRefund === 0 ? (
                        <FormattedMessage {...refundTableMessages.allItemsRefunded} />
                      ) : (
                        <FormattedMessage
                          {...refundTableMessages.alreadyRefunded}
                          values={{
                            value: (line.quantity - maxQtyToRefund).toString(),
                          }}
                        />
                      )}
                    </Text>
                  )}
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Box backgroundColor="default1" display="flex" gap={2}>
                  <Controller
                    control={control}
                    name={`linesToRefund.${ix}`}
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
                        value={linesToRefund?.[ix]?.quantity}
                        type="number"
                        min={0}
                        max={maxQtyToRefund}
                        disabled={maxQtyToRefund === 0}
                        onChange={event =>
                          onChange(
                            {
                              value: event.target.value,
                              row: ix,
                            },
                            ix,
                          )
                        }
                        onBlur={event =>
                          refundFieldsUpdate(ix, {
                            reason: field.reason,
                            quantity: validateQty({
                              order,
                              draftRefund,
                              update: { row: ix, value: event.target.value },
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
                      refundFieldsUpdate(ix, { reason: field.reason, quantity: maxQtyToRefund })
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
                  onClick={() => onEditReasonModal(ix)}
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
        })}
      </GridTable.Body>
    </GridTable>
  );
};
