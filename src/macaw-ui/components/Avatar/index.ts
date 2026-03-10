import { Store } from "./Store";
import { User } from "./User";

export type { StoreAvatarProps } from "./Store";
export type { UserAvatarProps } from "./User";

export const Avatar = Object.assign({}, { User, Store });
