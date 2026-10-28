import { Fragment } from "react";

import { MenuItem } from "./Item";
import { showSubmenuSeparator } from "./settingsSubmenuItem";
import { SubmenuSeparator } from "./SubmenuSeparator";
import { type SidebarMenuItem } from "./types";

export const SubmenuItems = ({ items }: { items: SidebarMenuItem[] }) => (
  <>
    {items.map((child, index) => (
      <Fragment key={child.id}>
        {showSubmenuSeparator(child, index) && <SubmenuSeparator />}
        <MenuItem menuItem={child} />
      </Fragment>
    ))}
  </>
);
