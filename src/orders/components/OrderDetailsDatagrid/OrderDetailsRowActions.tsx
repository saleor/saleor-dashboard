import { IconButton } from "@saleor/macaw-ui";
import { Divider } from "@saleor/macaw-ui-next";
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
  const classes = useStyles({});
  const firstMenuItem = menuItems[0];

  return (
    <div
      className={classes.rowAction}
      style={{ display: "flex", gap: "4px", width: "80px", justifyContent: "center" }}
    >
      <IconButton
        data-test-id="show-metadata-button"
        disabled={disabled}
        onClick={onShowMetadata}
        className={classes.ghostIcon}
        variant="ghost"
      >
        <Code size={20} />
      </IconButton>
      <Divider />
      {firstMenuItem?.Icon && (
        <IconButton
          data-test-id="row-action-button"
          disabled={disabled || firstMenuItem.disabled}
          onClick={() => firstMenuItem.onSelect()}
          className={classes.ghostIcon}
          variant="ghost"
        >
          {firstMenuItem.Icon}
        </IconButton>
      )}
    </div>
  );
};
