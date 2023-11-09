import { List, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

export interface MenuItem {
  id: string;
  title: ReactNode;
  description: ReactNode;
  onClick: () => void;
}

interface SubMenuProps {
  menuItems: MenuItem[];
}

export const SubMenu = ({ menuItems }: SubMenuProps) => {
  return (
    <List
      backgroundColor="surfaceNeutralPlain"
      __minWidth={326}
      borderRadius={3}
    >
      {menuItems.map(({ id, title, description, onClick }, idx) => {
        const isLastItem = idx === menuItems.length - 1;

        return (
          <List.Item
            key={id}
            onClick={onClick}
            display="grid"
            paddingX={3}
            paddingY={2}
            borderBottomStyle={isLastItem ? "none" : "solid"}
            borderBottomWidth={1}
            borderColor="neutralPlain"
          >
            <Text
              data-test-id={String(title).toLowerCase()}
              variant="bodyStrong"
            >
              {title}
            </Text>
            <Text>{description}</Text>
          </List.Item>
        );
      })}
    </List>
  );
};
