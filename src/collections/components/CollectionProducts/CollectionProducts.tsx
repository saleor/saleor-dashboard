import { NetworkStatus } from "@apollo/client";
import { type ChannelCollectionData } from "@dashboard/channels/utils";
import {
  collectionUrl,
  type CollectionUrlDialog,
  type CollectionUrlQueryParams,
} from "@dashboard/collections/urls";
import {
  getProductsFromSearchResults,
  isProductAssignedToCollection,
} from "@dashboard/collections/utils";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { AssignableListCard } from "@dashboard/components/AssignableListTable/AssignableListCard";
import { AssignableListPagination } from "@dashboard/components/AssignableListTable/AssignableListPagination";
import AssignProductDialog from "@dashboard/components/AssignProductDialog/AssignProductDialog";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@dashboard/config";
import {
  type CollectionDetailsQuery,
  type ProductWhereInput,
  type SearchProductsQueryVariables,
  useCollectionAssignProductMutation,
  useCollectionProductsQuery,
  useUnassignCollectionProductMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { commonMessages } from "@dashboard/intl";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { type Container } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button } from "@saleor/macaw-ui-next";
import { type MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListViews } from "../../../types";
import { ProductsTable } from "./ProductsTable";
import { ProductTableSkeleton } from "./ProductTableSkeleton";
import { useCollectionId } from "./useCollectionId";
import { useOptimisticPendingIds } from "./useOptimisticPendingIds";

/**
 * Products already in the collection are dropped from the fetched page client-side, so a page
 * of 20 can easily arrive empty on a large catalog. Asking for more per request keeps the
 * picker useful without leaning on backfill for every page.
 */
const ASSIGN_PRODUCT_SEARCH_PAGE_SIZE = 100;

const assignProductSearchVariables: SearchProductsQueryVariables = {
  ...DEFAULT_INITIAL_SEARCH_DATA,
  first: ASSIGN_PRODUCT_SEARCH_PAGE_SIZE,
};

interface CollectionProductsProps {
  collection: CollectionDetailsQuery["collection"];
  params: CollectionUrlQueryParams;
  currentChannels: ChannelCollectionData[];
  disabled: boolean;
}

