import { Menu, type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { rightColumnBoxShadow } from "@dashboard/components/Datagrid/ColumnPicker/utils";
import useStyles from "@dashboard/components/Datagrid/styles";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { buttonMessages } from "@dashboard/intl";
import { IconButton } from "@saleor/macaw-ui";
import { Box, Button } from "@saleor/macaw-ui-next";
import { Code, EllipsisVertical } from "lucide-react";
import { type IntlShape } from "react-intl";

import { messages } from "./messages";

interface OrderLineMatrixRowActionsProps {
  menuItems: TopNavMenuItem[];
  onShowMetadata: () => void;
  disabled?: boolean;
  intl: IntlShape;
}

export const OrderLineMatrixRowActions = ({
  menuItems,
  onShowMetadata,
  disabled,
  intl,
}: OrderLineMatrixRowActionsProps): JSX.Element => {
  const classes = useStyles({ showMetadataButton: true });
  const hasLineActionsMenu = menuItems.length > 1;
  const productMenuItem = menuItems[0];

  return (
    <div
      className={classes.rowAction}
      style={{
        boxShadow: rightColumnBoxShadow,
        gridTemplateColumns: hasLineActionsMenu || productMenuItem?.icon ? "1fr auto 1fr" : "1fr",
      }}
    >
      <IconButton
        data-test-id="show-metadata-button"
        disabled={disabled}
        onClick={onShowMetadata}
        className={classes.ghostIcon}
        variant="ghost"
        title={intl.formatMessage(messages.showMetadata)}
      >
        <Code size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </IconButton>
      {hasLineActionsMenu ? (
        <>
          <Box height="100%" __width={1} backgroundColor={"default3"} />
          <Menu
            items={menuItems}
            trigger={
              <Button
                variant="tertiary"
                disabled={disabled}
                className={classes.ghostIcon}
                data-test-id="show-more-button"
                title={intl.formatMessage(buttonMessages.moreOptions)}
                icon={
                  <EllipsisVertical
                    size={iconSize.small}
                    strokeWidth={iconStrokeWidthBySize.small}
                  />
                }
              />
            }
          />
        </>
      ) : (
        productMenuItem?.icon && (
          <>
            <Box height="100%" __width={1} backgroundColor={"default3"} />
            <IconButton
              data-test-id="row-action-button"
              disabled={disabled || productMenuItem.disabled}
              onClick={() => productMenuItem.onSelect({})}
              className={classes.ghostIcon}
              variant="ghost"
              title={productMenuItem.label}
            >
              {productMenuItem.icon}
            </IconButton>
          </>
        )
      )}
    </div>
  );
};
