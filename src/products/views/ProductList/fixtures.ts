import { attributes } from "@saleor/attributes/fixtures";
import { categories } from "@saleor/categories/fixtures";
import { collections } from "@saleor/collections/fixtures";
import { fetchMoreProps, searchPageProps } from "@saleor/fixtures";
import { ProductListFilterOpts } from "@saleor/products/components/ProductListPage";
import { productTypes } from "@saleor/productTypes/fixtures";
import { StockAvailability } from "@saleor/types/globalTypes";

export const productListFilterOpts: ProductListFilterOpts = {
  attributes: attributes.map(attr => ({
    active: false,
    choices: attr.choices.edges.map(val => ({
      label: val.node.name,
      value: val.node.slug
    })),
    name: attr.name,
    slug: attr.slug,
    value: [
      attr.choices.edges[0].node.slug,
      attr.choices.edges.length > 2 && attr.choices.edges[2].node.slug
    ]
  })),
  categories: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: categories.slice(5).map(category => ({
      label: category.name,
      value: category.id
    })),
    displayValues: [
      {
        label: categories[5].name,
        value: categories[5].id
      }
    ],
    value: [categories[5].id]
  },
  collections: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: collections.slice(5).map(category => ({
      label: category.name,
      value: category.id
    })),
    displayValues: [
      {
        label: collections[5].name,
        value: collections[5].id
      }
    ],
    value: [collections[5].id]
  },
  price: {
    active: false,
    value: {
      max: "20",
      min: "10"
    }
  },
  productType: {
    ...fetchMoreProps,
    ...searchPageProps,
    active: false,
    choices: productTypes.slice(3).map(category => ({
      label: category.name,
      value: category.id
    })),
    displayValues: [
      {
        label: productTypes[3].name,
        value: productTypes[3].id
      }
    ],
    value: [productTypes[4].id]
  },
  stockStatus: {
    active: false,
    value: StockAvailability.IN_STOCK
  }
};
