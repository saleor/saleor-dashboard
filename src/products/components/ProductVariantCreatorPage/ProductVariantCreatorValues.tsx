import { Card, CardContent } from "@material-ui/core";
import { getMeasurementUnitMessage } from "@saleor/attributes/components/AttributeDetails/utils";
import { getMultiChoices } from "@saleor/components/Attributes/utils";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { AttributeValueFragment } from "@saleor/fragments/types/AttributeValueFragment";
import { commonMessages } from "@saleor/intl";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import {
  getBasicAttributeValue,
  getBooleanAttributeValue
} from "@saleor/products/components/ProductVariantCreatorPage/utils";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { SearchAttributeValues_attribute_choices_edges_node } from "@saleor/searches/types/SearchAttributeValues";
import { FetchMoreProps } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import {
  defineMessages,
  FormattedMessage,
  IntlShape,
  useIntl
} from "react-intl";

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

const getBooleanDisplayValues = (
  intl: IntlShape,
  values: Array<AttributeValue<Partial<AttributeValueFragment>>>
) => {
  if (!values.length) {
    return [];
  }

  const choices = getBooleanChoices(intl);
  return values.map(({ value: { boolean } }) =>
    choices.find(({ value }) => value === boolean)
  );
};

const getBooleanChoices = (
  intl: IntlShape,
  values?: Array<AttributeValue<Partial<AttributeValueFragment>>>
) => {
  const selectedValues = values?.map(({ value }) => value.boolean) ?? [];
  const choices = [
    { label: intl.formatMessage(commonMessages.yes), value: true },
    { label: intl.formatMessage(commonMessages.no), value: false }
  ];

  return choices.filter(({ value }) => !selectedValues.includes(value));
};

export interface ProductVariantCreatorValuesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  attributeValues: SearchAttributeValues_attribute_choices_edges_node[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
  data: ProductVariantCreateFormData;
  variantsLeft: number | null;
  onValueClick: (
    attributeId: string,
    value: AttributeValue<Partial<AttributeValueFragment>>
  ) => void;
  onValueBlur: () => void;
}

const ProductVariantCreatorValues: React.FC<ProductVariantCreatorValuesProps> = props => {
  const {
    attributes,
    attributeValues,
    fetchAttributeValues,
    fetchMoreAttributeValues,
    data,
    variantsLeft,
    onValueClick,
    onValueBlur
  } = props;
  const intl = useIntl();
  const variantsNumber = getVariantsNumber(data);

  const handleValueClick = (
    attributeId: string,
    attributeName: string,
    attributeValue: string | boolean
  ) =>
    onValueClick(
      attributeId,
      typeof attributeValue === "boolean"
        ? getBooleanAttributeValue(attributeName, attributeValue)
        : getBasicAttributeValue(
            attributeId,
            attributeValue,
            attributeValues,
            data
          )
    );

  return (
    <>
      {variantsLeft !== null && variantsNumber > variantsLeft && (
        <LimitReachedAlert
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
        </LimitReachedAlert>
      )}
      {attributes.map(attribute => (
        <React.Fragment key={attribute.id}>
          <Card>
            <CardTitle title={attribute?.name || <Skeleton />} />
            <CardContent data-test-id="value-container">
              {attribute.inputType === AttributeInputTypeEnum.BOOLEAN ? (
                <MultiAutocompleteSelectField
                  displayValues={getBooleanDisplayValues(
                    intl,
                    data.attributes.find(({ id }) => id === attribute.id).values
                  )}
                  name={`attribute:${attribute.name}`}
                  label={intl.formatMessage(messages.multipleValueLabel)}
                  value={getMultiValues(data.attributes, attribute)}
                  onChange={event =>
                    handleValueClick(
                      attribute.id,
                      attribute.name,
                      event.target.value
                    )
                  }
                  allowCustomValues={false}
                  choices={getBooleanChoices(
                    intl,
                    data.attributes.find(({ id }) => id === attribute.id).values
                  )}
                />
              ) : (
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
                    handleValueClick(
                      attribute.id,
                      attribute.name,
                      event.target.value
                    )
                  }
                  endAdornment={
                    attribute.unit &&
                    getMeasurementUnitMessage(
                      attribute.unit,
                      intl.formatMessage
                    )
                  }
                  fetchOnFocus={true}
                  allowCustomValues={true}
                  fetchChoices={value =>
                    fetchAttributeValues(value, attribute.id)
                  }
                  onBlur={onValueBlur}
                  {...fetchMoreAttributeValues}
                />
              )}
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
