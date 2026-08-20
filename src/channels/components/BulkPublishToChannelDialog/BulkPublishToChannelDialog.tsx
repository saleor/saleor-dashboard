// @ts-strict-ignore
import { AssignProductPickerList } from "@dashboard/components/AssignProductDialog/AssignProductPickerList";
import {
  ASSIGN_PRODUCT_PICKER_SCROLL_ID,
  useAssignProductPicker,
} from "@dashboard/components/AssignProductDialog/useAssignProductPicker";
import BackButton from "@dashboard/components/BackButton";
import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { ChannelDisplay } from "@dashboard/components/Channel/Channel";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import ExitFormDialog from "@dashboard/components/Form/ExitFormDialog";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalProductFilterProvider } from "@dashboard/components/ModalFilters/entityConfigs/ModalProductFilterProvider";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type SearchProductsQueryVariables,
  useBulkPublishProductPricesQuery,
  useBulkPublishProductsDataQuery,
} from "@dashboard/graphql";
import {
  getParsedSearchData,
  getSearchFetchMoreProps,
} from "@dashboard/hooks/makeTopLevelSearch/utils";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useWizard from "@dashboard/hooks/useWizard";
import { buttonMessages } from "@dashboard/intl";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { type DialogProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button, Text } from "@saleor/macaw-ui-next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { BulkPublishConfirmStep } from "./BulkPublishConfirmStep";
import { getBulkPublishCurrentListings } from "./bulkPublishCurrentListings";
import { BulkPublishDefaultsStep } from "./BulkPublishDefaultsStep";
import {
  countDraftsWithPriceUpdate,
  createProductDrafts,
  getAppliedDefaultStock,
  getDraftsExceedingVariantLimit,
  getDraftsMissingCategoryForPublish,
  getDraftsMissingPrice,
  getDraftsWithInvalidCostPrice,
  getDraftsWithInvalidPrice,
  getDraftsWithInvalidStock,
  hasListedDrafts,
  isValidBulkPublishStock,
  mergeProductDrafts,
} from "./bulkPublishDrafts";
import { withBulkPublishCategoryWhere } from "./bulkPublishPickerWhere";
import {
  isProductListedInChannel,
  isProductMissingCategory,
} from "./bulkPublishProductChannelFilter";
import { BulkPublishProductPickerToolbar } from "./BulkPublishProductPickerToolbar";
import { BulkPublishReviewStep } from "./BulkPublishReviewStep";
import { isValidBulkPublishStockWarehouseSelection } from "./bulkPublishStockWarehouses";
import { messages } from "./messages";
import {
  BULK_PUBLISH_MAX_PRODUCTS,
  BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
  BULK_PUBLISH_PICKER_PAGE_SIZE,
  BULK_PUBLISH_PRICE_SAMPLE_LIMIT,
  type BulkPublishChannel,
  type BulkPublishDefaults,
  type BulkPublishSelectedProduct,
  BulkPublishStep,
  type BulkPublishWarehouse,
  type ProductPublishDraft,
  type PublishProgressItem,
} from "./types";
import { useBulkPublishToChannelSubmit } from "./useBulkPublishToChannelSubmit";

const defaultDefaults: BulkPublishDefaults = {
  stock: {
    enabled: true,
    defaultQuantity: "",
    warehouseScope: "all_channel",
    warehouseId: "",
  },
  isPublished: true,
  visibleInListings: true,
  isAvailableForPurchase: true,
};

const bulkPublishProductSearchVariables: SearchProductsQueryVariables = {
  ...DEFAULT_INITIAL_SEARCH_DATA,
  first: BULK_PUBLISH_PICKER_PAGE_SIZE,
  where: withBulkPublishCategoryWhere(),
};

interface BulkPublishToChannelDialogProps extends DialogProps {
  channel: BulkPublishChannel;
  warehouses: BulkPublishWarehouse[];
  shopWarehouseCount: number;
  onSuccess?: () => void;
}

