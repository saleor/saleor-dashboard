import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { storiesOf } from "@storybook/react";
import React from "react";

import { attributes } from "@saleor/attributes/fixtures";
import { isSelected } from "@saleor/utils/lists";
import Decorator from "../../../storybook/Decorator";
import ProductVariantCreateContent, {
  ProductVariantCreateContentProps
} from "./ProductVariantCreateContent";
import ProductVariantCreateDialog from "./ProductVariantCreateDialog";

const selectedAttributes = [1, 2, 4].map(index => attributes[index].id);
const selectedValues = attributes
  .filter(attribute =>
    isSelected(attribute.id, selectedAttributes, (a, b) => a === b)
  )
  .map(attribute => attribute.values.map(value => value.id))
  .reduce((acc, curr) => [...acc, ...curr], [])
  .filter((_, valueIndex) => valueIndex % 2);

const props: ProductVariantCreateContentProps = {
  attributes,
  currencySymbol: "USD",
  data: {
    attributes: selectedAttributes,
    price: {
      all: false,
      attribute: selectedAttributes[1],
      value: "2.79",
      values: selectedAttributes.map((_, attributeIndex) =>
        (attributeIndex + 4).toFixed(2)
      )
    },
    stock: {
      all: false,
      attribute: selectedAttributes[1],
      value: "8",
      values: selectedAttributes.map((_, attributeIndex) =>
        (selectedAttributes.length * 10 - attributeIndex).toString()
      )
    },
    values: selectedValues,
    variants: [
      {
        attributes: attributes
          .filter(attribute => selectedAttributes.includes(attribute.id))
          .map(attribute => ({
            id: attribute.id,
            values: [attribute.values[0].id]
          })),
        product: "=1uahc98nas"
      }
    ]
  },
  dispatchFormDataAction: () => undefined,
  step: "attributes"
};

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(storyFn => (
    <Card
      style={{
        margin: "auto",
        overflow: "visible",
        width: 600
      }}
    >
      <CardContent>{storyFn()}</CardContent>
    </Card>
  ))
  .addDecorator(Decorator)
  .add("choose attributes", () => <ProductVariantCreateContent {...props} />)
  .add("select values", () => (
    <ProductVariantCreateContent {...props} step="values" />
  ))
  .add("prices and SKU", () => (
    <ProductVariantCreateContent {...props} step="prices" />
  ))
  .add("summary", () => (
    <ProductVariantCreateContent {...props} step="summary" />
  ));

storiesOf("Views / Products / Create multiple variants", module)
  .addDecorator(Decorator)
  .add("interactive", () => (
    <ProductVariantCreateDialog
      {...props}
      open={true}
      onClose={() => undefined}
      onSubmit={() => undefined}
    />
  ));
