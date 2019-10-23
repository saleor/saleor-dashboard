import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { commonMessages } from "@saleor/intl";
import { VariantCreate_productVariantCreate_productErrors } from "@saleor/products/types/VariantCreate";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { ProductVariant_attributes_attribute_values } from "../../types/ProductVariant";

export interface VariantAttributeInputData {
  values: ProductVariant_attributes_attribute_values[];
}
export type VariantAttributeInput = FormsetAtomicData<
  VariantAttributeInputData,
  string
>;

interface ProductVariantAttributesProps {
  attributes: VariantAttributeInput[];
  disabled: boolean;
  errors: VariantCreate_productVariantCreate_productErrors[];
  onChange: FormsetChange<VariantAttributeInputData>;
}

function getAttributeDisplayValue(
  id: string,
  slug: string,
  attributes: VariantAttributeInput[]
): string {
  const attribute = attributes.find(attr => attr.id === id);
  const attributeValue = attribute.data.values.find(
    value => value.slug === slug
  );
  if (!!attributeValue) {
    return attributeValue.name;
  }

  return slug;
}

function getAttributeValue(
  id: string,
  attributes: VariantAttributeInput[]
): string {
  const attribute = attributes.find(attr => attr.id === id);
  return attribute.value;
}

function getAttributeValueChoices(
  id: string,
  attributes: VariantAttributeInput[]
): SingleAutocompleteChoiceType[] {
  const attribute = attributes.find(attr => attr.id === id);
  return attribute.data.values.map(attributeValue => ({
    label: attributeValue.name,
    value: attributeValue.slug
  }));
}

function translateErrors(intl: IntlShape) {
  return {
    [ProductErrorCode.REQUIRED]: intl.formatMessage({
      defaultMessage: "All attributes should have value",
      description: "product attribute error"
    }),
    [ProductErrorCode.UNIQUE]: intl.formatMessage({
      defaultMessage: "This variant already exists",
      description: "product attribute error"
    })
  };
}

const ProductVariantAttributes: React.FC<ProductVariantAttributesProps> = ({
  attributes,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const translatedErrors = translateErrors(intl);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(commonMessages.generalInformations)}
      />
      <CardContent>
        <Grid variant="uniform">
          {attributes === undefined ? (
            <Skeleton />
          ) : (
            attributes.map(attribute => (
              <SingleAutocompleteSelectField
                key={attribute.id}
                disabled={disabled}
                displayValue={getAttributeDisplayValue(
                  attribute.id,
                  attribute.value,
                  attributes
                )}
                label={attribute.label}
                name={`attribute:${attribute.id}`}
                onChange={event => onChange(attribute.id, event.target.value)}
                value={getAttributeValue(attribute.id, attributes)}
                choices={getAttributeValueChoices(attribute.id, attributes)}
                allowCustomValues
                data-tc="variant-attribute-input"
              />
            ))
          )}
        </Grid>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors
              .filter(error => error.field === "attributes")
              .map(error => (
                <Typography color="error" key={error.code}>
                  {translatedErrors[error.code]}
                </Typography>
              ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
ProductVariantAttributes.displayName = "ProductVariantAttributes";
export default ProductVariantAttributes;
