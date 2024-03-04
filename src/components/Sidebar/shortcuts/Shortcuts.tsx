import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { ShortcutItem } from "./ShortcutItem";
import { useShortcuts } from "./useShortcuts";

export const ShortCusts = () => {
  const shortcuts = useShortcuts();

  return (
    <Box display="grid" gap={3}>
      {shortcuts.map(({ icon, id, name, shortcut }) => (
        <ShortcutItem key={id}>
          <ShortcutItem.Icon>{icon}</ShortcutItem.Icon>
          {name}
          <ShortcutItem.KeyboardShortcut>
            {shortcut}
          </ShortcutItem.KeyboardShortcut>
        </ShortcutItem>
      ))}
    </Box>
  );
};
