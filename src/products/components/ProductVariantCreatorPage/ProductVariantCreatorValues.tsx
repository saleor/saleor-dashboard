import { Card, CardContent } from "@material-ui/core";
import Alert from "@saleor/components/Alert/Alert";
import { getMultiChoices } from "@saleor/components/Attributes/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import {
  Attribute,
  AttributeValue,
  ProductVariantCreateFormData
} from "./form";

const messages = defineMessages({
  multipleValueLabel: {
    defaultMessage: "Values",
    description: "attribute values"
  }
});

export function getVariantsNumber(data: ProductVariantCreateFormData): number {
  return data.attributes.reduce(
    (variants, attribute) => variants * attribute.values.length,
    1
  );
}

export function getMultiValues(
  attributes: Attribute[],
  attribute: ProductDetails_product_productType_variantAttributes
) {
  return attributes
    .find(getById(attribute.id))
    ?.values?.map(value => value.slug);
}

export function getMultiDisplayValues(
  attributes: Attribute[],
  attribute: ProductDetails_product_productType_variantAttributes
) {
  return attributes.find(getById(attribute.id))?.values.map(value => ({
    label: value.value?.name,
    value: value.slug
  }));
}

export interface ProductVariantCreatorValuesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
  data: ProductVariantCreateFormData;
  variantsLeft: number | null;
  onValueClick: (
    attributeId: string,
    value: AttributeValue<AttributeValueFragment>
  ) => void;
}

const ProductVariantCreatorValues: React.FC<ProductVariantCreatorValuesProps> = props => {
  const {
    attributes,
    attributeValues,
    fetchAttributeValues,
    fetchMoreAttributeValues,
    data,
    variantsLeft,
    onValueClick
  } = props;
  const intl = useIntl();
  const variantsNumber = getVariantsNumber(data);

  const handleValueClick = (attributeId: string, valueSlug: string) => {
    const dataAttribute = data.attributes.find(getById(attributeId));

    onValueClick(attributeId, {
      slug: valueSlug,
      value:
        dataAttribute?.values.find(value => value.slug === valueSlug)?.value ||
        attributeValues.find(value => value.slug === valueSlug)
    });
  };

  return (
    <>
      {variantsLeft !== null && (
        <Alert
          show={variantsNumber > variantsLeft}
          title={intl.formatMessage({
            defaultMessage: "SKU limit reached",
            description: "alert"
          })}
        >
          <FormattedMessage
            defaultMessage="You choices will add {variantsNumber} SKUs to your catalog which will exceed your limit by {aboveLimitVariantsNumber}. If you would like to up your limit, contact your administration staff about raising your limits."
            values={{
              variantsNumber,
              aboveLimitVariantsNumber: variantsNumber - variantsLeft
            }}
          />
        </Alert>
      )}
      {attributes.map(attribute => (
        <React.Fragment key={attribute.id}>
          <Card>
            <CardTitle title={attribute?.name || <Skeleton />} />
            <CardContent data-test-id="value-container">
              <MultiAutocompleteSelectField
                choices={getMultiChoices(attributeValues)}
                displayValues={getMultiDisplayValues(
                  data.attributes,
                  attribute
                )}
                name={`attribute:${attribute.name}`}
                label={intl.formatMessage(messages.multipleValueLabel)}
                value={getMultiValues(data.attributes, attribute)}
                onChange={event =>
                  handleValueClick(attribute.id, event.target.value)
                }
                allowCustomValues={true}
                fetchOnFocus={true}
                fetchChoices={value =>
                  fetchAttributeValues(value, attribute.id)
                }
                {...fetchMoreAttributeValues}
              />
            </CardContent>
          </Card>
          <CardSpacer />
        </React.Fragment>
      ))}
    </>
  );
};

ProductVariantCreatorValues.displayName = "ProductVariantCreatorValues";
export default ProductVariantCreatorValues;
