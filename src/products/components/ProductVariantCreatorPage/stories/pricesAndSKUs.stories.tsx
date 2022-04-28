import Container from "@saleor/components/Container";
import React from "react";

import Decorator from "../../../../storybook/Decorator";
import ProductVariantCreatorContent from "../ProductVariantCreatorContent";
import { ProductVariantCreatorStep } from "../types";
import { data, props } from "./fixtures";

export default {
  title: "Views / Products / Create multiple variants / prices and SKUs",
  decorators: [storyFn => <Container>{storyFn()}</Container>, Decorator]
};

export const ApplyToAll = () => (
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
);

ApplyToAll.story = {
  name: "apply to all"
};

export const ApplyToAllWhenOneWarehouse = () => (
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
);

ApplyToAllWhenOneWarehouse.story = {
  name: "apply to all when one warehouse"
};

export const ApplyToAttribute = () => (
  <ProductVariantCreatorContent
    {...props}
    step={ProductVariantCreatorStep.prices}
  />
);

ApplyToAttribute.story = {
  name: "apply to attribute"
};

export const ApplyToAttributeWhenOneWarehouse = () => (
  <ProductVariantCreatorContent
    {...props}
    data={{
      ...data,
      warehouses: [data.warehouses[0]]
    }}
    step={ProductVariantCreatorStep.prices}
    warehouses={[props.warehouses[0]]}
  />
);

ApplyToAttributeWhenOneWarehouse.story = {
  name: "apply to attribute when one warehouse"
};

export const ShipWhenNoWarehouses = () => (
  <ProductVariantCreatorContent
    {...props}
    data={{
      ...data,
      warehouses: []
    }}
    step={ProductVariantCreatorStep.prices}
    warehouses={[]}
  />
);

ShipWhenNoWarehouses.story = {
  name: "ship when no warehouses"
};
