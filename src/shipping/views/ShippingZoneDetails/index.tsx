import { DialogContentText } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { useShopCountries } from "@saleor/components/Shop/query";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { PAGINATE_BY } from "@saleor/config";
import { useLocalPaginationState } from "@saleor/hooks/useLocalPaginator";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { getById } from "@saleor/orders/components/OrderReturnPage/utils";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingZoneAddWarehouseDialog from "@saleor/shipping/components/ShippingZoneAddWarehouseDialog";
import ShippingZoneCountriesAssignDialog from "@saleor/shipping/components/ShippingZoneCountriesAssignDialog";
import {
  useShippingRateDelete,
  useShippingZoneDelete,
  useShippingZoneUpdate
} from "@saleor/shipping/mutations";
import { arrayDiff } from "@saleor/utils/arrays";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  mapCountriesToCountriesCodes,
  mapEdgesToItems
} from "@saleor/utils/maps";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import { useWarehouseCreate } from "@saleor/warehouses/mutations";
import { diff } from "fast-array-diff";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  extractMutationErrors,
  findValueInEnum,
  getStringOrPlaceholder
} from "../../../misc";
import {
  CountryCode,
  ShippingZoneUpdateInput
} from "../../../types/globalTypes";
import ShippingZoneDetailsPage from "../../components/ShippingZoneDetailsPage";
import { ShippingZoneUpdateFormData } from "../../components/ShippingZoneDetailsPage/types";
import { useShippingZone } from "../../queries";
import {
  shippingPriceRatesEditUrl,
  shippingPriceRatesUrl,
  shippingWeightRatesEditUrl,
  shippingWeightRatesUrl,
  shippingZonesListUrl,
  shippingZoneUrl,
  ShippingZoneUrlDialog,
  ShippingZoneUrlQueryParams
} from "../../urls";

export interface ShippingZoneDetailsProps {
  id: string;
  params: ShippingZoneUrlQueryParams;
}

