import ActionDialog from "@dashboard/components/ActionDialog";
import BackButton from "@dashboard/components/BackButton";
import { Callout } from "@dashboard/components/Callout/Callout";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import { useWarehouseListQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { LayoutGrid, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { AttributeValueChips } from "./components/AttributeValueChips";
import { DefaultsSection } from "./components/DefaultsSection";
import { VariantMatrix } from "./components/VariantMatrix";
import { VariantPreviewList } from "./components/VariantPreviewList";
import { messages } from "./messages";
import styles from "./ProductVariantGenerator.module.css";
import { ProductVariantGeneratorProps } from "./types";
import { useVariantGenerator } from "./useVariantGenerator";
import { toBulkCreateInputs } from "./utils";

// Maximum variants that can be created in a single batch (API performance consideration)
const VARIANT_LIMIT = 100;
// Show confirmation dialog when creating this many or more variants
const CONFIRMATION_THRESHOLD = 30;

type ViewMode = "grid" | "list";

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
  existingVariants,
  onSubmit,
}: ProductVariantGeneratorProps) => {
  const intl = useIntl();
  const [confirmState, setConfirmState] = useState<ConfirmButtonTransitionState>("default");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMissingDefaultsWarning, setShowMissingDefaultsWarning] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
    canShowMatrix,
    reset,
  } = useVariantGenerator({
    variantAttributes,
    existingVariants,
    defaultSkuPrefix,
  });

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      reset();
      setConfirmState("default");
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

    try {
      const inputs = toBulkCreateInputs(
        attributes,
        selections,
        defaults,
        warehouses,
        existingCombinations,
      );

      await onSubmit(inputs);
      setConfirmState("success");
    } catch {
      setConfirmState("error");
    }
  }, [attributes, selections, defaults, warehouses, existingCombinations, onSubmit]);

  const isMissingDefaults = !defaults.skuEnabled && !defaults.stockEnabled;

  const proceedWithGeneration = useCallback(() => {
    setShowMissingDefaultsWarning(false);

    if (needsConfirmation) {
      setShowConfirmation(true);
    } else {
      executeGenerate();
    }
  }, [needsConfirmation, executeGenerate]);

  const handleGenerate = useCallback(() => {
    if (!canGenerate || isOverLimit) return;

    if (isMissingDefaults) {
      setShowMissingDefaultsWarning(true);
    } else if (needsConfirmation) {
      setShowConfirmation(true);
    } else {
      executeGenerate();
    }
  }, [canGenerate, isOverLimit, isMissingDefaults, needsConfirmation, executeGenerate]);

  const handleClose = useCallback(() => {
    if (confirmState !== "loading") {
      onClose();
    }
  }, [confirmState, onClose]);

  const hasVariantAttributes = variantAttributes.length > 0;

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
              {/* Attribute selectors */}
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

              {/* Defaults row with view toggle */}
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

              {/* Preview */}
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

              {/* Warnings and errors */}
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
          <ConfirmButton
            transitionState={confirmState}
            onClick={handleGenerate}
            disabled={!canGenerate || isOverLimit}
          >
            {intl.formatMessage(messages.generate, { count: newVariantsCount })}
          </ConfirmButton>
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
