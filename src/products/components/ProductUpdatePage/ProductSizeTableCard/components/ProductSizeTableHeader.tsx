import { Header as DatagridHeader } from "@dashboard/components/Datagrid/components/Header";
import { DatagridRenderHeaderProps } from "@dashboard/components/Datagrid/Datagrid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "../messages";

export const ProductSizeTableHeader = ({
  isAnimationOpenFinished,
  isFullscreenOpen,
  toggleFullscreen,
  productName,
}: DatagridRenderHeaderProps & { productName: string }) => {
  const intl = useIntl();

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
            id="u/M+GQ"
            defaultMessage="Full screen"
            description="open full-screen mode"
          />
        )}
      </DatagridHeader.ButtonFullScreen>
    </DatagridHeader>
  );
};
