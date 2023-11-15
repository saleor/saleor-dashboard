import { SaleDetailsQuery, VoucherDetailsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import {
  SearchCategoriesOpts,
  SearchCollectionOpts,
  SearchProductsOpts,
} from "./types";

type SaleOrVoucherData = SaleDetailsQuery | VoucherDetailsQuery;

const getCriteria = (data: SaleOrVoucherData) => {
  if (!!data && "sale" in data) {
    return data.sale;
  }
  if (!!data && "voucher" in data) {
    return data.voucher;
  }
};

export function getFilteredCategories(
  data: SaleOrVoucherData,
  searchCategoriesOpts: SearchCategoriesOpts,
) {
  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search);

  const criteria = getCriteria(data);

  if (!criteria?.categories?.edges) {
    return categories;
  }

  const excludedCategoryIds = criteria.categories.edges.map(
    category => category.node.id,
  );

  return categories?.filter(
    suggestedCategory => !excludedCategoryIds.includes(suggestedCategory.id),
  );
}

export function getFilteredCollections(
  data: SaleOrVoucherData,
  searchCollectionsOpts: SearchCollectionOpts,
) {
  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search);

  const criteria = getCriteria(data);

  if (!criteria?.collections?.edges) {
    return collections;
  }

  const excludedCollectionIds = criteria?.collections.edges.map(
    collection => collection.node.id,
  );

  return collections?.filter(
    suggestedCollection =>
      !excludedCollectionIds.includes(suggestedCollection.id),
  );
}

export function getFilteredProducts(
  data: SaleOrVoucherData,
  searchProductsOpts: SearchProductsOpts,
) {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);

  const criteria = getCriteria(data);

  if (!criteria?.products?.edges) {
    return products;
  }

  const excludedProductIds = criteria?.products.edges.map(
    product => product.node.id,
  );

  return products?.filter(
    suggestedProduct => !excludedProductIds.includes(suggestedProduct.id),
  );
}

export function getFilteredProductVariants(
  data: SaleDetailsQuery,
  searchProductsOpts: SearchProductsOpts,
) {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);

  if (!data?.sale?.variants?.edges) {
    return products;
  }
  const excludedVariantsIds = data?.sale?.variants.edges.map(
    variant => variant.node.id,
  );

  return products?.map(suggestedProduct => ({
    ...suggestedProduct,
    variants: suggestedProduct.variants?.filter(
      variant => !excludedVariantsIds.includes(variant.id),
    ),
  }));
}
