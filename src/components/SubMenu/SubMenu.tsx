import { Box, List, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

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

/**
 * Title + description action menu (e.g. Add code).
 * Typography matches DetailSettingToggleRow: title size 3 medium, hint size 2 default2.
 */
export const SubMenu = ({ menuItems }: SubMenuProps): JSX.Element => (
  <List padding={1} __minWidth="100%">
    {menuItems.map(({ id, title, description, icon, onClick }) => (
      <List.Item
        key={id}
        onClick={onClick}
        borderRadius={3}
        paddingX={3}
        paddingY={2}
        data-test-id={typeof title === "string" ? title.toLowerCase() : id}
      >
        <Box display="flex" gap={3} alignItems="flex-start">
          {icon ? (
            <Box paddingTop={0.5} color="default2" flexShrink="0">
              {icon}
            </Box>
          ) : null}
          <Box display="flex" flexDirection="column" gap={0.5} minWidth={0}>
            <Text size={3} fontWeight="medium">
              {title}
            </Text>
            <Text size={2} color="default2">
              {description}
            </Text>
          </Box>
        </Box>
      </List.Item>
    ))}
  </List>
);
