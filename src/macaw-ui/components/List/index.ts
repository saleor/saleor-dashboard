import { Divider } from "./Divider";
import { Item } from "./Item";
import { ItemGroup } from "./ItemGroup";
import { List as RootList } from "./List";

export type { ListProps } from "./List";
export type { ListItemProps } from "./Item";
export type { ListDividerProps } from "./Divider";
export type { ItemGroupRootProps, ItemGroupTriggerProps } from "./ItemGroup";

export const List = Object.assign(RootList, { Item, ItemGroup, Divider });
