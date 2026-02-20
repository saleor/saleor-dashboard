import { GridTable } from "@dashboard/components/GridTable";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FieldArrayWithId } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { refundTableMessages } from "./messages";

interface RefundTableReasonCellProps {
  index: number;
  onEditReasonModal: (index: number) => void;
  field: FieldArrayWithId<OrderTransactionRefundPageFormData, "linesToRefund", "id">;
  modelForRefundReasonRefId: string | null;
}

export const RefundTableReasonCell = ({
  index,
  field,
  onEditReasonModal,
  modelForRefundReasonRefId,
}: RefundTableReasonCellProps) => {
  const { data: modelsData } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: modelForRefundReasonRefId ?? "",
    },
    skip: !modelForRefundReasonRefId || !field.reasonReference,
  });

  const referenceLabel = useMemo(() => {
    if (!field.reasonReference || !modelsData?.pages?.edges) {
      return null;
    }

    return modelsData.pages.edges.find(edge => edge.node.id === field.reasonReference)?.node.title;
  }, [field.reasonReference, modelsData]);

  const hasReason = !!referenceLabel || !!field.reason;

  return (
    <>
      <GridTable.Cell>
        {hasReason && (
          <Text size={2} wordBreak="break-word">
            {referenceLabel && (
              <Text size={2} color="default1" fontWeight="medium" as="span">
                {referenceLabel}
              </Text>
            )}
            {referenceLabel && field.reason && ": "}
            {field.reason && (
              <Text size={2} color="default2" as="span">
                {field.reason}
              </Text>
            )}
          </Text>
        )}
      </GridTable.Cell>
      <GridTable.Cell>
        <Box display="flex" justifyContent="flex-end">
          <Button
            data-test-id="line-refund-reason-button"
            variant="secondary"
            whiteSpace="nowrap"
            onClick={() => onEditReasonModal(index)}
            disabled={!field.quantity}
          >
            {!field.reason && !field.reasonReference ? (
              <FormattedMessage {...refundTableMessages.addReasonBtn} />
            ) : (
              <FormattedMessage {...refundTableMessages.editReasonBtn} />
            )}
          </Button>
        </Box>
      </GridTable.Cell>
    </>
  );
};
