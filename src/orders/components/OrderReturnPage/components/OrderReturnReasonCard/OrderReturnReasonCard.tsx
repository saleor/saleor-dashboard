import { DashboardCard } from "@dashboard/components/Card";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { Box, Select, Text, Textarea } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { orderReturnReasonCardMessages } from "./messages";

interface OrderReturnReasonCardProps {
  reason: string;
  reasonReference: string;
  /** Configured return reason Model (Page) Type id; empty when not configured. */
  reasonReferenceTypeId: string;
  disabled?: boolean;
  /** Marks the structured reason select as errored (e.g. required but not selected on submit). */
  error?: boolean;
  onChangeReason: (value: string) => void;
  onChangeReasonReference: (value: string) => void;
}

export const OrderReturnReasonCard = ({
  reason,
  reasonReference,
  reasonReferenceTypeId,
  disabled,
  error,
  onChangeReason,
  onChangeReasonReference,
}: OrderReturnReasonCardProps) => {
  const intl = useIntl();
  const { data, loading } = useModelsOfTypeQuery({
    variables: { pageTypeId: reasonReferenceTypeId },
    skip: !reasonReferenceTypeId,
  });

  // The structured reason reference is configured only when a reason reference type is set.
  // Without it the reference select is disabled, while the free-text reason note stays enabled.
  const isConfigured = !!reasonReferenceTypeId;
  const referenceDisabled = disabled || !isConfigured;

  const referenceOptions = useMemo(
    () => [
      { value: "", label: intl.formatMessage(orderReturnReasonCardMessages.selectPlaceholder) },
      ...[...(data?.pages?.edges ?? [])]
        .sort((a, b) => a.node.title.localeCompare(b.node.title))
        .map(edge => ({ value: edge.node.id, label: edge.node.title })),
    ],
    [data, intl],
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(orderReturnReasonCardMessages.title)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="flex" flexDirection="column" gap={4}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Text fontWeight="medium" size={3}>
            {intl.formatMessage(orderReturnReasonCardMessages.structuredReasonLabel)}
          </Text>
          <Select
            data-test-id="returnReasonReferenceSelect"
            disabled={referenceDisabled || loading}
            error={error}
            helperText={
              isConfigured
                ? intl.formatMessage(orderReturnReasonCardMessages.requiredHelper)
                : undefined
            }
            options={referenceOptions}
            value={reasonReference}
            onChange={value => onChangeReasonReference(value as string)}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <Text fontWeight="medium" size={3}>
            {intl.formatMessage(orderReturnReasonCardMessages.reasonLabel)}
          </Text>
          <Textarea
            data-test-id="returnReasonInput"
            rows={4}
            disabled={disabled}
            value={reason}
            onChange={event => onChangeReason(event.target.value)}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
