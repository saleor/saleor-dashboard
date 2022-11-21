import {
  createShippingChannelsFromRate,
  createSortedShippingChannels,
} from "@saleor/channels/utils";
import { Button } from "@saleor/components/Button";
import ChannelsAvailabilityDialog from "@saleor/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@saleor/config";
import {
  PostalCodeRuleInclusionTypeEnum,
  ShippingMethodTypeEnum,
  useDeleteShippingRateMutation,
  useShippingMethodChannelListingUpdateMutation,
  useShippingPriceExcludeProductMutation,
  useShippingPriceRemoveProductFromExcludeMutation,
  useShippingZoneQuery,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
  useUpdateShippingRateMutation,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useChannels from "@saleor/hooks/useChannels";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@saleor/hooks/useLocalPaginator";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { PaginatorContext } from "@saleor/hooks/usePaginator";
import { commonMessages, sectionNames } from "@saleor/intl";
import {
  getById,
  getByUnmatchingId,
} from "@saleor/orders/components/OrderReturnPage/utils";
import useProductSearch from "@saleor/searches/useProductSearch";
import DeleteShippingRateDialog from "@saleor/shipping/components/DeleteShippingRateDialog";
import ShippingMethodProductsAddDialog from "@saleor/shipping/components/ShippingMethodProductsAddDialog";
import ShippingZonePostalCodeRangeDialog from "@saleor/shipping/components/ShippingZonePostalCodeRangeDialog";
import ShippingZoneRatesPage from "@saleor/shipping/components/ShippingZoneRatesPage";
import { ShippingZoneRateUpdateFormData } from "@saleor/shipping/components/ShippingZoneRatesPage/types";
import UnassignDialog from "@saleor/shipping/components/UnassignDialog";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingPriceRateVariables,
  getUpdateShippingWeightRateVariables,
} from "@saleor/shipping/handlers";
import {
  shippingRateEditUrl,
  ShippingRateUrlDialog,
  ShippingRateUrlQueryParams,
  shippingZoneUrl,
} from "@saleor/shipping/urls";
import postalCodesReducer from "@saleor/shipping/views/reducer";
import {
  filterPostalCodes,
  getPostalCodeRuleByMinMax,
  getRuleObject,
} from "@saleor/shipping/views/utils";
import { MinMax } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const FORM_ID = Symbol();

export interface RateUpdateProps {
  id: string;
  rateId: string;
  params: ShippingRateUrlQueryParams;
}

