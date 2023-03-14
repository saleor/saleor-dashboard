import { Switch, ViewListIcon, ViewTilesIcon } from "@saleor/macaw-ui/next";
import React from "react";

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
    <Switch.Item id="datagrid" value="datagrid">
      <ViewListIcon size="medium" />
    </Switch.Item>
    <Switch.Item id="tile" value="tile">
      <ViewTilesIcon size="medium" />
    </Switch.Item>
  </Switch>
);
