import { MenuErrorCode, type MenuErrorFragment, type MenuUpdateMutation } from "@dashboard/graphql";
import { testIntlInstance } from "@test/intl";

import { handleUpdate } from "./successHandlers";

const menuError: MenuErrorFragment = {
  __typename: "MenuError",
  code: MenuErrorCode.NOT_FOUND,
  field: "ids",
  message: "Couldn't resolve to a node",
};

const createMenuUpdateResult = ({
  renameErrors = [],
  moveErrors = [],
  deleteErrors = [],
}: {
  renameErrors?: MenuErrorFragment[];
  moveErrors?: MenuErrorFragment[];
  deleteErrors?: MenuErrorFragment[];
}): MenuUpdateMutation => ({
  __typename: "Mutation",
  menuUpdate: { __typename: "MenuUpdate", errors: renameErrors },
  menuItemMove: { __typename: "MenuItemMove", errors: moveErrors },
  menuItemBulkDelete: { __typename: "MenuItemBulkDelete", errors: deleteErrors },
});

describe("handleUpdate", () => {
  it("confirms the save and reloads the structure when everything was saved", () => {
    // Arrange
    const notify = jest.fn();
    const refetch = jest.fn(() => Promise.resolve());

    // Act
    handleUpdate(createMenuUpdateResult({}), notify, refetch, testIntlInstance);

    // Assert
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["deleting", { deleteErrors: [menuError] }],
    ["moving", { moveErrors: [menuError] }],
    ["renaming", { renameErrors: [{ ...menuError, field: "name" }] }],
  ])("reloads the structure without confirming the save when %s failed", (_operation, errors) => {
    // Arrange
    const notify = jest.fn();
    const refetch = jest.fn(() => Promise.resolve());

    // Act
    handleUpdate(createMenuUpdateResult(errors), notify, refetch, testIntlInstance);

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(notify).not.toHaveBeenCalled();
  });

  it("doesn't throw when reloading the structure fails", async () => {
    // Arrange
    const notify = jest.fn();
    const refetch = jest.fn(() => Promise.reject(new Error("Failed to fetch")));

    // Act
    const run = (): void =>
      handleUpdate(createMenuUpdateResult({}), notify, refetch, testIntlInstance);

    // Assert
    expect(run).not.toThrow();
    await expect(refetch.mock.results[0].value).rejects.toThrow("Failed to fetch");
  });
});
