import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { Box, Select, Text, Textarea } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { type OrderReturnData } from "../../form";
import { submitCardMessages } from "./messages";

interface GrantRefundReasonFieldsProps {
  refundReason: string;
  refundReasonReference: string;
  /** Configured refund reason Model (Page) Type id; empty when not configured. */
  refundReasonReferenceTypeId: string;
  disabled?: boolean;
  /** Marks the refund reason select as errored (e.g. required but not selected on submit). */
  error?: boolean;
  onChange: FormChange;
  /** Called when the user picks a reference, used to clear the required error. */
  onClearError?: () => void;
}

export const GrantRefundReasonFields = ({
  refundReason,
  refundReasonReference,
  refundReasonReferenceTypeId,
  disabled,
  error,
  onChange,
  onClearError,
}: GrantRefundReasonFieldsProps) => {
  const intl = useIntl();
  const { data, loading } = useModelsOfTypeQuery({
    variables: { pageTypeId: refundReasonReferenceTypeId },
    skip: !refundReasonReferenceTypeId,
  });

  // The refund reason reference is configured only when a reason reference type is set.
  // Without it the reference select is shown but disabled, while the free-text reason note stays enabled.
  const isConfigured = !!refundReasonReferenceTypeId;
  const referenceDisabled = disabled || !isConfigured;

  const referenceOptions = useMemo(
    () => [
      { value: "", label: intl.formatMessage(submitCardMessages.refundReasonNone) },
      ...[...(data?.pages?.edges ?? [])]
        .sort((a, b) => a.node.title.localeCompare(b.node.title))
        .map(edge => ({ value: edge.node.id, label: edge.node.title })),
    ],
    [data, intl],
  );

  return (
    <Box display="flex" flexDirection="column" gap={4} width="100%">
      <Box display="flex" flexDirection="column" gap={1}>
        <Text fontWeight="medium" size={3}>
          {intl.formatMessage(submitCardMessages.refundReasonReferenceLabel)}
        </Text>
        <Select
          data-test-id="grantRefundReasonReferenceSelect"
          disabled={referenceDisabled || loading}
          error={error}
          options={referenceOptions}
          value={refundReasonReference}
          onChange={value => {
            onClearError?.();
            onChange({
              target: {
                name: "refundReasonReference" satisfies keyof OrderReturnData,
                value: value as string,
              },
            });
          }}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Text fontWeight="medium" size={3}>
          {intl.formatMessage(submitCardMessages.refundReasonLabel)}
        </Text>
        <Textarea
          data-test-id="grantRefundReasonInput"
          rows={4}
          disabled={disabled}
          value={refundReason}
          onChange={event =>
            onChange({
              target: {
                name: "refundReason" satisfies keyof OrderReturnData,
                value: event.target.value,
              },
            })
          }
        />
      </Box>
    </Box>
  );
};
