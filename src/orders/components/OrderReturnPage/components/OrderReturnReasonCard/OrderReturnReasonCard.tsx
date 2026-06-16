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
  onChangeReason: (value: string) => void;
  onChangeReasonReference: (value: string) => void;
}

export const OrderReturnReasonCard = ({
  reason,
  reasonReference,
  reasonReferenceTypeId,
  disabled,
  onChangeReason,
  onChangeReasonReference,
}: OrderReturnReasonCardProps) => {
  const intl = useIntl();
  const { data, loading } = useModelsOfTypeQuery({
    variables: { pageTypeId: reasonReferenceTypeId },
    skip: !reasonReferenceTypeId,
  });

  const referenceOptions = useMemo(
    () => [
      { value: "", label: intl.formatMessage(orderReturnReasonCardMessages.none) },
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
        {!!reasonReferenceTypeId && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Text fontWeight="medium" size={3}>
              {intl.formatMessage(orderReturnReasonCardMessages.structuredReasonLabel)}
            </Text>
            <Select
              data-test-id="returnReasonReferenceSelect"
              disabled={disabled || loading}
              options={referenceOptions}
              value={reasonReference}
              onChange={value => onChangeReasonReference(value as string)}
            />
          </Box>
        )}
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
