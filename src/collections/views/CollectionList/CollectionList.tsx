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
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import { getSortParams } from "@saleor/utils/sort";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import useShop from "@saleor/hooks/useShop";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import CollectionListPage from "../../components/CollectionListPage/CollectionListPage";
import {
  TypedCollectionBulkDelete,
  TypedCollectionBulkPublish
} from "../../mutations";
import { useCollectionListQuery } from "../../queries";
import { CollectionBulkDelete } from "../../types/CollectionBulkDelete";
import { CollectionBulkPublish } from "../../types/CollectionBulkPublish";
import {
  collectionAddUrl,
  collectionListUrl,
  CollectionListUrlQueryParams,
  collectionUrl,
  CollectionListUrlDialog
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  getFilterQueryParam,
  getFilterOpts
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface CollectionListProps {
  params: CollectionListUrlQueryParams;
}

export const CollectionList: React.FC<CollectionListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.COLLECTION_LIST
  );
  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useCollectionListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: collectionListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    CollectionListUrlDialog,
    CollectionListUrlQueryParams
  >(navigate, collectionListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      collectionListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(collectionListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.collections.pageInfo),
    paginationState,
    params
  );

  const handleCollectionBulkDelete = (data: CollectionBulkDelete) => {
    if (data.collectionBulkDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      refetch();
      reset();
      closeModal();
    }
  };

  const handleCollectionBulkPublish = (data: CollectionBulkPublish) => {
    if (data.collectionBulkPublish.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      refetch();
      reset();
      closeModal();
    }
  };

  const handleSort = createSortHandler(navigate, collectionListUrl, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");

  return (
    <TypedCollectionBulkDelete onCompleted={handleCollectionBulkDelete}>
      {(collectionBulkDelete, collectionBulkDeleteOpts) => (
        <TypedCollectionBulkPublish onCompleted={handleCollectionBulkPublish}>
          {(collectionBulkPublish, collectionBulkPublishOpts) => (
            <>
              <CollectionListPage
                currencySymbol={currencySymbol}
                currentTab={currentTab}
                filterOpts={getFilterOpts(params)}
                initialSearch={params.query || ""}
                onSearchChange={handleSearchChange}
                onFilterChange={changeFilters}
                onAdd={() => navigate(collectionAddUrl)}
                onAll={resetFilters}
                onTabChange={handleTabChange}
                onTabDelete={() => openModal("delete-search")}
                onTabSave={() => openModal("save-search")}
                tabs={tabs.map(tab => tab.name)}
                disabled={loading}
                collections={maybe(() =>
                  data.collections.edges.map(edge => edge.node)
                )}
                settings={settings}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onSort={handleSort}
                onUpdateListSettings={updateListSettings}
                pageInfo={pageInfo}
                sort={getSortParams(params)}
                onRowClick={id => () => navigate(collectionUrl(id))}
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
                        description="unpublish collections"
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
                        description="publish collections"
                      />
                    </Button>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        openModal("remove", {
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
              />
              <ActionDialog
                open={
                  params.action === "publish" &&
                  maybe(() => params.ids.length > 0)
                }
                onClose={closeModal}
                confirmButtonState={collectionBulkPublishOpts.status}
                onConfirm={() =>
                  collectionBulkPublish({
                    variables: {
                      ids: params.ids,
                      isPublished: true
                    }
                  })
                }
                variant="default"
                title={intl.formatMessage({
                  defaultMessage: "Publish collections",
                  description: "dialog title"
                })}
              >
                <DialogContentText>
                  <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to publish this collection?} other{Are you sure you want to publish {displayQuantity} collections?}}"
                    values={{
                      counter: maybe(() => params.ids.length),
                      displayQuantity: (
                        <strong>{maybe(() => params.ids.length)}</strong>
                      )
                    }}
                  />
                </DialogContentText>
              </ActionDialog>
              <ActionDialog
                open={
                  params.action === "unpublish" &&
                  maybe(() => params.ids.length > 0)
                }
                onClose={closeModal}
                confirmButtonState={collectionBulkPublishOpts.status}
                onConfirm={() =>
                  collectionBulkPublish({
                    variables: {
                      ids: params.ids,
                      isPublished: false
                    }
                  })
                }
                variant="default"
                title={intl.formatMessage({
                  defaultMessage: "Unpublish collections",
                  description: "dialog title"
                })}
              >
                <DialogContentText>
                  <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to unpublish this collection?} other{Are you sure you want to unpublish {displayQuantity} collections?}}"
                    values={{
                      counter: maybe(() => params.ids.length),
                      displayQuantity: (
                        <strong>{maybe(() => params.ids.length)}</strong>
                      )
                    }}
                  />
                </DialogContentText>
              </ActionDialog>
              <ActionDialog
                open={
                  params.action === "remove" &&
                  maybe(() => params.ids.length > 0)
                }
                onClose={closeModal}
                confirmButtonState={collectionBulkDeleteOpts.status}
                onConfirm={() =>
                  collectionBulkDelete({
                    variables: {
                      ids: params.ids
                    }
                  })
                }
                variant="delete"
                title={intl.formatMessage({
                  defaultMessage: "Delete collections",
                  description: "dialog title"
                })}
              >
                <DialogContentText>
                  <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to delete this collection?} other{Are you sure you want to delete {displayQuantity} collections?}}"
                    values={{
                      counter: maybe(() => params.ids.length),
                      displayQuantity: (
                        <strong>{maybe(() => params.ids.length)}</strong>
                      )
                    }}
                  />
                </DialogContentText>
              </ActionDialog>
              <SaveFilterTabDialog
                open={params.action === "save-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabSave}
              />
              <DeleteFilterTabDialog
                open={params.action === "delete-search"}
                confirmButtonState="default"
                onClose={closeModal}
                onSubmit={handleTabDelete}
                tabName={maybe(() => tabs[currentTab - 1].name, "...")}
              />
            </>
          )}
        </TypedCollectionBulkPublish>
      )}
    </TypedCollectionBulkDelete>
  );
};
export default CollectionList;
