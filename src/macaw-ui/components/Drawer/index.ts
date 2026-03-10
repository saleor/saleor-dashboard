import { Content } from "./Content";
import { Root } from "./Root";
import { Trigger } from "./Trigger";

export type { DrawerRootProps } from "./Root";
export type { DrawerTriggerProps } from "./Trigger";
export type { DrawerContentProps } from "./Content";

export const Drawer = Object.assign(Root, { Content, Trigger });
