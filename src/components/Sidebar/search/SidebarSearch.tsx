import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import {
  CategoryItem,
  CollectionItem,
  Loading,
  NoResults,
  OrderItem,
  ProductItem,
  ProductVariantItem,
} from "./Results";
import { SidebarSearchInput } from "./SidebarSearchInput";
import { useQuickSearch } from "./useQuickSearch";

const SectionHeader = ({ title }: { title: string }) => (
  <Text size={3} paddingX={1} marginBottom={2} fontWeight="bold" display="block">
    {title}
  </Text>
);

export const SidebarSearch = () => {
  const intl = useIntl();
  const { search, results, loading, noResults } = useQuickSearch();

  const _handleChangeQuery = (query: string) => {
    search(query);
  };
  const handleChangeQuery = useDebounce(_handleChangeQuery, 500);

  const ordersHeaderText = intl.formatMessage({ id: "X7jl6w", defaultMessage: "Orders" });
  const categoriesHeaderText = intl.formatMessage({ id: "VKb1MS", defaultMessage: "Categories" });
  const collectionsHeaderText = intl.formatMessage({ id: "ulh3kf", defaultMessage: "Collections" });
  const productsHeaderText = intl.formatMessage({ id: "7NFfmz", defaultMessage: "Products" });
  const productVariantsHeaderText = intl.formatMessage({
    id: "j9HJG/",
    defaultMessage: "Product variants",
  });

  return (
    <Box>
      <SidebarSearchInput onChangeQuery={handleChangeQuery}>
        <Box height="100%">
          {loading && <Loading />}
          {noResults && <NoResults />}

          {!loading && !noResults && (
            <>
              {results.orders.length > 0 && <SectionHeader title={ordersHeaderText} />}
              {results.orders.map(result => (
                <OrderItem key={result.id} item={result} />
              ))}
              {results.categories.length > 0 && <SectionHeader title={categoriesHeaderText} />}
              {results.categories.map(result => (
                <CategoryItem key={result.id} item={result} />
              ))}
              {results.collections.length > 0 && <SectionHeader title={collectionsHeaderText} />}
              {results.collections.map(result => (
                <CollectionItem key={result.id} item={result} />
              ))}
              {results.products.length > 0 && <SectionHeader title={productsHeaderText} />}
              {results.products.map(result => (
                <ProductItem key={result.id} item={result} />
              ))}
              {results.productVariants.length > 0 && (
                <SectionHeader title={productVariantsHeaderText} />
              )}
              {results.productVariants.map(result => (
                <ProductVariantItem key={result.id} item={result} />
              ))}
            </>
          )}
        </Box>
      </SidebarSearchInput>
    </Box>
  );
};
