import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Switch } from "@saleor/macaw-ui-next";
import { Grid3x3, List } from "lucide-react";
import { defineMessages, useIntl } from "react-intl";

import { type ProductListViewType } from "../ProductListPage";
import styles from "./ProductListViewSwitch.module.css";

interface ProductListViewSwitchProps {
  defaultValue: ProductListViewType;
  setProductListViewType: (value: ProductListViewType) => void;
}

const iconProps = {
  size: iconSize.small,
  strokeWidth: iconStrokeWidthBySize.small,
  className: styles.icon,
} as const;

const messages = defineMessages({
  listView: {
    id: "suAexp",
    defaultMessage: "List view",
    description: "aria label for list view button",
  },
  gridView: {
    id: "+BkNuT",
    defaultMessage: "Grid view",
    description: "aria label for grid view button",
  },
});

export const ProductListViewSwitch = ({
  defaultValue,
  setProductListViewType,
}: ProductListViewSwitchProps): JSX.Element => {
  const intl = useIntl();
  const listViewLabel = intl.formatMessage(messages.listView);
  const gridViewLabel = intl.formatMessage(messages.gridView);

  return (
    <Switch
      defaultValue={defaultValue}
      onValueChange={value => {
        setProductListViewType(value as ProductListViewType);
      }}
    >
      <Switch.Item
        id="datagrid"
        value="datagrid"
        data-test-id="datagrid-view-button"
        title={listViewLabel}
        aria-label={listViewLabel}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={7}
      >
        <List {...iconProps} />
      </Switch.Item>
      <Switch.Item
        id="tile"
        value="tile"
        data-test-id="tile-view-button"
        title={gridViewLabel}
        aria-label={gridViewLabel}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={7}
      >
        <Grid3x3 {...iconProps} />
      </Switch.Item>
    </Switch>
  );
};
