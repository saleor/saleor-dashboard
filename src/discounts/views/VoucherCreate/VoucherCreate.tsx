// @ts-strict-ignore
import { type ChannelVoucherData, createSortedVoucherData } from "@dashboard/channels/utils";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import ChannelsAvailabilityDialog from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilityDialog";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { PAIRED_ERROR_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { scrollToVoucherSection } from "@dashboard/discounts/components/VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import { voucherFeedbackMessages } from "@dashboard/discounts/voucherFeedbackMessages";
import {
  getFirstVoucherSectionWithError,
  getVoucherLocalErrors,
} from "@dashboard/discounts/voucherLocalErrors";
import { getVoucherSaveFailureFeedback } from "@dashboard/discounts/voucherSaveFailureFeedback";
import {
  type CategoryFilterInput,
  type CollectionFilterInput,
  type ProductWhereInput,
  useVoucherChannelListingUpdateMutation,
  useVoucherCreateMutation,
  useVoucherDeleteMutation,
} from "@dashboard/graphql";
import useBulkActions from "@dashboard/hooks/useBulkActions";
import useChannels from "@dashboard/hooks/useChannels";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { sectionNames } from "@dashboard/intl";
import { useCategoryWithTotalProductsSearch } from "@dashboard/searches/useCategorySearch";
import { useCollectionWithTotalProductsSearch } from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useState } from "react";
import { useIntl } from "react-intl";

import VoucherCreatePage from "../../components/VoucherCreatePage/VoucherCreatePage";
import {
  voucherAddUrl,
  type VoucherCreateUrlQueryParams,
  voucherUrl,
  type VoucherUrlDialog,
} from "../../urls";
import {
  categoryPickerSearch,
  collectionPickerSearch,
  productPickerSearch,
  useVoucherPickerSearches,
  variantPickerSearch,
} from "../voucherPickerSearches";
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
  // Empty required fields only count as errors after a create attempt.
  const [showRequiredValueErrors, setShowRequiredValueErrors] = useState(false);
  // Removes a voucher whose channel values were rejected right after it was created.
  const [voucherDelete, voucherDeleteOpts] = useVoucherDeleteMutation({
    disableErrorHandling: true,
  });
  const isSaving =
    voucherCreateOpts.loading || updateChannelsOpts.loading || voucherDeleteOpts.loading;
  // Set from the whole save: voucherCreate alone can succeed while its channel values fail.
  const [saveBarState, setSaveBarState] = useState<ConfirmButtonTransitionState>("default");
  const [showChannelErrors, setShowChannelErrors] = useState(false);

  const {
    productSearchVariables,
    setProductSearchVariables,
    variantSearchVariables,
    setVariantSearchVariables,
    categorySearchVariables,
    setCategorySearchVariables,
    collectionSearchVariables,
    setCollectionSearchVariables,
  } = useVoucherPickerSearches(params.action);
  // Assign-picker searches only feed their dialog, so keep them off until it opens.
  // SearchProducts pulls Product/ProductVariant.channelListings, which Core gates behind
  // MANAGE_PRODUCTS — running it on mount buried MANAGE_DISCOUNTS-only staff in permission
  // errors just for opening the create page.
  const categoriesSearch = useCategoryWithTotalProductsSearch({
    skip: params.action !== "assign-category",
    variables: categorySearchVariables,
  });
  const collectionsSearch = useCollectionWithTotalProductsSearch({
    skip: params.action !== "assign-collection",
    variables: collectionSearchVariables,
  });
  const productsSearch = useProductSearch({
    skip: params.action !== "assign-product",
    variables: productSearchVariables,
  });
  const variantsSearch = useProductSearch({
    skip: params.action !== "assign-variant",
    variables: variantSearchVariables,
  });

  const handleProductFilterChange = (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => {
    setProductSearchVariables({
      ...productPickerSearch,
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
      ...variantPickerSearch,
      where: filterVariables,
      channel,
      query,
    });
  };

  const handleCategoryFilterChange = (filterVariables: CategoryFilterInput, query: string) => {
    setCategorySearchVariables({
      ...categoryPickerSearch,
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
      ...collectionPickerSearch,
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

    // Checked before voucherCreate: once it succeeds, a rejected channel step would leave a
    // voucher without an offer behind.
    const valueErrors = getVoucherLocalErrors(data, intl);

    if (valueErrors.length > 0) {
      setShowRequiredValueErrors(true);

      const section = getFirstVoucherSectionWithError(valueErrors);

      if (section) {
        scrollToVoucherSection(section);
      }

      notify({
        status: "error",
        title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
        text: intl.formatMessage(voucherFeedbackMessages.checkHighlightedFields),
        autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME,
      });

      return false;
    }

    return true;
  };
  const saveNewVoucher = createHandler({
    createVoucher: variables => voucherCreate({ variables }),
    updateChannels,
    deleteVoucher: id => voucherDelete({ variables: { id } }),
    validate: handleFormValidate,
  });
  const handleSubmit = async (data: FormData) => {
    // Channel errors only belong to an attempt that got as far as saving channel values.
    setShowChannelErrors(false);

    const result = await saveNewVoucher(data);

    if ("validationFailed" in result) {
      // Toast + scroll/modal already handled in handleFormValidate.
      // Return a non-empty error list so the form does not treat submit as success.
      return ["Invalid data"];
    }

    setSaveBarState("errors" in result ? "error" : "success");

    if ("id" in result) {
      notify({
        status: "success",
        title: intl.formatMessage(voucherFeedbackMessages.voucherCreated),
      });
      navigate(voucherUrl(result.id), { replace: true });

      return [];
    }

    if (result.createdWithoutChannelsId) {
      // The voucher exists and couldn't be removed again, so continue on it rather than
      // creating it a second time, which would fail because its codes are taken.
      notify({
        status: "error",
        title: intl.formatMessage(voucherFeedbackMessages.discountValuesNotSaved),
        text: intl.formatMessage(voucherFeedbackMessages.addChannelsAndDiscountValues),
      });
      navigate(voucherUrl(result.createdWithoutChannelsId), { replace: true });

      return [];
    }

    setShowChannelErrors(result.failedStep === "channels");

    const { section, recovery, shownOnPage } = getVoucherSaveFailureFeedback(result.errors);

    if (section) {
      scrollToVoucherSection(section);
    }

    notify({
      status: "error",
      title: intl.formatMessage(voucherFeedbackMessages.couldNotCreateVoucher),
      text: intl.formatMessage(recovery),
      // Errors shown next to a field own the recovery; otherwise the toast stays.
      ...(shownOnPage ? { autohide: PAIRED_ERROR_NOTIFICATION_SHOW_TIME } : {}),
    });

    return result.errors;
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
        disabled={isSaving}
        errors={[
          ...(voucherCreateOpts.data?.voucherCreate.errors || []),
          ...((showChannelErrors && updateChannelsOpts.data?.voucherChannelListingUpdate.errors) ||
            []),
        ]}
        onSubmit={handleSubmit}
        showRequiredValueErrors={showRequiredValueErrors}
        saveButtonBarState={isSaving ? "loading" : saveBarState}
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
