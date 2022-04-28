import { attributes } from "@saleor/attributes/fixtures";
import { productChannels } from "@saleor/channels/fixtures";
import { fetchMoreProps } from "@saleor/fixtures";
import { BulkProductErrorFragment, ProductErrorCode } from "@saleor/graphql";
import { warehouseList } from "@saleor/warehouses/fixtures";

import { createVariants } from "../createVariants";
import {
  ChannelPrice,
  Price,
  ProductVariantCreateFormData,
  Stock
} from "../form";
import { ProductVariantCreatorContentProps } from "../ProductVariantCreatorContent";
import { ProductVariantCreatorStep } from "../types";

export const selectedAttributes = [1, 4, 5].map(index => attributes[index]);
export const selectedWarehouses = [0, 1, 3].map(index => warehouseList[index]);

export const channels: ChannelPrice[] = productChannels.map(channel => ({
  channelId: channel.channel.id,
  price: channel.pricing?.priceRange?.start?.net.amount.toString()
}));

export const price: Price = {
  attribute: selectedAttributes[0].id,
  channels,
  mode: "attribute",
  values: selectedAttributes[0].choices.edges.map(attribute => ({
    slug: attribute.node.slug,
    value: channels
  }))
};

export const stock: Stock = {
  attribute: selectedAttributes[0].id,
  mode: "attribute",
  value: selectedWarehouses.map(
    (_, warehouseIndex) => (warehouseIndex + 2) * 3
  ),
  values: selectedAttributes[0].choices.edges.map(
    (attribute, attributeIndex) => ({
      slug: attribute.node.slug,
      value: selectedWarehouses.map(
        (_, warehouseIndex) =>
          selectedAttributes.length * 10 - attributeIndex - warehouseIndex * 3
      )
    })
  )
};

export const dataAttributes = selectedAttributes.map(attribute => ({
  id: attribute.id,
  valueRequired: attribute.valueRequired,
  values: attribute.choices.edges
    .map(value => ({
      slug: value.node.slug,
      value: value.node
    }))
    .filter((_, valueIndex) => valueIndex % 2 !== 1)
}));

export const errors: BulkProductErrorFragment[] = [
  {
    __typename: "BulkProductError",
    channels: [channels[0].channelId],
    code: ProductErrorCode.UNIQUE,
    field: "sku",
    index: 3,
    message: "Uniwue bulk product error"
  }
];

export const data: ProductVariantCreateFormData = {
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
export const props: ProductVariantCreatorContentProps = {
  attributes: [0, 1, 4, 6].map(index => attributes[index]),
  attributeValues: [],
  fetchAttributeValues: () => undefined,
  fetchMoreAttributeValues: fetchMoreProps,
  channelListings: productChannels.map(listing => ({
    currency: listing.pricing?.priceRange?.start?.net.currency,
    id: listing.channel.id,
    name: listing.channel.name,
    price: listing.pricing?.priceRange?.start?.net?.amount.toString() || ""
  })),
  data: {
    ...data,
    variants: createVariants(data)
  },
  dispatchFormDataAction: () => undefined,
  errors: [],
  variantsLeft: 6,
  step: ProductVariantCreatorStep.values,
  warehouses: warehouseList,
  onAttributeSelectBlur: () => undefined
};
