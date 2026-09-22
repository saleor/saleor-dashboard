import { type SearchPermissionGroupsQuery } from "@dashboard/graphql";

import {
  DEFAULT_INVITE_PERMISSION_GROUP_NAME,
  getDefaultInvitePermissionGroups,
} from "./getDefaultInvitePermissionGroups";

type SearchPermissionGroup = NonNullable<
  NonNullable<NonNullable<SearchPermissionGroupsQuery["search"]>["edges"]>[number]
>["node"];

const group = (
  overrides: Partial<NonNullable<SearchPermissionGroup>> &
    Pick<NonNullable<SearchPermissionGroup>, "id" | "name">,
): NonNullable<SearchPermissionGroup> => ({
  __typename: "Group",
  userCanManage: true,
  ...overrides,
});

describe("getDefaultInvitePermissionGroups", () => {
  it("returns empty when no groups are available", () => {
    // Arrange / Act / Assert
    expect(getDefaultInvitePermissionGroups(undefined)).toEqual([]);
    expect(getDefaultInvitePermissionGroups([])).toEqual([]);
  });

  it("selects exact Full Access when the user can manage it", () => {
    // Arrange
    const groups = [
      group({ id: "g-support", name: "Customer Support" }),
      group({ id: "g-full", name: DEFAULT_INVITE_PERMISSION_GROUP_NAME }),
      group({ id: "g-cloud", name: "Full Access (Saleor Cloud users)" }),
    ];

    // Act
    const result = getDefaultInvitePermissionGroups(groups);

    // Assert
    expect(result).toEqual([{ label: "Full Access", value: "g-full" }]);
  });

  it("ignores Full Access when the user cannot manage it", () => {
    // Arrange
    const groups = [
      group({
        id: "g-full",
        name: DEFAULT_INVITE_PERMISSION_GROUP_NAME,
        userCanManage: false,
      }),
      group({ id: "g-cloud", name: "Full Access (Saleor Cloud users)" }),
    ];

    // Act / Assert
    expect(getDefaultInvitePermissionGroups(groups)).toEqual([]);
  });

  it("does not treat Full Access (Saleor Cloud users) as the default", () => {
    // Arrange
    const groups = [group({ id: "g-cloud", name: "Full Access (Saleor Cloud users)" })];

    // Act / Assert
    expect(getDefaultInvitePermissionGroups(groups)).toEqual([]);
  });
});
