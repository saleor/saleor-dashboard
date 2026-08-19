// @ts-strict-ignore
import { type ChannelVoucherData, createSortedVoucherData } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
} from "@dashboard/config";
import { isVoucherCatalogueError } from "@dashboard/discounts/components/VoucherCatalogueSection/voucherCatalogueErrors";
import { isVoucherCodesError } from "@dashboard/discounts/components/VoucherCodesCard/voucherCodesErrors";
import { isVoucherCountriesError } from "@dashboard/discounts/components/VoucherCountriesErrors/voucherCountriesErrors";
import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { scrollToVoucherSection } from "@dashboard/discounts/components/VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import {
  type CategoryFilterInput,
  type CollectionFilterInput,
  type ProductWhereInput,
  type SearchCategoriesWithTotalProductsQueryVariables,
  type SearchCollectionsWithTotalProductsQueryVariables,
  type SearchProductsQueryVariables,
  useVoucherChannelListingUpdateMutation,
  useVoucherCreateMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { sectionNames } from "@dashboard/intl";
import { useCategoryWithTotalProductsSearch } from "@dashboard/searches/useCategorySearch";
import { useCollectionWithTotalProductsSearch } from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useState } from "react";
import { useIntl } from "react-intl";

import VoucherCreatePage from "../../components/VoucherCreatePage";
import {
  voucherAddUrl,
  type VoucherCreateUrlQueryParams,
  voucherUrl,
  type VoucherUrlDialog,
} from "../../urls";
import { createHandler } from "./handlers";
import { VOUCHER_CREATE_FORM_ID } from "./types";

interface VoucherCreateProps {
  params: VoucherCreateUrlQueryParams;
}

const VoucherCreateView = ({ params }: VoucherCreateProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherUrlDialog,
    VoucherCreateUrlQueryParams
  >(navigate, params => voucherAddUrl(params), params);
  const { availableChannels } = useAppChannel(false);
  const allChannels: ChannelVoucherData[] = createSortedVoucherData(availableChannels);
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(params.ids);

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
    // Create starts with no channel listings — users assign via Manage.
    // `allChannels` is only for the picker dialog, not the initial selection.
    [],
    params?.action,
    { closeModal, openModal },
    { formId: VOUCHER_CREATE_FORM_ID },
  );
  const [updateChannels, updateChannelsOpts] = useVoucherChannelListingUpdateMutation({
    disableErrorHandling: true,
  });
  const [voucherCreate, voucherCreateOpts] = useVoucherCreateMutation({
    disableErrorHandling: true,
  });

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
  const categoriesSearch = useCategoryWithTotalProductsSearch({
    variables: categorySearchVariables,
  });
  const collectionsSearch = useCollectionWithTotalProductsSearch({
    variables: collectionSearchVariables,
  });
  // Products already on the voucher are dropped client-side, so a page of 20 can arrive empty
  // on a large catalog. Ask for more per request so the picker stays useful without leaning on
  // backfill for every page.
  const productsSearch = useProductSearch({
    variables: productSearchVariables,
  });
  const variantsSearch = useProductSearch({
    variables: variantSearchVariables,
  });

  const handleProductFilterChange = (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => {
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
    setVariantSearchVariables({
      ...assignVariantSearchVariables,
      where: filterVariables,
      channel,
      query,
    });
  };

  const handleCategoryFilterChange = (filterVariables: CategoryFilterInput, query: string) => {
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
    setCollectionSearchVariables({
      ...collectionSearchInitialVariables,
      filter: {
        ...filterVariables,
        search: query,
      },
      channel,
    });
  };

  const handleFormValidate = (data: VoucherDetailsPageFormData) => {
    if (data.codes.length === 0) {
      scrollToVoucherSection(voucherSectionIds.codes);
      notify({
        status: "error",
        title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
        text: intl.formatMessage(voucherFeedbackMessages.addAtLeastOneCode),
        autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
      });

      return false;
    }

    if (data.channelListings.length === 0) {
      handleChannelsModalOpen();
      notify({
        status: "error",
        title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
        text: intl.formatMessage(voucherFeedbackMessages.assignAtLeastOneChannel),
        autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
      });

      return false;
    }

    return true;
  };
  const createVoucher = createHandler(
    variables => voucherCreate({ variables }),
    updateChannels,
    handleFormValidate,
  );
  const handleSubmit = async (data: FormData) => {
    const result = await createVoucher(data);

    if (result && "validationFailed" in result && result.validationFailed) {
      // Toast + scroll/modal already handled in handleFormValidate.
      // Return a non-empty error list so the form does not treat submit as success.
      return ["Invalid data"];
    }

    if (result && "id" in result && result.id) {
      notify({
        status: "success",
        title: intl.formatMessage(voucherFeedbackMessages.voucherCreated),
      });
      navigate(voucherUrl(result.id), { replace: true });

      return [];
    }

    if (result && "errors" in result) {
      const saveErrors = result.errors;
      const hasCodesError = saveErrors.some(isVoucherCodesError);
      const hasCatalogueError = saveErrors.some(isVoucherCatalogueError);
      const hasCountriesError = saveErrors.some(isVoucherCountriesError);

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
        title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
        text: intl.formatMessage(recoveryMessage),
        autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
      });

      return result.errors;
    }

    notify({
      status: "error",
      title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
      text: intl.formatMessage(voucherFeedbackMessages.checkHighlightedFields),
      autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
    });

    return ["Could not create voucher"];
  };

  return (
    <>
      {!!allChannels?.length && (
        <ChannelsAvailabilityDialog
          isSelected={isChannelSelected}
          channels={allChannels}
          onChange={channelsToggle}
          onClose={handleChannelsModalClose}
          open={isChannelsModalOpen}
          title={intl.formatMessage({
            id: "Eau5AV",
            defaultMessage: "Manage Products Channel Availability",
          })}
          confirmButtonState="default"
          selected={channelListElements.length}
          hasSelectionChanged={hasChannelSelectionChanged}
          onConfirm={handleChannelsConfirm}
          toggleAll={toggleAllChannels}
        />
      )}
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
      <VoucherCreatePage
        action={params.action}
        countries={shop?.countries ?? []}
        categoriesSearch={categoriesSearch}
        collectionsSearch={collectionsSearch}
        productsSearch={productsSearch}
        variantsSearch={variantsSearch}
        onProductFilterChange={handleProductFilterChange}
        onVariantFilterChange={handleVariantFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onCollectionFilterChange={handleCollectionFilterChange}
        openModal={openModal}
        closeModal={closeModal}
        allChannelsCount={allChannels?.length}
        channelListings={currentChannels}
        disabled={voucherCreateOpts.loading || updateChannelsOpts.loading}
        errors={[
          ...(voucherCreateOpts.data?.voucherCreate.errors || []),
          ...(updateChannelsOpts.data?.voucherChannelListingUpdate.errors || []),
        ]}
        onSubmit={handleSubmit}
        saveButtonBarState={voucherCreateOpts.status}
        openChannelsModal={handleChannelsModalOpen}
        onChannelsChange={setCurrentChannels}
        isChecked={isSelected}
        selected={listElements}
        toggle={toggle}
        toggleAll={toggleAll}
        resetSelected={reset}
      />
    </>
  );
};

export default VoucherCreateView;
