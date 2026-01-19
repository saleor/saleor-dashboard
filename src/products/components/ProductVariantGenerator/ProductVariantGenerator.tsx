import ActionDialog from "@dashboard/components/ActionDialog";
import BackButton from "@dashboard/components/BackButton";
import { Callout } from "@dashboard/components/Callout/Callout";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { useWarehouseListQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
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

export const ProductVariantGenerator = ({
  open,
  onClose,
  variantAttributes,
  existingVariants,
  onSubmit,
}: ProductVariantGeneratorProps) => {
  const intl = useIntl();
  const [confirmState, setConfirmState] = useState<ConfirmButtonTransitionState>("default");
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const {
    attributes,
    defaults,
    setDefaults,
    toggleValue,
    selectAllValues,
    deselectAllValues,
    previews,
    newVariantsCount,
    existingCount,
    existingCombinations,
    canGenerate,
    reset,
  } = useVariantGenerator({
    variantAttributes,
    existingVariants,
  });

  // Determine if matrix view is available (exactly 2 attributes with selections)
  const canShowMatrix = useMemo(() => {
    const selectedAttrs = attributes.filter(attr => attr.values.some(v => v.selected));

    return selectedAttrs.length === 2;
  }, [attributes]);

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

  const executeGenerate = useCallback(async () => {
    setConfirmState("loading");
    setShowConfirmation(false);

    try {
      const inputs = toBulkCreateInputs(attributes, defaults, warehouses, existingCombinations);

      await onSubmit(inputs);
      setConfirmState("success");
    } catch {
      setConfirmState("error");
    }
  }, [attributes, defaults, warehouses, existingCombinations, onSubmit]);

  const handleGenerate = useCallback(() => {
    if (!canGenerate || isOverLimit) return;

    if (needsConfirmation) {
      setShowConfirmation(true);
    } else {
      executeGenerate();
    }
  }, [canGenerate, isOverLimit, needsConfirmation, executeGenerate]);

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
              <Box className={styles.attributesSection}>
                {attributes.map(attr => (
                  <AttributeValueChips
                    key={attr.id}
                    attribute={attr}
                    onToggleValue={valueId => toggleValue(attr.id, valueId)}
                    onSelectAll={() => selectAllValues(attr.id)}
                    onDeselectAll={() => deselectAllValues(attr.id)}
                  />
                ))}
              </Box>

              {/* Defaults row with view toggle */}
              <Box className={styles.controlsRow}>
                <DefaultsSection defaults={defaults} onChange={setDefaults} />
                <Box className={styles.viewToggle}>
                  <Button
                    variant={viewMode === "grid" ? "primary" : "secondary"}
                    size="small"
                    onClick={() => setViewMode("grid")}
                    disabled={!canShowMatrix}
                    aria-label={intl.formatMessage(messages.gridView)}
                    data-test-id="view-toggle-grid"
                  >
                    <LayoutGrid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "primary" : "secondary"}
                    size="small"
                    onClick={() => setViewMode("list")}
                    disabled={previews.length === 0}
                    aria-label={intl.formatMessage(messages.listView)}
                    data-test-id="view-toggle-list"
                  >
                    <List size={16} />
                  </Button>
                </Box>
              </Box>

              {/* Preview */}
              <Box className={styles.previewContent}>
                {viewMode === "grid" && canShowMatrix ? (
                  <VariantMatrix
                    attributes={attributes}
                    existingCombinations={existingCombinations}
                  />
                ) : (
                  <VariantPreviewList previews={previews} />
                )}
              </Box>

              {/* Warning banner */}
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

              {/* Limit error */}
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

      {/* Confirmation dialog for large batches */}
      <ActionDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={executeGenerate}
        confirmButtonState={confirmState}
        title={intl.formatMessage(messages.confirmTitle, { count: newVariantsCount })}
        confirmButtonLabel={intl.formatMessage(messages.continueButton)}
      >
        <Text>{intl.formatMessage(messages.confirmDescription, { count: newVariantsCount })}</Text>
      </ActionDialog>
    </DashboardModal>
  );
};
