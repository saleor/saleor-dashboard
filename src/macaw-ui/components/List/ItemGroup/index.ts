import { Content } from "./Content";
import { ItemGroupRoot } from "./Root";
import { Trigger } from "./Trigger";

export type { ItemGroupRootProps } from "./Root";
export type { ItemGroupTriggerProps } from "./Trigger";

export const ItemGroup = Object.assign(ItemGroupRoot, { Trigger, Content });
