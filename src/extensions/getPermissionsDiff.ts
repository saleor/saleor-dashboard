import { PermissionEnum } from "@dashboard/graphql";

export interface PermissionsDiff {
  added: PermissionEnum[];
  removed: PermissionEnum[];
}

export const getPermissionsDiff = (
  initial: PermissionEnum[],
  current: PermissionEnum[],
): PermissionsDiff => {
  const initialSet = new Set(initial);
  const currentSet = new Set(current);

  const added = current.filter(permission => !initialSet.has(permission));
  const removed = initial.filter(permission => !currentSet.has(permission));

  return { added, removed };
};
