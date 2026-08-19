// @ts-strict-ignore
import {
  type ChannelVoucherData,
  createChannelsDataWithDiscountPrice,
  createSortedChannelsDataFromVoucher,
} from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import AssignCategoriesDialog from "@dashboard/components/AssignCategoryDialog";
import AssignCollectionDialog from "@dashboard/components/AssignCollectionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog";
import AssignVariantDialog from "@dashboard/components/AssignVariantDialog";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
  VOUCHER_CATALOGUE_PAGINATE_BY,
} from "@dashboard/config";
import DiscountCountrySelectDialog from "@dashboard/discounts/components/DiscountCountrySelectDialog";
import { getPreferredVoucherCatalogueTab } from "@dashboard/discounts/components/VoucherCatalogueSection/getPreferredVoucherCatalogueTab";
import { isVoucherCatalogueError } from "@dashboard/discounts/components/VoucherCatalogueSection/voucherCatalogueErrors";
import { VoucherCatalogueUnassignDialog } from "@dashboard/discounts/components/VoucherCatalogueUnassignDialog/VoucherCatalogueUnassignDialog";
import { isVoucherCodesError } from "@dashboard/discounts/components/VoucherCodesCard/voucherCodesErrors";
import { isVoucherCountriesError } from "@dashboard/discounts/components/VoucherCountriesErrors/voucherCountriesErrors";
import { VoucherDeleteDialog } from "@dashboard/discounts/components/VoucherDeleteDialog/VoucherDeleteDialog";
import VoucherDetailsPage, {
  VoucherDetailsPageTab,
  type VoucherDetailsPageVoucher,
  type VoucherTabItemsCount,
} from "@dashboard/discounts/components/VoucherDetailsPage";
import { VoucherMetadataDialog } from "@dashboard/discounts/components/VoucherMetadataDialog/VoucherMetadataDialog";
import { scrollToVoucherSection } from "@dashboard/discounts/components/VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { getVoucherSetupReadiness } from "@dashboard/discounts/components/VoucherSetupCard/getVoucherSetupReadiness";
import { useVoucherSetupCardDismiss } from "@dashboard/discounts/components/VoucherSetupCard/useVoucherSetupCardDismiss";
import { useVoucherSetupCardDisplayReady } from "@dashboard/discounts/components/VoucherSetupCard/useVoucherSetupCardDisplayReady";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import {
  voucherListUrl,
  voucherUrl,
  type VoucherUrlDialog,
  type VoucherUrlQueryParams,
} from "@dashboard/discounts/urls";
import { getAssignedVariantIds } from "@dashboard/discounts/utils";
import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type CategoryFilterInput,
  type CollectionFilterInput,
  DiscountValueTypeEnum,
  type ProductWhereInput,
  type SearchCategoriesWithTotalProductsQueryVariables,
  type SearchCollectionsWithTotalProductsQueryVariables,
  type SearchProductsQueryVariables,
  useVoucherCatalogueQuery,
  useVoucherCataloguesAddMutation,
  useVoucherCataloguesRemoveMutation,
  useVoucherChannelListingUpdateMutation,
  useVoucherCodeBulkDeleteMutation,
  useVoucherDeleteMutation,
  useVoucherDetailsQuery,
  useVoucherUpdateMutation,
  type VoucherCatalogueQueryVariables,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useChannels from "@dashboard/hooks/useChannels";
import useLocalPaginator, {
  useSectionLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import useShop from "@dashboard/hooks/useShop";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { useCategoryWithTotalProductsSearch } from "@dashboard/searches/useCategorySearch";
import { useCollectionWithTotalProductsSearch } from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button } from "@saleor/macaw-ui-next";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { createUpdateHandler } from "./handlers";
import { useVoucherAssignedIds } from "./hooks/useVoucherAssignedIds";
import { useVoucherCodes } from "./hooks/useVoucherCodes";
import { VOUCHER_UPDATE_FORM_ID } from "./types";
import { useVoucherCatalogueDraft } from "./useVoucherCatalogueDraft";
import {
  adjustCatalogueCount,
  applyCatalogueBucketToConnection,
  hasVoucherCatalogueDraftChanges,
  hasVoucherCountriesDraftChanges,
  isIdAssignedWithDraft,
} from "./voucherCatalogueDraft";

