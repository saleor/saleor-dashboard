import { Box, List } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

interface ShortcutItemProps extends ChildrenProps {
  onClick?: () => void;
}

const ShortcutItemWrapper = ({ children, onClick }: ShortcutItemProps) => {
  return (
    <List.Item
      onClick={onClick}
      display="flex"
      gap={3}
      alignItems="center"
      color="default1"
      fontSize={3}
      lineHeight={3}
      letterSpacing={3}
      fontWeight="medium"
      borderRadius={3}
      paddingX={2}
      paddingY={1.5}
    >
      {children}
    </List.Item>
  );
};
const Icon = ({ children }: ChildrenProps) => {
  return (
    <Box __width={20} __height={20} color="default2">
      {children}
    </Box>
  );
};
const KeyboardShortcut = ({ children }: ChildrenProps) => {
  return (
    <Box
      borderColor="default1"
      borderStyle="solid"
      borderWidth={1}
      paddingX={0.5}
      borderRadius={2}
      boxShadow="defaultFocused"
    >
      {children}
    </Box>
  );
};

export const ShortcutItem = Object.assign(ShortcutItemWrapper, {
  Icon,
  KeyboardShortcut,
});
