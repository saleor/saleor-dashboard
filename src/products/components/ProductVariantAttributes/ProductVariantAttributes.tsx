// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import FormSpacer from "@dashboard/components/FormSpacer";
import Grid from "@dashboard/components/Grid";
import { ProductErrorWithAttributesFragment, ProductVariantFragment } from "@dashboard/graphql";
import { FormsetAtomicData, FormsetChange } from "@dashboard/hooks/useFormset";
import { commonMessages } from "@dashboard/intl";
import { getProductVariantAttributeErrorMessage } from "@dashboard/utils/errors/product";
import { Option, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
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

const ProductVariantAttributes = ({
  attributes,
  disabled,
  errors,
  onChange,
}: ProductVariantAttributesProps) => {
  const intl = useIntl();

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

              return (
                <Combobox
                  key={attribute.id}
                  allowCustomValues
                  disabled={disabled}
                  data-test-id="variant-attribute-input"
                  error={!!error}
                  helperText={getProductVariantAttributeErrorMessage(error, intl)}
                  label={attribute.label}
                  options={getAttributeValueChoices(attribute.id, attributes)}
                  fetchOptions={() => undefined}
                  name={`attribute:${attribute.id}`}
                  value={{
                    label: getAttributeDisplayValue(attribute.id, attribute.value, attributes),
                    value: getAttributeValue(attribute.id, attributes),
                  }}
                  onChange={event => onChange(attribute.id, event.target.value)}
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
