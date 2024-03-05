import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { ShortcutItem } from "./ShortcutItem";
import { useShortcuts } from "./useShortcuts";

export const Shortcusts = () => {
  const shortcuts = useShortcuts();

  return (
    <Box display="grid" gap={1} marginTop={1}>
      {shortcuts.map(({ icon, id, name, shortcut, action }) => (
        <ShortcutItem key={id} onClick={action}>
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
