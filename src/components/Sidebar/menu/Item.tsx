import React from "react";

import { Divider } from "./Divider";
import { ItemGroup } from "./ItemGroup";
import { SingleItem } from "./SingleItem";
import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

export const MenuItem: React.FC<Props> = props => {
  const { menuItem } = props;
  switch (menuItem.type) {
    case "item":
      return <SingleItem {...props} />;
    case "itemGroup":
      return <ItemGroup {...props} />;
    case "divider":
      return <Divider menuItem={menuItem} />;
  }
};
