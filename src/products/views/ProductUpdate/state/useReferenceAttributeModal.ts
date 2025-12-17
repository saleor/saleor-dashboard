import { InitialConstraints } from "@dashboard/components/AssignProductDialog/ModalProductFilterProvider";
import { AttributeInput } from "@dashboard/components/Attributes";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  ProductWhereInput,
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
  SearchPagesQuery,
  SearchPagesQueryVariables,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from "@dashboard/graphql";
import { UseSearchResult } from "@dashboard/hooks/makeSearch";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productUrl } from "@dashboard/products/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import {
  closeModalActionAtom,
  referenceModalStateAtom,
  referenceSearchActionsAtom,
  referenceSearchResultsAtom,
} from "./atoms";
import { ReferenceSearchActions, ReferenceSearchResults } from "./types";

interface SearchHooks {
  pages: UseSearchResult<SearchPagesQuery, SearchPagesQueryVariables>;
  products: UseSearchResult<SearchProductsQuery, SearchProductsQueryVariables>;
  categories: UseSearchResult<SearchCategoriesQuery, SearchCategoriesQueryVariables>;
  collections: UseSearchResult<SearchCollectionsQuery, SearchCollectionsQueryVariables>;
}

interface UseReferenceAttributeModalOptions {
  productId: string;
  searchHooks: SearchHooks;
  refAttr: AttributeDetailsFragment | undefined;
  initialConstraints: InitialConstraints | undefined;
}

export interface UseReferenceAttributeModalResult {
  openModal: (attribute: AttributeInput) => void;
  closeModal: () => void;
}

export const useReferenceAttributeModal = ({
  productId,
  searchHooks,
  refAttr,
  initialConstraints,
}: UseReferenceAttributeModalOptions): UseReferenceAttributeModalResult => {
  const navigate = useNavigator();

  const [, setModalState] = useAtom(referenceModalStateAtom);
  const [, setSearchResults] = useAtom(referenceSearchResultsAtom);
  const [, setSearchActions] = useAtom(referenceSearchActionsAtom);
  const [, setCloseModalAction] = useAtom(closeModalActionAtom);

  // Sync search results from hooks to atom
  const searchResults = useMemo(
    (): ReferenceSearchResults => ({
      pages: mapEdgesToItems(searchHooks.pages.result?.data?.search) || [],
      products: mapEdgesToItems(searchHooks.products.result?.data?.search) || [],
      categories: mapEdgesToItems(searchHooks.categories.result?.data?.search) || [],
      collections: mapEdgesToItems(searchHooks.collections.result?.data?.search) || [],
    }),
    [
      searchHooks.pages.result?.data?.search,
      searchHooks.products.result?.data?.search,
      searchHooks.categories.result?.data?.search,
      searchHooks.collections.result?.data?.search,
    ],
  );

  useEffect(() => {
    setSearchResults(searchResults);
  }, [searchResults, setSearchResults]);

  // Build search actions
  const handleProductFilterChange = useCallback(
    (filterVariables: ProductWhereInput, channel: string | undefined) => {
      const baseWhere: ProductWhereInput = initialConstraints?.productTypes?.length
        ? { productType: { oneOf: initialConstraints.productTypes.map(pt => pt.id) } }
        : {};

      searchHooks.products.result.refetch({
        ...DEFAULT_INITIAL_SEARCH_DATA,
        where: { ...baseWhere, ...filterVariables },
        channel,
      });
    },
    [initialConstraints, searchHooks.products.result],
  );

  const searchActions = useMemo(
    (): ReferenceSearchActions => ({
      searchPages: searchHooks.pages.search,
      searchProducts: searchHooks.products.search,
      searchCategories: searchHooks.categories.search,
      searchCollections: searchHooks.collections.search,
      fetchMorePages: getSearchFetchMoreProps(
        searchHooks.pages.result as unknown as CommonSearchOpts,
        searchHooks.pages.loadMore,
      ),
      fetchMoreProducts: getSearchFetchMoreProps(
        searchHooks.products.result as unknown as CommonSearchOpts,
        searchHooks.products.loadMore,
      ),
      fetchMoreCategories: getSearchFetchMoreProps(
        searchHooks.categories.result as unknown as CommonSearchOpts,
        searchHooks.categories.loadMore,
      ),
      fetchMoreCollections: getSearchFetchMoreProps(
        searchHooks.collections.result as unknown as CommonSearchOpts,
        searchHooks.collections.loadMore,
      ),
      onProductFilterChange: handleProductFilterChange,
    }),
    [searchHooks, handleProductFilterChange],
  );

  useEffect(() => {
    setSearchActions(searchActions);
  }, [searchActions, setSearchActions]);

  // Sync modal state when refAttr changes (URL-driven)
  useEffect(() => {
    if (refAttr) {
      setModalState({
        openAttributeId: refAttr.id,
        initialConstraints,
      });
    } else {
      setModalState({
        openAttributeId: null,
        initialConstraints: undefined,
      });
    }
  }, [refAttr, initialConstraints, setModalState]);

  const openModal = useCallback(
    (attribute: AttributeInput) => {
      navigate(
        productUrl(productId, {
          action: "assign-attribute-value",
          id: attribute.id,
        }),
        { resetScroll: false },
      );
    },
    [productId, navigate],
  );

  const closeModal = useCallback(() => {
    navigate(productUrl(productId), { resetScroll: false });
  }, [productId, navigate]);

  // Sync closeModal action to atom for consumers
  useEffect(() => {
    setCloseModalAction(() => closeModal);
  }, [closeModal, setCloseModalAction]);

  return {
    openModal,
    closeModal,
  };
};
