import { rightColumnBoxShadow } from "@dashboard/components/Datagrid/ColumnPicker/utils";
import { IconButton } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { Code } from "lucide-react";
import { IntlShape } from "react-intl";

import { CardMenuItem } from "../../../components/CardMenu";
import useStyles from "../../../components/Datagrid/styles";
import { messages } from "./messages";

interface OrderDetailsRowActionsProps {
  menuItems: CardMenuItem[];
  onShowMetadata: () => void;
  disabled?: boolean;
  intl: IntlShape;
}

export const OrderDetailsRowActions = ({
  menuItems,
  onShowMetadata,
  disabled,
  intl,
}: OrderDetailsRowActionsProps) => {
  const classes = useStyles({ showMetadataButton: true });
  const firstMenuItem = menuItems[0];

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
            title={intl.formatMessage(messages.openProductDetail)}
          >
            {firstMenuItem.Icon}
          </IconButton>
        </>
      )}
    </div>
  );
};
