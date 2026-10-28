import { Box, List } from "@saleor/macaw-ui-next";
import { memo } from "react";

import { RailItem } from "./menu/RailItem";
import { ShortcutItem } from "./shortcuts/ShortcutItem";
import { type Shortcut } from "./shortcuts/useShortcuts";

interface ShortcutsItemsProps {
  items: Shortcut[];
  collapsed?: boolean;
}

export const ShortcutsItems = memo(({ items, collapsed = false }: ShortcutsItemsProps) => {
  if (collapsed) {
    return (
      <List as="ul" display="grid" gap={1} marginTop={1}>
        {items.map(({ icon, id, name, shortcut, action }) => (
          <RailItem
            key={id}
            label={name}
            icon={<ShortcutItem.Icon>{icon}</ShortcutItem.Icon>}
            hint={
              shortcut && <ShortcutItem.KeyboardShortcut>{shortcut}</ShortcutItem.KeyboardShortcut>
            }
          >
            {content => (
              <button type="button" onClick={action}>
                {content}
              </button>
            )}
          </RailItem>
        ))}
      </List>
    );
  }

  return (
    <Box display="grid" gap={1} marginTop={1}>
      {items.map(({ icon, id, name, shortcut, action }) => (
        <ShortcutItem key={id} onClick={action}>
          <ShortcutItem.Icon>{icon}</ShortcutItem.Icon>
          {name}
          {shortcut && <ShortcutItem.KeyboardShortcut>{shortcut}</ShortcutItem.KeyboardShortcut>}
        </ShortcutItem>
      ))}
    </Box>
  );
});

ShortcutsItems.displayName = "ShortcutsItems";
