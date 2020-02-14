import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import {
  defaultListSettings,
  ProductListColumns,
  DEFAULT_INITIAL_SEARCH_DATA
} from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ProductListVariables } from "@saleor/products/types/ProductList";
import { ListViews } from "@saleor/types";
import { getSortUrlVariables } from "@saleor/utils/sort";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import useCategorySearch from "@saleor/searches/useCategorySearch";
import useCollectionSearch from "@saleor/searches/useCollectionSearch";
import useProductTypeSearch from "@saleor/searches/useProductTypeSearch";
import ProductListPage from "../../components/ProductListPage";
import {
  TypedProductBulkDeleteMutation,
  TypedProductBulkPublishMutation
} from "../../mutations";
import {
  AvailableInGridAttributesQuery,
  TypedProductListQuery,
  useInitialProductFilterDataQuery
} from "../../queries";
import { productBulkDelete } from "../../types/productBulkDelete";
import { productBulkPublish } from "../../types/productBulkPublish";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productUrl,
  ProductListUrlDialog
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  getFilterOpts,
  getFilterQueryParam
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings<ProductListColumns>(
    ListViews.PRODUCT_LIST
  );
  const intl = useIntl();
  const { data: initialFilterData } = useInitialProductFilterDataQuery({
    variables: {
      categories: params.categories,
      collections: params.collections,
      productTypes: params.productTypes
    }
  });
  const searchCategories = useCategorySearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchCollections = useCollectionSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });
  const searchProductTypes = useProductTypeSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 5
    }
  });

  React.useEffect(
    () =>
      navigate(
        productListUrl({
          ...params,
          after: undefined,
          before: undefined
        }),
        true
      ),
    [settings.rowNumber]
  );

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductListUrlDialog,
    ProductListUrlQueryParams
  >(navigate, productListUrl, params);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: productListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      productListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(productListUrl());
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const handleSort = (field: ProductListUrlSortField, attributeId?: string) =>
    navigate(
      productListUrl({
        ...params,
        ...getSortUrlVariables(field, params),
        attributeId
      })
    );

  const paginationState = createPaginationState(settings.rowNumber, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");
  const filter = getFilterVariables(params);
  const sort = getSortQueryVariables(params);
  const queryVariables = React.useMemo<ProductListVariables>(
    () => ({
      ...paginationState,
      filter,
      sort
    }),
    [params, settings.rowNumber]
  );

  const filterOpts = getFilterOpts(
    params,
    maybe(() => initialFilterData.attributes.edges.map(edge => edge.node), []),
    {
      initial: maybe(
        () => initialFilterData.categories.edges.map(edge => edge.node),
        []
      ),
      search: searchCategories
    },
    {
      initial: maybe(
        () => initialFilterData.collections.edges.map(edge => edge.node),
        []
      ),
      search: searchCollections
    },
    {
      initial: maybe(
        () => initialFilterData.productTypes.edges.map(edge => edge.node),
        []
      ),
      search: searchProductTypes
    }
  );

  return (
    <AvailableInGridAttributesQuery
      variables={{ first: 6, ids: settings.columns }}
    >
      {attributes => (
        <TypedProductListQuery displayLoader variables={queryVariables}>
          {({ data, loading, refetch }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              maybe(() => data.products.pageInfo),
              paginationState,
              params
            );

            const handleBulkDelete = (data: productBulkDelete) => {
              if (data.productBulkDelete.errors.length === 0) {
                closeModal();
                notify({
                  text: intl.formatMessage(commonMessages.savedChanges)
                });
                reset();
                refetch();
              }
            };

            const handleBulkPublish = (data: productBulkPublish) => {
              if (data.productBulkPublish.errors.length === 0) {
                closeModal();
                notify({
                  text: intl.formatMessage(commonMessages.savedChanges)
                });
                reset();
                refetch();
              }
            };

            return (
              <TypedProductBulkDeleteMutation onCompleted={handleBulkDelete}>
                {(productBulkDelete, productBulkDeleteOpts) => (
                  <TypedProductBulkPublishMutation
                    onCompleted={handleBulkPublish}
                  >
                    {(productBulkPublish, productBulkPublishOpts) => (
                      <>
                        <ProductListPage
                          activeAttributeSortId={params.attributeId}
                          sort={{
                            asc: params.asc,
                            sort: params.sort
                          }}
                          onSort={handleSort}
                          availableInGridAttributes={maybe(
                            () =>
                              attributes.data.availableInGrid.edges.map(
                                edge => edge.node
                              ),
                            []
                          )}
                          currencySymbol={currencySymbol}
                          currentTab={currentTab}
                          defaultSettings={
                            defaultListSettings[ListViews.PRODUCT_LIST]
                          }
                          filterOpts={filterOpts}
                          gridAttributes={maybe(
                            () =>
                              attributes.data.grid.edges.map(edge => edge.node),
                            []
                          )}
                          totalGridAttributes={maybe(
                            () => attributes.data.availableInGrid.totalCount,
                            0
                          )}
                          settings={settings}
                          loading={attributes.loading}
                          hasMore={maybe(
                            () =>
                              attributes.data.availableInGrid.pageInfo
                                .hasNextPage,
                            false
                          )}
                          onAdd={() => navigate(productAddUrl)}
                          disabled={loading}
                          products={maybe(() =>
                            data.products.edges.map(edge => edge.node)
                          )}
                          onFetchMore={() =>
                            attributes.loadMore(
                              (prev, next) => {
                                if (
                                  prev.availableInGrid.pageInfo.endCursor ===
                                  next.availableInGrid.pageInfo.endCursor
                                ) {
                                  return prev;
                                }
                                return {
                                  ...prev,
                                  availableInGrid: {
                                    ...prev.availableInGrid,
                                    edges: [
                                      ...prev.availableInGrid.edges,
                                      ...next.availableInGrid.edges
                                    ],
                                    pageInfo: next.availableInGrid.pageInfo
                                  }
                                };
                              },
                              {
                                after:
                                  attributes.data.availableInGrid.pageInfo
                                    .endCursor
                              }
                            )
                          }
                          onNextPage={loadNextPage}
                          onPreviousPage={loadPreviousPage}
                          onUpdateListSettings={updateListSettings}
                          pageInfo={pageInfo}
                          onRowClick={id => () => navigate(productUrl(id))}
                          onAll={resetFilters}
                          toolbar={
                            <>
                              <Button
                                color="primary"
                                onClick={() =>
                                  openModal("unpublish", {
                                    ids: listElements
                                  })
                                }
                              >
                                <FormattedMessage
                                  defaultMessage="Unpublish"
                                  description="unpublish product, button"
                                />
                              </Button>
                              <Button
                                color="primary"
                                onClick={() =>
                                  openModal("publish", {
                                    ids: listElements
                                  })
                                }
                              >
                                <FormattedMessage
                                  defaultMessage="Publish"
                                  description="publish product, button"
                                />
                              </Button>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  openModal("delete", {
                                    ids: listElements
                                  })
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          }
                          isChecked={isSelected}
                          selected={listElements.length}
                          toggle={toggle}
                          toggleAll={toggleAll}
                          onSearchChange={handleSearchChange}
                          onFilterChange={changeFilters}
                          onTabSave={() => openModal("save-search")}
                          onTabDelete={() => openModal("delete-search")}
                          onTabChange={handleTabChange}
                          initialSearch={params.query || ""}
                          tabs={getFilterTabs().map(tab => tab.name)}
                        />
                        <ActionDialog
                          open={params.action === "delete"}
                          confirmButtonState={productBulkDeleteOpts.status}
                          onClose={closeModal}
                          onConfirm={() =>
                            productBulkDelete({
                              variables: { ids: params.ids }
                            })
                          }
                          title={intl.formatMessage({
                            defaultMessage: "Delete Products",
                            description: "dialog header"
                          })}
                          variant="delete"
                        >
                          <DialogContentText>
                            <FormattedMessage
                              defaultMessage="{counter,plural,one{Are you sure you want to delete this product?} other{Are you sure you want to delete {displayQuantity} products?}}"
                              description="dialog content"
                              values={{
                                counter: maybe(() => params.ids.length),
                                displayQuantity: (
                                  <strong>
                                    {maybe(() => params.ids.length)}
                                  </strong>
                                )
                              }}
                            />
                          </DialogContentText>
                        </ActionDialog>
                        <ActionDialog
                          open={params.action === "publish"}
                          confirmButtonState={productBulkPublishOpts.status}
                          onClose={closeModal}
                          onConfirm={() =>
                            productBulkPublish({
                              variables: {
                                ids: params.ids,
                                isPublished: true
                              }
                            })
                          }
                          title={intl.formatMessage({
                            defaultMessage: "Publish Products",
                            description: "dialog header"
                          })}
                        >
                          <DialogContentText>
                            <FormattedMessage
                              defaultMessage="{counter,plural,one{Are you sure you want to publish this product?} other{Are you sure you want to publish {displayQuantity} products?}}"
                              description="dialog content"
                              values={{
                                counter: maybe(() => params.ids.length),
                                displayQuantity: (
                                  <strong>
                                    {maybe(() => params.ids.length)}
                                  </strong>
                                )
                              }}
                            />
                          </DialogContentText>
                        </ActionDialog>
                        <ActionDialog
                          open={params.action === "unpublish"}
                          confirmButtonState={productBulkPublishOpts.status}
                          onClose={closeModal}
                          onConfirm={() =>
                            productBulkPublish({
                              variables: {
                                ids: params.ids,
                                isPublished: false
                              }
                            })
                          }
                          title={intl.formatMessage({
                            defaultMessage: "Unpublish Products",
                            description: "dialog header"
                          })}
                        >
                          <DialogContentText>
                            <FormattedMessage
                              defaultMessage="{counter,plural,one{Are you sure you want to unpublish this product?} other{Are you sure you want to unpublish {displayQuantity} products?}}"
                              description="dialog content"
                              values={{
                                counter: maybe(() => params.ids.length),
                                displayQuantity: (
                                  <strong>
                                    {maybe(() => params.ids.length)}
                                  </strong>
                                )
                              }}
                            />
                          </DialogContentText>
                        </ActionDialog>
                        <SaveFilterTabDialog
                          open={params.action === "save-search"}
                          confirmButtonState="default"
                          onClose={closeModal}
                          onSubmit={handleFilterTabSave}
                        />
                        <DeleteFilterTabDialog
                          open={params.action === "delete-search"}
                          confirmButtonState="default"
                          onClose={closeModal}
                          onSubmit={handleFilterTabDelete}
                          tabName={maybe(
                            () => tabs[currentTab - 1].name,
                            "..."
                          )}
                        />
                      </>
                    )}
                  </TypedProductBulkPublishMutation>
                )}
              </TypedProductBulkDeleteMutation>
            );
          }}
        </TypedProductListQuery>
      )}
    </AvailableInGridAttributesQuery>
  );
};
export default ProductList;
