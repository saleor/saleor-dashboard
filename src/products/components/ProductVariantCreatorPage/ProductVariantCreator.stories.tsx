import { storiesOf } from "@storybook/react";
import React from "react";

import { attributes } from "@saleor/attributes/fixtures";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import Container from "@saleor/components/Container";
import { warehouseList } from "@saleor/warehouses/fixtures";
import Decorator from "../../../storybook/Decorator";
import { createVariants } from "./createVariants";
import { AllOrAttribute, ProductVariantCreateFormData } from "./form";
import ProductVariantCreatorContent, {
  ProductVariantCreatorContentProps
} from "./ProductVariantCreatorContent";
import ProductVariantCreatorPage from "./ProductVariantCreatorPage";
import { ProductVariantCreatorStep } from "./types";

const selectedAttributes = [1, 4, 5].map(index => attributes[index]);
const selectedWarehouses = [0, 1, 3].map(index => warehouseList[index]);

const price: AllOrAttribute<string> = {
  all: false,
  attribute: selectedAttributes[0].id,
  value: "2.79",
  values: selectedAttributes[0].values.map((attribute, attributeIndex) => ({
    slug: attribute.slug,
    value: (attributeIndex + 4).toFixed(2)
  }))
};

const stock: AllOrAttribute<number[]> = {
  all: false,
  attribute: selectedAttributes[0].id,
  value: selectedWarehouses.map(
    (_, warehouseIndex) => (warehouseIndex + 2) * 3
  ),
  values: selectedAttributes[0].values.map((attribute, attributeIndex) => ({
    slug: attribute.slug,
    value: selectedWarehouses.map(
      (_, warehouseIndex) =>
        selectedAttributes.length * 10 - attributeIndex - warehouseIndex * 3
    )
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

const data: ProductVariantCreateFormData = {
  attributes: dataAttributes,
  price,
  stock,
  variants: createVariants({
    attributes: dataAttributes,
    price,
    stock,
    variants: [],
    warehouses: selectedWarehouses.map(warehouse => warehouse.id)
  }),
  warehouses: selectedWarehouses.map(warehouse => warehouse.id)
};
const props: ProductVariantCreatorContentProps = {
  attributes,
  currencySymbol: "USD",
  data: {
    ...data,
    variants: createVariants(data)
  },
  dispatchFormDataAction: () => undefined,
  errors: [],
  step: ProductVariantCreatorStep.values,
  warehouses: warehouseList
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
