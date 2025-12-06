import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { Switch } from "@saleor/macaw-ui-next";
import { Grid3x3, List } from "lucide-react";

import { ProductListViewType } from "../ProductListPage";

interface ProductListViewSwitchProps {
  defaultValue: ProductListViewType;
  setProductListViewType: (value: ProductListViewType) => void;
}

export const ProductListViewSwitch = ({
  defaultValue,
  setProductListViewType,
}: ProductListViewSwitchProps) => (
  <Switch
    defaultValue={defaultValue}
    onValueChange={value => {
      setProductListViewType(value as ProductListViewType);
    }}
  >
    <Switch.Item id="datagrid" value="datagrid" data-test-id="datagrid-view-button">
      <List size={iconSize.medium} strokeWidth={iconStrokeWidth} />
    </Switch.Item>
    <Switch.Item id="tile" value="tile" data-test-id="tile-view-button">
      <Grid3x3 size={iconSize.medium} strokeWidth={iconStrokeWidth} />
    </Switch.Item>
  </Switch>
);
