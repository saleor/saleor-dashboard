import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { CopyPlus } from "lucide-react";
import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";
import styles from "./ProductVariantsHeader.module.css";

interface ProductVariantsHeaderProps extends DatagridRenderHeaderProps {
  productId: string;
  productName: string;
  hasVariantAttributes: boolean;
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
          <Tooltip open={hasVariantAttributes ? false : undefined}>
            <Tooltip.Trigger>
              <Button
                variant="secondary"
                disabled={!hasVariantAttributes}
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
              <FormattedMessage
                defaultMessage="No variant attributes — nothing to generate"
                id="/W3dtv"
                description="tooltip when generate variants is disabled"
              />
            </Tooltip.Content>
          </Tooltip>
        )}
        <DatagridHeader.ButtonAddRow onAddRow={handleAddNewRow}>
          <FormattedMessage defaultMessage="Add variant" id="3C3Nj5" description="button" />
        </DatagridHeader.ButtonAddRow>
      </DatagridHeader>
    </div>
  );
};
