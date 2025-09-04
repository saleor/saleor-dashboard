import { Switch, ViewListIcon, ViewTilesIcon } from "@saleor/macaw-ui-next";

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
      <ViewListIcon size="medium" />
    </Switch.Item>
    <Switch.Item id="tile" value="tile" data-test-id="tile-view-button">
      <ViewTilesIcon size="medium" />
    </Switch.Item>
  </Switch>
);
