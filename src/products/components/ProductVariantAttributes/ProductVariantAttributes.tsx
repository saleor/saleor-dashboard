// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import FormSpacer from "@dashboard/components/FormSpacer";
import Grid from "@dashboard/components/Grid";
import { ProductErrorWithAttributesFragment, ProductVariantFragment } from "@dashboard/graphql";
import { FormsetAtomicData, FormsetChange } from "@dashboard/hooks/useFormset";
import { commonMessages } from "@dashboard/intl";
import { getProductVariantAttributeErrorMessage } from "@dashboard/utils/errors/product";
import { DynamicCombobox, Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

export interface VariantAttributeInputData {
  values: Array<
    | ProductVariantFragment["selectionAttributes"][0]["attribute"]["choices"]["edges"][0]
    | ProductVariantFragment["nonSelectionAttributes"][0]["attribute"]["choices"]["edges"][0]
  >;
}
export type VariantAttributeInput = FormsetAtomicData<VariantAttributeInputData, string>;

interface ProductVariantAttributesProps {
  attributes: VariantAttributeInput[];
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
  onChange: FormsetChange<VariantAttributeInputData>;
}

function getAttributeDisplayValue(
  id: string,
  slug: string,
  attributes: VariantAttributeInput[],
): string {
  const attribute = attributes.find(attr => attr.id === id);
  const attributeValue = attribute.data.values.find(value => value.node.slug === slug);

  if (attributeValue) {
    return attributeValue.node.name;
  }

  return slug || "";
}

function getAttributeValue(id: string, attributes: VariantAttributeInput[]): string {
  const attribute = attributes.find(attr => attr.id === id);

  return attribute?.value === null ? undefined : attribute.value;
}

function getAttributeValueChoices(id: string, attributes: VariantAttributeInput[]): Option[] {
  const attribute = attributes.find(attr => attr.id === id);

  return attribute.data.values.map(attributeValue => ({
    label: attributeValue.node.name,
    value: attributeValue.node.slug,
  }));
}

const ProductVariantAttributes: React.FC<ProductVariantAttributesProps> = ({
  attributes,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const buildOptionsWithCustomValue = (attributeId: string) => {
    const baseOptions = getAttributeValueChoices(attributeId, attributes);
    const inputValue = inputValues[attributeId]?.trim();

    if (!inputValue) {
      return baseOptions;
    }

    const hasExactMatch = baseOptions.some(
      opt => opt.label.toLowerCase() === inputValue.toLowerCase(),
    );

    if (hasExactMatch) {
      return baseOptions;
    }

    // Add custom value option
    return [{ label: `Add: ${inputValue}`, value: inputValue }, ...baseOptions];
  };

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Grid variant="uniform">
          {attributes === undefined ? (
            <Skeleton />
          ) : (
            attributes.map(attribute => {
              const error = errors.find(err => err.attributes?.includes(attribute.id));
              const currentValue = getAttributeValue(attribute.id, attributes);

              return (
                <DynamicCombobox
                  key={attribute.id}
                  disabled={disabled}
                  data-test-id="variant-attribute-input"
                  error={!!error}
                  helperText={getProductVariantAttributeErrorMessage(error, intl)}
                  label={attribute.label}
                  options={buildOptionsWithCustomValue(attribute.id)}
                  name={`attribute:${attribute.id}`}
                  value={
                    currentValue
                      ? {
                          label: getAttributeDisplayValue(
                            attribute.id,
                            attribute.value,
                            attributes,
                          ),
                          value: currentValue,
                        }
                      : null
                  }
                  onChange={(option: Option | null) => {
                    (onChange as unknown as FormsetChange<string>)(
                      attribute.id,
                      option?.value ?? null,
                    );
                    setInputValues(prev => ({ ...prev, [attribute.id]: "" }));
                  }}
                  onInputValueChange={value => {
                    setInputValues(prev => ({ ...prev, [attribute.id]: value }));
                  }}
                  locale={{
                    loadingText: intl.formatMessage(commonMessages.loading),
                  }}
                  size="small"
                />
              );
            })
          )}
        </Grid>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors
              .filter(error => error.field === "attributes" && error.attributes === null)
              .map(error => (
                <Text color="critical1" key={error.code}>
                  {getProductVariantAttributeErrorMessage(error, intl)}
                </Text>
              ))}
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductVariantAttributes.displayName = "ProductVariantAttributes";
export default ProductVariantAttributes;