interface VoucherDetailsProps {
  id: string;
  params: VoucherUrlQueryParams;
}

const VoucherDetails = ({ id, params }: VoucherDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);
  const intl = useIntl();
  const {
    draft: catalogueDraft,
    resetDraft: resetCatalogueDraft,
    assignItems: assignCatalogueItems,
    unassignIds: unassignCatalogueIds,
    setCountryCodes,
    unassignCountryCode,
  } = useVoucherCatalogueDraft();
  // Products already on the voucher are dropped client-side, so a page of 20 can arrive empty
  // on a large catalog. Ask for more per request so the picker stays useful without leaning on
  // backfill for every page.
  const assignProductSearchVariables: SearchProductsQueryVariables = {
    ...DEFAULT_INITIAL_SEARCH_DATA,
    first: 100,
    includeVariants: false,
  };
  const assignVariantSearchVariables: SearchProductsQueryVariables = {
    ...DEFAULT_INITIAL_SEARCH_DATA,
    includeVariants: true,
  };
  const categorySearchInitialVariables: SearchCategoriesWithTotalProductsQueryVariables = {
    after: DEFAULT_INITIAL_SEARCH_DATA.after,
    first: DEFAULT_INITIAL_SEARCH_DATA.first,
  };
  const collectionSearchInitialVariables: SearchCollectionsWithTotalProductsQueryVariables = {
    after: DEFAULT_INITIAL_SEARCH_DATA.after,
    first: DEFAULT_INITIAL_SEARCH_DATA.first,
  };
  const [productSearchVariables, setProductSearchVariables] =
    useState<SearchProductsQueryVariables>(assignProductSearchVariables);
  const [variantSearchVariables, setVariantSearchVariables] =
    useState<SearchProductsQueryVariables>(assignVariantSearchVariables);
  const [categorySearchVariables, setCategorySearchVariables] =
    useState<SearchCategoriesWithTotalProductsQueryVariables>(categorySearchInitialVariables);
  const [collectionSearchVariables, setCollectionSearchVariables] =
    useState<SearchCollectionsWithTotalProductsQueryVariables>(collectionSearchInitialVariables);
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategoryWithTotalProductsSearch({
    variables: categorySearchVariables,
  });
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionWithTotalProductsSearch({
    variables: collectionSearchVariables,
  });
  const { loadMore: loadMoreProducts, result: searchProductsOpts } = useProductSearch({
    variables: productSearchVariables,
  });
  const { loadMore: loadMoreVariants, result: searchVariantsOpts } = useProductSearch({
    variables: variantSearchVariables,
  });

  // Bumped on every new search so the pickers' backfill budget starts over.
  const [searchGeneration, setSearchGeneration] = useState(0);
  const startNewSearch = () => setSearchGeneration(generation => generation + 1);

  const handleProductFilterChange = (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => {
    startNewSearch();
    setProductSearchVariables({
      ...assignProductSearchVariables,
      where: filterVariables,
      channel,
      query,
    });
  };

  const handleVariantFilterChange = (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => {
    startNewSearch();
    setVariantSearchVariables({
      ...assignVariantSearchVariables,
      where: filterVariables,
      channel,
      query,
    });
  };

  const handleCategoryFilterChange = (filterVariables: CategoryFilterInput, query: string) => {
    startNewSearch();
    setCategorySearchVariables({
      ...categorySearchInitialVariables,
      filter: {
        ...filterVariables,
        search: query,
      },
    });
  };

  const handleCollectionFilterChange = (
    filterVariables: CollectionFilterInput,
    channel: string | undefined,
    query: string,
  ) => {
    startNewSearch();
    setCollectionSearchVariables({
      ...collectionSearchInitialVariables,
      filter: {
        ...filterVariables,
        search: query,
      },
      channel,
    });
  };

  // null = follow server preference (first non-empty Eligible products group).
  const [userCatalogueTab, setUserCatalogueTab] = useState<VoucherDetailsPageTab | null>(null);
  const [catalogueTabVoucherId, setCatalogueTabVoucherId] = useState(id);

  if (catalogueTabVoucherId !== id) {
    setCatalogueTabVoucherId(id);
    setUserCatalogueTab(null);
  }

  const [catalogueNumberOfRows, setCatalogueNumberOfRows] = useState(VOUCHER_CATALOGUE_PAGINATE_BY);
  const { data, loading, refetch, updateQuery } = useVoucherDetailsQuery({
    displayLoader: true,
    variables: { id },
  });
  const preferredCatalogueTab = useMemo(() => {
    const voucher = data?.voucher;

    if (!voucher || voucher.id !== id) {
      return VoucherDetailsPageTab.categories;
    }

    return getPreferredVoucherCatalogueTab({
      categories: voucher.categoriesCount?.totalCount ?? 0,
      collections: voucher.collectionsCount?.totalCount ?? 0,
      products: voucher.productsCount?.totalCount ?? 0,
      variants: voucher.variantsCount?.totalCount ?? 0,
    });
  }, [data?.voucher, id]);
  const activeTab = userCatalogueTab ?? preferredCatalogueTab;
  const [paginationState, setPaginationState] = useSectionLocalPaginationState(
    catalogueNumberOfRows,
    activeTab,
  );
  const handleCatalogueListSettingsUpdate = (key: "rowNumber", value: number) => {
    if (key === "rowNumber") {
      setCatalogueNumberOfRows(value);
    }
  };
  const paginate = useLocalPaginator(setPaginationState);
  const changeTab = (tab: VoucherDetailsPageTab) => {
    reset();
    setUserCatalogueTab(tab);
  };
  const catalogueQueryInclude: Pick<
    VoucherCatalogueQueryVariables,
    "includeCategories" | "includeCollections" | "includeProducts" | "includeVariants"
  > = {
    includeCategories: activeTab === VoucherDetailsPageTab.categories,
    includeCollections: activeTab === VoucherDetailsPageTab.collections,
    includeProducts: activeTab === VoucherDetailsPageTab.products,
    includeVariants: activeTab === VoucherDetailsPageTab.variants,
  };
  const { data: catalogueData, refetch: refetchCatalogue } = useVoucherCatalogueQuery({
    displayLoader: false,
    skip: !data?.voucher,
    variables: {
      id,
      ...paginationState,
      ...catalogueQueryInclude,
    },
  });

  useRegisterEntityRefresh(refetch);

  const isAssignPickerOpen =
    params.action === "assign-product" ||
    params.action === "assign-category" ||
    params.action === "assign-collection";
  const {
    isProductAssigned: isProductAssignedOnServer,
    isCategoryAssigned: isCategoryAssignedOnServer,
    isCollectionAssigned: isCollectionAssignedOnServer,
  } = useVoucherAssignedIds({
    id,
    skip: !isAssignPickerOpen,
  });
  const isProductAssigned = useCallback(
    (item: { id: string }) =>
      isIdAssignedWithDraft(item.id, isProductAssignedOnServer(item), catalogueDraft.products),
    [catalogueDraft.products, isProductAssignedOnServer],
  );
  const isCategoryAssigned = useCallback(
    (item: { id: string }) =>
      isIdAssignedWithDraft(item.id, isCategoryAssignedOnServer(item), catalogueDraft.categories),
    [catalogueDraft.categories, isCategoryAssignedOnServer],
  );
  const isCollectionAssigned = useCallback(
    (item: { id: string }) =>
      isIdAssignedWithDraft(
        item.id,
        isCollectionAssignedOnServer(item),
        catalogueDraft.collections,
      ),
    [catalogueDraft.collections, isCollectionAssignedOnServer],
  );

  const {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesDeleteTransitionState,
    voucherCodesPagination,
    voucherCodesSettings,
    selectedVoucherCodesIds,
    addedVoucherCodes,
    pendingRemovedCodeIds,
    voucherCodesRefetch,
    setSelectedVoucherCodesIds,
    updateVoucherCodesListSettings,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteVoucherCodes,
    handleClearStagedVoucherCodes,
  } = useVoucherCodes({ id });
  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherUrlDialog,
    VoucherUrlQueryParams
  >(navigate, params => voucherUrl(id, params), params);
  const { channel, availableChannels } = useAppChannel(false);
  const allChannels: ChannelVoucherData[] = createChannelsDataWithDiscountPrice(
    data?.voucher,
    availableChannels,
  );
  // Per-channel drafts: `percentageDiscountValue` vs `discountValue` (seeded by active type).
  const voucherChannelsChoices: ChannelVoucherData[] = useMemo(
    () => createSortedChannelsDataFromVoucher(data?.voucher) ?? [],
    [data?.voucher],
  );
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
  } = useChannels(
    voucherChannelsChoices,
    params?.action,
    {
      closeModal,
      openModal,
    },
    { formId: VOUCHER_UPDATE_FORM_ID, deferDirtyOnConfirm: true },
  );
  const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdateMutation({
    // Field errors are mapped inline; VoucherDetails owns the single save-failure toast.
    disableErrorHandling: true,
  });
  const notifySaved = () =>
    notify({
      status: "success",
      title: intl.formatMessage(voucherFeedbackMessages.voucherUpdated),
    });
  const notifySaveFailed = (saveErrors: Array<{ field?: string | null }> = []) => {
    const hasCodesError = saveErrors.some(isVoucherCodesError);
    const hasCatalogueError = saveErrors.some(isVoucherCatalogueError);
    const hasCountriesError = saveErrors.some(isVoucherCountriesError);

    // Prefer the section that owns recovery; codes first (highest-friction identity).
    if (hasCodesError) {
      scrollToVoucherSection(voucherSectionIds.codes);
    } else if (hasCatalogueError) {
      scrollToVoucherSection(voucherSectionIds.catalogue);
    } else if (hasCountriesError) {
      scrollToVoucherSection(voucherSectionIds.countries);
    }

    const recoveryMessage = hasCodesError
      ? voucherFeedbackMessages.fixCodesAndTryAgain
      : hasCatalogueError
        ? voucherFeedbackMessages.fixCatalogueAndTryAgain
        : hasCountriesError
          ? voucherFeedbackMessages.fixCountriesAndTryAgain
          : voucherFeedbackMessages.checkHighlightedFields;

    notify({
      status: "error",
      title: intl.formatMessage(voucherFeedbackMessages.couldNotSaveVoucher),
      text: intl.formatMessage(recoveryMessage),
      // Inline/section errors own the recovery; toast is a short ack.
      autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
    });
  };
  const [voucherUpdate, voucherUpdateOpts] = useVoucherUpdateMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      // Only patch the voucher cache here. Success toast / clearing draft codes must wait
      // until channel + catalogue mutations in createUpdateHandler also succeed.
      if (data.voucherUpdate.errors.length === 0 && data.voucherUpdate.voucher) {
        updateQuery(prev => ({
          ...prev,
          voucher: {
            ...prev.voucher,
            ...data.voucherUpdate.voucher,
          },
        }));
      }
    },
  });
  const [voucherDelete, voucherDeleteOpts] = useVoucherDeleteMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if (data.voucherDelete.errors.length === 0) {
        notify({
          status: "success",
          title: intl.formatMessage(voucherFeedbackMessages.voucherDeleted),
        });
        navigate(voucherListUrl(), { replace: true });

        return;
      }

      notify({
        status: "error",
        title: intl.formatMessage(voucherFeedbackMessages.couldNotDeleteVoucher),
      });
    },
  });
  const [voucherCataloguesRemove, voucherCataloguesRemoveOpts] = useVoucherCataloguesRemoveMutation(
    { disableErrorHandling: true },
  );
  const [voucherCataloguesAdd, voucherCataloguesAddOpts] = useVoucherCataloguesAddMutation({
    disableErrorHandling: true,
  });
  const [voucherCodeBulkDelete] = useVoucherCodeBulkDeleteMutation({
    disableErrorHandling: true,
  });
  const selectedUnassignIds = params.ids ?? [];
  const selectedUnassignIdsCount = selectedUnassignIds.length;
  const canOpenBulkActionDialog = selectedUnassignIdsCount > 0;
  const catalogueQueryVariables = {
    ...paginationState,
    ...catalogueQueryInclude,
  };
  const updateHandler = createUpdateHandler(
    data?.voucher,
    voucherChannelsChoices,
    variables => voucherUpdate({ variables }),
    updateChannels,
    {
      cataloguesAdd: voucherCataloguesAdd,
      cataloguesRemove: voucherCataloguesRemove,
      voucherCodesDelete: voucherCodeBulkDelete,
      getCatalogueDraft: () => catalogueDraft,
      getPendingRemovedCodeIds: () => pendingRemovedCodeIds,
      catalogueQueryVariables,
    },
  );
  const handleSubmit = async formData => {
    const errors = await updateHandler(formData);

    if (!errors?.length) {
      notifySaved();
      handleClearStagedVoucherCodes();
      voucherCodesRefetch();
      resetCatalogueDraft();
      reset();
      refetch();
      refetchCatalogue();
    } else {
      notifySaveFailed(errors);
    }

    return errors;
  };
  const catalogueVoucher = catalogueData?.voucher;
  const voucher = data?.voucher;
  const voucherForPage: VoucherDetailsPageVoucher | undefined | null = useMemo(() => {
    if (!voucher) {
      return voucher;
    }

    const shopCountries = shop?.countries ?? [];
    const countriesByCode = new Map(
      [...shopCountries, ...(voucher.countries ?? [])].map(country => [country.code, country]),
    );
    const countries =
      catalogueDraft.countryCodes === null
        ? voucher.countries
        : catalogueDraft.countryCodes
            .map(code => countriesByCode.get(code))
            .filter((country): country is NonNullable<typeof country> => !!country);

    const pageVoucher: VoucherDetailsPageVoucher = {
      ...voucher,
      countries,
      products: applyCatalogueBucketToConnection(
        catalogueVoucher?.products,
        catalogueDraft.products,
      ) as VoucherDetailsPageVoucher["products"],
      collections: applyCatalogueBucketToConnection(
        catalogueVoucher?.collections,
        catalogueDraft.collections,
      ) as VoucherDetailsPageVoucher["collections"],
      categories: applyCatalogueBucketToConnection(
        catalogueVoucher?.categories,
        catalogueDraft.categories,
      ) as VoucherDetailsPageVoucher["categories"],
      variants: applyCatalogueBucketToConnection(
        catalogueVoucher?.variants,
        catalogueDraft.variants,
      ) as VoucherDetailsPageVoucher["variants"],
    };

    return pageVoucher;
  }, [catalogueDraft, catalogueVoucher, shop?.countries, voucher]);
  const tabPageInfo =
    activeTab === VoucherDetailsPageTab.categories
      ? maybe(() => catalogueVoucher?.categories?.pageInfo)
      : activeTab === VoucherDetailsPageTab.collections
        ? maybe(() => catalogueVoucher?.collections?.pageInfo)
        : activeTab === VoucherDetailsPageTab.variants
          ? maybe(() => catalogueVoucher?.variants?.pageInfo)
          : maybe(() => catalogueVoucher?.products?.pageInfo);
  const unassignCatalogueType =
    params.action === "unassign-category"
      ? "category"
      : params.action === "unassign-collection"
        ? "collection"
        : params.action === "unassign-product"
          ? "product"
          : params.action === "unassign-variant"
            ? "variant"
            : null;
  const handleUnassignConfirm = () => {
    switch (unassignCatalogueType) {
      case "category":
        unassignCatalogueIds("categories", selectedUnassignIds);
        break;
      case "collection":
        unassignCatalogueIds("collections", selectedUnassignIds);
        break;
      case "product":
        unassignCatalogueIds("products", selectedUnassignIds);
        break;
      case "variant":
        unassignCatalogueIds("variants", selectedUnassignIds);
        break;
    }

    closeModal();
    reset();
  };
  const { pageInfo, ...paginationValues } = paginate(tabPageInfo, paginationState);
  const tabItemsCount: VoucherTabItemsCount = {
    categories: adjustCatalogueCount(
      data?.voucher?.categoriesCount?.totalCount,
      catalogueDraft.categories,
    ),
    collections: adjustCatalogueCount(
      data?.voucher?.collectionsCount?.totalCount,
      catalogueDraft.collections,
    ),
    products: adjustCatalogueCount(
      data?.voucher?.productsCount?.totalCount,
      catalogueDraft.products,
    ),
    variants: adjustCatalogueCount(
      data?.voucher?.variantsCount?.totalCount,
      catalogueDraft.variants,
    ),
  };
  const hasCatalogueDraftChanges = hasVoucherCatalogueDraftChanges(catalogueDraft);
  const hasCountriesDraftChanges = hasVoucherCountriesDraftChanges(catalogueDraft);
  const stagedVariantIds = useMemo(() => {
    const serverIds = getAssignedVariantIds(catalogueVoucher?.variants);
    const withoutRemoved = serverIds.filter(
      id => !catalogueDraft.variants.idsToRemove.includes(id),
    );

    return [...catalogueDraft.variants.idsToAdd, ...withoutRemoved];
  }, [catalogueDraft.variants, catalogueVoucher?.variants]);
  const setupEmphasized = params.action === "setup";
  const {
    isDismissed: setupCardDismissed,
    dismiss: dismissSetupCard,
    undismiss: undismissSetupCard,
  } = useVoucherSetupCardDismiss(id);
  const setupDiscountType =
    data?.voucher?.type === VoucherTypeEnum.SHIPPING
      ? DiscountTypeEnum.SHIPPING
      : data?.voucher?.discountValueType === DiscountValueTypeEnum.PERCENTAGE
        ? DiscountTypeEnum.VALUE_PERCENTAGE
        : DiscountTypeEnum.VALUE_FIXED;
  // Menu reopen uses *saved* readiness from channel listings on the voucher payload.
  const setupReadinessForMenu = getVoucherSetupReadiness({
    voucher: voucherForPage,
    formData: {
      discountType: setupDiscountType,
      type: data?.voucher?.type ?? VoucherTypeEnum.ENTIRE_ORDER,
      percentageDiscountValue: "",
      channelListings: createSortedChannelsDataFromVoucher(data?.voucher) ?? [],
      codes: [],
    },
    voucherCodes,
    tabItemsCount,
    countriesCount: voucherForPage?.countries?.length ?? 0,
  });
  const setupCardDisplayReady = useVoucherSetupCardDisplayReady({
    voucherId: data?.voucher?.id,
    serverChannelCount: data?.voucher?.channelListings?.length ?? 0,
    channelListingsCount: currentChannels.length,
    savedCodesCount: data?.voucher?.codesCount?.totalCount ?? 0,
    voucherCodesLoading,
  });
  // Menu reopen uses saved readiness; the card itself also reacts to unsaved form edits.
  const setupCardVisibleFromSavedState =
    !!data?.voucher &&
    setupCardDisplayReady &&
    (setupEmphasized || (!setupCardDismissed && !setupReadinessForMenu.coreReady));

  return (
    <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
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
          hasSelectionChanged={hasChannelSelectionChanged}
          onConfirm={handleChannelsConfirm}
          confirmButtonState="default"
          toggleAll={toggleAllChannels}
        />
      )}
      <VoucherDetailsPage
        voucher={voucherForPage}
        voucherCodes={voucherCodes}
        addedVoucherCodes={addedVoucherCodes}
        pendingRemovedCodeIds={pendingRemovedCodeIds}
        voucherCodesPagination={voucherCodesPagination}
        voucherCodesLoading={voucherCodesLoading}
        voucherCodesSettings={voucherCodesSettings}
        deleteVoucherCodesTransitionState={voucherCodesDeleteTransitionState}
        onDeleteVoucherCodes={handleDeleteVoucherCodes}
        onMultipleVoucherCodesGenerate={handleGenerateMultipleCodes}
        onCustomVoucherCodeGenerate={handleAddVoucherCode}
        onVoucherCodesSettingsChange={updateVoucherCodesListSettings}
        onSelectedCodesChange={setSelectedVoucherCodesIds}
        selectedVoucherCodesIds={selectedVoucherCodesIds}
        allChannelsCount={allChannels?.length}
        channelListings={currentChannels}
        savedChannelListings={voucherChannelsChoices}
        disabled={
          (loading && !data?.voucher) ||
          voucherCataloguesRemoveOpts.loading ||
          voucherCataloguesAddOpts.loading ||
          updateChannelsOpts.loading
        }
        errors={[
          ...(voucherUpdateOpts.data?.voucherUpdate.errors || []),
          ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors || []),
          ...(voucherCataloguesAddOpts.data?.voucherCataloguesAdd.errors || []),
          ...(voucherCataloguesRemoveOpts.data?.voucherCataloguesRemove.errors || []),
        ]}
        selectedChannelId={channel?.id}
        onCategoryAssign={() => openModal("assign-category")}
        onCollectionAssign={() => openModal("assign-collection")}
        onCollectionUnassign={collectionId =>
          openModal("unassign-collection", {
            ids: [collectionId],
          })
        }
        onCountryAssign={() => openModal("assign-country")}
        onCountryUnassign={countryCode =>
          unassignCountryCode(
            countryCode,
            data?.voucher?.countries?.map(country => country.code) ?? [],
          )
        }
        onCategoryUnassign={categoryId =>
          openModal("unassign-category", {
            ids: [categoryId],
          })
        }
        onProductAssign={() => openModal("assign-product")}
        onProductUnassign={productId =>
          openModal("unassign-product", {
            ids: [productId],
          })
        }
        onVariantAssign={() => openModal("assign-variant")}
        onVariantUnassign={variantId =>
          openModal("unassign-variant", {
            ids: [variantId],
          })
        }
        activeTab={activeTab}
        tabItemsCount={tabItemsCount}
        catalogueNumberOfRows={catalogueNumberOfRows}
        onCatalogueListSettingsUpdate={handleCatalogueListSettingsUpdate}
        onTabClick={changeTab}
        onSubmit={handleSubmit}
        hasCatalogueDraftChanges={hasCatalogueDraftChanges}
        hasCountriesDraftChanges={hasCountriesDraftChanges}
        onShowMetadata={() => openModal("view-metadata")}
        onShowSetupChecklist={
          data?.voucher && !setupCardVisibleFromSavedState
            ? () => {
                undismissSetupCard();
                openModal("setup");
              }
            : undefined
        }
        setupEmphasized={setupEmphasized}
        setupCardDismissed={setupCardDismissed}
        setupCardDisplayReady={setupCardDisplayReady}
        onDismissSetupCard={() => {
          dismissSetupCard();

          if (setupEmphasized) {
            closeModal();
          }
        }}
        onRemove={() => openModal("remove")}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        saveButtonBarState={
          voucherUpdateOpts.loading ||
          updateChannelsOpts.loading ||
          voucherCataloguesAddOpts.loading ||
          voucherCataloguesRemoveOpts.loading
            ? "loading"
            : voucherUpdateOpts.status
        }
        categoryListToolbar={
          <Button
            variant="secondary"
            onClick={() =>
              openModal("unassign-category", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        collectionListToolbar={
          <Button
            variant="secondary"
            onClick={() =>
              openModal("unassign-collection", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        productListToolbar={
          <Button
            variant="secondary"
            onClick={() =>
              openModal("unassign-product", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        variantListToolbar={
          <Button
            variant="secondary"
            onClick={() =>
              openModal("unassign-variant", {
                ids: listElements,
              })
            }
          >
            <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
          </Button>
        }
        isChecked={isSelected}
        selected={listElements.length}
        toggle={toggle}
        toggleAll={toggleAll}
      />
      <AssignCategoriesDialog
        categories={mapEdgesToItems(searchCategoriesOpts?.data?.search)}
        excludeContainer={isCategoryAssigned}
        backfillResetKey={String(searchGeneration)}
        confirmButtonState="default"
        hasMore={searchCategoriesOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-category"}
        onFetch={searchCategories}
        onFilterChange={handleCategoryFilterChange}
        onFetchMore={loadMoreCategories}
        loading={searchCategoriesOpts.loading}
        onClose={closeModal}
        onSubmit={categories => {
          assignCatalogueItems("categories", categories);
          closeModal();
        }}
        labels={{
          confirmBtn: intl.formatMessage(buttonMessages.assign),
        }}
      />
      <AssignCollectionDialog
        collections={mapEdgesToItems(searchCollectionsOpts?.data?.search)}
        excludeContainer={isCollectionAssigned}
        backfillResetKey={String(searchGeneration)}
        confirmButtonState="default"
        hasMore={searchCollectionsOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-collection"}
        onFetch={searchCollections}
        onFetchMore={loadMoreCollections}
        onFilterChange={handleCollectionFilterChange}
        loading={searchCollectionsOpts.loading}
        onClose={closeModal}
        onSubmit={collections => {
          assignCatalogueItems("collections", collections);
          closeModal();
        }}
        labels={{
          confirmBtn: intl.formatMessage(buttonMessages.assign),
        }}
      />
      <DiscountCountrySelectDialog
        confirmButtonState="default"
        countries={maybe(() => shop.countries, [])}
        onClose={() => navigate(voucherUrl(id))}
        onConfirm={async formData => {
          setCountryCodes(formData.countries);
          closeModal();

          return [];
        }}
        open={params.action === "assign-country"}
        initial={
          catalogueDraft.countryCodes ??
          maybe(() => data.voucher.countries.map(country => country.code), [])
        }
        labels={{
          confirmBtn: intl.formatMessage(buttonMessages.assign),
        }}
      />
      <AssignVariantDialog
        confirmButtonState="default"
        hasMore={searchVariantsOpts.data?.search.pageInfo.hasNextPage}
        open={params.action === "assign-variant"}
        onFilterChange={handleVariantFilterChange}
        onFetchMore={loadMoreVariants}
        loading={searchVariantsOpts.loading}
        onClose={closeModal}
        onSubmit={variants => {
          assignCatalogueItems("variants", variants);
          closeModal();
        }}
        products={mapEdgesToItems(searchVariantsOpts?.data?.search)}
        selectedIds={stagedVariantIds}
        labels={{
          confirmBtn: intl.formatMessage(buttonMessages.assign),
        }}
      />
      <AssignProductDialog
        selectedChannels={currentChannels}
        productUnavailableText={intl.formatMessage({
          id: "XOkUxQ",
          defaultMessage: "Product unavailable in voucher channels",
        })}
        confirmButtonState="default"
        hasMore={searchProductsOpts.data?.search.pageInfo.hasNextPage ?? false}
        open={params.action === "assign-product"}
        onFetchMore={loadMoreProducts}
        loading={searchProductsOpts.loading}
        onClose={closeModal}
        onSubmit={products => {
          assignCatalogueItems("products", products);
          closeModal();
        }}
        products={mapEdgesToItems(searchProductsOpts?.data?.search) ?? []}
        excludeProduct={isProductAssigned}
        backfillResetKey={String(searchGeneration)}
        selectAllMode="when-scoped"
        onFilterChange={handleProductFilterChange}
        labels={{
          confirmBtn: intl.formatMessage(buttonMessages.assign),
        }}
      />
      {unassignCatalogueType !== null && (
        <VoucherCatalogueUnassignDialog
          catalogueType={unassignCatalogueType}
          confirmButtonState="default"
          count={selectedUnassignIdsCount}
          onClose={closeModal}
          onConfirm={handleUnassignConfirm}
          open={canOpenBulkActionDialog}
        />
      )}
      <VoucherMetadataDialog
        open={params.action === "view-metadata" && !!data?.voucher}
        onClose={closeModal}
        voucher={data?.voucher}
      />
      <VoucherDeleteDialog
        confirmButtonState={voucherDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() =>
          voucherDelete({
            variables: { id },
          })
        }
        open={params.action === "remove"}
        voucherCode={<strong>{maybe(() => data.voucher.name, "...")}</strong>}
      />
    </PaginatorContext.Provider>
  );
};

export default VoucherDetails;
