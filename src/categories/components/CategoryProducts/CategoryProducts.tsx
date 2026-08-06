import { NetworkStatus } from "@apollo/client";
import {
  categoryUrl,
  type CategoryUrlDialog,
  type CategoryUrlQueryParams,
} from "@dashboard/categories/urls";
import {
  getProductsFromSearchResults,
  isProductAssignedToCategory,
} from "@dashboard/categories/utils";
import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import { ProductsTable } from "@dashboard/collections/components/CollectionProducts/ProductsTable";
import { ProductTableSkeleton } from "@dashboard/collections/components/CollectionProducts/ProductTableSkeleton";
import { useOptimisticPendingIds } from "@dashboard/collections/components/CollectionProducts/useOptimisticPendingIds";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog/AssignProductDialog";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@dashboard/config";
import {
  type CategoryDetailsQuery,
  type ProductWhereInput,
  type SearchProductsQueryVariables,
  useCategoryProductsQuery,
  useProductUpdateMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { type Container, ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button } from "@saleor/macaw-ui-next";
import { type MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

const ASSIGN_PRODUCT_SEARCH_PAGE_SIZE = 100;

const assignProductSearchVariables: SearchProductsQueryVariables = {
  ...DEFAULT_INITIAL_SEARCH_DATA,
  first: ASSIGN_PRODUCT_SEARCH_PAGE_SIZE,
};

interface CategoryProductsProps {
  category: Pick<NonNullable<CategoryDetailsQuery["category"]>, "id" | "name"> | null | undefined;
  categoryId: string;
  params: CategoryUrlQueryParams;
  disabled: boolean;
}

export const CategoryProducts = ({
  category,
  categoryId,
  params,
  disabled,
}: CategoryProductsProps): JSX.Element => {
  const navigate = useNavigator();
  const [openModal, closeModal] = createDialogActionHandlers<
    CategoryUrlDialog,
    CategoryUrlQueryParams
  >(navigate, modalParams => categoryUrl(categoryId, modalParams), params);
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

  const intl = useIntl();
  const { settings, updateListSettings } = useListSettings(ListViews.COLLECTION_PRODUCTS_LIST);
  const numberOfRows = settings ? settings.rowNumber : PAGINATE_BY;
  const [paginationState, setPaginationState] = useLocalPaginationState(numberOfRows);
  const notify = useNotifier();
  const [updateProduct, updateProductOpts] = useProductUpdateMutation();

  const {
    data,
    networkStatus,
    refetch: refetchCategoryProducts,
  } = useCategoryProductsQuery({
    displayLoader: true,
    notifyOnNetworkStatusChange: true,
    variables: { id: categoryId, ...paginationState },
  });

  const products = mapEdgesToItems(data?.category?.products);
  const { markPending, clearPending, filterOutPending } = useOptimisticPendingIds();
  const visibleProducts = useMemo(
    () => filterOutPending(products ?? []),
    [filterOutPending, products],
  );
  const showProductsSkeleton =
    networkStatus === NetworkStatus.setVariables ||
    (networkStatus === NetworkStatus.loading && products === undefined);
  const numberOfColumns = visibleProducts.length === 0 ? 4 : 5;
  const paginate = useLocalPaginator(setPaginationState);

  const { pageInfo, ...paginationValues } = paginate(
    data?.category?.products?.pageInfo,
    paginationState,
  );

  const [productSearchVariables, setProductSearchVariables] = useState(
    assignProductSearchVariables,
  );
  const isAssignDialogOpen = params.action === "assign";
  const { loadMore, result } = useProductSearch({
    variables: productSearchVariables,
    skip: !isAssignDialogOpen,
  });
  const [searchGeneration, setSearchGeneration] = useState(0);

  useEffect(() => {
    if (!isAssignDialogOpen) {
      setProductSearchVariables(assignProductSearchVariables);
      setSearchGeneration(0);
    }
  }, [isAssignDialogOpen]);

  const handleFilterChange = useCallback(
    (filterVariables: ProductWhereInput, channel: string | undefined, query: string) => {
      setSearchGeneration(generation => generation + 1);
      setProductSearchVariables({
        ...assignProductSearchVariables,
        where: filterVariables,
        channel,
        query,
      });
    },
    [],
  );

  const handleAssignDialogClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const searchedProducts = useMemo(
    () => getProductsFromSearchResults(result?.data) ?? [],
    [result?.data],
  );

  const isAssignedToThisCategory = useCallback(
    (product: (typeof searchedProducts)[number]) =>
      isProductAssignedToCategory(product, category?.id),
    [category?.id],
  );

  const notifyProductCategoryFailure = useCallback(
    (errorMessage?: string | null) => {
      notify({
        status: "error",
        text: errorMessage || intl.formatMessage(commonMessages.somethingWentWrong),
      });
    },
    [intl, notify],
  );
  const refetchCategoryProductsSafely = async (): Promise<void> => {
    try {
      await refetchCategoryProducts();
    } catch {
      notifyProductCategoryFailure();
    }
  };

  const updateProductCategory = useCallback(
    async (productIds: string[], categoryValue: string | null) => {
      const results = await Promise.allSettled(
        productIds.map(productId =>
          updateProduct({
            variables: {
              id: productId,
              input: { category: categoryValue },
            },
          }),
        ),
      );
      const errors = results.flatMap(resultItem =>
        resultItem.status === "fulfilled"
          ? (resultItem.value.data?.productUpdate?.errors ?? [])
          : [],
      );
      const success =
        errors.length === 0 &&
        results.every(
          resultItem =>
            resultItem.status === "fulfilled" && Boolean(resultItem.value.data?.productUpdate),
        );

      return {
        success,
        errorMessage: errors[0]?.message,
      };
    },
    [updateProduct],
  );

  const handleProductUnassign = async (
    productId: string,
    _event: MouseEvent<HTMLButtonElement>,
  ) => {
    markPending([productId]);

    const { success, errorMessage } = await updateProductCategory([productId], null);

    if (!success) {
      clearPending([productId]);
      notifyProductCategoryFailure(errorMessage);
      await refetchCategoryProductsSafely();

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.productUnassigned),
    });
    clearPending([productId]);
    await refetchCategoryProductsSafely();
  };

  const handleAssignationChange = async (selectedProducts: Container[]) => {
    const productIds = selectedProducts.map(product => product.id);

    if (productIds.length === 0) {
      closeModal();

      return;
    }

    const { success, errorMessage } = await updateProductCategory(productIds, categoryId);

    if (!success) {
      notifyProductCategoryFailure(errorMessage);
      await refetchCategoryProductsSafely();

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.productAssigned),
    });
    closeModal();
    await refetchCategoryProductsSafely();
  };

  const handleBulkUnassign = async () => {
    const productIds = params.ids ?? [];

    if (productIds.length === 0) {
      return;
    }

    markPending(productIds);
    closeModal();

    const { success, errorMessage } = await updateProductCategory(productIds, null);

    if (!success) {
      clearPending(productIds);
      notifyProductCategoryFailure(errorMessage);
      await refetchCategoryProductsSafely();

      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.productsUnassigned),
    });
    reset();
    clearPending(productIds);
    await refetchCategoryProductsSafely();
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <DetailSettingsCard
        title={
          category ? (
            intl.formatMessage(
              {
                id: "+43JV5",
                defaultMessage: "Products in {categoryName}",
                description: "header",
              },
              {
                categoryName: category.name,
              },
            )
          ) : (
            <Skeleton __height="14px" __width="12rem" />
          )
        }
        headerEnd={
          <Button
            data-test-id="assign-product"
            disabled={disabled}
            variant="secondary"
            size="small"
            type="button"
            onClick={() => openModal("assign")}
          >
            <FormattedMessage id="scHVdW" defaultMessage="Assign product" description="button" />
          </Button>
        }
        contentFlush
        data-test-id="category-products"
      >
        {showProductsSkeleton ? (
          <ProductTableSkeleton rowCount={numberOfRows} reorderable={false} />
        ) : (
          <ProductsTable
            paginationState={paginationState}
            selected={listElements.length}
            products={visibleProducts}
            isChecked={isSelected}
            toggle={toggle}
            toggleAll={toggleAll}
            disabled={disabled}
            onProductUnassign={handleProductUnassign}
            numberOfColumns={numberOfColumns}
            onUnassignClick={() =>
              openModal("unassign", {
                ids: listElements,
              })
            }
            updateListSettings={updateListSettings}
            numberOfRows={numberOfRows}
            reorderable={false}
          />
        )}
        {!showProductsSkeleton && visibleProducts.length > 0 ? (
          <Pagination numberOfRows={numberOfRows} onUpdateListSettings={updateListSettings} />
        ) : null}
      </DetailSettingsCard>
      <AssignProductDialog
        confirmButtonState={updateProductOpts.status}
        hasMore={result.data?.search?.pageInfo?.hasNextPage ?? false}
        open={params.action === "assign"}
        skipFetchOnOpen
        onFetchMore={loadMore}
        loading={result.loading}
        onClose={handleAssignDialogClose}
        onSubmit={handleAssignationChange}
        products={searchedProducts}
        excludeProduct={isAssignedToThisCategory}
        selectAllMode="when-scoped"
        backfillResetKey={String(searchGeneration)}
        onFilterChange={handleFilterChange}
      />
      <ActionDialog
        confirmButtonState={updateProductOpts.status}
        onClose={closeModal}
        onConfirm={handleBulkUnassign}
        open={params.action === "unassign"}
        title={intl.formatMessage(messages.unassignTitle)}
      >
        <FormattedMessage
          {...messages.unassignBody}
          values={{
            counter: params.ids?.length ?? 0,
            displayQuantity: <strong>{params.ids?.length ?? 0}</strong>,
          }}
        />
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};