const ShippingZoneDetails: React.FC<ShippingZoneDetailsProps> = ({
  id,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const {
    data: restWorldCountries,
    refetch: refetchRestWorldCountries
  } = useShopCountries({
    variables: {
      filter: {
        attachedToShippingZones: false
      }
    }
  });

  const [paginationState] = useLocalPaginationState(PAGINATE_BY);

  const { result: searchWarehousesOpts, loadMore, search } = useWarehouseSearch(
    {
      variables: DEFAULT_INITIAL_SEARCH_DATA
    }
  );

  const { data, loading } = useShippingZone({
    displayLoader: true,
    variables: { id, ...paginationState }
  });
  const { availableChannels, channel } = useAppChannel();

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingZoneUrlDialog,
    ShippingZoneUrlQueryParams
  >(navigate, params => shippingZoneUrl(id, params), params);
  const rate = data?.shippingZone?.shippingMethods?.find(getById(params.id));

  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [deleteShippingZone, deleteShippingZoneOpts] = useShippingZoneDelete({
    onCompleted: data => {
      if (data.shippingZoneDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(shippingZonesListUrl(), { replace: true });
      }
    }
  });

  const [updateShippingZone, updateShippingZoneOpts] = useShippingZoneUpdate({
    onCompleted: data => {
      if (data.shippingZoneUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
        refetchRestWorldCountries();
      }
    }
  });

  const [createWarehouse, createWarehouseOpts] = useWarehouseCreate({
    onCompleted: data => {
      if (data.createWarehouse.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      }
    }
  });

  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const getParsedUpdateInput = (
    submitData: ShippingZoneUpdateFormData
  ): ShippingZoneUpdateInput => {
    const warehouseDiff = diff(
      data.shippingZone.warehouses.map(warehouse => warehouse.id),
      submitData.warehouses
    );

    const channelsDiff = arrayDiff(
      data.shippingZone.channels.map(channel => channel.id),
      submitData.channels
    );

    return {
      addWarehouses: warehouseDiff.added,
      addChannels: channelsDiff.added,
      removeChannels: channelsDiff.removed,
      description: submitData.description,
      name: submitData.name,
      removeWarehouses: warehouseDiff.removed
    };
  };

  const updateData = async (submitData: ShippingZoneUpdateFormData) =>
    extractMutationErrors(
      updateShippingZone({
        variables: {
          id,
          input: getParsedUpdateInput(submitData)
        }
      })
    );

  const handleSubmit = createMetadataUpdateHandler(
    data?.shippingZone,
    updateData,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  if (data?.shippingZone === null) {
    return <NotFoundPage onBack={() => navigate(shippingZonesListUrl())} />;
  }

  return (
    <>
      <ShippingZoneDetailsPage
        disabled={loading}
        errors={updateShippingZoneOpts.data?.shippingZoneUpdate.errors || []}
        onBack={() => navigate(shippingZonesListUrl())}
        onCountryAdd={() => openModal("assign-country")}
        onCountryRemove={code =>
          openModal("unassign-country", {
            id: code
          })
        }
        onDelete={() => openModal("remove")}
        onPriceRateAdd={() => navigate(shippingPriceRatesUrl(id))}
        onPriceRateEdit={rateId =>
          navigate(shippingPriceRatesEditUrl(id, rateId))
        }
        onRateRemove={rateId =>
          openModal("remove-rate", {
            id: rateId
          })
        }
        onSubmit={handleSubmit}
        allChannels={availableChannels}
        onWarehouseAdd={() => openModal("add-warehouse")}
        onWeightRateAdd={() => navigate(shippingWeightRatesUrl(id))}
        onWeightRateEdit={rateId =>
          navigate(shippingWeightRatesEditUrl(id, rateId))
        }
        saveButtonBarState={updateShippingZoneOpts.status}
        shippingZone={data?.shippingZone}
        warehouses={mapEdgesToItems(searchWarehousesOpts?.data?.search) || []}
        hasMore={searchWarehousesOpts.data?.search?.pageInfo?.hasNextPage}
        loading={searchWarehousesOpts.loading}
        onFetchMore={loadMore}
        onSearchChange={search}
        selectedChannelId={channel?.id}
      />
      <DeleteShippingRateDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={closeModal}
        handleConfirm={() =>
          deleteShippingRate({
            variables: {
              id: params.id
            }
          })
        }
        name={rate?.name}
        open={params.action === "remove-rate"}
      />
      <ActionDialog
        confirmButtonState={deleteShippingZoneOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          deleteShippingZone({
            variables: {
              id
            }
          })
        }
        open={params.action === "remove"}
        title={intl.formatMessage({
          defaultMessage: "Delete Shipping Zone",
          description: "dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {name}?"
            description="delete shipping zone"
            id="shippingZoneDetailsDialogsDeleteShippingZone"
            values={{
              name: (
                <strong>
                  {getStringOrPlaceholder(data?.shippingZone.name)}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneCountriesAssignDialog
        confirmButtonState={updateShippingZoneOpts.status}
        countries={shop?.countries || []}
        restWorldCountries={
          mapCountriesToCountriesCodes(restWorldCountries?.shop?.countries) ||
          []
        }
        initial={
          mapCountriesToCountriesCodes(data?.shippingZone?.countries) || []
        }
        onClose={closeModal}
        onConfirm={formData =>
          updateShippingZone({
            variables: {
              id,
              input: {
                countries: formData.countries
              }
            }
          })
        }
        open={params.action === "assign-country"}
      />
      <ActionDialog
        confirmButtonState={updateShippingZoneOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          updateShippingZone({
            variables: {
              id,
              input: {
                countries: data.shippingZone.countries
                  .filter(country => country.code !== params.id)
                  .map(country => country.code)
              }
            }
          })
        }
        open={params.action === "unassign-country"}
        title={intl.formatMessage({
          defaultMessage: "Delete from Shipping Zone",
          description: "unassign country, dialog header"
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {countryName} from this shipping zone?"
            description="unassign country"
            values={{
              countryName: (
                <strong>
                  {getStringOrPlaceholder(
                    data?.shippingZone?.countries.find(
                      country => country.code === params.id
                    )?.country
                  )}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <ShippingZoneAddWarehouseDialog
        countries={shop?.countries || []}
        disabled={createWarehouseOpts.loading}
        open={params.action === "add-warehouse"}
        confirmButtonState={createWarehouseOpts.status}
        errors={createWarehouseOpts.data?.createWarehouse.errors || []}
        onClose={closeModal}
        onSubmit={data =>
          createWarehouse({
            variables: {
              input: {
                address: {
                  companyName: data.companyName,
                  city: data.city,
                  cityArea: data.cityArea,
                  country: findValueInEnum(data.country, CountryCode),
                  countryArea: data.countryArea,
                  phone: data.phone,
                  postalCode: data.postalCode,
                  streetAddress1: data.streetAddress1,
                  streetAddress2: data.streetAddress2
                },
                name: data.name
              }
            }
          })
        }
      />
    </>
  );
};
export default ShippingZoneDetails;
