import { storiesOf } from "@storybook/react";
import React from "react";

import { attributes } from "@saleor/attributes/fixtures";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import Container from "@saleor/components/Container";
import Decorator from "../../../storybook/Decorator";
import { createVariants } from "./createVariants";
import { AllOrAttribute } from "./form";
import ProductVariantCreatorContent, {
  ProductVariantCreatorContentProps
} from "./ProductVariantCreatorContent";
import ProductVariantCreatorPage from "./ProductVariantCreatorPage";
import { ProductVariantCreatorStep } from "./types";

const selectedAttributes = [1, 4, 5].map(index => attributes[index]);

const price: AllOrAttribute = {
  all: false,
  attribute: selectedAttributes[1].id,
  value: "2.79",
  values: selectedAttributes[1].values.map((attribute, attributeIndex) => ({
    slug: attribute.slug,
    value: (attributeIndex + 4).toFixed(2)
  }))
};

const stock: AllOrAttribute = {
  all: false,
  attribute: selectedAttributes[1].id,
  value: "8",
  values: selectedAttributes[1].values.map((attribute, attributeIndex) => ({
    slug: attribute.slug,
    value: (selectedAttributes.length * 10 - attributeIndex).toString()
  }))
};

const dataAttributes = selectedAttributes.map(attribute => ({
  id: attribute.id,
  values: attribute.values
    .map(value => value.slug)
    .filter((_, valueIndex) => valueIndex % 2 !== 1)
}));

const errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[] = [
  {
    __typename: "BulkProductError",
    code: ProductErrorCode.UNIQUE,
    field: "sku",
    index: 3
  }
];

const props: ProductVariantCreatorContentProps = {
  attributes,
  currencySymbol: "USD",
  data: {
    attributes: dataAttributes,
    price,
    stock,
    variants: createVariants({
      attributes: dataAttributes,
      price,
      stock,
      variants: []
    })
  },
  dispatchFormDataAction: () => undefined,
  errors: [],
  step: ProductVariantCreatorStep.values
};

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .addDecorator(Decorator)
  .add("choose values", () => <ProductVariantCreatorContent {...props} />)
  .add("prices and SKU", () => (
    <ProductVariantCreatorContent
      {...props}
      step={ProductVariantCreatorStep.prices}
    />
  ));

storiesOf("Views / Products / Create multiple variants / summary", module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductVariantCreatorContent
      {...props}
      step={ProductVariantCreatorStep.summary}
    />
  ))
  .add("errors", () => (
    <ProductVariantCreatorContent
      {...props}
      step={ProductVariantCreatorStep.summary}
      errors={errors}
    />
  ));

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(Decorator)
  .add("interactive", () => (
    <ProductVariantCreatorPage
      {...props}
      defaultPrice="10.99"
      onSubmit={() => undefined}
    />
  ));
