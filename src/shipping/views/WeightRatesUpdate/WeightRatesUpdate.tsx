import Button from "@material-ui/core/Button";
import { useChannelsList } from "@saleor/channels/queries";
import {
  createShippingChannelsFromRate,
  createSortedShippingChannels
} from "@saleor/channels/utils";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { PAGINATE_BY } from "@saleor/config";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { sectionNames } from "@saleor/intl";
import { commonMessages } from "@saleor/intl";
import useProductSearch from "@saleor/searches/useProductSearch";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingMethodProductsAddDialog from "@saleor/shipping/components/ShippingMethodProductsAddDialog";
import ShippingRateZipCodeRangeRemoveDialog from "@saleor/shipping/components/ShippingRateZipCodeRangeRemoveDialog";
import ShippingZoneRatesPage, {
  FormData
} from "@saleor/shipping/components/ShippingZoneRatesPage";
import ShippingZoneZipCodeRangeDialog from "@saleor/shipping/components/ShippingZoneZipCodeRangeDialog";
import UnassignDialog from "@saleor/shipping/components/UnassignDialog";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingWeightRateVariables
} from "@saleor/shipping/handlers";
import {
  useShippingMethodChannelListingUpdate,
  useShippingMethodZipCodeRangeAssign,
  useShippingMethodZipCodeRangeUnassign,
  useShippingPriceExcludeProduct,
  useShippingPriceRemoveProductsFromExclude,
  useShippingRateDelete,
  useShippingRateUpdate
} from "@saleor/shipping/mutations";
import { useShippingZone } from "@saleor/shipping/queries";
import {
  ShippingRateUrlDialog,
  ShippingRateUrlQueryParams,
  shippingWeightRatesEditUrl,
  shippingZoneUrl
} from "@saleor/shipping/urls";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WeightRatesUpdateProps {
  id: string;
  rateId: string;
  params: ShippingRateUrlQueryParams;
}

