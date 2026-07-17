import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { SettingsFieldStack } from "@dashboard/components/Settings/SettingsFieldStack";
import { SettingsSection } from "@dashboard/components/Settings/SettingsSection";
import { pageTypeAddUrl } from "@dashboard/modelTypes/urls";
import { Box, Combobox, Skeleton, Text } from "@saleor/macaw-ui-next";

import { ReasonModelsPreview } from "./ReasonModelsPreview";
import { type ModelTypeOption } from "./types";

interface ReasonSettingsSectionProps {
  "data-test-id": string;
  id?: string;
  title: string;
  description: string;
  selectLabel: string;
  selectHelper: string;
  previewTitle: string;
  emptyModelsLabel: string;
  createModelTypeLabel: string;
  createModelLabel: string;
  modelTypesOptions: ModelTypeOption[];
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export const ReasonSettingsSection = ({
  "data-test-id": dataTestId,
  id,
  title,
  description,
  selectLabel,
  selectHelper,
  previewTitle,
  emptyModelsLabel,
  createModelTypeLabel,
  createModelLabel,
  modelTypesOptions,
  value,
  onChange,
  loading,
  disabled = false,
}: ReasonSettingsSectionProps): JSX.Element => {
  const selectedTypeLabel = modelTypesOptions.find(option => option.value === value)?.label;

  return (
    <SettingsSection
      id={id}
      data-test-id={dataTestId}
      ownership="shop"
      title={title}
      description={description}
    >
      <SettingsFieldStack>
        {loading ? (
          <Skeleton __height="2.5rem" />
        ) : (
          <Box>
            <Text size={2} fontWeight="medium" display="block" marginBottom={2}>
              {selectLabel}
            </Text>
            <Combobox
              options={modelTypesOptions}
              value={value}
              disabled={disabled}
              onChange={changed => onChange(changed as string)}
              data-test-id={`${dataTestId}-model-type-select`}
            />
            <Text size={2} color="default2" display="block" marginTop={2}>
              {selectHelper}{" "}
              <MicrocopyLink to={pageTypeAddUrl}>{createModelTypeLabel}</MicrocopyLink>
            </Text>
          </Box>
        )}
      </SettingsFieldStack>
      {value && selectedTypeLabel ? (
        <ReasonModelsPreview
          pageTypeId={value}
          pageTypeLabel={selectedTypeLabel}
          previewTitle={previewTitle}
          emptyModelsLabel={emptyModelsLabel}
          createModelLabel={createModelLabel}
        />
      ) : null}
    </SettingsSection>
  );
};
