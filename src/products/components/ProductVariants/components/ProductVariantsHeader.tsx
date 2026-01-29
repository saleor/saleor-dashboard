import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { VariantAttributeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { rippleVariantGenerator } from "@dashboard/products/ripples/variantGenerator";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button, Tooltip } from "@saleor/macaw-ui-next";
import { CopyPlus } from "lucide-react";
import { useCallback } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";
import styles from "./ProductVariantsHeader.module.css";

const localMessages = defineMessages({
  unsupportedRequiredAttributes: {
    id: "4YtpqB",
    defaultMessage:
      "Required attributes ({attributes}) are not currently supported by Generator.{newline}{newline}To use the Generator:{newline}1. Make them optional in product type{newline}2. Generate variants{newline}3. Set values manually{newline}4. Restore required setting",
    description:
      "tooltip when generate variants is disabled due to unsupported required attributes",
  },
  noSelectionAttributes: {
    id: "lEx2zw",
    defaultMessage: "No selection attributes defined for this product type.",
    description: "tooltip when generate variants is disabled due to no selection attributes",
  },
});

interface GenerateVariantsButtonProps {
  hasVariantAttributes: boolean;
  unsupportedRequiredAttributes: VariantAttributeFragment[];
  onGenerateVariants: () => void;
}

const GenerateVariantsButton = ({
  hasVariantAttributes,
  unsupportedRequiredAttributes,
  onGenerateVariants,
}: GenerateVariantsButtonProps) => {
  const intl = useIntl();

  const hasUnsupportedRequired = unsupportedRequiredAttributes.length > 0;
  const isDisabled = !hasVariantAttributes || hasUnsupportedRequired;

  // Determine which tooltip to show (check unsupported required first - more specific)
  const getTooltipMessage = () => {
    if (hasUnsupportedRequired) {
      return intl.formatMessage(localMessages.unsupportedRequiredAttributes, {
        attributes: unsupportedRequiredAttributes.map(a => a.name).join(", "),
        newline: "\n",
      });
    }

    if (!hasVariantAttributes) {
      return intl.formatMessage(localMessages.noSelectionAttributes);
    }

    return null;
  };

  const tooltipMessage = getTooltipMessage();

  return (
    <Tooltip open={tooltipMessage ? undefined : false}>
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
        <span style={{ whiteSpace: "pre-line" }}>{tooltipMessage}</span>
      </Tooltip.Content>
    </Tooltip>
  );
};

interface ProductVariantsHeaderProps extends DatagridRenderHeaderProps {
  productId: string;
  productName: string;
  hasVariantAttributes: boolean;
  /** Required non-selection attributes with unsupported types that block the generator */
  unsupportedRequiredAttributes: VariantAttributeFragment[];
  onGenerateVariants: () => void;
}

export const ProductVariantsHeader = ({
  addRowOnDatagrid,
  isAnimationOpenFinished,
  isFullscreenOpen,
  toggleFullscreen,
  productId,
  productName,
  hasVariantAttributes,
  unsupportedRequiredAttributes,
  onGenerateVariants,
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
        {!isFullscreenOpen && (
          <Box display="flex" alignItems="center" gap={2}>
            <GenerateVariantsButton
              hasVariantAttributes={hasVariantAttributes}
              unsupportedRequiredAttributes={unsupportedRequiredAttributes}
              onGenerateVariants={onGenerateVariants}
            />
            <Ripple model={rippleVariantGenerator} />
          </Box>
        )}
        <DatagridHeader.ButtonAddRow onAddRow={handleAddNewRow}>
          <FormattedMessage defaultMessage="Add variant" id="3C3Nj5" description="button" />
        </DatagridHeader.ButtonAddRow>
      </DatagridHeader>
    </div>
  );
};
