import { PermissionEnum } from "./types.generated";

export interface Node {
    id: string
}
export type PrefixedPermissions = `PERMISSION_${PermissionEnum}`;