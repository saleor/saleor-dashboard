// @ts-strict-ignore
import { attributes } from "@dashboard/attributes/fixtures";
import { categories } from "@dashboard/categories/fixtures";
import { collections } from "@dashboard/collections/fixtures";
import { fetchMoreProps, searchPageProps } from "@dashboard/fixtures";
import { StockAvailability } from "@dashboard/graphql";
import { ProductListFilterOpts } from "@dashboard/products/components/ProductListPage";
import { productTypes } from "@dashboard/productTypes/fixtures";
import { mapEdgesToItems, mapSlugNodeToChoice } from "@dashboard/utils/maps";

export const productListFilterOpts: ProductListFilterOpts = {
  attributes: attributes.map(attr => ({
    id: attr.id,
    active: false,
    inputType: attr.inputType,
    name: attr.name,
    slug: attr.slug,
    value: [
      attr.choices.edges[0].node.slug,
      attr.choices.edges.length > 2 && attr.choices.edges[2].node.slug,
    ],
  })),
  attributeChoices: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    value: null,
    choices: mapSlugNodeToChoice(mapEdgesToItems(attributes[0].choices)),
    displayValues: mapSlugNodeToChoice(mapEdgesToItems(attributes[0].choices)),
  },
  categories: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: categories.slice(5).map(category => ({
      label: category.name,
      value: category.id,
    })),
    displayValues: [
      {
        label: categories[5].name,
        value: categories[5].id,
      },
    ],
    value: [categories[5].id],
  },
  channel: {
    active: false,
    value: "default-channel",
    choices: [
      {
        value: "default-channel",
        label: "Default channel",
      },
    ],
  },
  metadata: {
    active: false,
    value: [{ key: "metadataKey", value: "metadataValue" }],
  },
  productKind: {
    active: false,
    value: "NORMAL",
    choices: [
      {
        value: "NORMAL",
        label: "Normal",
      },
    ],
  },
  collections: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: collections.slice(5).map(category => ({
      label: category.name,
      value: category.id,
    })),
    displayValues: [
      {
        label: collections[5].name,
        value: collections[5].id,
      },
    ],
    value: [collections[5].id],
  },
  price: {
    active: false,
    value: {
      max: "20",
      min: "10",
    },
  },
  productType: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: productTypes.slice(3).map(category => ({
      label: category.name,
      value: category.id,
    })),
    displayValues: [
      {
        label: productTypes[3].name,
        value: productTypes[3].id,
      },
    ],
    value: [productTypes[4].id],
  },
  stockStatus: {
    active: false,
    value: StockAvailability.IN_STOCK,
  },
};
