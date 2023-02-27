// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ActionDialog from "@dashboard/components/ActionDialog";
import {
  useBulkDeleteShippingZoneMutation,
  useDeleteShippingZoneMutation,
  useShippingZonesQuery,
  useUpdateDefaultWeightUnitMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import {
  extractMutationErrors,
  getById,
  getStringOrPlaceholder,
  maybe,
} from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DialogContentText } from "@material-ui/core";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ShippingZonesListPage from "../components/ShippingZonesListPage";
import {
  shippingZonesListUrl,
  ShippingZonesListUrlDialog,
  ShippingZonesListUrlQueryParams,
} from "../urls";

interface ShippingZonesListProps {
  params: ShippingZonesListUrlQueryParams;
}

export const ShippingZonesList: React.FC<ShippingZonesListProps> = ({
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { user } = useUser();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.SHIPPING_METHODS_LIST,
  );

  usePaginationReset(shippingZonesListUrl, params, settings.rowNumber);

  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
    }),
    [params, settings.rowNumber],
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingZonesListUrlDialog,
    ShippingZonesListUrlQueryParams
  >(navigate, shippingZonesListUrl, params);

  const { data, loading, refetch } = useShippingZonesQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const [deleteShippingZone, deleteShippingZoneOpts] =
    useDeleteShippingZoneMutation({
      onCompleted: data => {
        if (data.shippingZoneDelete.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          closeModal();
          refetch();
        }
      },
    });

  const [updateDefaultWeightUnit, updateDefaultWeightUnitOpts] =
    useUpdateDefaultWeightUnitMutation({
      onCompleted: data => {
        if (data.shopSettingsUpdate.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
        }
      },
    });

  const [bulkDeleteShippingZone, bulkDeleteShippingZoneOpts] =
    useBulkDeleteShippingZoneMutation({
      onCompleted: data => {
        if (data.shippingZoneBulkDelete.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          closeModal();
          reset();
          refetch();
        }
      },
    });

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.shippingZones.pageInfo),
    paginationState,
    queryString: params,
  });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <ShippingZonesListPage
        defaultWeightUnit={shop?.defaultWeightUnit}
        settings={settings}
        disabled={
          loading ||
          deleteShippingZoneOpts.loading ||
          updateDefaultWeightUnitOpts.loading
        }
        shippingZones={mapEdgesToItems(data?.shippingZones)}
        onUpdateListSettings={updateListSettings}
        onRemove={id =>
          openModal("remove", {
            id,
          })
        }
        onSubmit={unit =>
          extractMutationErrors(
            updateDefaultWeightUnit({
              variables: { unit },
            }),
          )
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            data-test-id="delete-selected-elements-icon"
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove-many", {
                ids: listElements,
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
          id: "k3EI/U",
          defaultMessage: "Delete Shipping Zone",
          description: "dialog header",
        })}
        onClose={closeModal}
        onConfirm={() =>
          deleteShippingZone({
            variables: { id: params.id },
          })
        }
      >
        <DialogContentText>
          <FormattedMessage
            id="qf/m5l"
            defaultMessage="Are you sure you want to delete {shippingZoneName} shipping zone?"
            values={{
              shippingZoneName: (
                <strong>
                  {getStringOrPlaceholder(
                    mapEdgesToItems(data?.shippingZones)?.find(
                      getById(params.id),
                    )?.name,
                  )}
                </strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        open={params.action === "remove-many"}
        confirmButtonState={bulkDeleteShippingZoneOpts.status}
        variant="delete"
        title={intl.formatMessage({
          id: "cpZLRH",
          defaultMessage: "Delete Shipping Zones",
          description: "dialog header",
        })}
        onClose={closeModal}
        onConfirm={() =>
          bulkDeleteShippingZone({
            variables: { ids: params.ids },
          })
        }
      >
        <DialogContentText>
          <FormattedMessage
            id="C9pcQx"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this shipping zone?} other{Are you sure you want to delete {displayQuantity} shipping zones?}}"
            description="dialog content"
            values={{
              counter: params.ids?.length,
              displayQuantity: (
                <strong>
                  {getStringOrPlaceholder(params.ids?.length.toString())}
                </strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </PaginatorContext.Provider>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
