import { RadioGroupRoot } from "./Group";
import { RadioGroupItem as Item } from "./Item";
import { RadioGroupIndicator as Indicator } from "./Indicator";

export type { RadioGroupRootProps } from "./Group";
export type { RadioGroupItemProps } from "./Item";
export type { RadioGroupIndicatorProps } from "./Indicator";

export const RadioGroup = Object.assign(RadioGroupRoot, { Item, Indicator });
