import { Box } from "@saleor/macaw-ui-next";
import React, { memo } from "react";

import { ShortcutItem } from "./shortcuts/ShortcutItem";
import { Shortcut } from "./shortcuts/useShortcuts";

interface ShortcutsItemsProps {
  items: Shortcut[];
}

export const ShortcutsItems = memo(({ items }: ShortcutsItemsProps) => {
  return (
    <Box display="grid" gap={1} marginTop={1}>
      {items.map(({ icon, id, name, shortcut, action }) => (
        <ShortcutItem key={id} onClick={action}>
          <ShortcutItem.Icon>{icon}</ShortcutItem.Icon>
          {name}
          <ShortcutItem.KeyboardShortcut>{shortcut}</ShortcutItem.KeyboardShortcut>
        </ShortcutItem>
      ))}
    </Box>
  );
});

ShortcutsItems.displayName = "ShortcutsItems";
