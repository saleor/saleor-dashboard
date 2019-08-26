import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import OrderDraftListPage from "../components/OrderDraftListPage";
import {
  TypedOrderDraftBulkCancelMutation,
  TypedOrderDraftCreateMutation
} from "../mutations";
import { TypedOrderDraftListQuery } from "../queries";
import { OrderDraftBulkCancel } from "../types/OrderDraftBulkCancel";
import { OrderDraftCreate } from "../types/OrderDraftCreate";
import {
  orderDraftListUrl,
  OrderDraftListUrlQueryParams,
  orderUrl
} from "../urls";

interface OrderDraftListProps {
  params: OrderDraftListUrlQueryParams;
}

export const OrderDraftList: React.StatelessComponent<OrderDraftListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.DRAFT_LIST
  );
  const intl = useIntl();

  const closeModal = () =>
    navigate(
      orderDraftListUrl({
        ...params,
        action: undefined,
        ids: undefined
      })
    );

  const handleCreateOrderCreateSuccess = (data: OrderDraftCreate) => {
    notify({
      text: intl.formatMessage({
        defaultMessage: "Order draft succesfully created"
      })
    });
    navigate(orderUrl(data.draftOrderCreate.order.id));
  };

  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedOrderDraftCreateMutation onCompleted={handleCreateOrderCreateSuccess}>
      {createOrder => (
        <TypedOrderDraftListQuery displayLoader variables={paginationState}>
          {({ data, loading, refetch }) => {
            const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
              maybe(() => data.draftOrders.pageInfo),
              paginationState,
              params
            );

            const handleOrderDraftBulkCancel = (data: OrderDraftBulkCancel) => {
              if (data.draftOrderBulkDelete.errors.length === 0) {
                notify({
                  text: intl.formatMessage({
                    defaultMessage: "Removed draft orders"
                  })
                });
                refetch();
                reset();
                closeModal();
              }
            };

            return (
              <TypedOrderDraftBulkCancelMutation
                onCompleted={handleOrderDraftBulkCancel}
              >
                {(orderDraftBulkDelete, orderDraftBulkDeleteOpts) => {
                  const bulkRemoveTransitionState = getMutationState(
                    orderDraftBulkDeleteOpts.called,
                    orderDraftBulkDeleteOpts.loading,
                    maybe(
                      () =>
                        orderDraftBulkDeleteOpts.data.draftOrderBulkDelete
                          .errors
                    )
                  );
                  const onOrderDraftBulkDelete = () =>
                    orderDraftBulkDelete({
                      variables: {
                        ids: params.ids
                      }
                    });

                  return (
                    <>
                      <OrderDraftListPage
                        disabled={loading}
                        settings={settings}
                        orders={maybe(() =>
                          data.draftOrders.edges.map(edge => edge.node)
                        )}
                        pageInfo={pageInfo}
                        onAdd={createOrder}
                        onNextPage={loadNextPage}
                        onPreviousPage={loadPreviousPage}
                        onUpdateListSettings={updateListSettings}
                        onRowClick={id => () => navigate(orderUrl(id))}
                        isChecked={isSelected}
                        selected={listElements.length}
                        toggle={toggle}
                        toggleAll={toggleAll}
                        toolbar={
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(
                                orderDraftListUrl({
                                  action: "remove",
                                  ids: listElements
                                })
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                      <ActionDialog
                        confirmButtonState={bulkRemoveTransitionState}
                        onClose={closeModal}
                        onConfirm={onOrderDraftBulkDelete}
                        open={params.action === "remove"}
                        title={intl.formatMessage({
                          defaultMessage: "Delete Order Drafts",
                          description: "dialog header"
                        })}
                        variant="delete"
                      >
                        <DialogContentText>
                          <FormattedMessage
                            defaultMessage="Are you sure you want to delete {counter, plural,
            one {this order draft}
            other {{displayQuantity} orderDrafts}
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
                    </>
                  );
                }}
              </TypedOrderDraftBulkCancelMutation>
            );
          }}
        </TypedOrderDraftListQuery>
      )}
    </TypedOrderDraftCreateMutation>
  );
};

export default OrderDraftList;
