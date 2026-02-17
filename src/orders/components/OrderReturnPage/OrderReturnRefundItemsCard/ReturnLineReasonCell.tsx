import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { TableCell } from "@material-ui/core";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { refundTableMessages } from "../../OrderTransactionRefundPage/components/OrderTransactionRefundTable/messages";
import { LineReasonData } from "../form";

interface ReturnLineReasonCellProps {
  lineId: string;
  lineReason: LineReasonData | undefined;
  disabled: boolean;
  onEditReason: (lineId: string) => void;
  modelForReturnReasonRefId: string | null;
}

export const ReturnLineReasonCell = ({
  lineId,
  lineReason,
  disabled,
  onEditReason,
  modelForReturnReasonRefId,
}: ReturnLineReasonCellProps) => {
  const { data: modelsData } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: modelForReturnReasonRefId ?? "",
    },
    skip: !modelForReturnReasonRefId || !lineReason?.reasonReference,
  });

  const referenceLabel = useMemo(() => {
    if (!lineReason?.reasonReference || !modelsData?.pages?.edges) {
      return null;
    }

    return modelsData.pages.edges.find(edge => edge.node.id === lineReason.reasonReference)?.node
      .title;
  }, [lineReason?.reasonReference, modelsData]);

  const hasReason = !!referenceLabel || !!lineReason?.reason;

  return (
    <>
      <TableCell>
        {hasReason && (
          <Text size={2} wordBreak="break-word">
            {referenceLabel && (
              <Text size={2} color="default1" fontWeight="medium" as="span">
                {referenceLabel}
              </Text>
            )}
            {referenceLabel && lineReason?.reason && ": "}
            {lineReason?.reason && (
              <Text size={2} color="default2" as="span">
                {lineReason.reason}
              </Text>
            )}
          </Text>
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" justifyContent="flex-end">
          <Button
            data-test-id="line-return-reason-button"
            variant="secondary"
            whiteSpace="nowrap"
            onClick={() => onEditReason(lineId)}
            disabled={disabled}
          >
            {!lineReason?.reason && !lineReason?.reasonReference ? (
              <FormattedMessage {...refundTableMessages.addReasonBtn} />
            ) : (
              <FormattedMessage {...refundTableMessages.editReasonBtn} />
            )}
          </Button>
        </Box>
      </TableCell>
    </>
  );
};
