import { DashboardCard } from "@dashboard/components/Card";
import { Multiselect } from "@dashboard/components/Combobox";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type FetchMoreProps } from "@dashboard/types";
import { Box, type Option, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface AttributeReferenceTypesSectionProps {
  disabled?: boolean;
  entityType?: AttributeEntityTypeEnum | undefined;
  fetchMore?: FetchMoreProps;
  fetchOptions: (query: string) => void;
  loading?: boolean;
  onChange: FormChange;
  options: Option[];
  value: Option[];
  variant?: "card" | "embedded";
}

export const AttributeReferenceTypesSection = ({
  disabled = false,
  entityType,
  fetchMore,
  fetchOptions,
  loading = false,
  onChange,
  options,
  value,
  variant = "card",
}: AttributeReferenceTypesSectionProps) => {
  const intl = useIntl();
  const isEmbedded = variant === "embedded";
  const label =
    entityType === AttributeEntityTypeEnum.PAGE
      ? intl.formatMessage(messages.modelTypesLabel)
      : intl.formatMessage(messages.productTypesLabel);

  const field = (
    <Multiselect
      data-test-id="attribute-reference-types-select"
      disabled={disabled}
      fetchMore={fetchMore}
      fetchOptions={fetchOptions}
      helperText={intl.formatMessage(messages.referenceTypesHelp)}
      label={label}
      loading={loading}
      name="referenceTypes"
      onChange={onChange}
      options={options}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      value={value}
      width="100%"
    />
  );

  if (isEmbedded) {
    return (
      <Box
        data-test-id="attribute-reference-types-section"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Text size={3} fontWeight="bold">
          {intl.formatMessage(messages.referenceTypesTitle)}
        </Text>
        {field}
      </Box>
    );
  }

  return (
    <DashboardCard paddingTop={6} data-test-id="attribute-reference-types-section">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(messages.referenceTypesTitle)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>{field}</DashboardCard.Content>
    </DashboardCard>
  );
};
