import Link from "@dashboard/components/Link";
import PageSectionHeader from "@dashboard/components/PageSectionHeader";
import { useModelsOfTypeQuery } from "@dashboard/graphql";
import { pageCreateUrl } from "@dashboard/modeling/urls";
import { pageTypeAddUrl, pageTypeUrl } from "@dashboard/modelTypes/urls";
import { Box, Combobox, Skeleton, Text } from "@saleor/macaw-ui-next";

interface ReasonSettingsSectionProps {
  title: string;
  description: string;
  selectLabel: string;
  selectHelper: string;
  previewTitle: string;
  emptyModelsLabel: string;
  createModelTypeLabel: string;
  createModelLabel: string;
  modelTypesOptions: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
}

export const ReasonSettingsSection = ({
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
}: ReasonSettingsSectionProps) => {
  const { data: exampleModelData } = useModelsOfTypeQuery({
    variables: {
      pageTypeId: value,
    },
    skip: !value,
  });

  const selectedTypeLabel = modelTypesOptions.find(option => option.value === value)?.label;
  const exampleModels = exampleModelData?.pages?.edges.map(edge => edge.node) ?? [];

  return (
    <Box display="grid" __gridTemplateColumns="1fr 2fr 1fr" gap={6} paddingX={6}>
      <PageSectionHeader title={title} description={description} />
      <Box marginTop={6} __maxWidth="700px">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <Text fontWeight="medium" display="block" marginBottom={2}>
              {selectLabel}
            </Text>
            <Combobox
              options={modelTypesOptions}
              value={value}
              onChange={changed => onChange(changed as string)}
            />
            <Box marginTop={2}>
              <Text color="default2">{selectHelper} </Text>
              <Link target="_blank" href={pageTypeAddUrl}>
                <Text color="inherit">{createModelTypeLabel}</Text>
              </Link>
            </Box>
          </>
        )}
      </Box>
      {!!value && (
        <Box marginTop={6}>
          <Text fontWeight="medium" display="block" marginBottom={2}>
            {previewTitle} <Link href={pageTypeUrl(value)}>{selectedTypeLabel}</Link>
          </Text>
          {exampleModels.length > 0 ? (
            <Box marginTop={4}>
              <Box marginTop={6} display="flex" flexDirection="column">
                {exampleModels.map(model => (
                  <Text disabled key={model.id}>
                    - {model.title}
                  </Text>
                ))}
              </Box>
            </Box>
          ) : (
            <Text>
              {emptyModelsLabel}{" "}
              <Link href={pageCreateUrl({ "page-type-id": value })}>{createModelLabel}</Link>
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