export const WeightRatesUpdate: React.FC<WeightRatesUpdateProps> = ({
  id,
  rateId,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const paginate = usePaginator();

  const paginationState = createPaginationState(PAGINATE_BY, params);

  const { data, loading, refetch } = useShippingZone({
    displayLoader: true,
    variables: { id, ...paginationState }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateUrlDialog,
    ShippingRateUrlQueryParams
  >(navigate, params => shippingWeightRatesEditUrl(id, rateId, params), params);

  const {
    loadMore,
    search: productsSearch,
    result: productsSearchOpts
  } = useProductSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });

  const rate = data?.shippingZone?.shippingMethods.find(
    rate => rate.id === rateId
  );

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    []
  );

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    rate?.excludedProducts.pageInfo,
    paginationState,
    params
  );

  const { data: channelsData } = useChannelsList({});
  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts
  ] = useShippingMethodChannelListingUpdate({});

  const [
    unassignProduct,
    unassignProductOpts
  ] = useShippingPriceRemoveProductsFromExclude({
    onCompleted: data => {
      if (data.shippingPriceRemoveProductFromExclude.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    }
  });

  const [assignProduct, assignProductOpts] = useShippingPriceExcludeProduct({
    onCompleted: data => {
      if (data.shippingPriceExcludeProducts.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    }
  });

  const shippingChannels = createShippingChannelsFromRate(
    rate?.channelListings
  );
  const allChannels = createSortedShippingChannels(channelsData?.channels);

  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels
  } = useChannels(shippingChannels, params?.action, { closeModal, openModal });

  const [updateShippingRate, updateShippingRateOpts] = useShippingRateUpdate(
    {}
  );

  const handleSuccess = () => {
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges)
    });
  };

  const [deleteShippingRate, deleteShippingRateOpts] = useShippingRateDelete({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        handleSuccess();
        navigate(shippingZoneUrl(id));
      }
    }
  });

  const [
    assignZipCodeRange,
    assignZipCodeRangeOpts
  ] = useShippingMethodZipCodeRangeAssign({
    onCompleted: data => {
      if (data.shippingMethodZipCodeRulesCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        closeModal();
      } else {
        notify({
          status: "error",
          text: intl.formatMessage({
            defaultMessage: "Cannot add specified zip codes range.",
            description: "zip code range add error text"
          })
        });
      }
    }
  });
  const [
    unassignZipCodeRange,
    unassignZipCodeRangeOpts
  ] = useShippingMethodZipCodeRangeUnassign({
    onCompleted: data => {
      if (data.shippingMethodZipCodeRulesDelete.errors.length === 0) {
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

  const updateData = async (data: FormData) => {
    const response = await updateShippingRate({
      variables: getUpdateShippingWeightRateVariables(data, id, rateId)
    });
    const errors = response.data.shippingPriceUpdate.errors;
    if (errors.length === 0) {
      handleSuccess();
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          data.noLimits,
          data.channelListings,
          shippingChannels
        )
      });
    }

    return errors;
  };

  const handleSubmit = createMetadataUpdateHandler(
    rate,
    updateData,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables })
  );

  const handleProductAssign = (ids: string[]) =>
    assignProduct({
      variables: { id: rateId, input: { products: ids } }
    });

  const handleProductUnassign = (ids: string[]) => {
    unassignProduct({
      variables: { id: rateId, products: ids }
    });
    reset();
  };

  const handleBack = () => navigate(shippingZoneUrl(id));

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          disabled={!channelListElements.length}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            defaultMessage: "Manage Channels Availability"
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <DeleteShippingRateDialog
        confirmButtonState={deleteShippingRateOpts.status}
        onClose={closeModal}
        handleConfirm={() =>
          deleteShippingRate({
            variables: {
              id: rateId
            }
          })
        }
        open={params.action === "remove"}
        name={rate?.name}
      />
      <UnassignDialog
        open={params.action === "unassign-product" && !!listElements.length}
        idsLength={listElements.length}
        confirmButtonState={unassignProductOpts.status}
        closeModal={closeModal}
        onConfirm={() => handleProductUnassign(listElements)}
      />
      <ShippingMethodProductsAddDialog
        confirmButtonState={assignProductOpts.status}
        loading={productsSearchOpts.loading}
        open={params.action === "assign-product"}
        hasMore={productsSearchOpts.data?.search?.pageInfo.hasNextPage}
        products={productsSearchOpts.data?.search?.edges
          .map(edge => edge.node)
          .filter(suggestedProduct => suggestedProduct.id)}
        onClose={closeModal}
        onFetch={productsSearch}
        onFetchMore={loadMore}
        onSubmit={handleProductAssign}
      />
      <ShippingZoneRatesPage
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading" ||
          unassignProductOpts?.status === "loading" ||
          assignProductOpts?.status === "loading"
        }
        hasChannelChanged={shippingChannels?.length !== currentChannels?.length}
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={() => openModal("remove")}
        onSubmit={handleSubmit}
        onBack={handleBack}
        rate={rate}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate.errors || []}
        channelErrors={
          updateShippingMethodChannelListingOpts?.data
            ?.shippingMethodChannelListingUpdate?.errors || []
        }
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        onProductUnassign={handleProductUnassign}
        onProductAssign={() => openModal("assign-product")}
        variant={ShippingMethodTypeEnum.WEIGHT}
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        pageInfo={pageInfo}
        toolbar={
          <Button color="primary" onClick={() => openModal("unassign-product")}>
            <FormattedMessage
              defaultMessage="Unassign"
              description="unassign products from shipping method, button"
            />
          </Button>
        }
        onZipCodeAssign={() => openModal("add-range")}
        onZipCodeUnassign={id =>
          openModal("remove-range", {
            id
          })
        }
      />
      <ShippingZoneZipCodeRangeDialog
        confirmButtonState={assignZipCodeRangeOpts.status}
        onClose={closeModal}
        onSubmit={data =>
          assignZipCodeRange({
            variables: {
              id: rateId,
              input: {
                zipCodeRules: [
                  {
                    end: data.max || null,
                    start: data.min
                  }
                ]
              }
            }
          })
        }
        open={params.action === "add-range"}
      />
      <ShippingRateZipCodeRangeRemoveDialog
        confirmButtonState={unassignZipCodeRangeOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          unassignZipCodeRange({
            variables: {
              id: params.id
            }
          })
        }
        open={params.action === "remove-range"}
      />
    </>
  );
};

export default WeightRatesUpdate;
