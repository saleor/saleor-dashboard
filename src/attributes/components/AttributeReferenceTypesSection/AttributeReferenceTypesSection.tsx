import { Multiselect } from "@dashboard/components/Combobox";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { type FetchMoreProps } from "@dashboard/types";
import { type Option } from "@saleor/macaw-ui-next";
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
}: AttributeReferenceTypesSectionProps): JSX.Element => {
  const intl = useIntl();
  const label =
    entityType === AttributeEntityTypeEnum.PAGE
      ? intl.formatMessage(messages.modelTypesLabel)
      : intl.formatMessage(messages.productTypesLabel);

  return (
    <DetailSettingsCard
      data-test-id="attribute-reference-types-section"
      title={intl.formatMessage(messages.referenceTypesTitle)}
    >
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
    </DetailSettingsCard>
  );
};
