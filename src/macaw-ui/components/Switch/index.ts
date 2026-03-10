import { SwitchRoot } from "./Switch";
import { SwitchItem as Item } from "./Item";

export type { SwitchItemProps } from "./Item";
export type { SwitchRoot } from "./Switch";

export const Switch = Object.assign(SwitchRoot, { Item });
