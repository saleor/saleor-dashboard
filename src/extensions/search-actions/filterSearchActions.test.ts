import { PermissionEnum, type UserFragment } from "@dashboard/graphql";

import { filterSearchActions } from "./filterSearchActions";
import { type SearchActionContext } from "./resolveSearchActionContext";
import { type ContextualSearchAction } from "./types";

const makeAction = (overrides: Partial<ContextualSearchAction>): ContextualSearchAction => ({
  id: "action",
  label: "Action",
  section: "App actions",
  onSelect: jest.fn(),
  ...overrides,
});

const makeUser = (permissions: PermissionEnum[]): UserFragment =>
  ({
    userPermissions: permissions.map(code => ({ code, name: code })),
  }) as UserFragment;

const productDetailsContext: SearchActionContext = {
  view: "PRODUCT_DETAILS",
  params: { productId: "p1" },
};

const noViewContext: SearchActionContext = { view: null, params: {} };

describe("filterSearchActions", () => {
  it("keeps actions without a views restriction in every view", () => {
    // Arrange
    const action = makeAction({ views: undefined });

    // Act
    const result = filterSearchActions([action], noViewContext, makeUser([]));

    // Assert
    expect(result).toEqual([action]);
  });

  it("keeps an action whose views include the current view", () => {
    // Arrange
    const action = makeAction({ views: ["PRODUCT_DETAILS", "ORDER_DETAILS"] });

    // Act
    const result = filterSearchActions([action], productDetailsContext, makeUser([]));

    // Assert
    expect(result).toEqual([action]);
  });

  it("drops an action whose views do not include the current view", () => {
    // Arrange
    const action = makeAction({ views: ["ORDER_DETAILS"] });

    // Act
    const result = filterSearchActions([action], productDetailsContext, makeUser([]));

    // Assert
    expect(result).toEqual([]);
  });

  it("drops a view-scoped action when there is no current view", () => {
    // Arrange
    const action = makeAction({ views: ["PRODUCT_DETAILS"] });

    // Act
    const result = filterSearchActions([action], noViewContext, makeUser([]));

    // Assert
    expect(result).toEqual([]);
  });

  it("keeps an action when the user holds all required permissions", () => {
    // Arrange
    const action = makeAction({ permissions: [PermissionEnum.MANAGE_PRODUCTS] });

    // Act
    const result = filterSearchActions(
      [action],
      noViewContext,
      makeUser([PermissionEnum.MANAGE_PRODUCTS]),
    );

    // Assert
    expect(result).toEqual([action]);
  });

  it("drops an action when the user is missing a required permission", () => {
    // Arrange
    const action = makeAction({ permissions: [PermissionEnum.MANAGE_PRODUCTS] });

    // Act
    const result = filterSearchActions([action], noViewContext, makeUser([]));

    // Assert
    expect(result).toEqual([]);
  });

  it("drops a permission-gated action when there is no user", () => {
    // Arrange
    const action = makeAction({ permissions: [PermissionEnum.MANAGE_PRODUCTS] });

    // Act
    const result = filterSearchActions([action], noViewContext, undefined);

    // Assert
    expect(result).toEqual([]);
  });
});
