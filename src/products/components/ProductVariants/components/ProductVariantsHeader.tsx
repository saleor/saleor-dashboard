import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import useNavigator from "@dashboard/hooks/useNavigator";
import { productVariantAddUrl } from "@dashboard/products/urls";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";

export const ProductVariantsHeader = ({
  addRowOnDatagrid,
  isAnimationOpenFinished,
  isFullscreenOpen,
  toggleFullscreen,
  productId,
  productName,
}: DatagridRenderHeaderProps & { productId: string; productName: string }) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const handleAddNewRow = () => {
    if (isFullscreenOpen) {
      addRowOnDatagrid();

      return;
    }

    navigate(productVariantAddUrl(productId));
  };

  const headerTitle = isAnimationOpenFinished
    ? intl.formatMessage(messages.fullScreenTitle, {
        name: productName,
      })
    : intl.formatMessage(messages.title);

  return (
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
    </DatagridHeader>
  );
};
