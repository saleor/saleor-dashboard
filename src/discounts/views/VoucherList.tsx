import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages, sectionNames } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import VoucherListPage from "../components/VoucherListPage";
import { TypedVoucherBulkDelete } from "../mutations";
import { TypedVoucherList } from "../queries";
import { VoucherBulkDelete } from "../types/VoucherBulkDelete";
import {
  voucherAddUrl,
  voucherListUrl,
  VoucherListUrlQueryParams,
  voucherUrl
} from "../urls";

interface VoucherListProps {
  params: VoucherListUrlQueryParams;
}

export const VoucherList: React.StatelessComponent<VoucherListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.VOUCHER_LIST
  );
  const intl = useIntl();

  const closeModal = () => navigate(voucherListUrl(), true);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const canOpenBulkActionDialog = maybe(() => params.ids.length > 0);

  return (
    <TypedVoucherList displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
          maybe(() => data.vouchers.pageInfo),
          paginationState,
          params
        );

        const handleVoucherBulkDelete = (data: VoucherBulkDelete) => {
          if (data.voucherBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            reset();
            closeModal();
            refetch();
          }
        };

        return (
          <TypedVoucherBulkDelete onCompleted={handleVoucherBulkDelete}>
            {(voucherBulkDelete, voucherBulkDeleteOpts) => {
              const bulkRemoveTransitionState = getMutationState(
                voucherBulkDeleteOpts.called,
                voucherBulkDeleteOpts.loading,
                maybe(() => voucherBulkDeleteOpts.data.voucherBulkDelete.errors)
              );
              const onVoucherBulkDelete = () =>
                voucherBulkDelete({
                  variables: {
                    ids: params.ids
                  }
                });
              return (
                <>
                  <WindowTitle
                    title={intl.formatMessage(sectionNames.vouchers)}
                  />
                  <VoucherListPage
                    defaultCurrency={maybe(() => shop.defaultCurrency)}
                    settings={settings}
                    vouchers={maybe(() =>
                      data.vouchers.edges.map(edge => edge.node)
                    )}
                    disabled={loading}
                    pageInfo={pageInfo}
                    onAdd={() => navigate(voucherAddUrl)}
                    onNextPage={loadNextPage}
                    onPreviousPage={loadPreviousPage}
                    onUpdateListSettings={updateListSettings}
                    onRowClick={id => () => navigate(voucherUrl(id))}
                    isChecked={isSelected}
                    selected={listElements.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            voucherListUrl({
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
                    onConfirm={onVoucherBulkDelete}
                    open={params.action === "remove" && canOpenBulkActionDialog}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Vouchers",
                      description: "dialog header"
                    })}
                    variant="delete"
                  >
                    {canOpenBulkActionDialog && (
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {counter, plural,
                      one {this voucher}
                      other {{displayQuantity} vouchers}
                    }?"
                          description="dialog content"
                          values={{
                            counter: params.ids.length,
                            displayQuantity: (
                              <strong>{params.ids.length}</strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    )}
                  </ActionDialog>
                </>
              );
            }}
          </TypedVoucherBulkDelete>
        );
      }}
    </TypedVoucherList>
  );
};
export default VoucherList;
