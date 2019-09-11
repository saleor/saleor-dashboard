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
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import CollectionListPage from "../../components/CollectionListPage/CollectionListPage";
import {
  TypedCollectionBulkDelete,
  TypedCollectionBulkPublish
} from "../../mutations";
import { TypedCollectionListQuery } from "../../queries";
import { CollectionBulkDelete } from "../../types/CollectionBulkDelete";
import { CollectionBulkPublish } from "../../types/CollectionBulkPublish";
import {
  collectionAddUrl,
  collectionListUrl,
  CollectionListUrlDialog,
  CollectionListUrlFilters,
  CollectionListUrlQueryParams,
  collectionUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filter";

interface CollectionListProps {
  params: CollectionListUrlQueryParams;
}

export const CollectionList: React.StatelessComponent<CollectionListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.COLLECTION_LIST
  );
  const intl = useIntl();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const changeFilterField = (filter: CollectionListUrlFilters) => {
    reset();
    navigate(
      collectionListUrl({
        ...getActiveFilters(params),
        ...filter,
        activeTab: undefined
      })
    );
  };

  const closeModal = () =>
    navigate(
      collectionListUrl({
        ...params,
        action: undefined,
        ids: undefined
      }),
      true
    );

  const openModal = (action: CollectionListUrlDialog, ids?: string[]) =>
    navigate(
      collectionListUrl({
        ...params,
        action,
        ids
      })
    );

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

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params)
    }),
    [params]
  );

  return (
    <TypedCollectionListQuery displayLoader variables={queryVariables}>
      {({ data, loading, refetch }) => {
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

        return (
          <TypedCollectionBulkDelete onCompleted={handleCollectionBulkDelete}>
            {(collectionBulkDelete, collectionBulkDeleteOpts) => (
              <TypedCollectionBulkPublish
                onCompleted={handleCollectionBulkPublish}
              >
                {(collectionBulkPublish, collectionBulkPublishOpts) => {
                  const bulkDeleteTransitionState = getMutationState(
                    collectionBulkDeleteOpts.called,
                    collectionBulkDeleteOpts.loading,
                    maybe(
                      () =>
                        collectionBulkDeleteOpts.data.collectionBulkDelete
                          .errors
                    )
                  );

                  const bulkPublishTransitionState = getMutationState(
                    collectionBulkPublishOpts.called,
                    collectionBulkPublishOpts.loading,
                    maybe(
                      () =>
                        collectionBulkPublishOpts.data.collectionBulkPublish
                          .errors
                    )
                  );

                  return (
                    <>
                      <CollectionListPage
                        currentTab={currentTab}
                        initialSearch={params.query || ""}
                        onSearchChange={query => changeFilterField({ query })}
                        onAdd={() => navigate(collectionAddUrl)}
                        onAll={() => navigate(collectionListUrl())}
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
                        onUpdateListSettings={updateListSettings}
                        pageInfo={pageInfo}
                        onRowClick={id => () => navigate(collectionUrl(id))}
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
                                description="unpublish collections"
                              />
                            </Button>
                            <Button
                              color="primary"
                              onClick={() => openModal("publish", listElements)}
                            >
                              <FormattedMessage
                                defaultMessage="Publish"
                                description="publish collections"
                              />
                            </Button>
                            <IconButton
                              color="primary"
                              onClick={() => openModal("remove", listElements)}
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
                        confirmButtonState={bulkPublishTransitionState}
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
                            defaultMessage="Are you sure you want to publish {counter, plural,
                              one {this collection}
                              other {{displayQuantity} collections}
                            }?"
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
                        open={
                          params.action === "unpublish" &&
                          maybe(() => params.ids.length > 0)
                        }
                        onClose={closeModal}
                        confirmButtonState={bulkPublishTransitionState}
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
                            defaultMessage="Are you sure you want to unpublish {counter, plural,
                              one {this collection}
                              other {{displayQuantity} collections}
                            }?"
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
                        open={
                          params.action === "remove" &&
                          maybe(() => params.ids.length > 0)
                        }
                        onClose={closeModal}
                        confirmButtonState={bulkDeleteTransitionState}
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
                            defaultMessage="Are you sure you want to delete {counter, plural,
                              one {this collection}
                              other {{displayQuantity} collections}
                            }?"
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
                  );
                }}
              </TypedCollectionBulkPublish>
            )}
          </TypedCollectionBulkDelete>
        );
      }}
    </TypedCollectionListQuery>
  );
};
export default CollectionList;
