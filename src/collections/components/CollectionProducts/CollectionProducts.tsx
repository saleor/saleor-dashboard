import { ChannelCollectionData } from "@dashboard/channels/utils";
import {
  collectionUrl,
  CollectionUrlDialog,
  CollectionUrlQueryParams,
} from "@dashboard/collections/urls";
import {
  getAssignedProductIdsToCollection,
  getProductsFromSearchResults,
} from "@dashboard/collections/utils";
import ActionDialog from "@dashboard/components/ActionDialog/ActionDialog";
import { Container } from "@dashboard/components/AssignContainerDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog/AssignProductDialog";
import { DashboardCard } from "@dashboard/components/Card";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  CollectionDetailsQuery,
  useCollectionAssignProductMutation,
  useCollectionProductsQuery,
  useUnassignCollectionProductMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import useProductSearch from "@dashboard/searches/useProductSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListViews } from "../../../types";
import { ProductsTable } from "./ProductsTable";
import { ProductTableSkeleton } from "./ProductTableSkeleton";
import { useCollectionId } from "./useCollectionId";

export interface CollectionProductsProps {
  collection: CollectionDetailsQuery["collection"];
  params: CollectionUrlQueryParams;
  currentChannels: ChannelCollectionData[];
  disabled: boolean;
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({
  collection,
  params,
  currentChannels,
  disabled,
}) => {
  const navigate = useNavigator();
  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionUrlDialog,
    CollectionUrlQueryParams
  >(navigate, params => collectionUrl(id, params), params);
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

  const intl = useIntl();
  const id = useCollectionId();
  const { settings, updateListSettings } = useListSettings(ListViews.COLLECTION_PRODUCTS_LIST);
  const numberOfRows = settings.rowNumber;
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

  const { data } = useCollectionProductsQuery({
    displayLoader: true,
    variables: { id, ...paginationState },
  });

  const products = mapEdgesToItems(data?.collection?.products);
  const numberOfColumns = products?.length === 0 ? 4 : 5;
  const paginate = useLocalPaginator(setPaginationState);

  const { pageInfo, ...paginationValues } = paginate(
    data?.collection?.products?.pageInfo,
    paginationState,
  );

  const { search, loadMore, result } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const assignedProductDict = getAssignedProductIdsToCollection(collection, result.data?.search);

  const handleProductUnassign = async (productId: string) => {
    await unassignProduct({
      variables: {
        collectionId: id,
        productIds: [productId],
        ...paginationState,
      },
    });
    await result.refetch(DEFAULT_INITIAL_SEARCH_DATA);
  };

  const handleAssignationChange = async (products: Container[]) => {
    const productIds = products.map(product => product.id);
    const toUnassignIds = Object.keys(assignedProductDict).filter(
      s => assignedProductDict[s] && !productIds.includes(s),
    );
    const baseVariables = { ...paginationState, collectionId: id };

    if (productIds.length > 0) {
      await assignProduct({
        variables: { ...baseVariables, productIds },
      });
    }

    if (toUnassignIds.length > 0) {
      await unassignProduct({
        variables: { ...baseVariables, productIds: toUnassignIds },
      });
    }

    closeModal();

    await result.refetch(DEFAULT_INITIAL_SEARCH_DATA);
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <DashboardCard paddingBottom={10}>
        <DashboardCard.Header>
          <DashboardCard.Title>
            {collection ? (
              intl.formatMessage(
                {
                  id: "/dnWE8",
                  defaultMessage: "Products in {name}",
                  description: "products in collection",
                },
                {
                  name: collection?.name ?? "...",
                },
              )
            ) : (
              <Skeleton />
            )}
          </DashboardCard.Title>
          <DashboardCard.Toolbar>
            <Button
              data-test-id="add-product"
              disabled={disabled}
              variant="secondary"
              onClick={() => openModal("assign")}
            >
              <FormattedMessage id="scHVdW" defaultMessage="Assign product" description="button" />
            </Button>
          </DashboardCard.Toolbar>
        </DashboardCard.Header>

        {products ? (
          <ProductsTable
            paginationState={paginationState}
            selected={listElements.length}
            products={products || []}
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
        ) : (
          <ProductTableSkeleton numberOfRows={numberOfRows} />
        )}
      </DashboardCard>
      <AssignProductDialog
        selectedChannels={currentChannels}
        productUnavailableText={intl.formatMessage({
          id: "OtMtzH",
          defaultMessage: "Product unavailable in collection channels",
        })}
        selectedIds={assignedProductDict}
        confirmButtonState={assignProductOpts.status}
        hasMore={result.data?.search?.pageInfo?.hasNextPage ?? false}
        open={params.action === "assign"}
        onFetch={search}
        onFetchMore={loadMore}
        loading={result.loading}
        onClose={closeModal}
        onSubmit={handleAssignationChange}
        products={getProductsFromSearchResults(result?.data) ?? []}
      />
      <ActionDialog
        confirmButtonState={unassignProductOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          unassignProduct({
            variables: {
              ...paginationState,
              collectionId: id,
              productIds: params.ids ?? [],
            },
          })
        }
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
