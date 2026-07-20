import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { type DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type VariantAttributeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { productTypeUrl } from "@dashboard/productTypes/urls";
import { Box, Button, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import { ChevronLeft, ChevronRight, CopyPlus } from "lucide-react";
import { useCallback } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import messages from "../messages";
import styles from "./ProductVariantsHeader.module.css";

const localMessages = defineMessages({
  generatorRequiresConfig: {
    id: "8FDx9i",
    defaultMessage:
      "To use the Generator, this product type needs:{newline}{newline}• 'Product type uses Variant Attributes' enabled{newline}• Selection variant attributes defined",
    description:
      "tooltip when generate variants is disabled due to product type configuration (hasVariants=false or no selection attributes)",
  },
  configureInProductType: {
    id: "9+iLpf",
    defaultMessage: "Configure in product type settings",
    description: "link text to product type settings",
  },
  unsupportedRequiredAttributes: {
    id: "gDvd3v",
    defaultMessage:
      "Required attributes with unsupported types:{newline}{attributes}{newline}{newline}To use the Generator:{newline}1. Make them optional in product type{newline}2. Generate variants{newline}3. Set values manually{newline}4. Restore required setting",
    description:
      "tooltip when generate variants is disabled due to unsupported required attributes",
  },
});

interface GenerateVariantsButtonProps {
  productTypeId: string;
  hasVariants: boolean;
  hasVariantAttributes: boolean;
  unsupportedRequiredAttributes: VariantAttributeFragment[];
  onGenerateVariants: () => void;
}

const GenerateVariantsButton = ({
  productTypeId,
  hasVariants,
  hasVariantAttributes,
  unsupportedRequiredAttributes,
  onGenerateVariants,
}: GenerateVariantsButtonProps) => {
  const intl = useIntl();

  const hasUnsupportedRequired = unsupportedRequiredAttributes.length > 0;
  const needsProductTypeConfig = !hasVariants || !hasVariantAttributes;
  const isDisabled = needsProductTypeConfig || hasUnsupportedRequired;

  // Render tooltip content based on the reason for being disabled
  const renderTooltipContent = () => {
    // Product type configuration issues (hasVariants=false or no selection attributes)
    if (needsProductTypeConfig) {
      return (
        <Box display="flex" flexDirection="column" gap={2}>
          <Text size={2} color="default1" style={{ whiteSpace: "pre-line" }}>
            {intl.formatMessage(localMessages.generatorRequiresConfig, {
              newline: "\n",
            })}
          </Text>
          <Link to={productTypeUrl(productTypeId)} style={{ color: "inherit" }}>
            <Text size={2} color="accent1" textDecoration="underline">
              {intl.formatMessage(localMessages.configureInProductType)}
            </Text>
          </Link>
        </Box>
      );
    }

    // Unsupported required attributes
    if (hasUnsupportedRequired) {
      const formatInputType = (type: string | null | undefined): string => {
        if (!type) return "Unknown";

        // Convert SCREAMING_SNAKE_CASE to Title Case
        return type
          .toLowerCase()
          .split("_")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      const attributesList = unsupportedRequiredAttributes
        .map(a => `• ${a.name} (${formatInputType(a.inputType)})`)
        .join("\n");

      return (
        <Text size={2} color="default1" style={{ whiteSpace: "pre-line" }}>
          {intl.formatMessage(localMessages.unsupportedRequiredAttributes, {
            attributes: attributesList,
            newline: "\n",
          })}
        </Text>
      );
    }

    return null;
  };

  const tooltipContent = renderTooltipContent();

  return (
    <Tooltip open={tooltipContent ? undefined : false}>
      <Tooltip.Trigger>
        <Button
          variant="secondary"
          disabled={isDisabled}
          onClick={onGenerateVariants}
          data-test-id="generate-variants-button"
          icon={<CopyPlus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
        >
          <FormattedMessage
            defaultMessage="Generate variants"
            id="vyVVAW"
            description="generate variants button"
          />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Arrow />
        {tooltipContent}
      </Tooltip.Content>
    </Tooltip>
  );
};

interface ProductVariantsHeaderProps extends DatagridRenderHeaderProps {
  productId: string;
  productTypeId: string;
  productName: string;
  /** Whether the product type supports multiple variants with attributes */
  hasVariants: boolean;
  hasVariantAttributes: boolean;
  /** Required non-selection attributes with unsupported types that block the generator */
  unsupportedRequiredAttributes: VariantAttributeFragment[];
  onGenerateVariants: () => void;
  variantsSearch?: string;
  onVariantsSearchChange?: (query: string) => void;
  variantsPageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  onVariantsNextPage?: () => void;
  onVariantsPreviousPage?: () => void;
  variantsRangeLabel?: string | null;
  onGuardUnsavedAction?: (action: () => void) => void;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  deleteDisabled?: boolean;
  pendingVariantDeleteCount?: number;
}

export const ProductVariantsHeader = ({
  addRowOnDatagrid,
  isAnimationOpenFinished,
  isFullscreenOpen,
  toggleFullscreen,
  productId,
  productTypeId,
  productName,
  hasVariants,
  hasVariantAttributes,
  unsupportedRequiredAttributes,
  onGenerateVariants,
  variantsSearch = "",
  onVariantsSearchChange,
  variantsPageInfo,
  onVariantsNextPage,
  onVariantsPreviousPage,
  variantsRangeLabel,
  onGuardUnsavedAction,
  selectedCount = 0,
  onDeleteSelected,
  deleteDisabled = false,
  pendingVariantDeleteCount = 0,
}: ProductVariantsHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const handleAddNewRow = useCallback(() => {
    if (isFullscreenOpen) {
      addRowOnDatagrid();

      return;
    }

    navigate(productVariantAddUrl(productId));
  }, [isFullscreenOpen, addRowOnDatagrid, navigate, productId]);

  const headerTitle = isAnimationOpenFinished
    ? intl.formatMessage(messages.fullScreenTitle, {
        name: productName,
      })
    : intl.formatMessage(messages.title);

  const showToolbar = Boolean(onVariantsSearchChange || variantsPageInfo);
  const runGuarded = onGuardUnsavedAction ?? ((action: () => void) => action());

  return (
    <div className={styles.header}>
      <DatagridHeader title={headerTitle}>
        <DatagridHeader.ButtonFullScreen isOpen={isFullscreenOpen} onToggle={toggleFullscreen}>
          {isFullscreenOpen ? (
            <FormattedMessage id="QjPJ78" defaultMessage="Close" description="close full-screen" />
          ) : (
            <FormattedMessage
              id="9OZ/fr"
              defaultMessage="Bulk edit"
              description="open full-screen mode with bulk edit"
            />
          )}
        </DatagridHeader.ButtonFullScreen>
        <DatagridHeader.ButtonAddRow onAddRow={handleAddNewRow}>
          <FormattedMessage defaultMessage="Add variant" id="3C3Nj5" description="button" />
        </DatagridHeader.ButtonAddRow>
        {!isFullscreenOpen && (
          <GenerateVariantsButton
            productTypeId={productTypeId}
            hasVariants={hasVariants}
            hasVariantAttributes={hasVariantAttributes}
            unsupportedRequiredAttributes={unsupportedRequiredAttributes}
            onGenerateVariants={onGenerateVariants}
          />
        )}
      </DatagridHeader>
      {showToolbar && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          paddingX={6}
          paddingBottom={4}
        >
          {onVariantsSearchChange ? (
            <Box __maxWidth="260px" width="100%">
              <Input
                size="small"
                value={variantsSearch}
                onChange={event => {
                  const nextQuery = event.target.value;

                  if (nextQuery === variantsSearch) {
                    return;
                  }

                  runGuarded(() => onVariantsSearchChange(nextQuery));
                }}
                onKeyDown={event => {
                  if (event.key !== "Escape" || !variantsSearch) {
                    return;
                  }

                  event.preventDefault();
                  runGuarded(() => onVariantsSearchChange(""));
                  event.currentTarget.blur();
                }}
                placeholder={intl.formatMessage({
                  id: "W5DAXI",
                  defaultMessage: "Search variants by name or SKU",
                  description: "product variants grid search placeholder",
                })}
              />
            </Box>
          ) : (
            <Box />
          )}
          <Box display="flex" alignItems="center" gap={3}>
            {selectedCount > 0 && onDeleteSelected && (
              <Button
                data-test-id="bulk-delete-button"
                variant="secondary"
                onClick={onDeleteSelected}
                disabled={deleteDisabled}
              >
                <FormattedMessage {...messages.deleteSelected} values={{ count: selectedCount }} />
              </Button>
            )}
            {variantsRangeLabel && (
              <Text size={2} color="default2" data-test-id="variants-range-label">
                {pendingVariantDeleteCount > 0
                  ? intl.formatMessage(messages.rangeWithPendingDeletes, {
                      range: variantsRangeLabel,
                      count: pendingVariantDeleteCount,
                    })
                  : variantsRangeLabel}
              </Text>
            )}
            {variantsPageInfo && (
              <Box display="flex" gap={2}>
                <Button
                  variant="secondary"
                  disabled={!variantsPageInfo.hasPreviousPage}
                  onClick={() => runGuarded(() => onVariantsPreviousPage?.())}
                  icon={
                    <ChevronLeft
                      size={iconSize.medium}
                      strokeWidth={iconStrokeWidthBySize.medium}
                    />
                  }
                />
                <Button
                  variant="secondary"
                  disabled={!variantsPageInfo.hasNextPage}
                  onClick={() => runGuarded(() => onVariantsNextPage?.())}
                  icon={
                    <ChevronRight
                      size={iconSize.medium}
                      strokeWidth={iconStrokeWidthBySize.medium}
                    />
                  }
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};
