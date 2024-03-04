import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface ShortcutItemProps {
  children: ReactNode;
}

const ShortcutItemWrapper = ({ children }: ShortcutItemProps) => {
  return (
    <Box
      display="flex"
      gap={3}
      alignItems="center"
      color="default1"
      fontSize="bodySmall"
      fontWeight="bodySmall"
    >
      {children}
    </Box>
  );
};

const Icon = ({ children }: ShortcutItemProps) => {
  return (
    <Box __width={20} __height={20}>
      {children}
    </Box>
  );
};

const KeyboardShortcut = ({ children }: ShortcutItemProps) => {
  return (
    <Box
      borderColor="default1"
      borderStyle="solid"
      borderWidth={1}
      paddingX={0.5}
      borderRadius={2}
    >
      {children}
    </Box>
  );
};

export const ShortcutItem = Object.assign(ShortcutItemWrapper, {
  Icon,
  KeyboardShortcut,
});
