import { type SearchPermissionGroupsQuery } from "@dashboard/graphql";
import { type Option } from "@saleor/macaw-ui-next";

/** Exact seed name used by Saleor; not "Full Access (Saleor Cloud users)". */
export const DEFAULT_INVITE_PERMISSION_GROUP_NAME = "Full Access";

type SearchPermissionGroup = NonNullable<
  NonNullable<NonNullable<SearchPermissionGroupsQuery["search"]>["edges"]>[number]
>["node"];

/**
 * Weak heuristic: prefer the classic "Full Access" group when the current user
 * can assign it. Ignores similarly named cloud-only groups.
 */
export function getDefaultInvitePermissionGroups(
  availablePermissionGroups: Array<SearchPermissionGroup | null | undefined> | null | undefined,
): Option[] {
  const fullAccess = availablePermissionGroups?.find(
    group =>
      group?.name === DEFAULT_INVITE_PERMISSION_GROUP_NAME && group.userCanManage && !!group.id,
  );

  if (!fullAccess) {
    return [];
  }

  return [
    {
      label: fullAccess.name,
      value: fullAccess.id,
    },
  ];
}
