import { IconButton } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";

import { CardMenuItem } from "../../../components/CardMenu";
import useStyles from "../../../components/Datagrid/styles";

interface OrderDetailsRowActionsProps {
  menuItems: CardMenuItem[];
  onShowMetadata: () => void;
  disabled?: boolean;
}

export const OrderDetailsRowActions = ({
  menuItems,
  onShowMetadata,
  disabled,
}: OrderDetailsRowActionsProps) => {
  const classes = useStyles({ showMetadataButton: true });
  const firstMenuItem = menuItems[0];

  return (
    <div className={classes.rowAction}>
      <IconButton
        data-test-id="show-metadata-button"
        disabled={disabled}
        onClick={onShowMetadata}
        className={classes.ghostIcon}
        variant="ghost"
        title="Show metadata"
      >
        <Code size={20} />
      </IconButton>
      {firstMenuItem?.Icon && (
        <>
          <Box height="100%" __width={1} backgroundColor={"default3"} />
          <IconButton
            data-test-id="row-action-button"
            disabled={disabled || firstMenuItem.disabled}
            onClick={() => firstMenuItem.onSelect()}
            className={classes.ghostIcon}
            variant="ghost"
            title="Open product detail"
          >
            {firstMenuItem.Icon}
          </IconButton>
        </>
      )}
    </div>
  );
};
