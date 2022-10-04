import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { Button } from "@saleor/components/Button";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import {
  usePageBulkPublishMutation,
  usePageBulkRemoveMutation,
  usePageListQuery,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import PageTypePickerDialog from "@saleor/pages/components/PageTypePickerDialog";
import usePageTypeSearch from "@saleor/searches/usePageTypeSearch";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageListPage from "../../components/PageListPage/PageListPage";
import {
  pageCreateUrl,
  pageListUrl,
  PageListUrlDialog,
  PageListUrlQueryParams,
} from "../../urls";
import { getFilterVariables, getSortQueryVariables } from "./sort";

interface PageListProps {
  params: PageListUrlQueryParams;
}

export const PageList: React.FC<PageListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.PAGES_LIST,
  );

  usePaginationReset(pageListUrl, params, settings.rowNumber);

  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = usePageListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.pages.pageInfo),
    paginationState,
    queryString: params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    PageListUrlDialog,
    PageListUrlQueryParams
  >(navigate, pageListUrl, params);

  const [bulkPageRemove, bulkPageRemoveOpts] = usePageBulkRemoveMutation({
    onCompleted: data => {
      if (data.pageBulkDelete.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "41z2Qi",
            defaultMessage: "Removed pages",
            description: "notification",
          }),
        });
        reset();
        refetch();
      }
    },
  });

  const [bulkPagePublish, bulkPagePublishOpts] = usePageBulkPublishMutation({
    onCompleted: data => {
      if (data.pageBulkPublish.errors.length === 0) {
        closeModal();
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "AzshS2",
            defaultMessage: "Published pages",
            description: "notification",
          }),
        });
        reset();
        refetch();
      }
    },
  });

  const handleSort = createSortHandler(navigate, pageListUrl, params);

  const {
    loadMore: loadMoreDialogPageTypes,
    search: searchDialogPageTypes,
    result: searchDialogPageTypesOpts,
  } = usePageTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const fetchMoreDialogPageTypes = {
    hasMore: searchDialogPageTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchDialogPageTypesOpts.loading,
    onFetchMore: loadMoreDialogPageTypes,
  };

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <PageListPage
        disabled={loading}
        settings={settings}
        pages={mapEdgesToItems(data?.pages)}
        onUpdateListSettings={updateListSettings}
        onAdd={() => openModal("create-page")}
        onSort={handleSort}
        actionDialogOpts={{
          open: openModal,
          close: closeModal,
        }}
        params={params}
        toolbar={
          <>
            <Button
              onClick={() =>
                openModal("unpublish", {
                  ids: listElements,
                })
              }
            >
              <FormattedMessage
                id="F8gsds"
                defaultMessage="Unpublish"
                description="unpublish page, button"
              />
            </Button>
            <Button
              onClick={() =>
                openModal("publish", {
                  ids: listElements,
                })
              }
            >
              <FormattedMessage
                id="yEmwxD"
                defaultMessage="Publish"
                description="publish page, button"
              />
            </Button>
            <IconButton
              variant="secondary"
              color="primary"
              onClick={() =>
                openModal("remove", {
                  ids: listElements,
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
      />
      <ActionDialog
        open={params.action === "publish"}
        onClose={closeModal}
        confirmButtonState={bulkPagePublishOpts.status}
        onConfirm={() =>
          bulkPagePublish({
            variables: {
              ids: params.ids,
              isPublished: true,
            },
          })
        }
        title={intl.formatMessage({
          id: "wyvzh9",
          defaultMessage: "Publish Pages",
          description: "dialog header",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="WRPQMM"
            defaultMessage="{counter,plural,one{Are you sure you want to publish this page?} other{Are you sure you want to publish {displayQuantity} pages?}}"
            description="dialog content"
            values={{
              counter: maybe(() => params.ids.length),
              displayQuantity: (
                <strong>{maybe(() => params.ids.length)}</strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={params.action === "unpublish"}
        onClose={closeModal}
        confirmButtonState={bulkPagePublishOpts.status}
        onConfirm={() =>
          bulkPagePublish({
            variables: {
              ids: params.ids,
              isPublished: false,
            },
          })
        }
        title={intl.formatMessage({
          id: "yHQQMQ",
          defaultMessage: "Unpublish Pages",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="Wd8vG7"
          defaultMessage="{counter,plural,one{Are you sure you want to unpublish this page?} other{Are you sure you want to unpublish {displayQuantity} pages?}}"
          description="dialog content"
          values={{
            counter: maybe(() => params.ids.length),
            displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>,
          }}
        />
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove"}
        onClose={closeModal}
        confirmButtonState={bulkPageRemoveOpts.status}
        onConfirm={() =>
          bulkPageRemove({
            variables: {
              ids: params.ids,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage({
          id: "3Sz1/t",
          defaultMessage: "Delete Pages",
          description: "dialog header",
        })}
      >
        <FormattedMessage
          id="UNwG+4"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this page?} other{Are you sure you want to delete {displayQuantity} pages?}}"
          description="dialog content"
          values={{
            counter: maybe(() => params.ids.length),
            displayQuantity: <strong>{maybe(() => params.ids.length)}</strong>,
          }}
        />
      </ActionDialog>
      <PageTypePickerDialog
        confirmButtonState="success"
        open={params.action === "create-page"}
        pageTypes={mapNodeToChoice(
          mapEdgesToItems(searchDialogPageTypesOpts?.data?.search),
        )}
        fetchPageTypes={searchDialogPageTypes}
        fetchMorePageTypes={fetchMoreDialogPageTypes}
        onClose={closeModal}
        onConfirm={pageTypeId =>
          navigate(
            pageCreateUrl({
              "page-type-id": pageTypeId,
            }),
          )
        }
      />
    </PaginatorContext.Provider>
  );
};

export default PageList;
