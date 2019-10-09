import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { configurationMenuUrl } from "@saleor/configuration";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import useShop from "@saleor/hooks/useShop";
import useUser from "@saleor/hooks/useUser";
import { commonMessages } from "@saleor/intl";
import { getMutationState, maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import ShippingZonesListPage from "../components/ShippingZonesListPage";
import {
  TypedBulkDeleteShippingZone,
  TypedDeleteShippingZone,
  TypedUpdateDefaultWeightUnit
} from "../mutations";
import { TypedShippingZones } from "../queries";
import { BulkDeleteShippingZone } from "../types/BulkDeleteShippingZone";
import { DeleteShippingZone } from "../types/DeleteShippingZone";
import { UpdateDefaultWeightUnit } from "../types/UpdateDefaultWeightUnit";
import {
  shippingZoneAddUrl,
  shippingZonesListUrl,
  ShippingZonesListUrlQueryParams,
  shippingZoneUrl
} from "../urls";

interface ShippingZonesListProps {
  params: ShippingZonesListUrlQueryParams;
}

export const ShippingZonesList: React.StatelessComponent<
  ShippingZonesListProps
> = ({ params }) => {
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
  const intl = useIntl();

  const paginationState = createPaginationState(settings.rowNumber, params);

  return (
    <TypedShippingZones displayLoader variables={paginationState}>
      {({ data, loading, refetch }) => {
        const handleUpdateDefaultWeightUnit = (
          data: UpdateDefaultWeightUnit
        ) => {
          if (data.shopSettingsUpdate.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
          }
        };

        const closeModal = () =>
          navigate(
            shippingZonesListUrl({
              ...params,
              action: undefined,
              ids: undefined
            }),
            true
          );

        const handleShippingZoneDelete = (data: DeleteShippingZone) => {
          if (data.shippingZoneDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            closeModal();
            refetch();
          }
        };

        const handleBulkDeleteShippingZone = (data: BulkDeleteShippingZone) => {
          if (data.shippingZoneBulkDelete.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            closeModal();
            reset();
            refetch();
          }
        };
        return (
          <TypedDeleteShippingZone onCompleted={handleShippingZoneDelete}>
            {(deleteShippingZone, deleteShippingZoneOpts) => (
              <TypedUpdateDefaultWeightUnit
                onCompleted={handleUpdateDefaultWeightUnit}
              >
                {(updateDefaultWeightUnit, updateDefaultWeightUnitOpts) => (
                  <TypedBulkDeleteShippingZone
                    onCompleted={handleBulkDeleteShippingZone}
                  >
                    {(bulkDeleteShippingZone, bulkDeleteShippingZoneOpts) => {
                      const deleteTransitionState = getMutationState(
                        deleteShippingZoneOpts.called,
                        deleteShippingZoneOpts.loading,
                        maybe(
                          () =>
                            deleteShippingZoneOpts.data.shippingZoneDelete
                              .errors
                        )
                      );

                      const bulkDeleteTransitionState = getMutationState(
                        bulkDeleteShippingZoneOpts.called,
                        bulkDeleteShippingZoneOpts.loading,
                        maybe(
                          () =>
                            bulkDeleteShippingZoneOpts.data
                              .shippingZoneBulkDelete.errors
                        )
                      );

                      const {
                        loadNextPage,
                        loadPreviousPage,
                        pageInfo
                      } = paginate(
                        maybe(() => data.shippingZones.pageInfo),
                        paginationState,
                        params
                      );

                      return (
                        <>
                          <ShippingZonesListPage
                            defaultWeightUnit={maybe(
                              () => shop.defaultWeightUnit
                            )}
                            settings={settings}
                            disabled={
                              loading ||
                              deleteShippingZoneOpts.loading ||
                              updateDefaultWeightUnitOpts.loading
                            }
                            shippingZones={maybe(() =>
                              data.shippingZones.edges.map(edge => edge.node)
                            )}
                            pageInfo={pageInfo}
                            onAdd={() => navigate(shippingZoneAddUrl)}
                            onBack={() => navigate(configurationMenuUrl)}
                            onUpdateListSettings={updateListSettings}
                            onNextPage={loadNextPage}
                            onPreviousPage={loadPreviousPage}
                            onRemove={id =>
                              navigate(
                                shippingZonesListUrl({
                                  ...params,
                                  action: "remove",
                                  id
                                })
                              )
                            }
                            onRowClick={id => () =>
                              navigate(shippingZoneUrl(id))}
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
                                color="primary"
                                onClick={() =>
                                  navigate(
                                    shippingZonesListUrl({
                                      action: "remove-many",
                                      ids: listElements
                                    })
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                            userPermissions={maybe(() => user.permissions, [])}
                          />

                          <ActionDialog
                            open={params.action === "remove"}
                            confirmButtonState={deleteTransitionState}
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
                                      {maybe(
                                        () =>
                                          data.shippingZones.edges.find(
                                            edge => edge.node.id === params.id
                                          ).node.name,
                                        "..."
                                      )}
                                    </strong>
                                  )
                                }}
                              />
                            </DialogContentText>
                          </ActionDialog>
                          <ActionDialog
                            open={params.action === "remove-many"}
                            confirmButtonState={bulkDeleteTransitionState}
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
                                defaultMessage="Are you sure you want to delete {counter, plural,
            one {this shipping zone}
            other {{displayQuantity} shipping zones}
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
                  </TypedBulkDeleteShippingZone>
                )}
              </TypedUpdateDefaultWeightUnit>
            )}
          </TypedDeleteShippingZone>
        );
      }}
    </TypedShippingZones>
  );
};
ShippingZonesList.displayName = "ShippingZonesList";
export default ShippingZonesList;
