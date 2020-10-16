import placeholderImage from "@assets/images/placeholder255x255.png";
import { ProductErrorCode } from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import ProductVariantCreatePage from "../../../products/components/ProductVariantCreatePage";
import { product as productFixture } from "../../../products/fixtures";
import Decorator from "../../Decorator";

const product = productFixture(placeholderImage);
const channels = product.channelListing.map(listing => ({
  costPrice: null,
  currency: listing.channel.currencyCode,
  id: listing.channel.id,
  name: listing.channel.name,
  price: null
}));

storiesOf("Views / Products / Create product variant", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <ProductVariantCreatePage
      channels={channels}
      channelErrors={[]}
      disabled={false}
      errors={[]}
      header="Add variant"
      product={product}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
    />
  ))
  .add("with errors", () => (
    <ProductVariantCreatePage
      channels={channels}
      channelErrors={[]}
      disabled={false}
      errors={[
        {
          code: ProductErrorCode.REQUIRED,
          field: "attributes"
        },
        {
          code: ProductErrorCode.UNIQUE,
          field: "attributes"
        },
        {
          code: ProductErrorCode.ALREADY_EXISTS,
          field: "sku"
        }
      ].map(error => ({
        __typename: "ProductError",
        ...error
      }))}
      header="Add variant"
      product={product}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
    />
  ))
  .add("when loading data", () => (
    <ProductVariantCreatePage
      channels={channels}
      channelErrors={[]}
      disabled={true}
      errors={[]}
      header="Add variant"
      product={undefined}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
    />
  ))
  .add("add first variant", () => (
    <ProductVariantCreatePage
      channels={channels}
      channelErrors={[]}
      disabled={false}
      errors={[]}
      header="Add variant"
      product={{
        ...product,
        variants: []
      }}
      onBack={() => undefined}
      onSubmit={() => undefined}
      onVariantClick={undefined}
      saveButtonBarState="default"
      warehouses={warehouseList}
    />
  ));
