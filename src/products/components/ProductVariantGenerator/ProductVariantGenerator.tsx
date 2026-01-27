import ActionDialog from "@dashboard/components/ActionDialog";
import BackButton from "@dashboard/components/BackButton";
import { Callout } from "@dashboard/components/Callout/Callout";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import FilterTabs, { FilterTab } from "@dashboard/components/TableFilter";
import { useWarehouseListQuery } from "@dashboard/graphql";
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
import { messages } from "./messages";
import styles from "./ProductVariantGenerator.module.css";
import {
  AttributeError,
  getUnsupportedRequiredAttributes,
  isGeneratorSupportedType,
  NonSelectionAttributeValues,
  ProductVariantGeneratorProps,
} from "./types";
import { useVariantGenerator } from "./useVariantGenerator";
import { toBulkCreateInputs } from "./utils";

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
  productName,
  variantAttributes,
  nonSelectionVariantAttributes,
  existingVariants,
  onAttributeValuesSearch,
  onSubmit,
}: ProductVariantGeneratorProps) => {
  const intl = useIntl();
  const [confirmState, setConfirmState] = useState<ConfirmButtonTransitionState>("default");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMissingDefaultsWarning, setShowMissingDefaultsWarning] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState(TAB_SELECTION);

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

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      reset();
      setConfirmState("default");
      setNonSelectionValues({});
      setAttributeErrors([]);
      setActiveTab(TAB_SELECTION);
      // Default to grid view if 2 attributes, otherwise list
      setViewMode(variantAttributes.length === 2 ? "grid" : "list");
    }
  }, [open, reset, variantAttributes.length]);

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
      const inputs = toBulkCreateInputs(
        attributes,
        selections,
        defaults,
        warehouses,
        existingCombinations,
        nonSelectionValues,
        nonSelectionVariantAttributes ?? [],
      );

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
  const canGenerateVariants = canGenerate && hasAllRequiredAttributes;

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
    hasSelectionPerAttribute,
    newVariantsCount,
    hasAllRequiredAttributes,
    intl,
  ]);

  return (
    <DashboardModal open={open} onChange={handleClose}>
      <DashboardModal.Content size="md">
        <Box display="flex" flexDirection="column" gap={2}>
          <DashboardModal.Header>{intl.formatMessage(messages.title)}</DashboardModal.Header>
          <Text size={2} color="default2">
            {intl.formatMessage(messages.subtitle)}
          </Text>
        </Box>

        <Box className={styles.body}>
          {!hasVariantAttributes ? (
            <Text className={styles.noAttributes}>{intl.formatMessage(messages.noAttributes)}</Text>
          ) : (
            <>
              {/* Tab bar - only show if there are required attributes */}
              {hasRequiredTab && (
                <FilterTabs currentTab={activeTab}>
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
                <div className={styles.attributesSectionWrapper}>
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
                </div>
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
              <Box className={styles.previewContent}>
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
              {(existingCount > 0 || isTruncated || isOverLimit) && (
                <Box className={styles.callouts}>
                  {existingCount > 0 && (
                    <Callout
                      type="warning"
                      title={
                        <Text size={2}>
                          {intl.formatMessage(messages.existingSkipped, { count: existingCount })}
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

      {/* Warning dialog for missing SKU/stock */}
      <ActionDialog
        open={showMissingDefaultsWarning}
        onClose={() => setShowMissingDefaultsWarning(false)}
        onConfirm={proceedWithGeneration}
        title={intl.formatMessage(messages.missingDefaultsTitle)}
        confirmButtonLabel={intl.formatMessage(buttonMessages.continue)}
        confirmButtonState="default"
      >
        <Text>{intl.formatMessage(messages.missingDefaultsDescription)}</Text>
      </ActionDialog>

      {/* Confirmation dialog for large batches */}
      <ActionDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={executeGenerate}
        confirmButtonState={confirmState}
        title={intl.formatMessage(messages.confirmTitle, { count: newVariantsCount })}
        confirmButtonLabel={intl.formatMessage(buttonMessages.continue)}
      >
        <Text>{intl.formatMessage(messages.confirmDescription, { count: newVariantsCount })}</Text>
      </ActionDialog>
    </DashboardModal>
  );
};
