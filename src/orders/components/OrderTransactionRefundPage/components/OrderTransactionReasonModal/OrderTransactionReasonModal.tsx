import { DashboardModal } from "@dashboard/components/Modal";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Select, Skeleton, Textarea } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { refundTableMessages } from "../OrderTransactionRefundTable/messages";

interface OrderTransactionReasonModalProps {
  open: boolean;
  reason: string | null;
  reasonReference: string | null;
  modelForRefundReasonRefId: string | null;
  onClose: () => void;
  onConfirm: (reason: string, reasonReference: string) => void;
}

export const OrderTransactionReasonModal = ({
  open,
  reason,
  reasonReference,
  modelForRefundReasonRefId,
  onClose,
  onConfirm,
}: OrderTransactionReasonModalProps) => {
  const intl = useIntl();
  const [tempReason, setTempReason] = useState<string>(reason ?? "");
  const [tempReasonReference, setTempReasonReference] = useState<string>(reasonReference ?? "");

  useEffect(() => {
    setTempReason(reason ?? "");
    setTempReasonReference(reasonReference ?? "");
  }, [reason, reasonReference]);

  const { data: modelsData, loading: modelsLoading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: modelForRefundReasonRefId ?? "",
    },
    skip: !modelForRefundReasonRefId,
  });

  const reasonRefOptions = useMemo(() => {
    const options =
      modelsData?.pages?.edges.map(model => ({
        value: model.node.id,
        label: model.node.title,
      })) ?? [];

    return [
      {
        value: "",
        label: intl.formatMessage({ defaultMessage: "Select a reason type", id: "vSLaZ7" }),
      },
      ...options,
    ];
  }, [modelsData, intl]);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content data-test-id="refund-reason-dialog" size="xs">
        <DashboardModal.Header>
          <FormattedMessage
            {...(reason ? refundTableMessages.editReason : refundTableMessages.addReason)}
          />
        </DashboardModal.Header>

        <Box display="flex" flexDirection="column" gap={4}>
          {modelForRefundReasonRefId &&
            (modelsLoading ? (
              <Skeleton />
            ) : (
              <Select
                options={reasonRefOptions}
                value={tempReasonReference}
                onChange={value => setTempReasonReference(value as string)}
              />
            ))}

          <Textarea
            data-test-id="line-refund-reason-input"
            rows={5}
            value={tempReason}
            onChange={event => setTempReason(event.target.value)}
          />
        </Box>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary" data-test-id="cancel-delete-rule-button">
            <FormattedMessage {...buttonMessages.cancel} />
          </Button>
          <Button
            onClick={() => {
              onConfirm(tempReason, tempReasonReference);
              onClose();
            }}
            data-test-id="confirm-button"
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