const CollectionProducts = ({
  collection,
  params,
  currentChannels,
  disabled,
}: CollectionProductsProps) => {
  const navigate = useNavigator();
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

  const intl = useIntl();
  const id = useCollectionId();
  const { settings, updateListSettings } = useListSettings(ListViews.COLLECTION_PRODUCTS_LIST);
  const numberOfRows = settings ? settings.rowNumber : PAGINATE_BY;
  const [paginationState, setPaginationState] = useLocalPaginationState(numberOfRows);
  const notify = useNotifier();

  const [assignProduct, assignProductOpts] = useCollectionAssignProductMutation({
    onCompleted: data => {
      if (data.collectionAddProducts?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "56vUeQ",
            defaultMessage: "Added product to collection",
          }),
        });
      }
    },
  });
  const [unassignProduct, unassignProductOpts] = useUnassignCollectionProductMutation({
    onCompleted: data => {
      if (data.collectionRemoveProducts?.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "WW+Ruy",
            defaultMessage: "Deleted product from collection",
          }),
        });
        reset();
        closeModal();
      }
    },
  });

  const {
    data,
    networkStatus,
    refetch: refetchCollectionProducts,
  } = useCollectionProductsQuery({
    displayLoader: true,
    notifyOnNetworkStatusChange: true,
    variables: { id, ...paginationState },
  });
  const refetchCollectionProductsSafely = async (): Promise<void> => {
    try {
      await refetchCollectionProducts();
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });
    }
  };

  const products = mapEdgesToItems(data?.collection?.products);
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
    data?.collection?.products?.pageInfo,
    paginationState,
  );

  // Drive search through React variables — not result.refetch(). Refetch merges
  // variables into Apollo while the hook still passes the previous options, which
  // can queue a second network request and leave the picker on a stuck throbber.
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

  const isAssignedToThisCollection = useCallback(
    (product: (typeof searchedProducts)[number]) =>
      isProductAssignedToCollection(product, collection?.id),
    [collection?.id],
  );

  const assignProductInitialConstraints = useMemo(
    () =>
      collection
        ? {
            excludeCollections: [{ id: collection.id, name: collection.name }],
          }
        : undefined,
    [collection],
  );

  const handleProductUnassign = async (
    productId: string,
    _event: MouseEvent<HTMLButtonElement>,
  ) => {
    markPending([productId]);

    try {
      const result = await unassignProduct({
        variables: {
          collectionId: id,
          productIds: [productId],
          ...paginationState,
        },
      });

      if ((result.data?.collectionRemoveProducts?.errors.length ?? 0) > 0) {
        clearPending([productId]);
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });

        return;
      }
    } catch {
      clearPending([productId]);
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return;
    }

    clearPending([productId]);
    await refetchCollectionProductsSafely();
  };

  const handleAssignationChange = async (products: Container[]) => {
    const productIds = products.map(product => product.id);

    if (productIds.length === 0) {
      closeModal();

      return;
    }

    try {
      const response = await assignProduct({
        variables: {
          ...paginationState,
          collectionId: id,
          productIds,
          moves: productIds.map(productId => ({ productId, sortOrder: 0 })),
        },
      });

      if ((response.data?.collectionAddProducts?.errors.length ?? 0) > 0) {
        notify({
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });

        return;
      }
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong),
      });

      return;
    }

    closeModal();

    await refetchCollectionProductsSafely();
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <AssignableListCard
        title={
          collection ? (
            intl.formatMessage(
              {
                id: "/dnWE8",
                defaultMessage: "Products in {name}",
                description: "products in collection",
              },
              {
                name: collection.name,
              },
            )
          ) : (
            <Skeleton __height="14px" __width="12rem" />
          )
        }
        headerEnd={
          <Button
            data-test-id="add-product"
            disabled={disabled}
            variant="secondary"
            type="button"
            onClick={() => openModal("assign")}
          >
            <FormattedMessage id="scHVdW" defaultMessage="Assign product" description="button" />
          </Button>
        }
        footer={
          !showProductsSkeleton && visibleProducts.length > 0 ? (
            <AssignableListPagination
              inset="drag"
              numberOfRows={numberOfRows}
              onUpdateListSettings={updateListSettings}
            />
          ) : null
        }
        data-test-id="collection-products"
      >
        {showProductsSkeleton ? (
          <ProductTableSkeleton rowCount={numberOfRows} />
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
          />
        )}
      </AssignableListCard>
      <AssignProductDialog
        // Empty list means "no channel constraint yet" — passing [] disables every
        // product (intersection with an empty set). Only gate when channels exist.
        selectedChannels={currentChannels.length > 0 ? currentChannels : undefined}
        productUnavailableText={intl.formatMessage({
          id: "OtMtzH",
          defaultMessage: "Product unavailable in collection channels",
        })}
        confirmButtonState={assignProductOpts.status}
        hasMore={result.data?.search?.pageInfo?.hasNextPage ?? false}
        open={params.action === "assign"}
        skipFetchOnOpen
        onFetchMore={loadMore}
        loading={result.loading}
        onClose={handleAssignDialogClose}
        onSubmit={handleAssignationChange}
        products={searchedProducts}
        excludeProduct={isAssignedToThisCollection}
        selectAllMode="when-scoped"
        backfillResetKey={String(searchGeneration)}
        excludedFilters={["channel"]}
        initialConstraints={assignProductInitialConstraints}
        onFilterChange={handleFilterChange}
      />
      <ActionDialog
        confirmButtonState={unassignProductOpts.status}
        onClose={closeModal}
        onConfirm={async () => {
          const productIds = params.ids ?? [];

          if (productIds.length === 0) {
            return;
          }

          markPending(productIds);
          closeModal();

          try {
            const result = await unassignProduct({
              variables: {
                ...paginationState,
                collectionId: id,
                productIds,
              },
            });

            if ((result.data?.collectionRemoveProducts?.errors.length ?? 0) > 0) {
              clearPending(productIds);
              notify({
                status: "error",
                text: intl.formatMessage(commonMessages.somethingWentWrong),
              });

              return;
            }
          } catch {
            clearPending(productIds);
            notify({
              status: "error",
              text: intl.formatMessage(commonMessages.somethingWentWrong),
            });

            return;
          }

          clearPending(productIds);
          await refetchCollectionProductsSafely();
        }}
        open={params.action === "unassign"}
        title={intl.formatMessage({
          id: "5OtU+V",
          defaultMessage: "Unassign products from collection",
          description: "dialog title",
        })}
      >
        <FormattedMessage
          id="AulH/n"
          defaultMessage="{counter,plural,one{Are you sure you want to unassign this product?} other{Are you sure you want to unassign {displayQuantity} products?}}"
          values={{
            counter: params.ids?.length ?? 0,
            displayQuantity: <strong>{params.ids?.length ?? 0}</strong>,
          }}
        />
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
