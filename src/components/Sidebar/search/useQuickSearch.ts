import { QuickSearchQuery, useQuickSearchLazyQuery } from "@dashboard/graphql";

export interface Order {
  id: string;
  number: string;
  status: string;
  total: {
    amount: number;
    currency: string;
  };
  type: "order";
}

export interface Category {
  id: string;
  name: string;
  thumbnail: { url: string; alt: string };
  totalProducts: number;
  type: "category";
}

export interface Collection {
  id: string;
  name: string;
  totalProducts: number;
  thumbnail: { url: string; alt: string };
  type: "collection";
}

export interface Product {
  id: string;
  name: string;
  category: {
    name: string;
  };
  thumbnail: { url: string; alt: string };
  type: "product";
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  thumbnail: { url: string; alt: string };
  product: {
    id: string;
    category: {
      name: string;
    };
  };
  type: "productVariant";
}

export interface QuickSearchResult {
  orders: Order[];
  categories: Category[];
  collections: Collection[];
  products: Product[];
  productVariants: ProductVariant[];
}

const toOrderItem = (node: QuickSearchQuery["orders"]["edges"][number]): Order => ({
  id: node.node.id,
  number: node.node.number,
  status: node.node.status,
  total: {
    amount: node.node.total.gross.amount,
    currency: node.node.total.gross.currency,
  },
  type: "order",
});

const toCategoryItem = (node: QuickSearchQuery["categories"]["edges"][number]): Category => ({
  id: node.node.id,
  name: node.node.name,
  thumbnail: {
    url: node.node.backgroundImage?.url,
    alt: node.node.backgroundImage?.alt,
  },
  totalProducts: node.node.products.totalCount,
  type: "category",
});

const toCollectionItem = (node: QuickSearchQuery["collections"]["edges"][number]): Collection => ({
  id: node.node.id,
  name: node.node.name,
  totalProducts: node.node.products.totalCount,
  thumbnail: {
    url: node.node.backgroundImage?.url,
    alt: node.node.backgroundImage?.alt,
  },
  type: "collection",
});

const toProductItem = (node: QuickSearchQuery["products"]["edges"][number]): Product => ({
  id: node.node.id,
  name: node.node.name,
  category: {
    name: node.node.category.name,
  },
  thumbnail: {
    url: node.node.thumbnail?.url,
    alt: node.node.thumbnail?.alt,
  },
  type: "product",
});

const toProductVariantItem = (
  node: QuickSearchQuery["productVariants"]["edges"][number],
): ProductVariant => ({
  id: node.node.id,
  name: node.node.name,
  sku: node.node.sku,
  thumbnail: {
    url: node.node.media[0]?.url,
    alt: node.node.media[0]?.alt,
  },
  product: {
    id: node.node.product.id,
    category: {
      name: node.node.product.category.name,
    },
  },
  type: "productVariant",
});

export const useQuickSearch = () => {
  const [_search, { data, loading, error }] = useQuickSearchLazyQuery();

  const search = (query: string) => {
    _search({ variables: { query } });
  };

  const results = {
    orders: data?.orders?.edges.map(toOrderItem) || [],
    categories: data?.categories?.edges.map(toCategoryItem) || [],
    collections: data?.collections?.edges.map(toCollectionItem) || [],
    products: data?.products?.edges.map(toProductItem) || [],
    productVariants: data?.productVariants?.edges.map(toProductVariantItem) || [],
  };

  const noResults =
    results.orders.length === 0 &&
    results.categories.length === 0 &&
    results.collections.length === 0 &&
    results.products.length === 0 &&
    results.productVariants.length === 0;

  return {
    search,
    results,
    loading: typeof data === "undefined" || loading,
    error,
    noResults,
  };
};
