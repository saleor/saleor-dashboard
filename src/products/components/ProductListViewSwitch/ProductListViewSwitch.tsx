import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Switch } from "@saleor/macaw-ui-next";
import { Grid3x3, List } from "lucide-react";

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

export const ProductListViewSwitch = ({
  defaultValue,
  setProductListViewType,
}: ProductListViewSwitchProps): JSX.Element => (
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
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={7}
    >
      <Grid3x3 {...iconProps} />
    </Switch.Item>
  </Switch>
);
