import { Content } from "./Content";
import { Anchor } from "./Anchor";
import { Trigger } from "./Trigger";
import { Arrow } from "./Arrow";
import { PopoverRoot } from "./Root";
import { Close } from "./Close";

export type { PopoverContentProps } from "./Content";
export type { PopoverAnchorProps } from "./Anchor";
export type { PopoverTriggerProps } from "./Trigger";
export type { PopoverArrowProps } from "./Arrow";
export type { PopoverProps } from "./Root";

export const Popover = Object.assign(PopoverRoot, {
  Trigger,
  Content,
  Anchor,
  Arrow,
  Close,
});
