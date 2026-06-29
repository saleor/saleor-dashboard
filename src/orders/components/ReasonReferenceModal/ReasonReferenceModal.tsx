import { DashboardModal } from "@dashboard/components/Modal";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Select, Text, Textarea } from "@saleor/macaw-ui-next";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { reasonReferenceModalMessages } from "./messages";

interface ReasonReferenceValue {
  reason: string;
  reasonReference: string;
}

interface ReasonReferenceModalProps {
  open: boolean;
  reason: string;
  reasonReference: string;
  /** Configured reason Model (Page) Type id. When empty, the reference picker is hidden. */
  referenceModelTypeId: string;
  onClose: () => void;
  onConfirm: (value: ReasonReferenceValue) => void;
}

export const ReasonReferenceModal = ({
  open,
  reason,
  reasonReference,
  referenceModelTypeId,
  onClose,
  onConfirm,
}: ReasonReferenceModalProps) => {
  const intl = useIntl();
  const [tempReason, setTempReason] = useState(reason);
  const [tempReference, setTempReference] = useState(reasonReference);

  useEffect(() => {
    setTempReason(reason);
    setTempReference(reasonReference);
  }, [reason, reasonReference, open]);

  const { data, loading } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: referenceModelTypeId,
    },
    skip: !referenceModelTypeId,
  });

  // The reference picker is configured only when a reason reference type is set.
  // Without it the reference select is shown but disabled, while the free-text reason note stays enabled.
  const isConfigured = !!referenceModelTypeId;
  const referenceDisabled = !isConfigured;

  const referenceOptions = useMemo(() => {
    const edges = [...(data?.pages?.edges ?? [])].sort((a, b) =>
      a.node.title.localeCompare(b.node.title),
    );

    return [
      { value: "", label: intl.formatMessage(reasonReferenceModalMessages.noneOption) },
      ...edges.map(edge => ({ value: edge.node.id, label: edge.node.title })),
    ];
  }, [data, intl]);

  const hasExistingValue = !!reason || !!reasonReference;

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content data-test-id="reason-reference-dialog" size="xs">
        <DashboardModal.Header>
          <FormattedMessage
            {...(hasExistingValue
              ? reasonReferenceModalMessages.editTitle
              : reasonReferenceModalMessages.addTitle)}
          />
        </DashboardModal.Header>

        <Text color="default2" size={3}>
          <FormattedMessage {...reasonReferenceModalMessages.reasonReferenceHelperText} />
        </Text>

        <Box display="flex" flexDirection="column" gap={4}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text fontWeight="medium" size={3}>
              <FormattedMessage {...reasonReferenceModalMessages.reasonReferenceLabel} />
            </Text>
            <Select
              data-test-id="line-reason-reference-select"
              disabled={referenceDisabled || loading}
              options={referenceOptions}
              value={tempReference}
              onChange={value => setTempReference(value as string)}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <Text fontWeight="medium" size={3}>
              <FormattedMessage {...reasonReferenceModalMessages.reasonLabel} />
            </Text>
            <Textarea
              data-test-id="line-reason-input"
              rows={5}
              value={tempReason}
              onChange={event => setTempReason(event.target.value)}
            />
          </Box>
        </Box>

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary" data-test-id="reason-cancel-button">
            <FormattedMessage {...buttonMessages.cancel} />
          </Button>
          <Button
            onClick={() => {
              onConfirm({ reason: tempReason, reasonReference: tempReference });
              onClose();
            }}
            data-test-id="reason-confirm-button"
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
