import useNavigator from "@saleor/hooks/useNavigator";
import {
  productListUrl,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
} from "@saleor/products/urls";
import { useEffect } from "react";

import { canBeSorted, DEFAULT_SORT_KEY } from "./sort";

export function useSortRedirects(
  params: ProductListUrlQueryParams,
  isChannelSelected: boolean,
) {
  const navigate = useNavigator();

  const hasQuery = !!params.query?.trim();

  useEffect(() => {
    const sortWithQuery = ProductListUrlSortField.rank;
    const sortWithoutQuery =
      params.sort === ProductListUrlSortField.rank
        ? DEFAULT_SORT_KEY
        : params.sort;
    navigate(
      productListUrl({
        ...params,
        asc: hasQuery ? false : params.asc,
        sort: hasQuery ? sortWithQuery : sortWithoutQuery,
      }),
    );
  }, [params.query]);

  useEffect(() => {
    if (!canBeSorted(params.sort, isChannelSelected)) {
      navigate(
        productListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);
}
