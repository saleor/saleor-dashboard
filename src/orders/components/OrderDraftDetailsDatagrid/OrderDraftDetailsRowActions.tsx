import { rightColumnBoxShadow } from "@dashboard/components/Datagrid/ColumnPicker/utils";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { IconButton } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { Code, EllipsisVertical } from "lucide-react";
import { IntlShape } from "react-intl";

import CardMenu, { CardMenuItem } from "../../../components/CardMenu";
import useStyles from "../../../components/Datagrid/styles";
import { messages } from "./messages";

interface OrderDraftDetailsRowActionsProps {
  menuItems: CardMenuItem[];
  onShowMetadata: () => void;
  disabled?: boolean;
  intl: IntlShape;
}

export const OrderDraftDetailsRowActions = ({
  menuItems,
  onShowMetadata,
  disabled,
  intl,
}: OrderDraftDetailsRowActionsProps) => {
  const classes = useStyles({ showMetadataButton: true });

  return (
    <div
      className={classes.rowAction}
      style={{
        boxShadow: rightColumnBoxShadow,
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
    </div>
  );
};
