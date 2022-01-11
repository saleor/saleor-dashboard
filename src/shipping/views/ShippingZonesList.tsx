import { DialogContentText } from "@material-ui/core";
import { useUser } from "@saleor/auth";
import ActionDialog from "@saleor/components/ActionDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { getStringOrPlaceholder, maybe } from "@saleor/misc";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZonesListPage from "../components/ShippingZonesListPage";
import {
  useDefaultWeightUnitUpdate,
  useShippingZoneBulkDelete,
  useShippingZoneDelete
} from "../mutations";
import { useShippingZoneList } from "../queries";
import {
  shippingZoneAddUrl,
  shippingZonesListUrl,
  ShippingZonesListUrlDialog,
  ShippingZonesListUrlQueryParams,
  shippingZoneUrl
} from "../urls";

interface ShippingZonesListProps {
  params: ShippingZonesListUrlQueryParams;
}

export const ShippingZonesList: React.FC<ShippingZonesListProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { user } = useUser();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.SHIPPING_METHODS_LIST
  );

  usePaginationReset(shippingZonesListUrl, params, settings.rowNumber);

  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState
    }),
    [params, settings.rowNumber]
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingZonesListUrlDialog,
    ShippingZonesListUrlQueryParams
  >(navigate, shippingZonesListUrl, params);

  const { data, loading, refetch } = useShippingZoneList({
    displayLoader: true,
    variables: queryVariables
  });

  const [deleteShippingZone, deleteShippingZoneOpts] = useShippingZoneDelete({
    onCompleted: data => {
      if (data.shippingZoneDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
        refetch();
      }
    }
  });

  const [
    updateDefaultWeightUnit,
    updateDefaultWeightUnitOpts
  ] = useDefaultWeightUnitUpdate({
    onCompleted: data => {
      if (data.shopSettingsUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const [
    bulkDeleteShippingZone,
    bulkDeleteShippingZoneOpts
  ] = useShippingZoneBulkDelete({
    onCompleted: data => {
      if (data.shippingZoneBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
        reset();
        refetch();
      }
    }
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.shippingZones.pageInfo),
    paginationState,
    params
  );

  return (
    <>
      <ShippingZonesListPage
        defaultWeightUnit={shop?.defaultWeightUnit}
        settings={settings}
        disabled={
          loading ||
          deleteShippingZoneOpts.loading ||
          updateDefaultWeightUnitOpts.loading
        }
        shippingZones={mapEdgesToItems(data?.shippingZones)}
        pageInfo={pageInfo}
        onAdd={() => navigate(shippingZoneAddUrl)}
        onBack={() => navigate(configurationMenuUrl)}
        onUpdateListSettings={updateListSettings}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onRemove={id =>
          openModal("remove", {
            id
          })
        }
        onRowClick={id => () => navigate(shippingZoneUrl(id))}
        onSubmit={unit =>
          updateDefaultWeightUnit({
            variables: { unit }
          })
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove-many", {
                ids: listElements
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
        userPermissions={user?.userPermissions || []}
      />

      <ActionDialog
        open={params.action === "remove"}
        confirmButtonState={deleteShippingZoneOpts.status}
        variant="delete"
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Zone",
          description: "dialog header"
        })}
        onClose={closeModal}
        onConfirm={() =>
          deleteShippingZone({
            variables: { id: params.id }
          })
        }
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {shippingZoneName} shipping zone?"
            values={{
              shippingZoneName: (
                <strong>
                  {getStringOrPlaceholder(
                    mapEdgesToItems(data?.shippingZones)?.find(
                      getById(params.id)
                    )?.name
                  )}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove-many"}
        confirmButtonState={bulkDeleteShippingZoneOpts.status}
        variant="delete"
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Zones",
          description: "dialog header"
        })}
        onClose={closeModal}
        onConfirm={() =>
          bulkDeleteShippingZone({
            variables: { ids: params.ids }
          })
        }
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="{counter,plural,one{Are you sure you want to delete this shipping zone?} other{Are you sure you want to delete {displayQuantity} shipping zones?}}"
            description="dialog content"
            values={{
              counter: params.ids?.length,
              displayQuantity: (
                <strong>
                  {getStringOrPlaceholder(params.ids?.length.toString())}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
