import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { storiesOf } from "@storybook/react";
import React from "react";

import { attributes } from "@saleor/attributes/fixtures";
import { ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import Decorator from "../../../storybook/Decorator";
import { createVariants } from "./createVariants";
import { AllOrAttribute } from "./form";
import ProductVariantCreateContent, {
  ProductVariantCreateContentProps
} from "./ProductVariantCreateContent";
import ProductVariantCreateDialog from "./ProductVariantCreateDialog";

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

const errors: ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors[] = [
  {
    __typename: "BulkProductError",
    code: ProductErrorCode.UNIQUE,
    field: "sku",
    index: 3,
    message: "Duplicated SKU."
  }
];

const props: ProductVariantCreateContentProps = {
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
  onStepClick: () => undefined,
  step: "values"
};

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(storyFn => (
    <Card
      style={{
        margin: "auto",
        overflow: "visible",
        width: 800
      }}
    >
      <CardContent>{storyFn()}</CardContent>
    </Card>
  ))
  .addDecorator(Decorator)
  .add("choose values", () => <ProductVariantCreateContent {...props} />)
  .add("prices and SKU", () => (
    <ProductVariantCreateContent {...props} step="prices" />
  ));

storiesOf("Views / Products / Create multiple variants / summary", module)
  .addDecorator(storyFn => (
    <Card
      style={{
        margin: "auto",
        overflow: "visible",
        width: 800
      }}
    >
      <CardContent>{storyFn()}</CardContent>
    </Card>
  ))
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductVariantCreateContent {...props} step="summary" />
  ))
  .add("errors", () => (
    <ProductVariantCreateContent {...props} step="summary" errors={errors} />
  ));

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(Decorator)
  .add("interactive", () => (
    <ProductVariantCreateDialog
      {...props}
      defaultPrice="10.99"
      open={true}
      onClose={() => undefined}
      onSubmit={() => undefined}
    />
  ));
