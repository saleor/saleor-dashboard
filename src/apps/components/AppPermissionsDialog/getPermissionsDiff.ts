import { PermissionEnum } from "@dashboard/graphql";
import difference from "lodash/difference";

export const getPermissionsDiff = (
  initialPermissionsCodes: PermissionEnum[],
  newPermissionsCodes: PermissionEnum[],
): {
  added: PermissionEnum[];
  removed: PermissionEnum[];
} => {
  const removed = difference(initialPermissionsCodes, newPermissionsCodes);
  const added = difference(newPermissionsCodes, initialPermissionsCodes);

  return {
    added,
    removed,
  };
};