export const RateUpdate: React.FC<RateUpdateProps> = ({
  id,
  rateId,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [paginationState, setPaginationState] = useLocalPaginationState(
    PAGINATE_BY,
  );
  const paginate = useLocalPaginator(setPaginationState);

  const { data, loading, refetch } = useShippingZoneQuery({
    displayLoader: true,
    variables: { id, ...paginationState },
  });

  const channelsData = data?.shippingZone?.channels;

  const rate = data?.shippingZone?.shippingMethods?.find(getById(rateId));

  const {
    loadMore,
    search: productsSearch,
    result: productsSearchOpts,
  } = useProductSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });

  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateUrlDialog,
    ShippingRateUrlQueryParams
  >(navigate, params => shippingRateEditUrl(id, rateId, params), params);

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    [],
  );

  const { pageInfo, ...paginationValues } = paginate(
    rate?.excludedProducts.pageInfo,
    paginationState,
  );

  const [
    updateShippingMethodChannelListing,
    updateShippingMethodChannelListingOpts,
  ] = useShippingMethodChannelListingUpdateMutation({});

  const [
    unassignProduct,
    unassignProductOpts,
  ] = useShippingPriceRemoveProductFromExcludeMutation({
    onCompleted: data => {
      if (data.shippingPriceRemoveProductFromExclude.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    },
  });

  const [
    assignProduct,
    assignProductOpts,
  ] = useShippingPriceExcludeProductMutation({
    onCompleted: data => {
      if (data.shippingPriceExcludeProducts.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    },
  });
  const shippingChannels = createShippingChannelsFromRate(
    rate?.channelListings,
  );
  const allChannels = createSortedShippingChannels(channelsData);

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
    toggleAllChannels,
  } = useChannels(
    shippingChannels,
    params?.action,
    { closeModal, openModal },
    { formId: FORM_ID },
  );

  const [
    updateShippingRate,
    updateShippingRateOpts,
  ] = useUpdateShippingRateMutation({});

  const handleSuccess = () => {
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });
  };
  const [
    deleteShippingRate,
    deleteShippingRateOpts,
  ] = useDeleteShippingRateMutation({
    onCompleted: data => {
      if (data.shippingPriceDelete.errors.length === 0) {
        handleSuccess();
        navigate(shippingZoneUrl(id));
      }
    },
  });

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const [state, dispatch] = React.useReducer(postalCodesReducer, {
    codesToDelete: [],
    havePostalCodesChanged: false,
    inclusionType: rate?.postalCodeRules[0]?.inclusionType,
    originalCodes: [],
    postalCodeRules: rate?.postalCodeRules || [],
  });

  const postalCodeRulesLoaded =
    !loading &&
    !state.postalCodeRules?.length &&
    !state.codesToDelete?.length &&
    rate?.postalCodeRules?.length;

  if (postalCodeRulesLoaded) {
    dispatch({ postalCodeRules: rate.postalCodeRules });
  }

  const onPostalCodeInclusionChange = (
    inclusion: PostalCodeRuleInclusionTypeEnum,
  ) => {
    dispatch({
      codesToDelete: rate.postalCodeRules.map(code => code.id),
      havePostalCodesChanged: true,
      inclusionType: inclusion,
      postalCodeRules: [],
    });
  };

  const updateData = async (
    formData: ShippingZoneRateUpdateFormData,
  ): Promise<unknown[]> => {
    const getUpdateVariables =
      rate!.type === ShippingMethodTypeEnum.PRICE
        ? getUpdateShippingPriceRateVariables
        : getUpdateShippingWeightRateVariables;
    const response = await updateShippingRate({
      variables: getUpdateVariables(
        formData,
        id,
        rateId,
        state.postalCodeRules,
        state.codesToDelete,
      ),
    });

    dispatch({ codesToDelete: [] });

    const errors = response.data.shippingPriceUpdate.errors;

    if (errors.length === 0) {
      handleSuccess();
      dispatch({ havePostalCodesChanged: false });
      updateShippingMethodChannelListing({
        variables: getShippingMethodChannelVariables(
          rateId,
          formData.orderValueRestricted,
          formData.channelListings,
          shippingChannels,
        ),
      });
    }

    return errors;
  };

  const handleSubmit = createMetadataUpdateHandler(
    rate,
    updateData,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const handleProductAssign = (ids: string[]) =>
    assignProduct({
      variables: { id: rateId, input: { products: ids } },
    });

  const handleProductUnassign = (ids: string[]) => {
    unassignProduct({
      variables: { id: rateId, products: ids },
    });
    reset();
  };

  const onPostalCodeAssign = (rule: MinMax) => {
    if (!state.originalCodes.length) {
      dispatch({ originalCodes: rate.postalCodeRules });
    }

    if (
      state.postalCodeRules.filter(getPostalCodeRuleByMinMax(rule)).length > 0
    ) {
      closeModal();
      return;
    }

    const newCode = getRuleObject(rule, state.inclusionType);
    dispatch({
      havePostalCodesChanged: true,
      postalCodeRules: [...state.postalCodeRules, newCode],
    });
    closeModal();
  };

  const onPostalCodeUnassign = code => {
    if (code.id !== undefined) {
      dispatch({
        codesToDelete: [...state.codesToDelete, code.id],
        havePostalCodesChanged: true,
        postalCodeRules: state.postalCodeRules.filter(
          getByUnmatchingId(code.id),
        ),
      });
    } else {
      dispatch({
        havePostalCodesChanged: true,
        postalCodeRules: filterPostalCodes(state.postalCodeRules, code),
      });
    }
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "EM730i",
            defaultMessage: "Manage Channel Availability",
          })}
          selected={channelListElements.length}
          confirmButtonState="default"
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
              id: rateId,
            },
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
        products={mapEdgesToItems(productsSearchOpts?.data?.search)?.filter(
          suggestedProduct => suggestedProduct.id,
        )}
        onClose={closeModal}
        onFetch={productsSearch}
        onFetchMore={loadMore}
        onSubmit={handleProductAssign}
      />
      <ShippingZoneRatesPage
        formId={FORM_ID}
        allChannelsCount={allChannels?.length}
        shippingChannels={currentChannels}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading" ||
          unassignProductOpts?.status === "loading" ||
          assignProductOpts?.status === "loading"
        }
        saveButtonBarState={updateShippingRateOpts.status}
        onDelete={() => openModal("remove")}
        backHref={shippingZoneUrl(id)}
        onSubmit={handleSubmit}
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
        variant={rate?.type}
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <Button onClick={() => openModal("unassign-product")}>
            <FormattedMessage
              id="YdeHZX"
              defaultMessage="Unassign"
              description="unassign products from shipping method, button"
            />
          </Button>
        }
        onPostalCodeInclusionChange={onPostalCodeInclusionChange}
        onPostalCodeAssign={() => openModal("add-range")}
        onPostalCodeUnassign={onPostalCodeUnassign}
        postalCodeRules={state.postalCodeRules}
      />
      <ShippingZonePostalCodeRangeDialog
        confirmButtonState={"default"}
        onClose={closeModal}
        onSubmit={code => onPostalCodeAssign(code)}
        open={params.action === "add-range"}
      />
    </PaginatorContext.Provider>
  );
};

export default RateUpdate;
