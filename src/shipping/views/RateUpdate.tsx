import {
  type Channel,
  type ChannelShippingData,
  createShippingChannelsFromRate,
  createSortedShippingChannels,
  sortChannelShippingDataByName,
} from "@dashboard/channels/utils";
import { AssignProductDialog } from "@dashboard/components/AssignProductDialog/AssignProductDialog";
import { Button } from "@dashboard/components/Button";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, PAGINATE_BY } from "@dashboard/config";
import {
  type PostalCodeRuleInclusionTypeEnum,
  type ProductWhereInput,
  ShippingMethodTypeEnum,
  type ShippingMethodTypeFragment,
  type ShippingMethodWithPostalCodesFragment,
  useDeleteShippingRateMutation,
  useShippingMethodChannelListingUpdateMutation,
  useShippingPriceExcludeProductMutation,
  useShippingPriceRemoveProductFromExcludeMutation,
  useShippingZoneQuery,
  useUpdateShippingRateMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useChannels from "@dashboard/hooks/useChannels";
import useLocalPaginator, { useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { sectionNames } from "@dashboard/intl";
import { type ShippingMethodPostalCodeRule } from "@dashboard/legacy-sdk/apollo/types";
import { getById, getByUnmatchingId, getMutationState } from "@dashboard/misc";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { DeleteShippingRateDialog } from "@dashboard/shipping/components/DeleteShippingRateDialog";
import { ShippingMethodMetadataDialog } from "@dashboard/shipping/components/ShippingMethodMetadataDialog/ShippingMethodMetadataDialog";
import { ShippingZonePostalCodeRangeDialog } from "@dashboard/shipping/components/ShippingZonePostalCodeRangeDialog";
import ShippingZoneRatesPage from "@dashboard/shipping/components/ShippingZoneRatesPage";
import { type ShippingZoneRateUpdateFormData } from "@dashboard/shipping/components/ShippingZoneRatesPage/types";
import { UnassignDialog } from "@dashboard/shipping/components/UnassignDialog";
import {
  getShippingMethodChannelVariables,
  getUpdateShippingPriceRateVariables,
  getUpdateShippingWeightRateVariables,
} from "@dashboard/shipping/handlers";
import { shippingMethodChannelsDialogMessages } from "@dashboard/shipping/messages/channelAvailabilityDialogMessages";
import {
  shippingRateEditUrl,
  type ShippingRateUrlDialog,
  type ShippingRateUrlQueryParams,
  shippingZoneUrl,
} from "@dashboard/shipping/urls";
import {
  hasPostalCodeStateChanges,
  resolvePostalCodeInclusionType,
} from "@dashboard/shipping/utils/postalCodeState";
import postalCodesReducer from "@dashboard/shipping/views/reducer";
import {
  filterPostalCodes,
  getPostalCodeRuleByMinMax,
  getRuleObject,
  mapPostalCodeRulesInclusionType,
} from "@dashboard/shipping/views/utils";
import { useTaxClassFetchMore } from "@dashboard/taxes/utils/useTaxClassFetchMore";
import { type MinMax } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useReducer, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const FORM_ID = Symbol("shipping-zone-rates-details-form-id");

interface RateUpdateProps {
  id: string;
  rateId: string;
  params: ShippingRateUrlQueryParams;
}

const RateUpdate = ({ id, rateId, params }: RateUpdateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [paginationState, setPaginationState] = useLocalPaginationState(PAGINATE_BY);
  const paginate = useLocalPaginator(setPaginationState);
  const { data, loading, refetch } = useShippingZoneQuery({
    displayLoader: true,
    variables: { id, ...paginationState },
  });
  const channelsData = data?.shippingZone?.channels;
  const zoneName = data?.shippingZone?.name;
  const rate = data?.shippingZone?.shippingMethods?.find(getById(rateId));
  const { loadMore, result: productsSearchOpts } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const handleProductFilterChange = useCallback(
    (filterVariables: ProductWhereInput, channel: string | undefined, query: string) => {
      void productsSearchOpts.refetch({
        ...DEFAULT_INITIAL_SEARCH_DATA,
        where: filterVariables,
        channel,
        query,
      });
    },
    [productsSearchOpts.refetch],
  );
  const [openModal, closeModal] = createDialogActionHandlers<
    ShippingRateUrlDialog,
    ShippingRateUrlQueryParams
  >(navigate, params => shippingRateEditUrl(id, rateId, params), params);
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions([]);
  const { pageInfo, ...paginationValues } = paginate(
    rate?.excludedProducts?.pageInfo,
    paginationState,
  );
  const [updateShippingMethodChannelListing, updateShippingMethodChannelListingOpts] =
    useShippingMethodChannelListingUpdateMutation({ disableErrorHandling: true });
  const [unassignProduct, unassignProductOpts] = useShippingPriceRemoveProductFromExcludeMutation({
    onCompleted: data => {
      if (data?.shippingPriceRemoveProductFromExclude?.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    },
  });
  const [assignProduct, assignProductOpts] = useShippingPriceExcludeProductMutation({
    onCompleted: data => {
      if (data?.shippingPriceExcludeProducts?.errors.length === 0) {
        handleSuccess();
        refetch();
        closeModal();
      }
    },
  });
  const shippingChannels = useMemo(
    () =>
      createShippingChannelsFromRate(
        rate?.channelListings as ShippingMethodTypeFragment["channelListings"],
      ),
    [rate?.channelListings],
  );
  const savedChannelIds = useMemo(
    () => shippingChannels.map(channel => channel.id),
    [shippingChannels],
  );
  const allChannels = useMemo(() => createSortedShippingChannels(channelsData), [channelsData]);
  const {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    hasChannelSelectionChanged,
    isChannelSelected,
    isChannelsModalOpen,
    setCurrentChannels,
    toggleAllChannels,
  } = useChannels<ChannelShippingData, ShippingRateUrlDialog | undefined>(
    shippingChannels,
    params?.action,
    { closeModal, openModal },
    { formId: FORM_ID },
  );
  const focusChannelId = params.channelId;
  const [excludedFocusChannelId, setExcludedFocusChannelId] = useState<string | null>(null);
  const clearFocusChannelFromUrl = useCallback(() => {
    if (!params.channelId) {
      return;
    }

    setExcludedFocusChannelId(params.channelId);

    const { channelId: _channelId, ...paramsWithoutChannel } = params;

    navigate(shippingRateEditUrl(id, rateId, paramsWithoutChannel), { replace: true });
  }, [id, navigate, params, rateId]);
  const shippingChannelsWithFocusTarget = useMemo(() => {
    if (!focusChannelId || !allChannels?.length || excludedFocusChannelId === focusChannelId) {
      return currentChannels;
    }

    if (currentChannels.some(channel => channel.id === focusChannelId)) {
      return currentChannels;
    }

    const channelToFocus = allChannels.find(channel => channel.id === focusChannelId);

    if (!channelToFocus) {
      return currentChannels;
    }

    return sortChannelShippingDataByName([...currentChannels, channelToFocus]);
  }, [allChannels, currentChannels, excludedFocusChannelId, focusChannelId]);

  const handleChannelsConfirmWithFocus = () => {
    const nextChannels = sortChannelShippingDataByName(channelListElements);
    const removesFocusChannel =
      focusChannelId != null && !nextChannels.some(channel => channel.id === focusChannelId);

    if (removesFocusChannel) {
      clearFocusChannelFromUrl();
    }

    handleChannelsConfirm();
  };
  const { taxClasses, fetchMoreTaxClasses } = useTaxClassFetchMore();
  const [updateShippingRate, updateShippingRateOpts] = useUpdateShippingRateMutation({
    disableErrorHandling: true,
  });
  const handleSuccess = () => {
    notify({
      status: "success",
      text: intl.formatMessage({
        id: "84VEY1",
        defaultMessage: "Shipping rate updated",
      }),
    });
  };
  const [deleteShippingRate, deleteShippingRateOpts] = useDeleteShippingRateMutation({
    onCompleted: data => {
      if (data?.shippingPriceDelete?.errors.length === 0) {
        handleSuccess();
        navigate(shippingZoneUrl(id));
      }
    },
  });
  const [state, dispatch] = useReducer(postalCodesReducer, {
    codesToDelete: [],
    inclusionType:
      (rate?.postalCodeRules?.length && rate?.postalCodeRules[0].inclusionType) || undefined,
    originalCodes: [],
    postalCodeRules: rate?.postalCodeRules || [],
  });
  const savedPostalCodeState = useMemo(
    () => ({
      postalCodeRules: rate?.postalCodeRules ?? [],
      inclusionType: undefined,
      codesToDelete: [],
    }),
    [rate?.postalCodeRules],
  );
  const hasPostalCodeChanges = useMemo(
    () =>
      hasPostalCodeStateChanges(
        {
          postalCodeRules: state.postalCodeRules,
          inclusionType: state.inclusionType,
          codesToDelete: state.codesToDelete,
        },
        savedPostalCodeState,
      ),
    [savedPostalCodeState, state.codesToDelete, state.inclusionType, state.postalCodeRules],
  );
  const postalCodeRulesLoaded =
    !loading &&
    !state.postalCodeRules?.length &&
    !state.codesToDelete?.length &&
    rate?.postalCodeRules?.length;

  if (postalCodeRulesLoaded) {
    dispatch({ postalCodeRules: rate.postalCodeRules });
  }

  const onPostalCodeInclusionChange = (inclusion: PostalCodeRuleInclusionTypeEnum) => {
    dispatch({
      inclusionType: inclusion,
      postalCodeRules: mapPostalCodeRulesInclusionType(state.postalCodeRules, inclusion),
    });
  };
  const updateData = async (
    formData: ShippingZoneRateUpdateFormData,
  ): Promise<unknown[] | undefined> => {
    const getUpdateVariables =
      rate?.type === ShippingMethodTypeEnum.PRICE
        ? getUpdateShippingPriceRateVariables
        : getUpdateShippingWeightRateVariables;

    // Saleor stores inclusionType per postal-code rule, so flipping it for the
    // whole method is not persisted by sending the new inclusionType alone -
    // the existing rules must be deleted and re-created with it. When the
    // inclusion type changed we strip ids from the current rules (so they are
    // sent as new additions carrying the new inclusion) and queue every
    // persisted rule id for deletion.
    const savedRules = rate?.postalCodeRules ?? [];
    const inclusionChanged =
      savedRules.length > 0 &&
      resolvePostalCodeInclusionType(state.postalCodeRules, state.inclusionType) !==
        resolvePostalCodeInclusionType(savedRules);
    const postalCodeRulesToSave = (
      inclusionChanged
        ? state.postalCodeRules!.map(rule => ({ ...rule, id: undefined }))
        : state.postalCodeRules!
    ) as ShippingMethodTypeFragment["postalCodeRules"];
    const codesToDeleteToSave = inclusionChanged
      ? Array.from(new Set<string>([...(state.codesToDelete ?? []), ...savedRules.map(r => r.id)]))
      : state.codesToDelete!;

    const response = await updateShippingRate({
      variables: getUpdateVariables(
        formData,
        id,
        rateId,
        postalCodeRulesToSave,
        codesToDeleteToSave,
        state.inclusionType,
      ),
    });

    dispatch({ codesToDelete: [] });

    const errors = response?.data?.shippingPriceUpdate?.errors;

    if (errors?.length) {
      return errors;
    }

    const channelResponse = await updateShippingMethodChannelListing({
      variables: getShippingMethodChannelVariables(
        rateId,
        formData.channelListings,
        shippingChannels,
      ),
    });
    const channelErrors = channelResponse?.data?.shippingMethodChannelListingUpdate?.errors ?? [];

    if (channelErrors.length === 0) {
      handleSuccess();
      clearFocusChannelFromUrl();

      // Re-hydrate the local postal-code editor state from the authoritative
      // server response. Locally added rules have no id until saved, so without
      // this re-sync the editor state never matches the refetched rate and the
      // form stays dirty after saving a mix of added/removed ranges.
      const refetchResult = await refetch();
      const refetchedRules =
        refetchResult?.data?.shippingZone?.shippingMethods?.find(getById(rateId))
          ?.postalCodeRules ?? [];

      dispatch({ postalCodeRules: refetchedRules, originalCodes: [] });
    }

    return channelErrors;
  };
  const saveButtonBarState = getMutationState(
    updateShippingRateOpts.called || updateShippingMethodChannelListingOpts.called,
    updateShippingRateOpts.loading || updateShippingMethodChannelListingOpts.loading,
    updateShippingRateOpts.data?.shippingPriceUpdate?.errors ?? [],
    updateShippingMethodChannelListingOpts.data?.shippingMethodChannelListingUpdate?.errors ?? [],
  );
  const handleProductAssign = useCallback(
    (products: Array<{ id: string }>) => {
      assignProduct({
        variables: { id: rateId, input: { products: products.map(product => product.id) } },
      });
    },
    [assignProduct, rateId],
  );
  const handleProductUnassign = (ids: string[]) => {
    unassignProduct({
      variables: { id: rateId, products: ids },
    });
    reset();
  };
  const onPostalCodeAssign = (rule: MinMax) => {
    if (!state?.originalCodes?.length) {
      dispatch({ originalCodes: rate?.postalCodeRules });
    }

    if (state?.postalCodeRules!.filter(getPostalCodeRuleByMinMax(rule)).length > 0) {
      closeModal();

      return;
    }

    const newCode = getRuleObject(rule, state?.inclusionType!) as unknown as NonNullable<
      ShippingMethodWithPostalCodesFragment["postalCodeRules"]
    >[number];

    dispatch({
      postalCodeRules: [...state.postalCodeRules!, newCode],
    });
    closeModal();
  };
  const onPostalCodeUnassign = (code: ShippingMethodPostalCodeRule) => {
    if (code.id !== undefined) {
      dispatch({
        codesToDelete: [...state.codesToDelete!, code.id],
        postalCodeRules: state.postalCodeRules!.filter(getByUnmatchingId(code.id)),
      });
    } else {
      dispatch({
        postalCodeRules: filterPostalCodes(state.postalCodeRules, code),
      });
    }
  };

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <WindowTitle title={intl.formatMessage(sectionNames.shipping)} />
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={option => isChannelSelected(option as ChannelShippingData)}
          channels={allChannels as Channel[]}
          onChange={option => channelsToggle(option as ChannelShippingData)}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage(
            rate?.name
              ? shippingMethodChannelsDialogMessages.titleWithMethod
              : shippingMethodChannelsDialogMessages.title,
            { methodName: rate?.name },
          )}
          description={
            zoneName ? (
              <FormattedMessage
                {...(rate?.name
                  ? shippingMethodChannelsDialogMessages.descriptionWithMethod
                  : shippingMethodChannelsDialogMessages.description)}
                values={{ zoneName, methodName: rate?.name }}
              />
            ) : undefined
          }
          selected={channelListElements.length}
          confirmButtonState="default"
          hasSelectionChanged={hasChannelSelectionChanged}
          onConfirm={handleChannelsConfirmWithFocus}
          toggleAll={(items, selected) =>
            toggleAllChannels(items as ChannelShippingData[], selected)
          }
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
        name={rate?.name!}
      />
      <UnassignDialog
        open={params.action === "unassign-product" && !!listElements.length}
        idsLength={listElements.length}
        confirmButtonState={unassignProductOpts.status}
        closeModal={closeModal}
        onConfirm={() => handleProductUnassign(listElements)}
      />
      <AssignProductDialog
        confirmButtonState={assignProductOpts.status}
        hasMore={productsSearchOpts.data?.search?.pageInfo.hasNextPage ?? false}
        labels={{
          confirmBtn: intl.formatMessage({
            id: "FzEew9",
            defaultMessage: "Assign and save",
            description: "assign products to shipping rate and save, button",
          }),
        }}
        loading={productsSearchOpts.loading}
        onClose={closeModal}
        onFetchMore={loadMore}
        onFilterChange={handleProductFilterChange}
        onSubmit={handleProductAssign}
        open={params.action === "assign-product"}
        productUnavailableText={intl.formatMessage({
          id: "jmZSK1",
          defaultMessage: "Product is not available in selected channels",
        })}
        products={
          mapEdgesToItems(productsSearchOpts?.data?.search)?.filter(
            suggestedProduct => suggestedProduct.id,
          ) ?? []
        }
        selectedChannels={currentChannels}
      />
      <ShippingZoneRatesPage
        formId={FORM_ID}
        allChannelsCount={allChannels?.length}
        shippingChannels={shippingChannelsWithFocusTarget as ChannelShippingData[]}
        savedChannelIds={savedChannelIds}
        savedShippingChannels={shippingChannels}
        hasPostalCodeChanges={hasPostalCodeChanges}
        loading={loading}
        disabled={
          loading ||
          updateShippingRateOpts?.status === "loading" ||
          updateShippingMethodChannelListingOpts?.status === "loading" ||
          unassignProductOpts?.status === "loading" ||
          assignProductOpts?.status === "loading"
        }
        saveButtonBarState={saveButtonBarState}
        onDelete={() => openModal("remove")}
        backHref={shippingZoneUrl(id)}
        shippingZoneName={zoneName}
        onSubmit={updateData}
        onShowMetadata={() => openModal("view-metadata")}
        rate={rate!}
        errors={updateShippingRateOpts.data?.shippingPriceUpdate?.errors || []}
        channelErrors={
          updateShippingMethodChannelListingOpts?.data?.shippingMethodChannelListingUpdate
            ?.errors || []
        }
        openChannelsModal={handleChannelsModalOpen}
        focusChannelId={focusChannelId}
        onChannelsChange={setCurrentChannels}
        onProductUnassign={handleProductUnassign}
        onProductAssign={() => openModal("assign-product")}
        variant={rate?.type!}
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
        postalCodeInclusionType={state.inclusionType}
        postalCodeRules={loading ? undefined : (state.postalCodeRules ?? [])}
        taxClasses={taxClasses ?? []}
        fetchMoreTaxClasses={fetchMoreTaxClasses}
      />
      <ShippingZonePostalCodeRangeDialog
        confirmButtonState={"default"}
        onClose={closeModal}
        onSubmit={code => onPostalCodeAssign(code)}
        open={params.action === "add-range"}
      />
      <ShippingMethodMetadataDialog
        open={params.action === "view-metadata" && !!rate}
        onClose={closeModal}
        shippingMethod={rate}
      />
    </PaginatorContext.Provider>
  );
};

export default RateUpdate;
