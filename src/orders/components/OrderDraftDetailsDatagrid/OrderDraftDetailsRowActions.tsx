import { rightColumnBoxShadow } from "@dashboard/components/Datagrid/ColumnPicker/utils";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { rippleOrderLineDiscountDiscoverability } from "@dashboard/orders/ripples/orderLineDiscountDiscoverability";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { IconButton } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { Code, EllipsisVertical } from "lucide-react";
import { type IntlShape } from "react-intl";

import CardMenu, { type CardMenuItem } from "../../../components/CardMenu";
import useStyles from "../../../components/Datagrid/styles";
import { messages } from "./messages";

interface OrderDraftDetailsRowActionsProps {
  menuItems: CardMenuItem[];
  onShowMetadata: () => void;
  disabled?: boolean;
  intl: IntlShape;
  showDiscountRipple?: boolean;
}

export const OrderDraftDetailsRowActions = ({
  menuItems,
  onShowMetadata,
  disabled,
  intl,
  showDiscountRipple = false,
}: OrderDraftDetailsRowActionsProps) => {
  const classes = useStyles({ showMetadataButton: true });

  return (
    <div
      className={classes.rowAction}
      style={{
        boxShadow: rightColumnBoxShadow,
        gridTemplateColumns: "1fr auto 1fr",
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
      <Box height="100%" __width={1} backgroundColor={"default3"} />
      <Box position="relative">
        <CardMenu
          disabled={disabled}
          autoFocusItem={false}
          showMenuIcon={true}
          Icon={() => (
            <EllipsisVertical size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          )}
          IconButtonProps={{
            className: classes.ghostIcon,
            variant: "ghost",
            hoverOutline: false,
            state: "default",
          }}
          menuItems={menuItems}
        />
        {showDiscountRipple && (
          <Box position="absolute" __top="-4px" __left="-4px">
            <Ripple model={rippleOrderLineDiscountDiscoverability} />
          </Box>
        )}
      </Box>
    </div>
  );
};