export const BulkPublishToChannelDialog = (props: BulkPublishToChannelDialogProps) => (
  <ModalProductFilterProvider excludedFilters={["channel", "hasCategory"]}>
    <BulkPublishToChannelDialogContent {...props} />
  </ModalProductFilterProvider>
);

const BulkPublishToChannelDialogContent = ({
  open,
  onClose,
  channel,
  warehouses,
  shopWarehouseCount,
  onSuccess,
}: BulkPublishToChannelDialogProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const [step, { next, prev, set: setStep }] = useWizard(BulkPublishStep.SELECT, [
    BulkPublishStep.SELECT,
    BulkPublishStep.DEFAULTS,
    BulkPublishStep.REVIEW,
    BulkPublishStep.CONFIRM,
  ]);
  const [selectedProducts, setSelectedProducts] = useState<BulkPublishSelectedProduct[]>([]);
  const [defaults, setDefaults] = useState<BulkPublishDefaults>(defaultDefaults);
  const [productDrafts, setProductDrafts] = useState<ProductPublishDraft[]>([]);
  const [publishProgress, setPublishProgress] = useState<PublishProgressItem[] | null>(null);
  const [failedProductIds, setFailedProductIds] = useState<string[]>([]);
  const [isPreparingReview, setIsPreparingReview] = useState(false);
  const [lastAppliedDefaultStock, setLastAppliedDefaultStock] = useState<string | undefined>(
    undefined,
  );
  const [excludeListedInChannel, setExcludeListedInChannel] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { setIsDirty, setBlockDialogClose, setExitDialogDescription } = useExitFormDialog();
  const isSelectStep = step === BulkPublishStep.SELECT;

  const [productSearchVariables, setProductSearchVariables] =
    useState<SearchProductsQueryVariables>(bulkPublishProductSearchVariables);
  const { loadMore, result } = useProductSearch({
    variables: productSearchVariables,
  });
  const pickerProducts = getParsedSearchData(result);
  const pickerFetchMoreProps = getSearchFetchMoreProps(result, loadMore);
  const [searchGeneration, setSearchGeneration] = useState(0);

  const excludePickerProduct = useCallback(
    (product: (typeof pickerProducts)[number]) => {
      if (isProductMissingCategory(product)) {
        return true;
      }

      return excludeListedInChannel ? isProductListedInChannel(product, channel.id) : false;
    },
    [channel.id, excludeListedInChannel],
  );

  const handleExcludeListedInChannelChange = useCallback((value: boolean) => {
    setExcludeListedInChannel(value);
  }, []);

  const handleFilterChange = useCallback(
    (filterVariables, channelSlug: string | undefined, query: string) => {
      setSearchGeneration(generation => generation + 1);
      setProductSearchVariables({
        ...bulkPublishProductSearchVariables,
        where: withBulkPublishCategoryWhere(filterVariables),
        channel: channelSlug,
        query,
      });
    },
    [],
  );

  const handleProductSelectionChange = useCallback(
    ({ products }: { products: BulkPublishSelectedProduct[] }) => {
      setSelectedProducts(currentProducts => {
        if (
          step !== BulkPublishStep.SELECT &&
          products.length === 0 &&
          currentProducts.length > 0
        ) {
          return currentProducts;
        }

        return products;
      });
    },
    [step],
  );

  const productPicker = useAssignProductPicker({
    open,
    onClose,
    onSubmit: () => undefined,
    onSelectionChange: handleProductSelectionChange,
    onFilterChange: handleFilterChange,
    products: pickerProducts,
    loading: result.loading,
    confirmButtonState: "default",
    maxSelection: BULK_PUBLISH_MAX_PRODUCTS,
    selectAllMode: "when-scoped",
    excludeProduct: excludePickerProduct,
    backfillResetKey: `${searchGeneration}:${excludeListedInChannel}`,
    // Turning the "already in channel" filter on must drop selections made while it was off.
    pruneUnavailableSelection: true,
    onMaxSelectionReached: ({ skipped }) => {
      notify({
        status: "warning",
        text: intl.formatMessage(messages.selectAllTruncated, {
          max: BULK_PUBLISH_MAX_PRODUCTS,
          skipped,
        }),
      });
    },
    ...pickerFetchMoreProps,
  });

  const resetState = useCallback(() => {
    setStep(BulkPublishStep.SELECT);
    setSelectedProducts([]);
    setDefaults(defaultDefaults);
    setProductDrafts([]);
    setPublishProgress(null);
    setFailedProductIds([]);
    setIsPreparingReview(false);
    setLastAppliedDefaultStock(undefined);
    setExcludeListedInChannel(true);
    setSearchGeneration(0);
    setProductSearchVariables(bulkPublishProductSearchVariables);
    setShowExitDialog(false);
  }, [setStep]);

  useModalDialogOpen(open, {
    onClose: resetState,
  });

  const { publishProducts, submitting } = useBulkPublishToChannelSubmit({
    channel,
    channelWarehouses: warehouses,
  });

  const stepItems = useMemo(
    () => [
      { label: intl.formatMessage(messages.selectStep) },
      { label: intl.formatMessage(messages.defaultsStep) },
      { label: intl.formatMessage(messages.reviewStep) },
      { label: intl.formatMessage(messages.confirmStep) },
    ],
    [intl],
  );

  const confirmButtonState: ConfirmButtonTransitionState = submitting ? "loading" : "default";
  const isPublishing = publishProgress !== null;
  const hasWizardProgress = step !== BulkPublishStep.SELECT || selectedProducts.length > 0;
  // Match handleRequestClose: trap while a request is in flight, or while the wizard
  // still has progress that has not been published. After publish starts, X/Back are free
  // so merchants can dismiss a partial failure.
  const shouldTrapLeave = open && (submitting || (!isPublishing && hasWizardProgress));
  const hasOversizedDrafts = useMemo(
    () => getDraftsExceedingVariantLimit(productDrafts).length > 0,
    [productDrafts],
  );
  const showPriceDiff = useMemo(() => hasListedDrafts(productDrafts), [productDrafts]);
  const priceUpdateCount = useMemo(
    () => countDraftsWithPriceUpdate(productDrafts),
    [productDrafts],
  );

  useEffect(
    function syncBulkPublishLeaveTrap() {
      // Opt into blocking URL dialog close (Back / Cmd+[) — page forms leave this off so
      // opening unrelated modals never interrupts them. Also registers the form so setIsDirty
      // has an entry to write to.
      setBlockDialogClose(shouldTrapLeave);
      setIsDirty(shouldTrapLeave);
      setExitDialogDescription(
        shouldTrapLeave ? <FormattedMessage {...messages.exitWizardDescription} /> : null,
      );
    },
    [shouldTrapLeave, setBlockDialogClose, setIsDirty, setExitDialogDescription],
  );

  const releaseLeaveTrap = useCallback(() => {
    setIsDirty(false);
    setBlockDialogClose(false);
    setExitDialogDescription(null);
  }, [setBlockDialogClose, setExitDialogDescription, setIsDirty]);

  const dismissExitPrompts = useCallback(() => {
    setShowExitDialog(false);
    releaseLeaveTrap();
  }, [releaseLeaveTrap]);

  const handleRequestClose = useCallback(() => {
    // Only block while a publish request is in flight. After failures, users must
    // be able to dismiss (progress stays mounted so Retry failed can be shown).
    if (submitting) {
      return;
    }

    // Publish already ran (partial/total failure). Skip the unsaved-wizard prompt —
    // some listings may already exist on the channel.
    if (isPublishing) {
      onSuccess?.();
      releaseLeaveTrap();
      onClose();

      return;
    }

    if (hasWizardProgress) {
      setShowExitDialog(true);

      return;
    }

    releaseLeaveTrap();
    onClose();
  }, [hasWizardProgress, isPublishing, onClose, releaseLeaveTrap, submitting]);

  const handleConfirmClose = useCallback(() => {
    if (submitting) {
      return;
    }

    dismissExitPrompts();
    onClose();
  }, [dismissExitPrompts, onClose, submitting]);

  const handleModalOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleRequestClose();
      }
    },
    [handleRequestClose],
  );

  const { refetch: fetchProductsData } = useBulkPublishProductsDataQuery({
    skip: true,
    variables: {
      ids: [],
      first: 1,
    },
  });
  const { refetch: fetchProductPrices } = useBulkPublishProductPricesQuery({
    skip: true,
    variables: {
      ids: [],
      first: 1,
      variantsFirst: BULK_PUBLISH_PRICE_SAMPLE_LIMIT,
    },
  });

  /**
   * Only products already in the channel have prices to keep, and pulling variant prices is the
   * expensive part of preparing the review step — so the onboarding path skips this entirely.
   */
  const loadCurrentListings = useCallback(
    async (listedProductIds: string[]) => {
      if (listedProductIds.length === 0) {
        return undefined;
      }

      try {
        const { data } = await fetchProductPrices({
          ids: listedProductIds,
          first: listedProductIds.length,
          variantsFirst: BULK_PUBLISH_PRICE_SAMPLE_LIMIT,
        });

        return getBulkPublishCurrentListings({
          products: mapEdgesToItems(data?.products) ?? [],
          channelId: channel.id,
        });
      } catch {
        // Placeholders and warnings are a convenience — losing them must not block the wizard.
        return undefined;
      }
    },
    [channel.id, fetchProductPrices],
  );

  const handleNextFromSelect = () => {
    if (selectedProducts.length === 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.noProductsSelected),
      });

      return;
    }

    if (selectedProducts.length > BULK_PUBLISH_MAX_PRODUCTS) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.tooManyProducts, {
          max: BULK_PUBLISH_MAX_PRODUCTS,
        }),
      });

      return;
    }

    next();
  };

  const handleNextFromDefaults = async () => {
    if (
      defaults.stock.enabled &&
      !isValidBulkPublishStockWarehouseSelection({
        channelWarehouses: warehouses,
        stock: defaults.stock,
      })
    ) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.stockSingleWarehouseRequired),
      });

      return;
    }

    // Without this the quantity is dropped on the way to the review step and stock silently never lands.
    if (defaults.stock.enabled && !isValidBulkPublishStock(defaults.stock.defaultQuantity)) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.stockInvalid),
      });

      return;
    }

    setIsPreparingReview(true);

    try {
      const { data } = await fetchProductsData({
        ids: selectedProducts.map(product => product.id),
        first: BULK_PUBLISH_MAX_PRODUCTS,
      });
      const products = mapEdgesToItems(data?.products);

      if (products.length === 0 && selectedProducts.length > 0) {
        notify({
          status: "error",
          text: intl.formatMessage(messages.productsLoadFailed),
        });

        return;
      }

      if (products.length < selectedProducts.length) {
        notify({
          status: "error",
          text: intl.formatMessage(messages.productsPartiallyLoaded, {
            loaded: products.length,
            selected: selectedProducts.length,
          }),
        });

        return;
      }

      const appliedDefaultStock = getAppliedDefaultStock(defaults);
      const currentListings = await loadCurrentListings(
        products
          .filter(product => isProductListedInChannel(product, channel.id))
          .map(product => product.id),
      );

      setProductDrafts(previousDrafts => {
        const freshDrafts = createProductDrafts({
          products,
          channelId: channel.id,
          defaultStock: appliedDefaultStock,
          currentListings,
        });

        if (previousDrafts.length === 0) {
          return freshDrafts;
        }

        return mergeProductDrafts({
          drafts: freshDrafts,
          previousDrafts,
          previousDefaultStock: lastAppliedDefaultStock,
        });
      });
      setLastAppliedDefaultStock(appliedDefaultStock);
      next();
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(messages.productsLoadFailed),
      });
    } finally {
      setIsPreparingReview(false);
    }
  };

  const handleNextFromReview = () => {
    const invalidPriceDrafts = getDraftsWithInvalidPrice(productDrafts);

    if (invalidPriceDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.priceInvalid),
      });

      return;
    }

    const missingPriceDrafts = getDraftsMissingPrice(productDrafts);

    if (missingPriceDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.priceRequired),
      });

      return;
    }

    const invalidCostPriceDrafts = getDraftsWithInvalidCostPrice(productDrafts);

    if (invalidCostPriceDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.costPriceInvalid),
      });

      return;
    }

    const oversizedDrafts = getDraftsExceedingVariantLimit(productDrafts);

    if (oversizedDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.variantLimitExceeded, {
          count: oversizedDrafts.length,
          max: BULK_PUBLISH_MAX_VARIANTS_PER_PRODUCT,
        }),
      });

      return;
    }

    const missingCategoryDrafts = getDraftsMissingCategoryForPublish(
      productDrafts,
      defaults.isPublished,
    );

    if (missingCategoryDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.missingCategoryForPublish, {
          count: missingCategoryDrafts.length,
        }),
      });

      return;
    }

    const invalidStockDrafts = defaults.stock.enabled
      ? getDraftsWithInvalidStock(productDrafts)
      : [];

    if (invalidStockDrafts.length > 0) {
      notify({
        status: "error",
        text: intl.formatMessage(messages.stockInvalid),
      });

      return;
    }

    next();
  };

  const handlePublish = async (productIds: string[]) => {
    setPublishProgress(
      productIds.map(productId => {
        const draft = productDrafts.find(item => item.productId === productId);

        return {
          productId,
          name: draft?.name ?? productId,
          status: "pending",
        };
      }),
    );

    try {
      const { failedProductIds: newFailedProductIds } = await publishProducts({
        productDrafts,
        defaults,
        productIds,
        onProgressChange: setPublishProgress,
      });

      if (newFailedProductIds.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.success),
        });
        dismissExitPrompts();
        onSuccess?.();
        onClose();
      } else {
        setFailedProductIds(newFailedProductIds);
        notify({
          status: "warning",
          text: intl.formatMessage(messages.partialSuccess),
        });
      }
    } catch {
      notify({
        status: "error",
        text: intl.formatMessage(messages.publishFailed),
      });
    }
  };

  const handleConfirmPublish = () => {
    void handlePublish(productDrafts.map(draft => draft.productId));
  };

  const handleBack = () => {
    if (step === BulkPublishStep.CONFIRM) {
      setPublishProgress(null);
      setFailedProductIds([]);
    }

    prev();
  };

  const handleRetryFailed = () => {
    void handlePublish(failedProductIds);
  };

  // Keep retry as the only primary action after a failure — including while a retry is in flight —
  // so the footer never flips back to "Add N products" mid-retry.
  const showRetryFailed = failedProductIds.length > 0;

  return (
    <>
      <DashboardModal onChange={handleModalOpenChange} open={open}>
        <DashboardModal.Content
          disableEscapeKeyDown
          disableScrollLayout
          size={isSelectStep ? "picker" : "md"}
        >
          <DashboardModal.ContextHeader
            steps={{
              current: step + 1,
              items: stepItems,
            }}
          >
            <FormattedMessage
              {...messages.title}
              values={{
                channelName: (
                  <ChannelDisplay
                    channel={{ name: channel.name }}
                    inline
                    size={6}
                    color="default1"
                    fontWeight="bold"
                    data-test-id="bulk-publish-channel-name"
                  />
                ),
              }}
            />
          </DashboardModal.ContextHeader>

          {isSelectStep ? (
            <>
              <DashboardModal.PickerHeader
                hideChrome
                toolbar={
                  <BulkPublishProductPickerToolbar
                    picker={productPicker}
                    excludeListedInChannel={excludeListedInChannel}
                    onExcludeListedInChannelChange={handleExcludeListedInChannelChange}
                  />
                }
              />
              <DashboardModal.Body fill id={ASSIGN_PRODUCT_PICKER_SCROLL_ID}>
                <AssignProductPickerList
                  picker={productPicker}
                  scrollableTargetId={ASSIGN_PRODUCT_PICKER_SCROLL_ID}
                />
              </DashboardModal.Body>
            </>
          ) : (
            <DashboardModal.Body>
              <DashboardModal.Inset>
                {step === BulkPublishStep.DEFAULTS ? (
                  <BulkPublishDefaultsStep
                    defaults={defaults}
                    channelWarehouses={warehouses}
                    shopWarehouseCount={shopWarehouseCount}
                    onChange={setDefaults}
                  />
                ) : null}
                {step === BulkPublishStep.REVIEW ? (
                  <BulkPublishReviewStep
                    channel={channel}
                    defaults={defaults}
                    productDrafts={productDrafts}
                    onChange={setProductDrafts}
                  />
                ) : null}
                {step === BulkPublishStep.CONFIRM ? (
                  <BulkPublishConfirmStep
                    channel={channel}
                    channelWarehouses={warehouses}
                    defaults={defaults}
                    productDrafts={productDrafts}
                    progress={publishProgress}
                  />
                ) : null}
              </DashboardModal.Inset>
            </DashboardModal.Body>
          )}

          <DashboardModal.Actions alignItems="center">
            {isSelectStep ? (
              <>
                <BackButton disabled={submitting} onClick={handleRequestClose}>
                  <FormattedMessage {...buttonMessages.cancel} />
                </BackButton>
                <Button
                  data-test-id="bulk-publish-next"
                  disabled={selectedProducts.length === 0 || submitting}
                  onClick={handleNextFromSelect}
                  variant="primary"
                >
                  <FormattedMessage {...buttonMessages.nextStep} />
                </Button>
              </>
            ) : (
              <>
                {step === BulkPublishStep.REVIEW ? (
                  <Text
                    size={2}
                    color="default2"
                    data-test-id="bulk-publish-review-product-count"
                    __marginRight="auto"
                  >
                    <FormattedMessage
                      {...messages.reviewCardSubtitle}
                      values={{ count: productDrafts.length }}
                    />
                    {showPriceDiff ? (
                      <>
                        {" · "}
                        <FormattedMessage
                          {...messages.reviewPriceUpdateCount}
                          values={{ count: priceUpdateCount }}
                        />
                      </>
                    ) : null}
                  </Text>
                ) : null}
                <BackButton disabled={submitting || isPreparingReview} onClick={handleBack} />
                {step === BulkPublishStep.CONFIRM ? (
                  showRetryFailed ? (
                    <Button
                      data-test-id="bulk-publish-retry"
                      disabled={submitting}
                      onClick={handleRetryFailed}
                      variant="primary"
                    >
                      <FormattedMessage {...messages.retryFailed} />
                    </Button>
                  ) : (
                    <ConfirmButton
                      data-test-id="bulk-publish-submit"
                      disabled={submitting || isPublishing}
                      onClick={handleConfirmPublish}
                      transitionState={confirmButtonState}
                      type="submit"
                    >
                      <FormattedMessage
                        {...messages.confirmAddProducts}
                        values={{ count: productDrafts.length }}
                      />
                    </ConfirmButton>
                  )
                ) : step === BulkPublishStep.DEFAULTS ? (
                  <ButtonWithLoader
                    data-test-id="bulk-publish-next"
                    disabled={submitting}
                    onClick={handleNextFromDefaults}
                    transitionState={isPreparingReview ? "loading" : "default"}
                    variant="primary"
                  >
                    <FormattedMessage {...buttonMessages.nextStep} />
                  </ButtonWithLoader>
                ) : (
                  <Button
                    data-test-id="bulk-publish-next"
                    disabled={submitting || (step === BulkPublishStep.REVIEW && hasOversizedDrafts)}
                    onClick={step === BulkPublishStep.REVIEW ? handleNextFromReview : next}
                    variant="primary"
                  >
                    <FormattedMessage {...buttonMessages.nextStep} />
                  </Button>
                )}
              </>
            )}
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
      <ExitFormDialog
        isOpen={showExitDialog}
        description={<FormattedMessage {...messages.exitWizardDescription} />}
        onClose={() => setShowExitDialog(false)}
        onLeave={handleConfirmClose}
      />
    </>
  );
};
