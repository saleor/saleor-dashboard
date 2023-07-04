import { PermissionEnum } from "@dashboard/graphql";

export interface AppPermission {
  code: PermissionEnum;
  name: string;
}
