import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionDialog from "@saleor/components/ActionDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageListPage from "../../components/PageListPage/PageListPage";
import { TypedPageBulkPublish, TypedPageBulkRemove } from "../../mutations";
import { usePageListQuery } from "../../queries";
import { PageBulkPublish } from "../../types/PageBulkPublish";
import { PageBulkRemove } from "../../types/PageBulkRemove";
import {
  pageCreateUrl,
  pageListUrl,
  PageListUrlDialog,
  PageListUrlQueryParams,
  pageUrl
} from "../../urls";
import { getSortQueryVariables } from "./sort";

interface PageListProps {
  params: PageListUrlQueryParams;
}

export const PageList: React.FC<PageListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.PAGES_LIST
  );
  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = usePageListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.pages.pageInfo),
    paginationState,
    params
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    PageListUrlDialog,
    PageListUrlQueryParams
  >(navigate, pageListUrl, params);

  const handlePageBulkPublish = (data: PageBulkPublish) => {
    if (data.pageBulkPublish.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Published pages",
          description: "notification"
        })
      });
      reset();
      refetch();
    }
  };

  const handlePageBulkRemove = (data: PageBulkRemove) => {
    if (data.pageBulkDelete.errors.length === 0) {
      closeModal();
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Removed pages",
          description: "notification"
        })
      });
      reset();
      refetch();
    }
  };

  const handleSort = createSortHandler(navigate, pageListUrl, params);

  return (
    <TypedPageBulkRemove onCompleted={handlePageBulkRemove}>
      {(bulkPageRemove, bulkPageRemoveOpts) => (
        <TypedPageBulkPublish onCompleted={handlePageBulkPublish}>
          {(bulkPagePublish, bulkPagePublishOpts) => (
            <>
              <PageListPage
                disabled={loading}
                settings={settings}
                pages={maybe(() => data.pages.edges.map(edge => edge.node))}
                pageInfo={pageInfo}
                onAdd={() => navigate(pageCreateUrl)}
                onBack={() => navigate(configurationMenuUrl)}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onUpdateListSettings={updateListSettings}
                onRowClick={id => () => navigate(pageUrl(id))}
                onSort={handleSort}
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
                        description="unpublish page, button"
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
                        description="publish page, button"
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
                      isPublished: true
                    }
                  })
                }
                title={intl.formatMessage({
                  defaultMessage: "Publish Pages",
                  description: "dialog header"
                })}
              >
                <DialogContentText>
                  <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to publish this page?} other{Are you sure you want to publish {displayQuantity} pages?}}"
                    description="dialog content"
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
                open={params.action === "unpublish"}
                onClose={closeModal}
                confirmButtonState={bulkPagePublishOpts.status}
                onConfirm={() =>
                  bulkPagePublish({
                    variables: {
                      ids: params.ids,
                      isPublished: false
                    }
                  })
                }
                title={intl.formatMessage({
                  defaultMessage: "Unpublish Pages",
                  description: "dialog header"
                })}
              >
                <FormattedMessage
                  defaultMessage="{counter,plural,one{Are you sure you want to unpublish this page?} other{Are you sure you want to unpublish {displayQuantity} pages?}}"
                  description="dialog content"
                  values={{
                    counter: maybe(() => params.ids.length),
                    displayQuantity: (
                      <strong>{maybe(() => params.ids.length)}</strong>
                    )
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
                      ids: params.ids
                    }
                  })
                }
                variant="delete"
                title={intl.formatMessage({
                  defaultMessage: "Delete Pages",
                  description: "dialog header"
                })}
              >
                <FormattedMessage
                  defaultMessage="{counter,plural,one{Are you sure you want to delete this page?} other{Are you sure you want to delete {displayQuantity} pages?}}"
                  description="dialog content"
                  values={{
                    counter: maybe(() => params.ids.length),
                    displayQuantity: (
                      <strong>{maybe(() => params.ids.length)}</strong>
                    )
                  }}
                />
              </ActionDialog>
            </>
          )}
        </TypedPageBulkPublish>
      )}
    </TypedPageBulkRemove>
  );
};

export default PageList;
