import { useApolloClient } from "@apollo/client";
import BackButton from "@dashboard/components/BackButton";
import { Callout } from "@dashboard/components/Callout/Callout";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import FilterTabs, { FilterTab } from "@dashboard/components/TableFilter";
import {
  ProductVariantSkusExistDocument,
  type ProductVariantSkusExistQuery,
  useWarehouseListQuery,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { buttonMessages } from "@dashboard/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { LayoutGrid, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { AttributeValueChips } from "./components/AttributeValueChips";
import { DefaultsSection } from "./components/DefaultsSection";
import { RequiredAttributesSection } from "./components/RequiredAttributesSection";
import { VariantMatrix } from "./components/VariantMatrix";
import { VariantPreviewList } from "./components/VariantPreviewList";
import { fetchAllExistingVariantsForGenerator } from "./fetchExistingVariants";
import { messages } from "./messages";
import styles from "./ProductVariantGenerator.module.css";
import {
  type AttributeError,
  type ExistingVariantData,
  getUnsupportedRequiredAttributes,
  isGeneratorSupportedType,
  type NonSelectionAttributeValues,
  type ProductVariantGeneratorProps,
} from "./types";
import { useVariantGenerator } from "./useVariantGenerator";
import { excludeInputsWithCollidingSkus, toBulkCreateInputs } from "./utils";

// Maximum variants that can be created in a single batch (API performance consideration)
const VARIANT_LIMIT = 100;
// Show confirmation dialog when creating this many or more variants
const CONFIRMATION_THRESHOLD = 30;

type ViewMode = "grid" | "list";

// Tab indices
const TAB_SELECTION = 0;
const TAB_REQUIRED = 1;

// Convert product name to a URL-safe SKU prefix (uppercase, no spaces, max 20 chars)
const toSkuPrefix = (name: string): string =>
  name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);

