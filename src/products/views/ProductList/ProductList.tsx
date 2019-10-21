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
import { defaultListSettings, ProductListColumns } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useLocale from "@saleor/hooks/useLocale";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ProductListVariables } from "@saleor/products/types/ProductList";
import { ListViews } from "@saleor/types";
import { getSortUrlVariables } from "@saleor/utils/sort";
import ProductListPage from "../../components/ProductListPage";
import {
  TypedProductBulkDeleteMutation,
  TypedProductBulkPublishMutation
} from "../../mutations";
import {
  AvailableInGridAttributesQuery,
  TypedProductListQuery
} from "../../queries";
import { productBulkDelete } from "../../types/productBulkDelete";
import { productBulkPublish } from "../../types/productBulkPublish";
import {
  productAddUrl,
  productListUrl,
  ProductListUrlDialog,
  ProductListUrlFilters,
  ProductListUrlQueryParams,
  ProductListUrlSortField,
  productUrl
} from "../../urls";
import {
  areFiltersApplied,
  createFilter,
  createFilterChips,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface ProductListProps {
  params: ProductListUrlQueryParams;
}

export const ProductList: React.StatelessComponent<ProductListProps> = ({
  params
}) => {
  const { locale } = useLocale();
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

  const closeModal = () =>
    navigate(
      productListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const changeFilters = (filters: ProductListUrlFilters) => {
    reset();
    navigate(productListUrl(filters));
  };

  const changeFilterField = (filter: ProductListUrlFilters) => {
    reset();
    navigate(
      productListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const openModal = (action: ProductListUrlDialog, ids?: string[]) =>
    navigate(
      productListUrl({
        ...params,
        action,
        ids
      })
    );

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
                    {(productBulkPublish, productBulkPublishOpts) => {
                      const bulkDeleteMutationState = getMutationState(
                        productBulkDeleteOpts.called,
                        productBulkDeleteOpts.loading,
                        maybe(
                          () =>
                            productBulkDeleteOpts.data.productBulkDelete.errors
                        )
                      );

                      const bulkPublishMutationState = getMutationState(
                        productBulkPublishOpts.called,
                        productBulkPublishOpts.loading,
                        maybe(
                          () =>
                            productBulkPublishOpts.data.productBulkPublish
                              .errors
                        )
                      );

                      return (
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
                            gridAttributes={maybe(
                              () =>
                                attributes.data.grid.edges.map(
                                  edge => edge.node
                                ),
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
                            filtersList={createFilterChips(
                              params,
                              {
                                currencySymbol,
                                locale
                              },
                              changeFilterField,
                              intl
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
                            onAll={() =>
                              changeFilters({
                                status: undefined
                              })
                            }
                            toolbar={
                              <>
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    openModal("unpublish", listElements)
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
                                    openModal("publish", listElements)
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
                                    openModal("delete", listElements)
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
                            onSearchChange={query =>
                              changeFilterField({ query })
                            }
                            onFilterAdd={filter =>
                              changeFilterField(createFilter(filter))
                            }
                            onTabSave={() => openModal("save-search")}
                            onTabDelete={() => openModal("delete-search")}
                            onTabChange={handleTabChange}
                            initialSearch={params.query || ""}
                            tabs={getFilterTabs().map(tab => tab.name)}
                          />
                          <ActionDialog
                            open={params.action === "delete"}
                            confirmButtonState={bulkDeleteMutationState}
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
                                defaultMessage="Are you sure you want to delete {counter, plural,
            one {this product}
            other {{displayQuantity} products}
          }?"
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
                            confirmButtonState={bulkPublishMutationState}
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
                                defaultMessage="Are you sure you want to publish {counter, plural,
            one {this product}
            other {{displayQuantity} products}
          }?"
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
                            confirmButtonState={bulkPublishMutationState}
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
                                defaultMessage="Are you sure you want to unpublish {counter, plural,
            one {this product}
            other {{displayQuantity} products}
          }?"
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
                      );
                    }}
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
