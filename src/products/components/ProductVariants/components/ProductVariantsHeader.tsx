import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { Box, Button, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import { CopyPlus, MoreVertical } from "lucide-react";
import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";

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
    <DatagridHeader title={headerTitle}>
      {hasVariantAttributes && !isFullscreenOpen && (
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              variant="tertiary"
              icon={<MoreVertical size={20} />}
              data-test-id="variants-menu-button"
            />
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <List
              padding={2}
              borderRadius={4}
              boxShadow="defaultOverlay"
              backgroundColor="default1"
            >
              <Dropdown.Item>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  onClick={onGenerateVariants}
                  data-test-id="generate-variants-button"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <CopyPlus size={16} />
                    <Text>
                      <FormattedMessage
                        defaultMessage="Generate variants"
                        id="ZcbW+/"
                        description="generate variants menu item"
                      />
                    </Text>
                  </Box>
                </List.Item>
              </Dropdown.Item>
            </List>
          </Dropdown.Content>
        </Dropdown>
      )}
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
    </DatagridHeader>
  );
};
