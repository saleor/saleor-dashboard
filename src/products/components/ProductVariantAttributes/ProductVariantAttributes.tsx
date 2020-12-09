import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import {
  ProductVariant_nonSelectionAttributes_attribute_values,
  ProductVariant_selectionAttributes_attribute_values
} from "@saleor/fragments/types/ProductVariant";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { commonMessages } from "@saleor/intl";
import { getProductVariantAttributeErrorMessage } from "@saleor/utils/errors/product";
import React from "react";
import { useIntl } from "react-intl";

export interface VariantAttributeInputData {
  values: Array<
    | ProductVariant_selectionAttributes_attribute_values
    | ProductVariant_nonSelectionAttributes_attribute_values
  >;
}
export type VariantAttributeInput = FormsetAtomicData<
  VariantAttributeInputData,
  string
>;

interface ProductVariantAttributesProps {
  attributes: VariantAttributeInput[];
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
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

  return slug || "";
}

function getAttributeValue(
  id: string,
  attributes: VariantAttributeInput[]
): string {
  const attribute = attributes.find(attr => attr.id === id);
  return attribute?.value === null ? undefined : attribute.value;
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

const ProductVariantAttributes: React.FC<ProductVariantAttributesProps> = ({
  attributes,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

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
            attributes.map(attribute => {
              const error = errors.find(err =>
                err.attributes?.includes(attribute.id)
              );

              return (
                <SingleAutocompleteSelectField
                  key={attribute.id}
                  disabled={disabled}
                  displayValue={getAttributeDisplayValue(
                    attribute.id,
                    attribute.value,
                    attributes
                  )}
                  error={!!error}
                  helperText={getProductVariantAttributeErrorMessage(
                    error,
                    intl
                  )}
                  label={attribute.label}
                  name={`attribute:${attribute.id}`}
                  onChange={event => onChange(attribute.id, event.target.value)}
                  value={getAttributeValue(attribute.id, attributes)}
                  choices={getAttributeValueChoices(attribute.id, attributes)}
                  allowCustomValues
                  data-test="variant-attribute-input"
                />
              );
            })
          )}
        </Grid>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors
              .filter(
                error =>
                  error.field === "attributes" && error.attributes === null
              )
              .map(error => (
                <Typography color="error" key={error.code}>
                  {getProductVariantAttributeErrorMessage(error, intl)}
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
