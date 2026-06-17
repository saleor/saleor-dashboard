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
  onChange: FormChange;
}

export const GrantRefundReasonFields = ({
  refundReason,
  refundReasonReference,
  refundReasonReferenceTypeId,
  disabled,
  onChange,
}: GrantRefundReasonFieldsProps) => {
  const intl = useIntl();
  const { data, loading } = useModelsOfTypeQuery({
    variables: { pageTypeId: refundReasonReferenceTypeId },
    skip: !refundReasonReferenceTypeId,
  });

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
      {!!refundReasonReferenceTypeId && (
        <Box display="flex" flexDirection="column" gap={1}>
          <Text fontWeight="medium" size={3}>
            {intl.formatMessage(submitCardMessages.refundReasonReferenceLabel)}
          </Text>
          <Select
            data-test-id="grantRefundReasonReferenceSelect"
            disabled={disabled || loading}
            options={referenceOptions}
            value={refundReasonReference}
            onChange={value =>
              onChange({
                target: {
                  name: "refundReasonReference" satisfies keyof OrderReturnData,
                  value: value as string,
                },
              })
            }
          />
        </Box>
      )}
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