export const ProductVariantGenerator = ({
  open,
  onClose,
  productId,
  productName,
  variantAttributes,
  nonSelectionVariantAttributes,
  onAttributeValuesSearch,
  onSubmit,
}: ProductVariantGeneratorProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const apolloClient = useApolloClient();
  const [confirmState, setConfirmState] = useState<ConfirmButtonTransitionState>("default");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMissingDefaultsWarning, setShowMissingDefaultsWarning] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState(TAB_SELECTION);
  const [existingVariants, setExistingVariants] = useState<ExistingVariantData>([]);
  const [existingVariantsLoading, setExistingVariantsLoading] = useState(false);
  const [existingVariantsLoadFailed, setExistingVariantsLoadFailed] = useState(false);

  // State for non-selection required attribute values
  const [nonSelectionValues, setNonSelectionValues] = useState<NonSelectionAttributeValues>({});

  // State for attribute errors from API (for inline display)
  const [attributeErrors, setAttributeErrors] = useState<AttributeError[]>([]);

  // Get required non-selection attributes
  const requiredNonSelectionAttributes = useMemo(
    () => (nonSelectionVariantAttributes ?? []).filter(attr => attr.valueRequired),
    [nonSelectionVariantAttributes],
  );

  // Check for required attributes with unsupported types - these BLOCK generation entirely
  const unsupportedRequiredAttributes = useMemo(
    () => getUnsupportedRequiredAttributes(requiredNonSelectionAttributes),
    [requiredNonSelectionAttributes],
  );

  const hasUnsupportedRequiredAttributes = unsupportedRequiredAttributes.length > 0;

  // Get only the supported required attributes (these are the ones user can fill)
  const supportedRequiredAttributes = useMemo(
    () => requiredNonSelectionAttributes.filter(attr => isGeneratorSupportedType(attr.inputType)),
    [requiredNonSelectionAttributes],
  );

  // Check if all supported required attributes have values
  // Note: unsupported attributes block generation via hasUnsupportedRequiredAttributes
  const hasAllRequiredAttributes = useMemo(() => {
    if (hasUnsupportedRequiredAttributes) {
      return false; // Can never generate if there are unsupported required attributes
    }

    return supportedRequiredAttributes.every(attr => nonSelectionValues[attr.id]?.length > 0);
  }, [supportedRequiredAttributes, nonSelectionValues, hasUnsupportedRequiredAttributes]);

  const handleNonSelectionAttributeChange = useCallback((attributeId: string, values: string[]) => {
    setNonSelectionValues(prev => ({
      ...prev,
      [attributeId]: values,
    }));
  }, []);

  // Fetch warehouses for stock defaults
  const { data: warehousesData } = useWarehouseListQuery({
    variables: { first: 100 },
    skip: !open,
  });
  const warehouses = useMemo(
    () => mapEdgesToItems(warehousesData?.warehouses) ?? [],
    [warehousesData],
  );

  const defaultSkuPrefix = useMemo(() => toSkuPrefix(productName), [productName]);

  const {
    attributes,
    selections,
    defaults,
    setDefaults,
    toggleValue,
    setSelectedValues,
    selectAllValues,
    deselectAllValues,
    previews,
    newVariantsCount,
    existingCount,
    totalCount,
    isTruncated,
    existingCombinations,
    canGenerate,
    hasSelectionPerAttribute,
    canShowMatrix,
    reset,
  } = useVariantGenerator({
    variantAttributes,
    existingVariants,
    defaultSkuPrefix,
  });

  // Check if we should show the Required tab
  const hasRequiredTab = supportedRequiredAttributes.length > 0;

  // Reset form state when modal opens
  useEffect(
    function resetGeneratorOnOpen() {
      if (!open) {
        return;
      }

      reset();
      setConfirmState("default");
      setNonSelectionValues({});
      setAttributeErrors([]);
      setActiveTab(TAB_SELECTION);
      setViewMode(variantAttributes.length === 2 ? "grid" : "list");
      setExistingVariants([]);
      setExistingVariantsLoadFailed(false);
    },
    [open, reset, variantAttributes.length],
  );

  // Load every existing variant (all pages) so off-page combos are marked Exists and skipped.
  // Fail closed on errors — an empty list must not be treated as "nothing exists".
  const selectionAttributeIdsKey = variantAttributes.map(attr => attr.id).join("\0");

  useEffect(
    function loadExistingVariantsForGenerator() {
      if (!open) {
        return;
      }

      let cancelled = false;
      const selectionAttributeIds = new Set(
        selectionAttributeIdsKey ? selectionAttributeIdsKey.split("\0") : [],
      );

      // Keep prior data while reloading to avoid flashing every cell as "New".
      setExistingVariantsLoadFailed(false);
      setExistingVariantsLoading(true);
      fetchAllExistingVariantsForGenerator(apolloClient, productId, selectionAttributeIds)
        .then(variants => {
          if (!cancelled) {
            setExistingVariants(variants);
            setExistingVariantsLoadFailed(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setExistingVariants([]);
            setExistingVariantsLoadFailed(true);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setExistingVariantsLoading(false);
          }
        });

      return () => {
        cancelled = true;
      };
    },
    [open, apolloClient, productId, selectionAttributeIdsKey],
  );

  // Auto-close modal after successful generation
  useEffect(() => {
    if (confirmState === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [confirmState, onClose]);

  const isOverLimit = newVariantsCount > VARIANT_LIMIT;
  const needsConfirmation = newVariantsCount >= CONFIRMATION_THRESHOLD && !isOverLimit;

  // Generate SKU preview example from first preview
  const skuPreviewExample = useMemo(() => {
    if (previews.length === 0) return undefined;

    const firstPreview = previews.find(p => !p.isExisting) ?? previews[0];
    const slugParts = firstPreview.attributes.map(a =>
      a.valueName.toLowerCase().replace(/\s+/g, "-"),
    );
    const prefix = defaults.skuPrefix.trim();

    return prefix ? [prefix, ...slugParts].join("-") : slugParts.join("-");
  }, [previews, defaults.skuPrefix]);

  const executeGenerate = useCallback(async () => {
    setConfirmState("loading");
    setShowConfirmation(false);
    setAttributeErrors([]); // Clear previous errors

    try {
      let inputs = toBulkCreateInputs(
        attributes,
        selections,
        defaults,
        warehouses,
        existingCombinations,
        nonSelectionValues,
        nonSelectionVariantAttributes ?? [],
      );

      const generatedSkus = inputs
        .map(input => input.sku)
        .filter((sku): sku is string => Boolean(sku));

      if (generatedSkus.length > 0) {
        const duplicateInBatch = generatedSkus.filter(
          (sku, index) => generatedSkus.indexOf(sku) !== index,
        );

        if (duplicateInBatch.length > 0) {
          notify({
            status: "error",
            title: intl.formatMessage(messages.skuCollisionTitle),
            text: intl.formatMessage(messages.skuDuplicateInBatch, {
              skus: [...new Set(duplicateInBatch)].join(", "),
            }),
          });
          setConfirmState("error");

          return;
        }

        const collidingSkus = new Set<string>();
        const chunkSize = 100;

        for (let offset = 0; offset < generatedSkus.length; offset += chunkSize) {
          const chunk = generatedSkus.slice(offset, offset + chunkSize);
          const result = await apolloClient.query<ProductVariantSkusExistQuery>({
            query: ProductVariantSkusExistDocument,
            variables: {
              skus: chunk,
              first: chunk.length,
            },
            fetchPolicy: "network-only",
          });
          const existing = mapEdgesToItems(result.data?.productVariants) ?? [];

          existing.forEach(variant => {
            if (variant?.sku) {
              collidingSkus.add(variant.sku);
            }
          });
        }

        if (collidingSkus.size > 0) {
          const { kept, skippedSkus } = excludeInputsWithCollidingSkus(inputs, collidingSkus);
          const skippedLabel = [...new Set(skippedSkus)].join(", ");

          if (kept.length === 0) {
            notify({
              status: "error",
              title: intl.formatMessage(messages.skuCollisionTitle),
              text: intl.formatMessage(messages.skuCollisionAllSkipped, {
                skus: skippedLabel,
              }),
            });
            setConfirmState("error");

            return;
          }

          notify({
            status: "warning",
            title: intl.formatMessage(messages.skuCollisionTitle),
            text: intl.formatMessage(messages.skuCollisionSkipped, {
              count: skippedSkus.length,
              skus: skippedLabel,
            }),
          });
          inputs = kept;
        }
      }

      const result = await onSubmit(inputs);

      if (result.attributeErrors.length > 0) {
        // Has attribute-specific errors - show them inline
        setAttributeErrors(result.attributeErrors);
        setConfirmState("error");

        // Switch to Required tab if it has errors
        if (hasRequiredTab) {
          setActiveTab(TAB_REQUIRED);
        }
      } else if (result.success) {
        setConfirmState("success");
      } else {
        // Failed with non-attribute errors (notifications already shown)
        setConfirmState("error");
      }
    } catch {
      setConfirmState("error");
    }
  }, [
    attributes,
    selections,
    defaults,
    warehouses,
    existingCombinations,
    nonSelectionValues,
    nonSelectionVariantAttributes,
    onSubmit,
    hasRequiredTab,
    apolloClient,
    intl,
    notify,
  ]);

  const isMissingDefaults = !defaults.skuEnabled && !defaults.stockEnabled;

  const proceedWithGeneration = useCallback(() => {
    setShowMissingDefaultsWarning(false);

    if (needsConfirmation) {
      setShowConfirmation(true);
    } else {
      executeGenerate();
    }
  }, [needsConfirmation, executeGenerate]);

  // Combined generation readiness check
  const canGenerateVariants =
    canGenerate &&
    hasAllRequiredAttributes &&
    !existingVariantsLoading &&
    !existingVariantsLoadFailed;

  const handleGenerate = useCallback(() => {
    if (!canGenerateVariants || isOverLimit) return;

    if (isMissingDefaults) {
      setShowMissingDefaultsWarning(true);
    } else if (needsConfirmation) {
      setShowConfirmation(true);
    } else {
      executeGenerate();
    }
  }, [canGenerateVariants, isOverLimit, isMissingDefaults, needsConfirmation, executeGenerate]);

  const handleClose = useCallback(() => {
    if (confirmState !== "loading") {
      onClose();
    }
  }, [confirmState, onClose]);

  const hasVariantAttributes = variantAttributes.length > 0;

  // Compute tooltip message for disabled generate button
  const disabledTooltipMessage = useMemo(() => {
    const isDisabled = !canGenerateVariants || isOverLimit;

    if (!isDisabled) {
      return null;
    }

    // Check conditions in order of priority
    if (hasUnsupportedRequiredAttributes) {
      return intl.formatMessage(messages.unsupportedRequiredAttributesDescription, {
        attributes: unsupportedRequiredAttributes.map(a => a.name).join(", "),
        newline: "\n",
      });
    }

    if (existingVariantsLoading) {
      return intl.formatMessage(messages.loadingExistingVariants);
    }

    if (existingVariantsLoadFailed) {
      return intl.formatMessage(messages.existingVariantsLoadFailed);
    }

    if (isOverLimit) {
      return intl.formatMessage(messages.disabledOverLimit, { limit: VARIANT_LIMIT });
    }

    if (!hasSelectionPerAttribute) {
      return intl.formatMessage(messages.disabledNoSelections);
    }

    if (newVariantsCount === 0) {
      return intl.formatMessage(messages.disabledNoNewVariants);
    }

    if (!hasAllRequiredAttributes) {
      return intl.formatMessage(messages.disabledRequiredNotFilled);
    }

    return null;
  }, [
    canGenerateVariants,
    isOverLimit,
    hasUnsupportedRequiredAttributes,
    unsupportedRequiredAttributes,
    existingVariantsLoading,
    existingVariantsLoadFailed,
    hasSelectionPerAttribute,
    newVariantsCount,
    hasAllRequiredAttributes,
    intl,
  ]);

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.ContextHeader description={intl.formatMessage(messages.subtitle)}>
          {intl.formatMessage(messages.title)}
        </DashboardModal.ContextHeader>

        <DashboardModal.Body>
          <DashboardModal.Inset>
            <Box className={styles.content}>
              {!hasVariantAttributes ? (
                <Text className={styles.noAttributes}>
                  {intl.formatMessage(messages.noAttributes)}
                </Text>
              ) : (
                <>
                  {/* Tab bar - only show if there are required attributes */}
                  {hasRequiredTab && (
                    <FilterTabs currentTab={activeTab} flush>
                      <FilterTab
                        label={intl.formatMessage(messages.tabSelection)}
                        onClick={() => setActiveTab(TAB_SELECTION)}
                      />
                      <FilterTab
                        label={intl.formatMessage(messages.tabRequired)}
                        onClick={() => setActiveTab(TAB_REQUIRED)}
                      />
                    </FilterTabs>
                  )}

                  {/* Tab content */}
                  {activeTab === TAB_SELECTION && (
                    <Box
                      className={styles.attributesSection}
                      borderStyle="solid"
                      borderColor="default1"
                      borderWidth={1}
                      borderRadius={4}
                    >
                      {attributes.map(attr => (
                        <AttributeValueChips
                          key={attr.id}
                          attribute={attr}
                          selectedIds={selections[attr.id] ?? new Set()}
                          onToggleValue={valueId => toggleValue(attr.id, valueId)}
                          onSelectAll={() => selectAllValues(attr.id)}
                          onDeselectAll={() => deselectAllValues(attr.id)}
                          onSetSelected={valueIds => setSelectedValues(attr.id, valueIds)}
                        />
                      ))}
                    </Box>
                  )}

                  {activeTab === TAB_REQUIRED && hasRequiredTab && (
                    <RequiredAttributesSection
                      attributes={supportedRequiredAttributes}
                      values={nonSelectionValues}
                      errors={attributeErrors}
                      onChange={handleNonSelectionAttributeChange}
                      onAttributeValuesSearch={onAttributeValuesSearch}
                    />
                  )}

                  {/* Defaults row with view toggle - always visible */}
                  <Box className={styles.controlsRow}>
                    <DefaultsSection
                      defaults={defaults}
                      onChange={setDefaults}
                      skuPreviewExample={skuPreviewExample}
                    />
                    {previews.length > 0 && (
                      <Box className={styles.viewToggle}>
                        <Tooltip open={canShowMatrix ? false : undefined}>
                          <Tooltip.Trigger>
                            <Button
                              variant={viewMode === "grid" ? "primary" : "secondary"}
                              size="small"
                              onClick={() => setViewMode("grid")}
                              disabled={!canShowMatrix}
                              aria-label={intl.formatMessage(messages.gridView)}
                              data-test-id="view-toggle-grid"
                            >
                              <LayoutGrid
                                size={iconSize.small}
                                strokeWidth={iconStrokeWidthBySize.small}
                              />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content side="bottom">
                            <Tooltip.Arrow />
                            {intl.formatMessage(messages.matrixRequiresTwoAttributes)}
                          </Tooltip.Content>
                        </Tooltip>
                        <Button
                          variant={viewMode === "list" ? "primary" : "secondary"}
                          size="small"
                          onClick={() => setViewMode("list")}
                          aria-label={intl.formatMessage(messages.listView)}
                          data-test-id="view-toggle-list"
                        >
                          <List size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Preview - always visible */}
                  <Box className={styles.previewSection}>
                    {viewMode === "grid" && canShowMatrix ? (
                      <VariantMatrix
                        attributes={attributes}
                        selections={selections}
                        existingCombinations={existingCombinations}
                      />
                    ) : (
                      <VariantPreviewList previews={previews} />
                    )}
                  </Box>

                  {/* Warnings */}
                  {(existingVariantsLoading ||
                    existingVariantsLoadFailed ||
                    existingCount > 0 ||
                    isTruncated ||
                    isOverLimit) && (
                    <Box className={styles.callouts}>
                      {existingVariantsLoading && (
                        <Callout
                          type="info"
                          title={
                            <Text size={2}>
                              {intl.formatMessage(messages.loadingExistingVariants)}
                            </Text>
                          }
                        />
                      )}
                      {existingVariantsLoadFailed && (
                        <Callout
                          type="error"
                          title={
                            <Text size={2}>
                              {intl.formatMessage(messages.existingVariantsLoadFailed)}
                            </Text>
                          }
                        />
                      )}
                      {existingCount > 0 && (
                        <Callout
                          type="warning"
                          title={
                            <Text size={2}>
                              {intl.formatMessage(messages.existingSkipped, {
                                count: existingCount,
                              })}
                            </Text>
                          }
                        />
                      )}
                      {isTruncated && (
                        <Callout
                          type="warning"
                          title={
                            <Text size={2}>
                              {intl.formatMessage(messages.previewTruncated, {
                                total: totalCount.toLocaleString(),
                                limit: VARIANT_LIMIT,
                              })}
                            </Text>
                          }
                        />
                      )}
                      {isOverLimit && (
                        <Callout
                          type="error"
                          title={
                            <Text size={2}>
                              {intl.formatMessage(messages.limitReached, { limit: VARIANT_LIMIT })}
                            </Text>
                          }
                        />
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} disabled={confirmState === "loading"}>
            {intl.formatMessage(buttonMessages.cancel)}
          </BackButton>
          <Tooltip open={disabledTooltipMessage ? undefined : false}>
            <Tooltip.Trigger>
              {/* Box wrapper enables hover events on disabled button */}
              <Box display="inline-block">
                <ConfirmButton
                  transitionState={confirmState}
                  onClick={handleGenerate}
                  disabled={!canGenerateVariants || isOverLimit}
                >
                  {intl.formatMessage(messages.generate, { count: newVariantsCount })}
                </ConfirmButton>
              </Box>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">
              <Tooltip.Arrow />
              <span style={{ whiteSpace: "pre-line" }}>{disabledTooltipMessage}</span>
            </Tooltip.Content>
          </Tooltip>
        </DashboardModal.Actions>
      </DashboardModal.Content>

      <DashboardModal
        onChange={() => setShowMissingDefaultsWarning(false)}
        open={showMissingDefaultsWarning}
      >
        <DashboardModal.Content size="xs">
          <DashboardModal.Header subtitle={intl.formatMessage(messages.missingDefaultsDescription)}>
            {intl.formatMessage(messages.missingDefaultsTitle)}
          </DashboardModal.Header>

          <DashboardModal.Actions>
            <BackButton onClick={() => setShowMissingDefaultsWarning(false)} />
            <ConfirmButton
              data-test-id="submit"
              onClick={proceedWithGeneration}
              transitionState="default"
            >
              {intl.formatMessage(buttonMessages.continue)}
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>

      <DashboardModal onChange={() => setShowConfirmation(false)} open={showConfirmation}>
        <DashboardModal.Content size="xs">
          <DashboardModal.Header
            subtitle={intl.formatMessage(messages.confirmDescription, { count: newVariantsCount })}
          >
            {intl.formatMessage(messages.confirmTitle, { count: newVariantsCount })}
          </DashboardModal.Header>

          <DashboardModal.Actions>
            <BackButton onClick={() => setShowConfirmation(false)} />
            <ConfirmButton
              data-test-id="submit"
              onClick={executeGenerate}
              transitionState={confirmState}
            >
              {intl.formatMessage(buttonMessages.continue)}
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
    </DashboardModal>
  );
};
