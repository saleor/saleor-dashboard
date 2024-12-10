import { Box, List, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

export interface MenuItem {
  id: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
}

interface SubMenuProps {
  menuItems: MenuItem[];
}

export const SubMenu = ({ menuItems }: SubMenuProps) => {
  return (
    <List backgroundColor="default1" __minWidth={326} borderRadius={3}>
      {menuItems.map(({ id, title, description, icon, onClick }, idx) => {
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
            borderColor="default1"
          >
            <Box display="flex" gap={3} alignItems="center">
              {icon}
              <Text data-test-id={String(title).toLowerCase()} size={4} fontWeight="bold">
                {title}
              </Text>
            </Box>
            <Text>{description}</Text>
          </List.Item>
        );
      })}
    </List>
  );
};
