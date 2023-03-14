import { GenericAppIcon, MenuIcon, Switch } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";

import { ProductListViewType } from "../ProductListPage";

interface ProductListViewSwitchProps {
  defaultValue: ProductListViewType;
  setProductListViewType: (value: ProductListViewType) => void;
}

export const ProductListViewSwitch = ({
  defaultValue,
  setProductListViewType,
}: ProductListViewSwitchProps) => {
  const getIconColor = useCallback(
    (value: ProductListViewType) => {
      if (value === defaultValue) {
        return "iconNeutralDefault";
      }

      return "iconNeutralPlain";
    },
    [defaultValue],
  );

  return (
    <Switch
      defaultValue={defaultValue}
      onValueChange={value => {
        setProductListViewType(value as ProductListViewType);
      }}
    >
      <Switch.Item id="datagrid" value="datagrid">
        <MenuIcon size="medium" color={getIconColor("datagrid")} />
      </Switch.Item>
      <Switch.Item id="tile" value="tile">
        <GenericAppIcon size="medium" color={getIconColor("tile")} />
      </Switch.Item>
    </Switch>
  );
};
