import { Content } from "./Content";
import { Item } from "./Item";
import { DropdownRoot } from "./Root";
import { Trigger } from "./Trigger";

export type { DropdownContentProps } from "./Content";
export type { DropdownRootProps } from "./Root";
export type { DropdownTriggerProps } from "./Trigger";

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Content,
  Item,
});
