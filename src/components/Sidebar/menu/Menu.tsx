import { Box, List } from "@saleor/macaw-ui-next";

import { Shortcusts } from "../shortcuts/Shortcuts";
import { FeedbackButton } from "../user/Controls";
import { useMenuStructure } from "./hooks/useMenuStructure";
import { MenuItem } from "./Item";
import { RailMenuItem } from "./RailMenuItem";
import { RailTooltipGroup } from "./RailTooltipGroup";

export const Menu = ({ collapsed = false }: { collapsed?: boolean }) => {
  const menuStructure = useMenuStructure();

  return (
    <RailTooltipGroup>
      <Box
        padding={3}
        overflowY="auto"
        className="hide-scrollbar"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <List as="ol" display="grid" gap={1} data-test-id="menu-list">
          {menuStructure.map(menuItem =>
            collapsed ? (
              <RailMenuItem menuItem={menuItem} key={menuItem.id} />
            ) : (
              <MenuItem menuItem={menuItem} key={menuItem.id} />
            ),
          )}
        </List>

        <Box>
          <Shortcusts collapsed={collapsed} />
          {/* The footer is too narrow for it in the rail, so it joins the shortcuts. */}
          {collapsed && (
            <List as="ul" display="grid" marginTop={1}>
              <FeedbackButton variant="rail" />
            </List>
          )}
        </Box>
      </Box>
    </RailTooltipGroup>
  );
};
