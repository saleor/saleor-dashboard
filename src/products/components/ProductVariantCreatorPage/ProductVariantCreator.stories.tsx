import { attributes } from "@saleor/attributes/fixtures";
import Container from "@saleor/components/Container";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

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
  attribute: selectedAttributes[0].id,
  mode: "attribute",
  value: "2.79",
  values: selectedAttributes[0].values.map((attribute, attributeIndex) => ({
    slug: attribute.slug,
    value: (attributeIndex + 4).toFixed(2)
  }))
};

const stock: AllOrAttribute<number[]> = {
  attribute: selectedAttributes[0].id,
  mode: "attribute",
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
  attributes: [0, 1, 4, 6].map(index => attributes[index]),
  attributesListElements: dataAttributes.map(attribute => attribute.id),
  currencySymbol: "USD",
  data: {
    ...data,
    variants: createVariants(data)
  },
  dispatchFormDataAction: () => undefined,
  errors: [],
  isChecked: () => undefined,
  selected: 0,
  step: ProductVariantCreatorStep.values,
  toggle: () => undefined,
  toggleAll: () => undefined,
  warehouses: warehouseList
};

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .addDecorator(Decorator)
  .add("choose values", () => <ProductVariantCreatorContent {...props} />);

storiesOf(
  "Views / Products / Create multiple variants / prices and SKUs",
  module
)
  .addDecorator(storyFn => <Container>{storyFn()}</Container>)
  .addDecorator(Decorator)
  .add("apply to all", () => (
    <ProductVariantCreatorContent
      {...props}
      data={{
        ...data,
        stock: {
          ...data.stock,
          mode: "all"
        }
      }}
      step={ProductVariantCreatorStep.prices}
    />
  ))
  .add("apply to all when one warehouse", () => (
    <ProductVariantCreatorContent
      {...props}
      data={{
        ...data,
        stock: {
          ...data.stock,
          mode: "all"
        },
        warehouses: [data.warehouses[0]]
      }}
      step={ProductVariantCreatorStep.prices}
      warehouses={[props.warehouses[0]]}
    />
  ))
  .add("apply to attribute", () => (
    <ProductVariantCreatorContent
      {...props}
      step={ProductVariantCreatorStep.prices}
    />
  ))
  .add("apply to attribute when one warehouse", () => (
    <ProductVariantCreatorContent
      {...props}
      data={{
        ...data,
        warehouses: [data.warehouses[0]]
      }}
      step={ProductVariantCreatorStep.prices}
      warehouses={[props.warehouses[0]]}
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
