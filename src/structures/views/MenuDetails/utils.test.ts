import { type FetchResult } from "@apollo/client";
import { MenuErrorCode, type MenuErrorFragment, type MenuUpdateMutation } from "@dashboard/graphql";

import { getMenuUpdateErrors } from "./utils";

const deleteError: MenuErrorFragment = {
  __typename: "MenuError",
  code: MenuErrorCode.NOT_FOUND,
  field: "ids",
  message: "Couldn't resolve to a node",
};

describe("getMenuUpdateErrors", () => {
  it("returns nothing when the request failed outright, so pending item changes are kept", () => {
    // Arrange
    const failedRequest: FetchResult<MenuUpdateMutation> = { data: undefined };

    // Act
    const errors = getMenuUpdateErrors(failedRequest);

    // Assert
    expect(errors).toBeUndefined();
  });

  it("returns the errors of all three mutations when the request went through", () => {
    // Arrange
    const result: FetchResult<MenuUpdateMutation> = {
      data: {
        __typename: "Mutation",
        menuUpdate: { __typename: "MenuUpdate", errors: [] },
        menuItemMove: { __typename: "MenuItemMove", errors: [] },
        menuItemBulkDelete: { __typename: "MenuItemBulkDelete", errors: [deleteError] },
      },
    };

    // Act
    const errors = getMenuUpdateErrors(result);

    // Assert
    expect(errors).toEqual([deleteError]);
  });
});
